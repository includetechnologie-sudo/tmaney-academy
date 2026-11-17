// Edge Function appelée par le navigateur (clé anon publique). Détient le
// seul point d'accès au token secret PawaPay (PAWAPAY_API_TOKEN) — le
// navigateur n'appelle jamais PawaPay directement.
//
// Actions :
//  - "initiate" : crée une ligne `payments` puis démarre un dépôt PawaPay.
//  - "status"   : relit le statut (revérifié auprès de PawaPay) d'un dépôt.

import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

import { corsHeaders } from "../_shared/cors.ts";
import {
  convertXafAmount,
  getCountryConfig,
  isCorrespondentAllowed,
} from "../_shared/correspondents.ts";
import { getDepositStatus, initiateDeposit, normalizeStatus } from "../_shared/pawapay-client.ts";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const initiateSchema = z.object({
  action: z.literal("initiate"),
  productId: z.string().trim().min(1).max(60),
  productLabel: z.string().trim().min(1).max(160),
  amountXaf: z.number().positive(),
  countryIso2: z.string().trim().length(2),
  phoneLocal: z.string().trim().min(4).max(20),
  dialCode: z.string().trim().min(2).max(6),
  correspondent: z.string().trim().min(2).max(40),
  fullName: z.string().trim().min(2).max(120),
});

const statusSchema = z.object({
  action: z.literal("status"),
  depositId: z.string().uuid(),
});

/** 4-22 caractères alphanumériques + espaces (contrainte PawaPay customerMessage). */
function shortMessage(productId: string): string {
  const slug = `TMANEY ${productId}`
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .slice(0, 22);
  return slug.length >= 4 ? slug : "TMANEY ACADEMY";
}

async function handleInitiate(data: z.infer<typeof initiateSchema>) {
  const countryConfig = getCountryConfig(data.countryIso2);
  if (!countryConfig) {
    return Response.json({ error: "PawaPay indisponible pour ce pays." }, { status: 400 });
  }
  if (!isCorrespondentAllowed(data.countryIso2, data.correspondent)) {
    return Response.json(
      { error: "Opérateur de paiement invalide pour ce pays." },
      { status: 400 },
    );
  }

  const amount = convertXafAmount(data.amountXaf, countryConfig.currency);
  const phoneNumber = `${data.dialCode.replace("+", "")}${data.phoneLocal.replace(/\D/g, "")}`;
  const depositId = crypto.randomUUID();

  // On enregistre la tentative AVANT l'appel PawaPay pour garder une trace
  // même si l'appel réseau échoue.
  const { error: insertError } = await supabaseAdmin.from("payments").insert({
    product_id: data.productId,
    product_label: data.productLabel,
    full_name: data.fullName,
    country_iso2: data.countryIso2,
    phone: phoneNumber,
    amount,
    currency: countryConfig.currency,
    payment_provider: "pawapay",
    payment_reference: depositId,
    correspondent: data.correspondent,
    payment_status: "pending",
  });

  if (insertError) {
    console.error("[pawapay] insert payments failed", insertError);
    return Response.json({ error: "Enregistrement impossible pour le moment." }, { status: 500 });
  }

  let depositResponse;
  try {
    depositResponse = await initiateDeposit({
      depositId,
      amount,
      currency: countryConfig.currency,
      phoneNumber,
      correspondent: data.correspondent,
      customerMessage: shortMessage(data.productId),
    });
  } catch (err) {
    console.error("[pawapay] initiateDeposit failed", err);
    await supabaseAdmin
      .from("payments")
      .update({ payment_status: "failed" })
      .eq("payment_reference", depositId);
    return Response.json(
      { error: "Impossible de contacter PawaPay pour le moment." },
      { status: 502 },
    );
  }

  const newStatus = depositResponse.status === "ACCEPTED" ? "accepted" : "failed";
  await supabaseAdmin
    .from("payments")
    .update({ payment_status: newStatus })
    .eq("payment_reference", depositId);

  if (depositResponse.status !== "ACCEPTED") {
    return Response.json({
      depositId,
      status: depositResponse.status,
      failureMessage: depositResponse.failureReason?.failureMessage,
    });
  }

  return Response.json({ depositId, status: "ACCEPTED" });
}

async function handleStatus(data: z.infer<typeof statusSchema>) {
  const { data: row } = await supabaseAdmin
    .from("payments")
    .select("product_id, full_name, payment_status")
    .eq("payment_provider", "pawapay")
    .eq("payment_reference", data.depositId)
    .maybeSingle();

  if (!row) {
    return Response.json({ error: "Paiement introuvable." }, { status: 404 });
  }

  if (row.payment_status === "paid" || row.payment_status === "failed") {
    return Response.json({
      status: row.payment_status,
      productId: row.product_id,
      fullName: row.full_name,
    });
  }

  let verified;
  try {
    verified = await getDepositStatus(data.depositId);
  } catch (err) {
    console.error("[pawapay] getDepositStatus failed", err);
    return Response.json({ status: "pending", productId: row.product_id, fullName: row.full_name });
  }

  const rawStatus = verified.data?.status ?? verified.status;
  const status = normalizeStatus(rawStatus);

  if (status !== "pending") {
    await supabaseAdmin
      .from("payments")
      .update({ payment_status: status, raw_callback: verified })
      .eq("payment_provider", "pawapay")
      .eq("payment_reference", data.depositId);
  }

  return Response.json({ status, productId: row.product_id, fullName: row.full_name });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "Corps de requête invalide." },
      { status: 400, headers: corsHeaders },
    );
  }

  const action = (body as { action?: string } | null)?.action;

  try {
    if (action === "initiate") {
      const parsed = initiateSchema.safeParse(body);
      if (!parsed.success) {
        return Response.json(
          { error: "Données invalides." },
          { status: 400, headers: corsHeaders },
        );
      }
      const res = await handleInitiate(parsed.data);
      return new Response(res.body, {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "status") {
      const parsed = statusSchema.safeParse(body);
      if (!parsed.success) {
        return Response.json(
          { error: "Données invalides." },
          { status: 400, headers: corsHeaders },
        );
      }
      const res = await handleStatus(parsed.data);
      return new Response(res.body, {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return Response.json({ error: "Action inconnue." }, { status: 400, headers: corsHeaders });
  } catch (err) {
    console.error("[pawapay] unhandled error", err);
    return Response.json({ error: "Erreur interne." }, { status: 500, headers: corsHeaders });
  }
});

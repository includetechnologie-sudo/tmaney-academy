// Webhook appelé directement par PawaPay (URL enregistrée dans leur
// dashboard) — aucun identifiant Supabase n'est envoyé par PawaPay, donc
// cette fonction doit avoir `verify_jwt = false` dans supabase/config.toml.
//
// Comme pour le webhook MyCoolPay existant (src/routes/api/public/mycoolpay-webhook.ts),
// on ne fait JAMAIS confiance au statut annoncé dans le payload : on
// revérifie toujours directement auprès de PawaPay avant de mettre à jour.

import { createClient } from "npm:@supabase/supabase-js@2";

import { getDepositStatus, normalizeStatus } from "../_shared/pawapay-client.ts";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid body", { status: 400 });
  }

  const depositId = (body as { depositId?: string } | null)?.depositId;
  if (!depositId) {
    return new Response("Missing depositId", { status: 400 });
  }

  let verified;
  try {
    verified = await getDepositStatus(depositId);
  } catch (err) {
    console.error("[pawapay-callback] getDepositStatus failed", err);
    return new Response("Verification failed", { status: 502 });
  }

  const rawStatus = verified.data?.status ?? verified.status;
  const status = normalizeStatus(rawStatus);

  await supabaseAdmin
    .from("payments")
    .update({ payment_status: status, raw_callback: verified })
    .eq("payment_provider", "pawapay")
    .eq("payment_reference", depositId);

  return Response.json({ received: true });
});

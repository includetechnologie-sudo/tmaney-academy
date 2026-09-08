import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const WHATSAPP_NUMBER = "237697216348";

const registrationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  city: z.string().trim().max(120).optional().default(""),
  country: z.string().trim().max(120).optional().default(""),
  formation: z.string().trim().min(2).max(160),
  session: z.string().trim().max(160).optional().default(""),
  level: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().max(1000).optional().default(""),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const AMOUNT_XAF = 300000;

function buildWhatsappText(data: RegistrationInput, ref: string) {
  return [
    "Nouvelle inscription — T.Maney Academy",
    `Nom : ${data.fullName}`,
    `Email : ${data.email}`,
    `Téléphone : ${data.phone}`,
    `Ville / Pays : ${[data.city, data.country].filter(Boolean).join(", ") || "—"}`,
    `Formation : ${data.formation}`,
    `Session : ${data.session || "—"}`,
    `Niveau : ${data.level || "—"}`,
    `Message : ${data.message || "—"}`,
    `Montant : ${AMOUNT_XAF.toLocaleString("fr-FR")} FCFA`,
    `Référence : ${ref}`,
  ].join("\n");
}

/**
 * Crée l'inscription (statut « en attente ») puis démarre le paiement MyCoolPay.
 * Aucune donnée bancaire n'est collectée ni stockée : le paiement se fait
 * entièrement sur la page sécurisée de MyCoolPay.
 */
export const createRegistration = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => registrationSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row, error } = await supabaseAdmin
      .from("registrations")
      .insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        city: data.city || null,
        country: data.country || null,
        formation: data.formation,
        session_choice: data.session || null,
        level: data.level || null,
        message: data.message || null,
        amount: AMOUNT_XAF,
      })
      .select("id")
      .single();

    if (error || !row) {
      throw new Error("Enregistrement impossible pour le moment.");
    }

    const whatsappText = buildWhatsappText(data, row.id);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

    // Envoi automatique via l'API WhatsApp Business dès que les identifiants
    // sont configurés (WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID).
    let whatsappSent = false;
    const waToken = process.env["WHATSAPP_TOKEN"];
    const waPhoneId = process.env["WHATSAPP_PHONE_NUMBER_ID"];
    if (waToken && waPhoneId) {
      try {
        const res = await fetch(`https://graph.facebook.com/v21.0/${waPhoneId}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${waToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: WHATSAPP_NUMBER,
            type: "text",
            text: { body: whatsappText },
          }),
        });
        whatsappSent = res.ok;
        if (whatsappSent) {
          await supabaseAdmin
            .from("registrations")
            .update({ whatsapp_notified: true })
            .eq("id", row.id);
        }
      } catch {
        whatsappSent = false;
      }
    }

    // Paiement MyCoolPay
    const publicKey = process.env["MYCOOLPAY_PUBLIC_KEY"];
    let paymentUrl: string | null = null;
    let paymentConfigured = false;

    if (publicKey) {
      paymentConfigured = true;
      try {
        const res = await fetch(`https://my-coolpay.com/api/${publicKey}/paylink`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transaction_amount: AMOUNT_XAF,
            transaction_currency: "XAF",
            transaction_reason: `Inscription ${data.formation} — T.Maney Academy`,
            app_transaction_ref: row.id,
            customer_name: data.fullName,
            customer_email: data.email,
            customer_phone_number: data.phone,
            customer_lang: "fr",
          }),
        });
        const payload = (await res.json()) as {
          status?: string;
          payment_url?: string;
          transaction_ref?: string;
        };
        if (payload.status === "success" && payload.payment_url) {
          paymentUrl = payload.payment_url;
          await supabaseAdmin
            .from("registrations")
            .update({ payment_reference: payload.transaction_ref ?? null })
            .eq("id", row.id);
        }
      } catch {
        paymentUrl = null;
      }
    }

    return {
      id: row.id as string,
      whatsappUrl,
      whatsappSent,
      paymentUrl,
      paymentConfigured,
    };
  });

/** Consultation de l'état d'une inscription (pour l'écran de confirmation). */
export const getRegistrationStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("registrations")
      .select("payment_status, status")
      .eq("id", data.id)
      .maybeSingle();
    return {
      paymentStatus: row?.payment_status ?? "unknown",
      status: row?.status ?? "unknown",
    };
  });

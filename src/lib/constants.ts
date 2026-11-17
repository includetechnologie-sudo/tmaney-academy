export const WHATSAPP_NUMBER = "237697216348";

/** Destinataire à afficher au client pour un envoi manuel via Tap Tap Send
 *  (l'app ne propose pas d'API marchande : le client envoie lui-même vers ce
 *  numéro Mobile Money, puis confirme via WhatsApp). */
export const TAPTAPSEND_RECIPIENT_NAME = "Nouewoue Djomegne Manuela";
export const TAPTAPSEND_RECIPIENT_PHONE = "+237 697 216 348";

export const MYCOOLPAY_PUBLIC_KEY = import.meta.env["VITE_MYCOOLPAY_PUBLIC_KEY"] as
  string | undefined;

export const SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;

export const SUPABASE_PUBLISHABLE_KEY = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as
  string | undefined;

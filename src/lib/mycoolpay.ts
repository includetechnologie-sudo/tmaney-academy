export interface PaylinkInput {
  amount: number;
  reason: string;
  customerName: string;
  /** Format attendu par l'API : indicatif + numéro, chiffres uniquement, sans "+" (ex: "237670000000"). */
  customerPhone: string;
  /** Carried through unchanged into the success/cancel/error redirect URL. */
  extraParams?: Record<string, string>;
}

/**
 * Demande un lien de paiement My-CoolPay directement depuis le navigateur.
 * La clé publique n'est pas un secret (cf. doc officielle My-CoolPay,
 * section "Confidentialité des clés d'API") : seule la clé privée doit
 * rester côté serveur, elle n'est jamais utilisée ici.
 *
 * L'API attend un corps en "application/x-www-form-urlencoded" (le JSON est
 * rejeté avec "This field is required !" même quand les champs sont fournis).
 */
export async function createMyCoolPayLink(publicKey: string, input: PaylinkInput): Promise<string> {
  const query = input.extraParams ? `?${new URLSearchParams(input.extraParams).toString()}` : "";

  const body = new URLSearchParams({
    transaction_amount: String(input.amount),
    transaction_currency: "XAF",
    transaction_reason: input.reason,
    customer_name: input.customerName,
    customer_phone_number: input.customerPhone,
    customer_lang: "fr",
  });

  const res = await fetch(`https://my-coolpay.com/api/${publicKey}/paylink${query}`, {
    method: "POST",
    body,
  });

  const payload = (await res.json()) as { status?: string; payment_url?: string; message?: string };

  if (payload.status !== "success" || !payload.payment_url) {
    throw new Error(payload.message || "Lien de paiement indisponible pour le moment.");
  }

  return payload.payment_url;
}

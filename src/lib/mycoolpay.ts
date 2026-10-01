export interface PaylinkInput {
  amount: number;
  reason: string;
  customerName: string;
  /** Format attendu par l'API : indicatif + numéro, chiffres uniquement, sans "+" (ex: "237670000000"). */
  customerPhone: string;
  /** Carried through unchanged into the success/cancel/error redirect URL. */
  extraParams?: Record<string, string>;
}

export interface PaylinkResult {
  paymentUrl: string;
  transactionRef: string;
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
export async function createMyCoolPayLink(
  publicKey: string,
  input: PaylinkInput,
): Promise<PaylinkResult> {
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

  const payload = (await res.json()) as {
    status?: string;
    payment_url?: string;
    transaction_ref?: string;
    message?: string;
  };

  if (payload.status !== "success" || !payload.payment_url || !payload.transaction_ref) {
    throw new Error(payload.message || "Lien de paiement indisponible pour le moment.");
  }

  return { paymentUrl: payload.payment_url, transactionRef: payload.transaction_ref };
}

export interface TransactionStatus {
  status: "success" | "error";
  transactionStatus?: "CREATED" | "PENDING" | "SUCCESS" | "CANCELED" | "FAILED";
}

/**
 * Vérifie le statut d'une transaction directement depuis le navigateur
 * (même raisonnement que ci-dessus : clé publique uniquement, pas de backend).
 * Sert de filet de secours quand la redirection de retour après paiement
 * échoue (connexion coupée, onglet fermé) : on peut revérifier manuellement
 * via la référence de transaction sauvegardée en local.
 */
export async function checkMyCoolPayStatus(
  publicKey: string,
  transactionRef: string,
): Promise<TransactionStatus> {
  const res = await fetch(`https://my-coolpay.com/api/${publicKey}/checkStatus/${transactionRef}`);
  const payload = (await res.json()) as { status?: string; transaction_status?: string };

  if (payload.status !== "success") {
    return { status: "error" };
  }

  return {
    status: "success",
    transactionStatus: payload.transaction_status as TransactionStatus["transactionStatus"],
  };
}

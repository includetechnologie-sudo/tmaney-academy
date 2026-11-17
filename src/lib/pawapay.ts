import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./constants";

export interface InitiateDepositInput {
  productId: string;
  productLabel: string;
  /** Montant affiché sur le site, en XAF. La conversion vers la devise de
   *  règlement est faite côté Edge Function (ne jamais faire confiance au
   *  montant envoyé par le client pour le calcul final). */
  amountXaf: number;
  countryIso2: string;
  /** Numéro local, chiffres uniquement, sans l'indicatif. */
  phoneLocal: string;
  /** Indicatif avec le "+", ex: "+221". */
  dialCode: string;
  correspondent: string;
  fullName: string;
}

export interface InitiateDepositResult {
  depositId: string;
  status: "ACCEPTED" | "REJECTED" | "DUPLICATE_IGNORED";
  failureMessage?: string;
}

export interface DepositStatusResult {
  status: "pending" | "paid" | "failed";
  productId?: string;
  fullName?: string;
}

/**
 * Appelle la Supabase Edge Function "pawapay", seule détentrice du token API
 * secret PawaPay. Le navigateur n'appelle jamais PawaPay directement.
 */
async function callPawaPayFunction<T>(action: string, body: Record<string, unknown>): Promise<T> {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Le paiement PawaPay n'est pas encore configuré.");
  }

  const res = await fetch(`${SUPABASE_URL}/functions/v1/pawapay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ action, ...body }),
  });

  const payload = (await res.json()) as T & { error?: string };

  if (!res.ok) {
    throw new Error(payload.error || "Le service de paiement PawaPay est indisponible.");
  }

  return payload;
}

export async function initiatePawaPayDeposit(
  input: InitiateDepositInput,
): Promise<InitiateDepositResult> {
  return callPawaPayFunction<InitiateDepositResult>("initiate", { ...input });
}

export async function checkPawaPayDepositStatus(depositId: string): Promise<DepositStatusResult> {
  return callPawaPayFunction<DepositStatusResult>("status", { depositId });
}

// Client minimal pour l'API PawaPay v2 (Deposits).
// https://docs.pawapay.io/v2/api-reference/deposits/initiate-deposit
//
// Le token est un vrai secret (contrairement à la clé "publique" MyCoolPay) :
// il ne doit vivre que dans les secrets de cette Edge Function
// (PAWAPAY_API_TOKEN), jamais côté client.

export interface InitiateDepositParams {
  depositId: string;
  amount: number;
  currency: string;
  phoneNumber: string;
  correspondent: string;
  /** 4-22 caractères alphanumériques + espaces (contrainte PawaPay). */
  customerMessage: string;
}

export interface PawaPayDepositResponse {
  depositId: string;
  status: "ACCEPTED" | "REJECTED" | "DUPLICATE_IGNORED";
  created?: string;
  failureReason?: { failureCode?: string; failureMessage?: string };
}

export interface PawaPayDepositStatusResponse {
  depositId: string;
  status: string;
  data?: { status?: string };
  [key: string]: unknown;
}

function getConfig() {
  const baseUrl = Deno.env.get("PAWAPAY_BASE_URL");
  const token = Deno.env.get("PAWAPAY_API_TOKEN");
  if (!baseUrl || !token) {
    throw new Error(
      "PawaPay n'est pas configuré (PAWAPAY_BASE_URL / PAWAPAY_API_TOKEN manquants).",
    );
  }
  return { baseUrl, token };
}

export async function initiateDeposit(
  params: InitiateDepositParams,
): Promise<PawaPayDepositResponse> {
  const { baseUrl, token } = getConfig();

  const res = await fetch(`${baseUrl}/v2/deposits`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      depositId: params.depositId,
      payer: {
        type: "MMO",
        accountDetails: {
          phoneNumber: params.phoneNumber,
          provider: params.correspondent,
        },
      },
      // PawaPay attend une chaîne décimale, pas un nombre (différent de
      // MyCoolPay qui accepte String(nombre)).
      amount: params.amount.toFixed(2),
      currency: params.currency,
      customerMessage: params.customerMessage,
    }),
  });

  const payload = (await res.json()) as PawaPayDepositResponse;
  return payload;
}

export async function getDepositStatus(depositId: string): Promise<PawaPayDepositStatusResponse> {
  const { baseUrl, token } = getConfig();

  const res = await fetch(`${baseUrl}/v2/deposits/${depositId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const payload = (await res.json()) as PawaPayDepositStatusResponse;
  return payload;
}

/**
 * Normalise le statut PawaPay (dont le nom exact du statut terminal doit
 * être confirmé en sandbox avant la mise en prod) vers notre statut interne.
 */
export function normalizeStatus(raw: string | undefined): "pending" | "paid" | "failed" {
  const status = (raw ?? "").toUpperCase();
  if (status === "COMPLETED" || status === "SUCCESS" || status === "SUCCEEDED") return "paid";
  if (status === "FAILED" || status === "REJECTED") return "failed";
  return "pending";
}

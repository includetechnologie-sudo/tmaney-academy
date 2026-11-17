// Copie côté serveur de src/lib/payment-providers.ts. Les Edge Functions
// (Deno) ne peuvent pas importer le code du bundle Vite (src/) directement,
// donc cette table est dupliquée volontairement. Si un code opérateur
// change, le mettre à jour aux DEUX endroits.
//
// Source de vérité pour la validation : ne jamais faire confiance au
// correspondant/devise envoyés par le client, toujours revérifier ici.

export interface CountryPawaPayConfig {
  currency: string;
  correspondents: string[];
}

// Codes ML (Mali) non confirmés dans la documentation PawaPay consultée —
// à vérifier via l'endpoint "Active Configuration" du compte réel avant la
// mise en production pour le Mali.
export const PAWAPAY_COUNTRIES: Record<string, CountryPawaPayConfig> = {
  CD: { currency: "CDF", correspondents: ["VODACOM_MPESA_COD", "AIRTEL_COD", "ORANGE_COD"] },
  CG: { currency: "XAF", correspondents: ["AIRTEL_COG", "MTN_MOMO_COG"] },
  ML: { currency: "XOF", correspondents: ["ORANGE_MLI", "MOOV_MLI"] },
  SN: { currency: "XOF", correspondents: ["ORANGE_SEN", "FREE_SEN", "WAVE_SEN"] },
  CM: { currency: "XAF", correspondents: ["MTN_MOMO_CMR", "ORANGE_CMR"] },
};

// Taux fixes XAF -> devise cible. XAF/XOF sont en parité fixe 1:1 (francs
// CFA). Le taux CDF est approximatif, à réajuster avant la mise en
// production pour la RD Congo.
const XAF_TO_CURRENCY: Record<string, number> = {
  XAF: 1,
  XOF: 1,
  CDF: 7.2,
};

export function getCountryConfig(iso2: string): CountryPawaPayConfig | undefined {
  return PAWAPAY_COUNTRIES[iso2];
}

export function isCorrespondentAllowed(iso2: string, correspondent: string): boolean {
  return getCountryConfig(iso2)?.correspondents.includes(correspondent) ?? false;
}

export function convertXafAmount(amountXaf: number, currency: string): number {
  return Math.round(amountXaf * (XAF_TO_CURRENCY[currency] ?? 1));
}

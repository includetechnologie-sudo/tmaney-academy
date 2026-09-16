export interface CountryOption {
  iso2: string;
  name: string;
  dialCode: string;
  flag: string;
}

// Pays d'Afrique francophone (dont Congo-Brazzaville et RD Congo pour PawaPay),
// complétés par les principaux pays de la diaspora francophone.
export const COUNTRIES: CountryOption[] = [
  { iso2: "CM", name: "Cameroun", dialCode: "+237", flag: "🇨🇲" },
  { iso2: "CG", name: "Congo-Brazzaville", dialCode: "+242", flag: "🇨🇬" },
  { iso2: "CD", name: "RD Congo (Kinshasa)", dialCode: "+243", flag: "🇨🇩" },
  { iso2: "CI", name: "Côte d'Ivoire", dialCode: "+225", flag: "🇨🇮" },
  { iso2: "SN", name: "Sénégal", dialCode: "+221", flag: "🇸🇳" },
  { iso2: "GA", name: "Gabon", dialCode: "+241", flag: "🇬🇦" },
  { iso2: "ML", name: "Mali", dialCode: "+223", flag: "🇲🇱" },
  { iso2: "BF", name: "Burkina Faso", dialCode: "+226", flag: "🇧🇫" },
  { iso2: "BJ", name: "Bénin", dialCode: "+229", flag: "🇧🇯" },
  { iso2: "TG", name: "Togo", dialCode: "+228", flag: "🇹🇬" },
  { iso2: "NE", name: "Niger", dialCode: "+227", flag: "🇳🇪" },
  { iso2: "GN", name: "Guinée", dialCode: "+224", flag: "🇬🇳" },
  { iso2: "TD", name: "Tchad", dialCode: "+235", flag: "🇹🇩" },
  { iso2: "CF", name: "République centrafricaine", dialCode: "+236", flag: "🇨🇫" },
  { iso2: "MR", name: "Mauritanie", dialCode: "+222", flag: "🇲🇷" },
  { iso2: "MG", name: "Madagascar", dialCode: "+261", flag: "🇲🇬" },
  { iso2: "BI", name: "Burundi", dialCode: "+257", flag: "🇧🇮" },
  { iso2: "DJ", name: "Djibouti", dialCode: "+253", flag: "🇩🇯" },
  { iso2: "KM", name: "Comores", dialCode: "+269", flag: "🇰🇲" },
  { iso2: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { iso2: "BE", name: "Belgique", dialCode: "+32", flag: "🇧🇪" },
  { iso2: "CH", name: "Suisse", dialCode: "+41", flag: "🇨🇭" },
  { iso2: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { iso2: "US", name: "États-Unis", dialCode: "+1", flag: "🇺🇸" },
];

// Pays où PawaPay (Mobile Money) est utilisé comme moyen de paiement.
// Tous les autres pays passent par MyCoolPay.
const PAWAPAY_COUNTRIES = new Set(["CG", "CD"]);

export type PaymentProvider = "pawapay" | "mycoolpay";

export function providerForCountry(iso2: string): PaymentProvider {
  return PAWAPAY_COUNTRIES.has(iso2) ? "pawapay" : "mycoolpay";
}

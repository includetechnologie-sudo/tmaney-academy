export type PaymentProvider = "mycoolpay" | "pawapay" | "taptapsend";

export interface CorrespondentOption {
  /** Code opérateur attendu par l'API PawaPay (ex: "ORANGE_SEN"). */
  code: string;
  /** Libellé affiché à l'utilisateur. */
  label: string;
}

export interface CountryPaymentConfig {
  allowed: PaymentProvider[];
  default: PaymentProvider;
  pawapay?: {
    /** Devise de règlement PawaPay pour ce pays (peut différer du XAF affiché). */
    currency: string;
    correspondents: CorrespondentOption[];
  };
}

/**
 * Règle métier (confirmée avec l'utilisateur) :
 * - Congo-Kinshasa (CD) et Congo-Brazzaville (CG) : PawaPay uniquement.
 * - Mali (ML) et Sénégal (SN) : PawaPay par défaut, MyCoolPay reste choisissable.
 * - Cameroun (CM) et tout pays non listé ci-dessous : comportement actuel inchangé
 *   (MyCoolPay par défaut), PawaPay choisissable pour le Cameroun.
 *
 * Les codes opérateurs ML sont une hypothèse de travail (non confirmés dans la
 * documentation PawaPay consultée) : à vérifier via l'endpoint "Active
 * Configuration" du compte réel avant la mise en production pour le Mali.
 */
const CONFIG: Record<string, CountryPaymentConfig> = {
  CD: {
    allowed: ["pawapay"],
    default: "pawapay",
    pawapay: {
      currency: "CDF",
      correspondents: [
        { code: "VODACOM_MPESA_COD", label: "M-Pesa (Vodacom)" },
        { code: "AIRTEL_COD", label: "Airtel Money" },
        { code: "ORANGE_COD", label: "Orange Money" },
      ],
    },
  },
  CG: {
    allowed: ["pawapay"],
    default: "pawapay",
    pawapay: {
      currency: "XAF",
      correspondents: [
        { code: "AIRTEL_COG", label: "Airtel Money" },
        { code: "MTN_MOMO_COG", label: "MTN Mobile Money" },
      ],
    },
  },
  ML: {
    allowed: ["mycoolpay", "pawapay"],
    default: "pawapay",
    pawapay: {
      currency: "XOF",
      correspondents: [
        // À VÉRIFIER avant mise en prod — voir le commentaire de CONFIG ci-dessus.
        { code: "ORANGE_MLI", label: "Orange Money" },
        { code: "MOOV_MLI", label: "Moov Money" },
      ],
    },
  },
  SN: {
    allowed: ["mycoolpay", "pawapay"],
    default: "pawapay",
    pawapay: {
      currency: "XOF",
      correspondents: [
        { code: "ORANGE_SEN", label: "Orange Money" },
        { code: "FREE_SEN", label: "Free Money" },
        { code: "WAVE_SEN", label: "Wave" },
      ],
    },
  },
  CM: {
    allowed: ["mycoolpay", "pawapay"],
    default: "mycoolpay",
    pawapay: {
      currency: "XAF",
      correspondents: [
        { code: "MTN_MOMO_CMR", label: "MTN Mobile Money" },
        { code: "ORANGE_CMR", label: "Orange Money" },
      ],
    },
  },
  // Pays "d'envoi" confirmés pour Tap Tap Send (app sans API marchande : le
  // client envoie manuellement vers notre numéro Mobile Money, cf.
  // TAPTAPSEND_RECIPIENT_* dans constants.ts, puis confirme via WhatsApp).
  FR: { allowed: ["mycoolpay", "taptapsend"], default: "mycoolpay" },
  BE: { allowed: ["mycoolpay", "taptapsend"], default: "mycoolpay" },
  CA: { allowed: ["mycoolpay", "taptapsend"], default: "mycoolpay" },
  US: { allowed: ["mycoolpay", "taptapsend"], default: "mycoolpay" },
};

/** Tout pays non listé dans CONFIG : comportement actuel, MyCoolPay seul. */
const DEFAULT_CONFIG: CountryPaymentConfig = { allowed: ["mycoolpay"], default: "mycoolpay" };

export function getPaymentConfig(iso2: string): CountryPaymentConfig {
  return CONFIG[iso2] ?? DEFAULT_CONFIG;
}

export function canChooseProvider(iso2: string): boolean {
  return getPaymentConfig(iso2).allowed.length > 1;
}

/**
 * Taux fixes XAF -> devise cible, pour convertir les prix affichés (en XAF)
 * vers la devise de règlement PawaPay du pays choisi.
 * XAF et XOF sont tous deux des francs CFA en parité fixe 1:1, aucune
 * maintenance nécessaire pour ces deux-là. Le taux CDF est approximatif et
 * doit être réajusté avant la mise en production pour la RD Congo (le CDF
 * n'est pas fixe).
 */
const XAF_TO_CURRENCY: Record<string, number> = {
  XAF: 1,
  XOF: 1,
  CDF: 7.2,
};

export function convertAmount(amountXaf: number, currency: string): number {
  return Math.round(amountXaf * (XAF_TO_CURRENCY[currency] ?? 1));
}

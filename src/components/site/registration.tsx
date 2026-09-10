import { AlertTriangle, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

// Liste complète des pays avec indicatifs
const countries = [
  { name: "Afghanistan", code: "AF", dial: "+93" },
  { name: "Afrique du Sud", code: "ZA", dial: "+27" },
  { name: "Albanie", code: "AL", dial: "+355" },
  { name: "Algérie", code: "DZ", dial: "+213" },
  { name: "Allemagne", code: "DE", dial: "+49" },
  { name: "Andorre", code: "AD", dial: "+376" },
  { name: "Angola", code: "AO", dial: "+244" },
  { name: "Arabie Saoudite", code: "SA", dial: "+966" },
  { name: "Argentine", code: "AR", dial: "+54" },
  { name: "Australie", code: "AU", dial: "+61" },
  { name: "Autriche", code: "AT", dial: "+43" },
  { name: "Belgique", code: "BE", dial: "+32" },
  { name: "Bénin", code: "BJ", dial: "+229" },
  { name: "Brésil", code: "BR", dial: "+55" },
  { name: "Burkina Faso", code: "BF", dial: "+226" },
  { name: "Burundi", code: "BI", dial: "+257" },
  { name: "Cameroun", code: "CM", dial: "+237" },
  { name: "Canada", code: "CA", dial: "+1" },
  { name: "Centrafrique", code: "CF", dial: "+236" },
  { name: "Chine", code: "CN", dial: "+86" },
  { name: "Congo", code: "CG", dial: "+242" },
  { name: "Congo (RDC)", code: "CD", dial: "+243" },
  { name: "Côte d'Ivoire", code: "CI", dial: "+225" },
  { name: "Danemark", code: "DK", dial: "+45" },
  { name: "Égypte", code: "EG", dial: "+20" },
  { name: "Émirats Arabes Unis", code: "AE", dial: "+971" },
  { name: "Espagne", code: "ES", dial: "+34" },
  { name: "États-Unis", code: "US", dial: "+1" },
  { name: "Éthiopie", code: "ET", dial: "+251" },
  { name: "France", code: "FR", dial: "+33" },
  { name: "Gabon", code: "GA", dial: "+241" },
  { name: "Gambie", code: "GM", dial: "+220" },
  { name: "Ghana", code: "GH", dial: "+233" },
  { name: "Grèce", code: "GR", dial: "+30" },
  { name: "Guinée", code: "GN", dial: "+224" },
  { name: "Guinée équatoriale", code: "GQ", dial: "+240" },
  { name: "Guinée-Bissau", code: "GW", dial: "+245" },
  { name: "Inde", code: "IN", dial: "+91" },
  { name: "Italie", code: "IT", dial: "+39" },
  { name: "Japon", code: "JP", dial: "+81" },
  { name: "Kenya", code: "KE", dial: "+254" },
  { name: "Madagascar", code: "MG", dial: "+261" },
  { name: "Mali", code: "ML", dial: "+223" },
  { name: "Maroc", code: "MA", dial: "+212" },
  { name: "Maurice", code: "MU", dial: "+230" },
  { name: "Mauritanie", code: "MR", dial: "+222" },
  { name: "Mexique", code: "MX", dial: "+52" },
  { name: "Niger", code: "NE", dial: "+227" },
  { name: "Nigeria", code: "NG", dial: "+234" },
  { name: "Norvège", code: "NO", dial: "+47" },
  { name: "Pays-Bas", code: "NL", dial: "+31" },
  { name: "Portugal", code: "PT", dial: "+351" },
  { name: "Royaume-Uni", code: "GB", dial: "+44" },
  { name: "Rwanda", code: "RW", dial: "+250" },
  { name: "Sénégal", code: "SN", dial: "+221" },
  { name: "Suède", code: "SE", dial: "+46" },
  { name: "Suisse", code: "CH", dial: "+41" },
  { name: "Tchad", code: "TD", dial: "+235" },
  { name: "Togo", code: "TG", dial: "+228" },
  { name: "Tunisie", code: "TN", dial: "+216" },
];

type Result = {
  id: string;
  whatsappUrl: string;
  whatsappSent: boolean;
  paymentUrl: string | null;
  paymentConfigured: boolean;
};

const field =
  "w-full border border-input bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold";

const label = "mb-2 block text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground";

const WHATSAPP_NUMBER = "237697216348"; // Numéro WhatsApp de l'académie

export function Registration() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [payment, setPayment] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("CM"); // Cameroun par défaut
  const [phonePrefix, setPhonePrefix] = useState("+237");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("paiement");
    if (p) setPayment(p);
  }, []);

  // Mise à jour de l'indicatif quand le pays change
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      setPhonePrefix(country.dial);
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setState("sending");
    
    const fd = new FormData(e.currentTarget);
    const formData = {
      fullName: String(fd.get("fullName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: `${phonePrefix} ${String(fd.get("phone") ?? "")}`,
      country: countries.find(c => c.code === selectedCountry)?.name ?? "",
      formation: String(fd.get("formation") ?? ""),
      session: String(fd.get("session") ?? ""),
    };

    // Créer le message WhatsApp
    const whatsappMessage = `
🎓 *NOUVELLE INSCRIPTION - T.MANEY ACADEMY*

👤 *Nom :* ${formData.fullName}
📧 *Email :* ${formData.email}
📱 *Téléphone :* ${formData.phone}
🌍 *Pays :* ${formData.country}

📚 *Formation :* ${formData.formation}
📅 *Session :* ${formData.session || "Prochaine disponible"}

---
Envoyé depuis tmaneyacademy.com
    `.trim();

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    try {
      // Rediriger directement vers WhatsApp
      setState("done");
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 500);
    } catch {
      setState("error");
      setError("Une erreur est survenue. Merci de réessayer.");
    }
  }

  return (
    <section id="inscription" className="border-t border-border py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Inscription</p>
          <h2 className="mt-5 text-4xl sm:text-5xl">Réservez votre place</h2>
          <div className="gold-rule mx-auto mt-7 max-w-[10rem]" />
          <p className="mt-7 leading-relaxed text-muted-foreground">
            Frais d'inscription à la Corset MasterClass :{" "}
            <span className="text-gold">300 000 FCFA</span>. Votre place est confirmée une fois
            le paiement validé.
          </p>
        </div>

        {payment && (
          <div
            className={`mx-auto mt-10 flex max-w-2xl items-start gap-3 border p-5 text-sm ${
              payment === "succes" ? "border-gold text-gold" : "border-destructive text-destructive"
            }`}
          >
            {payment === "succes" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <p>
              {payment === "succes"
                ? "Paiement reçu. Votre inscription est confirmée dès la validation définitive par notre banque partenaire — vous recevrez un message de confirmation."
                : payment === "annule"
                  ? "Paiement annulé. Votre place n'est pas encore réservée, vous pouvez recommencer quand vous le souhaitez."
                  : "Le paiement n'a pas abouti. Aucun montant n'a été débité, vous pouvez réessayer."}
            </p>
          </div>
        )}

        {state === "done" ? (
          <div className="mx-auto mt-12 max-w-2xl border border-gold p-10 text-center">
            <CheckCircle2 className="mx-auto text-gold" size={34} />
            <h3 className="mt-5 text-3xl">Demande envoyée !</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Votre demande d'inscription a été envoyée par WhatsApp à notre équipe.
              Nous vous contacterons très rapidement pour finaliser votre inscription.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 bg-gold px-8 py-4 text-xs uppercase tracking-[0.24em] text-primary-foreground"
            >
              <MessageCircle size={16} />
              Ouvrir WhatsApp
            </a>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-12 grid gap-6 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="fullName">Nom complet *</label>
              <input id="fullName" name="fullName" required maxLength={120} className={field} placeholder="Votre nom et prénom" />
            </div>
            <div>
              <label className={label} htmlFor="email">Email *</label>
              <input id="email" name="email" type="email" required maxLength={255} className={field} placeholder="vous@email.com" />
            </div>
            <div>
              <label className={label} htmlFor="country">Pays *</label>
              <select 
                id="country" 
                name="country" 
                required 
                className={field}
                value={selectedCountry}
                onChange={handleCountryChange}
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="phone">Téléphone / WhatsApp *</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={phonePrefix} 
                  readOnly 
                  className="w-20 border border-input bg-muted px-3 py-3 text-center text-sm text-foreground"
                />
                <input 
                  id="phone" 
                  name="phone" 
                  required 
                  maxLength={30} 
                  className={field} 
                  placeholder="6.. .. .. .." 
                />
              </div>
            </div>
            <div>
              <label className={label} htmlFor="formation">Formation souhaitée *</label>
              <select id="formation" name="formation" required className={field} defaultValue="Corset MasterClass">
                <option>Corset MasterClass</option>
                <option>Bustier &amp; Robe structurée</option>
                <option>Accompagnement Pro</option>
              </select>
            </div>
            <div>
              <label className={label} htmlFor="session">Session souhaitée</label>
              <input id="session" name="session" maxLength={160} className={field} placeholder="Ex. prochaine session" />
            </div>

            {state === "error" && (
              <p className="sm:col-span-2 text-sm text-destructive">{error}</p>
            )}

            <div className="sm:col-span-2 flex flex-col items-center gap-4">
              <button
                type="submit"
                disabled={state === "sending"}
                className="inline-flex w-full items-center justify-center gap-3 bg-gold px-10 py-4 text-xs uppercase tracking-[0.24em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
              >
                {state === "sending" && <Loader2 className="animate-spin" size={16} />}
                Réservez votre place en présentiel
              </button>
              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                Après envoi, vous serez redirigé vers WhatsApp pour finaliser votre inscription avec notre équipe.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

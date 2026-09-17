import { Check, Loader2, MessageCircle } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { COUNTRIES, providerForCountry } from "@/lib/dial-codes";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface BridalProgram {
  id: string;
  title: string;
  priceBarre: string;
  pricePromo: string;
  points: string[];
  featured?: boolean;
}

const modules: BridalProgram[] = [
  {
    id: "bridal-1",
    title: "Module 1 : Bridal 1",
    priceBarre: "55 000 FCFA",
    pricePromo: "45 000 FCFA",
    points: [
      "Robe corset avec fermeture invisible",
      "Ingénierie du corset de mariée",
      "Laçage interne",
      "Illusion peau nue",
      "Travail des dentelles perlées",
      "Surjupe & traîne amovible transparente",
      "Coupe sirène structurée",
      "Finition haute couture",
    ],
  },
  {
    id: "bridal-2",
    title: "Module 2 : Bridal 2",
    priceBarre: "55 000 FCFA",
    pricePromo: "45 000 FCFA",
    points: [
      "Robe de mariée sans couture apparente",
      "Corset transparent spécial mariée",
      "Jupe sirène en tulle",
      "Choix & manipulation des matières",
      "Techniques de superposition",
      "Finition haute couture",
      "Reconstitution de motifs",
    ],
  },
  {
    id: "bridal-3",
    title: "Module 3 : Bridal 3",
    priceBarre: "55 000 FCFA",
    pricePromo: "45 000 FCFA",
    points: [
      "Robe princesse volumineuse en transparence",
      "Corset transparent à bonnet",
      "Laçage vintage",
      "Encolure bardot longue manche",
      "Optimisation & calcul de métrage",
      "Techniques d'embellissement",
      "Finition haute couture",
    ],
  },
];

const pack: BridalProgram = {
  id: "pack-bridal",
  title: "PACK Complet Bridal + Bonus",
  priceBarre: "140 000 FCFA",
  pricePromo: "100 000 FCFA",
  points: [
    "Les 3 modules Bridal 1, 2 et 3",
    "Bonus exclusifs offerts",
    "Accès à vie aux supports de cours",
    "Certificat de compétence",
  ],
  featured: true,
};

const field =
  "w-full border border-input bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold";

const label = "mb-2 block text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground";

function ProgramCard({
  program,
  onSelect,
}: {
  program: BridalProgram;
  onSelect: (p: BridalProgram) => void;
}) {
  return (
    <article
      className={`flex flex-col rounded-lg border p-6 transition-all sm:p-8 ${
        program.featured
          ? "border-gold bg-card shadow-[0_0_30px_-10px_var(--gold)]"
          : "border-border bg-card/60 hover:border-gold/50 hover:shadow-lg"
      }`}
    >
      <h3 className="text-2xl font-semibold sm:text-3xl">{program.title}</h3>

      <div className="my-6 flex items-baseline gap-3">
        <span className="text-sm text-muted-foreground line-through">{program.priceBarre}</span>
        <span className="text-3xl font-bold text-gold">{program.pricePromo}</span>
      </div>

      <ul className="mb-8 flex-1 space-y-3 text-sm text-muted-foreground">
        {program.points.map((pt) => (
          <li key={pt} className="flex gap-3">
            <Check className="mt-0.5 shrink-0 text-gold" size={16} />
            {pt}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onSelect(program)}
        className={`mt-auto rounded-lg px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.24em] transition-all ${
          program.featured
            ? "bg-gold text-primary-foreground shadow-md hover:opacity-90 hover:shadow-lg"
            : "border-2 border-gold/60 text-gold hover:border-gold hover:bg-gold/5"
        }`}
      >
        Payer maintenant
      </button>
    </article>
  );
}

export function BridalPrograms() {
  const [selected, setSelected] = useState<BridalProgram | null>(null);
  const [fullName, setFullName] = useState("");
  const [countryIso2, setCountryIso2] = useState("CM");
  const [localPhone, setLocalPhone] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  const country = COUNTRIES.find((c) => c.iso2 === countryIso2) ?? COUNTRIES[0]!;
  const provider = providerForCountry(country.iso2);

  function closeDialog(open: boolean) {
    if (!open) {
      setSelected(null);
      setState("idle");
      setFullName("");
      setLocalPhone("");
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    setState("sending");

    const fullPhone = `${country.dialCode}${localPhone.replace(/\D/g, "")}`;
    const providerLabel = provider === "pawapay" ? "PawaPay (Mobile Money)" : "MyCoolPay";
    const text = [
      "Nouvelle demande — Formation en ligne T.Maney Academy",
      `Nom : ${fullName}`,
      `Téléphone : ${fullPhone}`,
      `Pays : ${country.flag} ${country.name}`,
      `Formation : ${selected.title}`,
      `Montant : ${selected.pricePromo}`,
      `Moyen de paiement : ${providerLabel}`,
    ].join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setState("done");
  }

  return (
    <section className="border-t border-border py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">100% en ligne sur Télégram</p>
          <h1 className="mt-5 text-4xl sm:text-5xl">
            Bridal <span className="gold-text italic">MasterClass</span>
          </h1>
          <div className="gold-rule mx-auto mt-7 max-w-[10rem]" />
          <p className="mt-7 leading-relaxed text-muted-foreground">
            Formez-vous à la haute couture bridal à votre rythme, où que vous soyez.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {modules.map((m) => (
            <ProgramCard key={m.id} program={m} onSelect={setSelected} />
          ))}
        </div>

        <div className="mt-8">
          <ProgramCard program={pack} onSelect={setSelected} />
        </div>
      </div>

      <Dialog open={selected !== null} onOpenChange={closeDialog}>
        <DialogContent>
          {state === "done" ? (
            <div className="py-6 text-center">
              <MessageCircle className="mx-auto text-gold" size={32} />
              <h3 className="mt-4 text-2xl">Demande envoyée</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Un onglet WhatsApp vient de s'ouvrir avec le récapitulatif de votre commande.
                Confirmez l'envoi du message pour recevoir votre lien de paiement sécurisé (
                {provider === "pawapay" ? "PawaPay" : "MyCoolPay"}) et démarrer votre formation.
              </p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{selected?.title}</DialogTitle>
                <DialogDescription>
                  {selected?.pricePromo} — remplissez vos informations pour finaliser votre
                  inscription.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={onSubmit} className="grid gap-5">
                <div>
                  <label className={label} htmlFor="bridal-name">
                    Nom et prénom *
                  </label>
                  <input
                    id="bridal-name"
                    required
                    maxLength={120}
                    className={field}
                    placeholder="Votre nom et prénom"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div>
                  <label className={label} htmlFor="bridal-country">
                    Pays *
                  </label>
                  <select
                    id="bridal-country"
                    required
                    className={field}
                    value={countryIso2}
                    onChange={(e) => setCountryIso2(e.target.value)}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.iso2} value={c.iso2}>
                        {c.flag} {c.name} ({c.dialCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={label} htmlFor="bridal-phone">
                    Téléphone / WhatsApp *
                  </label>
                  <div className="flex">
                    <span className="flex items-center border border-r-0 border-input bg-transparent px-4 text-sm text-muted-foreground">
                      {country.dialCode}
                    </span>
                    <input
                      id="bridal-phone"
                      required
                      maxLength={20}
                      className={`${field} border-l-0`}
                      placeholder="6.. .. .. .."
                      value={localPhone}
                      onChange={(e) => setLocalPhone(e.target.value)}
                    />
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  Paiement proposé :{" "}
                  <span className="text-gold">
                    {provider === "pawapay" ? "PawaPay (Mobile Money)" : "MyCoolPay"}
                  </span>
                </p>

                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="mt-2 inline-flex w-full items-center justify-center gap-3 bg-gold px-8 py-4 text-xs uppercase tracking-[0.24em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {state === "sending" && <Loader2 className="animate-spin" size={16} />}
                  Payer maintenant
                </button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

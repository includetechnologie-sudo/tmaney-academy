import { Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { COUNTRIES } from "@/lib/dial-codes";
import {
  MYCOOLPAY_PUBLIC_KEY,
  TAPTAPSEND_RECIPIENT_NAME,
  TAPTAPSEND_RECIPIENT_PHONE,
  WHATSAPP_NUMBER,
} from "@/lib/constants";
import { createMyCoolPayLink } from "@/lib/mycoolpay";
import { checkPawaPayDepositStatus, initiatePawaPayDeposit } from "@/lib/pawapay";
import { canChooseProvider, getPaymentConfig, type PaymentProvider } from "@/lib/payment-providers";
import { GoldParticles } from "./brand";

const POLL_INTERVAL_MS = 4000;
const POLL_MAX_ATTEMPTS = 30; // ~2 minutes

const faqs = [
  {
    q: "Combien de temps dure la formation ?",
    a: "La formation est 100 % en ligne et à votre rythme. Une fois votre inscription validée, vous bénéficiez d'un accès illimité et à vie à l'ensemble des vidéos.",
  },
  {
    q: "Comment poser mes questions si je rencontre une difficulté pendant les cours ?",
    a: "Vous bénéficiez d'un coaching d'une durée d'1 mois pour chaque module acheté (3 mois pour le pack complet). Vous pourrez poser vos questions dans le groupe privé, partager vos réalisations et recevoir l'accompagnement direct de la formatrice.",
  },
  {
    q: "Quels sont les moyens de paiement acceptés ?",
    a: "Nous acceptons les paiements sécurisés par Mobile Money (M-Pesa, Orange Money, MTN) ainsi que les cartes bancaires (VISA / Mastercard). L'accès à votre formation est débloqué automatiquement dès la validation du paiement.",
  },
  {
    q: "Quel est le niveau nécessaire pour suivre la Bridal Masterclass ?",
    a: "Cette formation est conçue pour les stylistes et modélistes ayant déjà les bases de la couture souhaitant se perfectionner dans les techniques de Haute Couture.",
  },
  {
    q: "Où se déroule la formation ?",
    a: "La formation est 100 % en ligne via l'application Télégram, disponible sur smartphone, tablette ou ordinateur.",
  },
  {
    q: "Recevrai-je un certificat à la fin de la formation ?",
    a: "Oui, un certificat de fin de formation T.Maney Academy vous sera délivré après la validation de vos projets pratiques.",
  },
];

interface BridalProgram {
  id: string;
  title: string;
  image?: string;
  priceBarre: string;
  pricePromo: string;
  priceAmount: number;
  /** Lien d'invitation Télégram affiché après confirmation du paiement.
   *  Doit rester synchronisé avec la map FORMATIONS de public/paiement-succes.html
   *  (fichier statique séparé, ne peut pas importer ce module). */
  telegram: string;
  points: string[];
  featured?: boolean;
}

const modules: BridalProgram[] = [
  {
    id: "bridal-1",
    title: "Module 1 : Bridal 1",
    image: "/images/bridal-module1.jpg",
    priceBarre: "55 000 FCFA",
    pricePromo: "45 000 FCFA",
    priceAmount: 45000,
    telegram: "https://t.me/+ZDgJ12VBedgzYjE0",
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
    image: "/images/bridal-module2.jpg",
    priceBarre: "55 000 FCFA",
    pricePromo: "45 000 FCFA",
    priceAmount: 45000,
    telegram: "https://t.me/+YLhVOOkJVmBlM2Q0",
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
    image: "/images/bridal-module3.jpg",
    priceBarre: "55 000 FCFA",
    pricePromo: "45 000 FCFA",
    priceAmount: 45000,
    telegram: "https://t.me/+JSEzXSQctL4wZjQ8",
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
  image: "/images/pack-vip.jpg",
  priceBarre: "140 000 FCFA",
  pricePromo: "100 000 FCFA",
  priceAmount: 100000,
  telegram: "https://t.me/+pDDA69YoffZiZTFk",
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
      className={`flex flex-col overflow-hidden rounded-lg border transition-all ${
        program.featured
          ? "border-gold bg-card shadow-[0_0_30px_-10px_var(--gold)]"
          : "border-border bg-card/60 hover:border-gold/50 hover:shadow-lg"
      }`}
    >
      {program.image && (
        <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
          <img
            src={program.image}
            alt={program.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          {/* Flou progressif style "aperçu limité" */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 backdrop-blur-md"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 80%)",
              maskImage: "linear-gradient(to bottom, transparent, black 80%)",
            }}
          />
          {/* Fondu doré qui dissout l'image dans la carte */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-card" />
          {/* Étincelles dorées qui montent */}
          <GoldParticles />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {!program.image && <h3 className="text-2xl font-semibold sm:text-3xl">{program.title}</h3>}

        <div className={`flex items-baseline gap-3 ${program.image ? "" : "mt-6"}`}>
          <span className="text-sm text-muted-foreground line-through">{program.priceBarre}</span>
          <span className="text-3xl font-bold text-gold">{program.pricePromo}</span>
        </div>

        <ul className="mb-8 mt-6 flex-1 space-y-3 text-sm text-muted-foreground">
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
      </div>
    </article>
  );
}

export function BridalPrograms() {
  const [selected, setSelected] = useState<BridalProgram | null>(null);
  const [fullName, setFullName] = useState("");
  const [countryIso2, setCountryIso2] = useState("CM");
  const [localPhone, setLocalPhone] = useState("");
  const [state, setState] = useState<
    "idle" | "sending" | "awaiting-approval" | "manual-review" | "paid"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<PaymentProvider>("mycoolpay");
  const [correspondent, setCorrespondent] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const country = COUNTRIES.find((c) => c.iso2 === countryIso2) ?? COUNTRIES[0]!;
  const paymentConfig = getPaymentConfig(countryIso2);

  // Le moyen de paiement par défaut dépend du pays (règle métier : PawaPay
  // uniquement pour CD/CG, PawaPay par défaut pour ML/SN, MyCoolPay par
  // défaut ailleurs). On réinitialise l'opérateur sélectionné à chaque
  // changement de pays.
  useEffect(() => {
    setProvider(paymentConfig.default);
    setCorrespondent(paymentConfig.pawapay?.correspondents[0]?.code ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryIso2]);

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  useEffect(() => () => stopPolling(), []);

  function closeDialog(open: boolean) {
    if (!open) {
      stopPolling();
      setSelected(null);
      setState("idle");
      setError(null);
      setFullName("");
      setLocalPhone("");
      setCorrespondent("");
    }
  }

  function savePendingPayment(data: Record<string, unknown>) {
    try {
      localStorage.setItem("tmaney_pending_payment", JSON.stringify({ ...data, ts: Date.now() }));
    } catch {
      // Stockage indisponible (navigation privée, etc.) : on continue sans filet.
    }
  }

  async function submitMyCoolPay(prog: BridalProgram) {
    if (!MYCOOLPAY_PUBLIC_KEY) {
      setState("idle");
      setError("Le paiement en ligne n'est pas encore configuré. Contactez-nous sur WhatsApp.");
      return;
    }

    const localDigits = localPhone.replace(/\D/g, "");

    try {
      // L'API My-CoolPay attend l'indicatif + le numéro en chiffres, sans "+".
      const paymentPhone = `${country.dialCode.replace("+", "")}${localDigits}`;
      const { paymentUrl, transactionRef } = await createMyCoolPayLink(MYCOOLPAY_PUBLIC_KEY, {
        amount: prog.priceAmount,
        reason: `${prog.title} — T.Maney Academy`,
        customerName: fullName,
        customerPhone: paymentPhone,
        extraParams: { formation: prog.id, nom: fullName },
      });

      // Filet de secours si la redirection de retour échoue (connexion
      // coupée, onglet fermé) : la page de confirmation peut revérifier ce
      // paiement via sa référence, même sans les paramètres d'URL.
      savePendingPayment({
        provider: "mycoolpay",
        transactionRef,
        formation: prog.id,
        nom: fullName,
      });

      window.location.href = paymentUrl;
    } catch {
      setState("idle");
      setError(
        "Impossible de générer le lien de paiement pour le moment. Réessayez ou contactez-nous sur WhatsApp.",
      );
    }
  }

  function pollPawaPayStatus(depositId: string, prog: BridalProgram) {
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts += 1;
      try {
        const result = await checkPawaPayDepositStatus(depositId);
        if (result.status === "paid") {
          stopPolling();
          setState("paid");
          localStorage.removeItem("tmaney_pending_payment");
        } else if (result.status === "failed") {
          stopPolling();
          setState("idle");
          setError(
            "Le paiement n'a pas abouti auprès de l'opérateur. Vérifiez votre numéro et réessayez.",
          );
        }
      } catch {
        // Erreur réseau ponctuelle : on retente au prochain cycle.
      }

      if (attempts >= POLL_MAX_ATTEMPTS && pollRef.current) {
        stopPolling();
        window.location.href = `/paiement-succes.html?provider=pawapay&depositId=${depositId}&formation=${prog.id}`;
      }
    }, POLL_INTERVAL_MS);
  }

  async function submitPawaPay(prog: BridalProgram) {
    if (!correspondent) {
      setState("idle");
      setError("Choisissez un opérateur Mobile Money.");
      return;
    }

    const localDigits = localPhone.replace(/\D/g, "");

    try {
      const { depositId, status, failureMessage } = await initiatePawaPayDeposit({
        productId: prog.id,
        productLabel: prog.title,
        amountXaf: prog.priceAmount,
        countryIso2,
        phoneLocal: localDigits,
        dialCode: country.dialCode,
        correspondent,
        fullName,
      });

      if (status !== "ACCEPTED") {
        setState("idle");
        setError(failureMessage || "Le paiement a été refusé. Vérifiez votre numéro et réessayez.");
        return;
      }

      savePendingPayment({ provider: "pawapay", depositId, formation: prog.id, nom: fullName });
      setState("awaiting-approval");
      pollPawaPayStatus(depositId, prog);
    } catch (err) {
      setState("idle");
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de contacter PawaPay pour le moment. Réessayez ou contactez-nous sur WhatsApp.",
      );
    }
  }

  function submitTapTapSend(prog: BridalProgram) {
    // Tap Tap Send n'a pas d'API marchande : pas de vérification automatique
    // possible. Le client envoie manuellement, puis confirme via WhatsApp
    // pour validation manuelle avant l'envoi du lien Télégram.
    savePendingPayment({ provider: "taptapsend", formation: prog.id, nom: fullName });
    setState("manual-review");
  }

  function openTapTapSendWhatsappConfirmation(prog: BridalProgram) {
    const text = [
      "Paiement Tap Tap Send — T.Maney Academy",
      `Formation : ${prog.title}`,
      `Montant : ${prog.pricePromo}`,
      `Nom : ${fullName}`,
      `Téléphone : ${country.dialCode} ${localPhone}`,
      `Pays : ${country.flag} ${country.name}`,
      "Je viens d'envoyer le paiement via Tap Tap Send, voici ma preuve :",
    ].join("\n");
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    setError(null);

    if (provider === "taptapsend") {
      submitTapTapSend(selected);
      return;
    }

    setState("sending");

    if (provider === "pawapay") {
      await submitPawaPay(selected);
    } else {
      await submitMyCoolPay(selected);
    }
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
          <a
            href="/paiement-succes.html"
            className="mt-4 inline-block text-xs text-muted-foreground underline underline-offset-4 hover:text-gold"
          >
            Déjà payé mais pas reçu votre lien ? Vérifiez votre paiement
          </a>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {modules.map((m) => (
            <ProgramCard key={m.id} program={m} onSelect={setSelected} />
          ))}
        </div>

        <div className="mt-8">
          <ProgramCard program={pack} onSelect={setSelected} />
        </div>

        {/* Foire aux questions */}
        <div className="mx-auto mt-20 max-w-3xl sm:mt-28">
          <div className="text-center">
            <p className="eyebrow">Questions fréquentes</p>
            <h2 className="mt-5 text-4xl sm:text-5xl">Foire aux questions</h2>
            <div className="gold-rule mx-auto mt-7 max-w-[10rem]" />
          </div>

          <Accordion type="single" collapsible className="mt-12 w-full">
            {faqs.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="py-5 text-base font-semibold text-foreground hover:no-underline sm:text-lg">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-foreground/80 sm:text-base">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <Dialog open={selected !== null} onOpenChange={closeDialog}>
        <DialogContent>
          {state === "paid" ? (
            <div className="py-6 text-center">
              <Check className="mx-auto text-gold" size={32} />
              <h3 className="mt-4 text-2xl">Paiement confirmé</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Merci {fullName || ""}, votre paiement pour « {selected?.title} » a bien été reçu.
                Cliquez ci-dessous pour rejoindre le groupe Télégram de la formation.
              </p>
              <a
                href={selected?.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-3 bg-gold px-8 py-4 text-xs uppercase tracking-[0.24em] text-primary-foreground transition-opacity hover:opacity-90"
              >
                Rejoindre le groupe Télégram
              </a>
            </div>
          ) : state === "manual-review" && selected ? (
            <div className="py-2">
              <DialogHeader>
                <DialogTitle>Finalisez votre paiement avec Tap Tap Send</DialogTitle>
                <DialogDescription>
                  {selected.pricePromo} — {selected.title}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-2 border border-input bg-muted/30 p-4 text-sm">
                <p>
                  Destinataire : <span className="font-semibold">{TAPTAPSEND_RECIPIENT_NAME}</span>
                </p>
                <p>
                  Numéro : <span className="font-semibold">{TAPTAPSEND_RECIPIENT_PHONE}</span>
                </p>
                <p>
                  Montant : <span className="font-semibold">{selected.pricePromo}</span>
                </p>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                1. Ouvrez l&apos;app Tap Tap Send et envoyez le montant ci-dessus vers ce numéro
                (Cameroun).
                <br />
                2. Une fois l&apos;envoi fait, confirmez-le nous via WhatsApp (capture d&apos;écran à
                l&apos;appui) pour recevoir votre lien Télégram.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a
                  href="https://www.taptapsend.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border-2 border-gold/60 px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.24em] text-gold transition-all hover:border-gold hover:bg-gold/5"
                >
                  Ouvrir Tap Tap Send
                </a>
                <button
                  type="button"
                  onClick={() => openTapTapSendWhatsappConfirmation(selected)}
                  className="inline-flex items-center justify-center bg-gold px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground transition-opacity hover:opacity-90"
                >
                  J&apos;ai envoyé — confirmer
                </button>
              </div>
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
                    disabled={state === "awaiting-approval"}
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
                    disabled={state === "awaiting-approval"}
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
                      disabled={state === "awaiting-approval"}
                    />
                  </div>
                </div>

                {canChooseProvider(countryIso2) && (
                  <div>
                    <label className={label}>Moyen de paiement *</label>
                    <ToggleGroup
                      type="single"
                      value={provider}
                      onValueChange={(v) => v && setProvider(v as PaymentProvider)}
                      className="justify-start gap-2"
                    >
                      <ToggleGroupItem value="mycoolpay" className="border border-input text-xs">
                        MyCoolPay (Mobile Money / Carte)
                      </ToggleGroupItem>
                      {paymentConfig.allowed.includes("pawapay") && (
                        <ToggleGroupItem value="pawapay" className="border border-input text-xs">
                          PawaPay (Mobile Money)
                        </ToggleGroupItem>
                      )}
                      {paymentConfig.allowed.includes("taptapsend") && (
                        <ToggleGroupItem value="taptapsend" className="border border-input text-xs">
                          Tap Tap Send
                        </ToggleGroupItem>
                      )}
                    </ToggleGroup>
                  </div>
                )}

                {provider === "pawapay" && paymentConfig.pawapay && (
                  <div>
                    <label className={label}>Opérateur Mobile Money *</label>
                    <RadioGroup
                      value={correspondent}
                      onValueChange={setCorrespondent}
                      className="grid-flow-col auto-cols-max flex-wrap gap-4"
                    >
                      {paymentConfig.pawapay.correspondents.map((c) => (
                        <label key={c.code} className="flex items-center gap-2 text-sm">
                          <RadioGroupItem value={c.code} id={`correspondent-${c.code}`} />
                          {c.label}
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {state === "awaiting-approval" ? (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Un code de confirmation a été envoyé sur votre Mobile Money. Validez le paiement
                    directement sur votre téléphone pour finaliser votre inscription.
                  </p>
                ) : provider === "pawapay" ? (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Paiement via <span className="text-gold">PawaPay</span> (Mobile Money) — une
                    invite de validation sera envoyée directement sur votre téléphone.
                  </p>
                ) : provider === "taptapsend" ? (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Paiement via <span className="text-gold">Tap Tap Send</span> — vous enverrez
                    vous-même le montant depuis l&apos;app, puis confirmerez via WhatsApp (vérification
                    manuelle, pas de validation automatique).
                  </p>
                ) : (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Vous serez redirigé(e) vers la page de paiement sécurisée{" "}
                    <span className="text-gold">MyCoolPay</span> (Mobile Money ou carte bancaire).
                  </p>
                )}

                {error && <p className="text-xs leading-relaxed text-destructive">{error}</p>}

                <button
                  type="submit"
                  disabled={state === "sending" || state === "awaiting-approval"}
                  className="mt-2 inline-flex w-full items-center justify-center gap-3 bg-gold px-8 py-4 text-xs uppercase tracking-[0.24em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {(state === "sending" || state === "awaiting-approval") && (
                    <Loader2 className="animate-spin" size={16} />
                  )}
                  {state === "awaiting-approval"
                    ? "En attente de validation…"
                    : provider === "taptapsend"
                      ? "Continuer"
                      : "Payer maintenant"}
                </button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

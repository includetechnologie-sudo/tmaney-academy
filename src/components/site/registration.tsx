import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { createRegistration } from "@/lib/registrations.functions";

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

export function Registration() {
  const submit = useServerFn(createRegistration);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState<string | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("paiement");
    if (p) setPayment(p);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setState("sending");
    const fd = new FormData(e.currentTarget);
    try {
      const res = (await submit({
        data: {
          fullName: String(fd.get("fullName") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          city: String(fd.get("city") ?? ""),
          country: String(fd.get("country") ?? ""),
          formation: String(fd.get("formation") ?? ""),
          session: String(fd.get("session") ?? ""),
          level: String(fd.get("level") ?? ""),
          message: String(fd.get("message") ?? ""),
        },
      })) as Result;
      setResult(res);
      setState("done");
      if (res.paymentUrl) window.location.href = res.paymentUrl;
    } catch {
      setState("error");
      setError("Votre inscription n'a pas pu être envoyée. Merci de réessayer dans un instant.");
    }
  }

  return (
    <section id="inscription" className="border-t border-border bg-ink py-24 sm:py-32">
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

        {state === "done" && result ? (
          <div className="mx-auto mt-12 max-w-2xl border border-gold p-10 text-center">
            <CheckCircle2 className="mx-auto text-gold" size={34} />
            <h3 className="mt-5 text-3xl">Demande enregistrée</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {result.paymentUrl
                ? "Redirection vers la page de paiement sécurisée…"
                : result.paymentConfigured
                  ? "Le paiement en ligne est momentanément indisponible. Écrivez-nous sur WhatsApp pour finaliser votre inscription."
                  : "Dernière étape : envoyez-nous votre confirmation sur WhatsApp pour recevoir les modalités de paiement."}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Statut : en attente de paiement
            </p>
            <a
              href={result.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 bg-gold px-8 py-4 text-xs uppercase tracking-[0.24em] text-primary-foreground"
            >
              <MessageCircle size={16} />
              Confirmer sur WhatsApp
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
              <label className={label} htmlFor="phone">Téléphone / WhatsApp *</label>
              <input id="phone" name="phone" required maxLength={30} className={field} placeholder="+237 6.. .. .. .." />
            </div>
            <div>
              <label className={label} htmlFor="city">Ville</label>
              <input id="city" name="city" maxLength={120} className={field} placeholder="Yaoundé" />
            </div>
            <div>
              <label className={label} htmlFor="country">Pays</label>
              <input id="country" name="country" maxLength={120} className={field} placeholder="Cameroun" />
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
            <div>
              <label className={label} htmlFor="level">Niveau en couture</label>
              <select id="level" name="level" className={field} defaultValue="Débutante">
                <option>Débutante</option>
                <option>Intermédiaire</option>
                <option>Professionnelle</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={4} maxLength={1000} className={field} placeholder="Parlez-nous de votre projet…" />
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
                Payer 300 000 FCFA et réserver
              </button>
              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                Paiement sécurisé par MyCoolPay (Mobile Money, Orange Money, carte).
                Aucune donnée bancaire n'est saisie ni conservée sur ce site.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

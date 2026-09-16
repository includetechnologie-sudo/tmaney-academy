import { Loader2, MessageCircle } from "lucide-react";
import { useState } from "react";

import { WHATSAPP_NUMBER } from "@/lib/constants";

const FORMATION_PRICES: Record<string, string> = {
  Débutant: "300 000 FCFA",
  Intermédiaire: "400 000 FCFA",
  Perfectionnement: "500 000 FCFA",
};

const field =
  "w-full border border-input bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold";

const label = "mb-2 block text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground";

export function Registration() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("fullName") ?? "");
    const email = String(fd.get("email") ?? "");
    const phone = String(fd.get("phone") ?? "");
    const country = String(fd.get("country") ?? "");
    const formation = String(fd.get("formation") ?? "");

    const text = [
      "Nouvelle inscription — T.Maney Academy (présentiel)",
      `Nom : ${fullName}`,
      `Email : ${email}`,
      `Téléphone : ${phone}`,
      `Pays : ${country || "—"}`,
      `Formation : ${formation}`,
      `Montant : ${FORMATION_PRICES[formation] ?? "—"}`,
    ].join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setState("done");
  }

  return (
    <section id="inscription" className="border-t border-border py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Inscription</p>
          <h2 className="mt-5 text-4xl sm:text-5xl">Réservez votre place</h2>
          <div className="gold-rule mx-auto mt-7 max-w-[10rem]" />
          <p className="mt-7 leading-relaxed text-muted-foreground">
            Choisissez votre formation et réservez votre place à la prochaine rentrée. Un conseiller
            vous recontacte pour finaliser les modalités.
          </p>
        </div>

        {state === "done" ? (
          <div className="mx-auto mt-12 max-w-2xl border border-gold p-10 text-center">
            <MessageCircle className="mx-auto text-gold" size={34} />
            <h3 className="mt-5 text-3xl">Demande envoyée</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Un onglet WhatsApp vient de s'ouvrir avec le récapitulatif de votre demande. Confirmez
              l'envoi du message pour finaliser votre réservation.
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
              <label className={label} htmlFor="fullName">
                Nom complet *
              </label>
              <input
                id="fullName"
                name="fullName"
                required
                maxLength={120}
                className={field}
                placeholder="Votre nom et prénom"
              />
            </div>
            <div>
              <label className={label} htmlFor="email">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={255}
                className={field}
                placeholder="vous@email.com"
              />
            </div>
            <div>
              <label className={label} htmlFor="phone">
                Téléphone / WhatsApp *
              </label>
              <input
                id="phone"
                name="phone"
                required
                maxLength={30}
                className={field}
                placeholder="+237 6.. .. .. .."
              />
            </div>
            <div>
              <label className={label} htmlFor="country">
                Pays
              </label>
              <input
                id="country"
                name="country"
                maxLength={120}
                className={field}
                placeholder="Cameroun"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="formation">
                Formation souhaitée *
              </label>
              <select
                id="formation"
                name="formation"
                required
                className={field}
                defaultValue="Débutant"
              >
                <option>Débutant</option>
                <option>Intermédiaire</option>
                <option>Perfectionnement</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex flex-col items-center gap-4">
              <button
                type="submit"
                disabled={state === "sending"}
                className="inline-flex w-full items-center justify-center gap-3 bg-gold px-10 py-4 text-xs uppercase tracking-[0.24em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
              >
                {state === "sending" && <Loader2 className="animate-spin" size={16} />}
                Je réserve ma place
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

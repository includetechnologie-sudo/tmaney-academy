import { Check, ExternalLink } from "lucide-react";

interface OnlineProgram {
  id: string;
  title: string;
  duration: string;
  price: string;
  features: string[];
  paymentLink: string;
  courseLink: string;
  badge?: string;
}

const onlinePrograms: OnlineProgram[] = [
  {
    id: "debutant",
    title: "Pack Débutant",
    duration: "9 mois",
    price: "300 000 FCFA",
    badge: "Idéal pour commencer",
    features: [
      "Bases de la haute couture",
      "Patronage et coupe",
      "Montage de vêtements simples",
      "Techniques de finition",
      "Accès plateforme 24/7",
      "Support par WhatsApp",
      "Certificat de compétence",
    ],
    paymentLink: "https://pay.notchpay.co/tmaney-debutant", // À remplacer par le vrai lien
    courseLink: "/formations/debutant",
  },
  {
    id: "intermediaire",
    title: "Pack Intermédiaire",
    duration: "9 mois",
    price: "400 000 FCFA",
    badge: "Le plus populaire",
    features: [
      "Techniques avancées de coupe",
      "Corsetterie et baleinage",
      "Stylisme et création",
      "Modélisme sur mesure",
      "Projets réels guidés",
      "Accès plateforme 24/7",
      "Support prioritaire",
      "Certificat de compétence",
    ],
    paymentLink: "https://pay.notchpay.co/tmaney-intermediaire", // À remplacer
    courseLink: "/formations/intermediaire",
  },
  {
    id: "perfectionnement",
    title: "Pack Perfectionnement",
    duration: "6 mois",
    price: "500 000 FCFA",
    badge: "Expert",
    features: [
      "Haute couture d'exception",
      "Techniques de luxe",
      "Création de collections",
      "Business de mode",
      "Mentorat individuel",
      "Accès plateforme à vie",
      "Support VIP",
      "Certificat d'excellence",
    ],
    paymentLink: "https://pay.notchpay.co/tmaney-perfectionnement", // À remplacer
    courseLink: "/formations/perfectionnement",
  },
];

export function OnlinePrograms() {
  const handleProgramClick = (program: OnlineProgram) => {
    // Redirection vers le lien de paiement
    // Après paiement, le provider redirigera vers courseLink
    window.location.href = `${program.paymentLink}?redirect=${encodeURIComponent(program.courseLink)}`;
  };

  return (
    <section id="formations-en-ligne" className="border-t border-border py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">100% En ligne</p>
          <h2 className="mt-5 text-4xl sm:text-5xl">Nos formations en ligne</h2>
          <div className="gold-rule mx-auto mt-7 max-w-[10rem]" />
          <p className="mt-7 leading-relaxed text-muted-foreground">
            Formez-vous à votre rythme depuis chez vous. Accès immédiat après paiement.
          </p>
        </div>

        {/* Grid des programmes */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {onlinePrograms.map((program) => (
            <article
              key={program.id}
              onClick={() => handleProgramClick(program)}
              className="group relative cursor-pointer overflow-hidden rounded-lg border-2 border-border bg-card transition-all hover:border-gold hover:shadow-xl hover:shadow-gold/20"
            >
              {/* Badge */}
              {program.badge && (
                <div className="absolute right-4 top-4 z-10 rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lg">
                  {program.badge}
                </div>
              )}

              <div className="p-8 sm:p-10">
                {/* Titre et durée */}
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">
                    {program.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{program.duration}</p>
                </div>

                {/* Prix */}
                <div className="mb-8 border-y border-border py-6">
                  <p className="text-center text-4xl font-bold text-gold sm:text-5xl">
                    {program.price}
                  </p>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Paiement en plusieurs tranches possible
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {program.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 shrink-0 text-gold" size={18} />
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Bouton */}
                <div className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-gold px-6 py-4 text-center font-semibold uppercase tracking-wider text-primary-foreground transition-all group-hover:scale-105 group-hover:shadow-lg">
                  <span>Accéder à la formation</span>
                  <ExternalLink size={18} />
                </div>
              </div>

              {/* Effet hover */}
              <div className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
              </div>
            </article>
          ))}
        </div>

        {/* Note */}
        <div className="mx-auto mt-12 max-w-2xl rounded-lg border border-gold/30 bg-card/50 p-6 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-gold">💳 Paiement sécurisé</span> • Après validation
            de votre paiement, vous recevrez immédiatement vos accès à la plateforme de formation par
            email et WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}

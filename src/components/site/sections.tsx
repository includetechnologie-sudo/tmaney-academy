import { Award, Ruler, Scissors, Sparkles } from "lucide-react";

const p1 = { url: "/images/photo-p1-diplomee.jpg" };
const p2 = { url: "/images/photo-p2-mannequin.jpg" };
const p3 = { url: "/images/photo-p3-groupe.jpg" };
const p4 = { url: "/images/photo-p4-placeholder.jpg" };

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-5 text-4xl sm:text-5xl">{title}</h2>
      <div className="gold-rule mx-auto mt-7 max-w-[10rem]" />
    </div>
  );
}

export function About() {
  return (
    <section id="academie" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 sm:px-8 lg:grid-cols-2">
        <div className="relative">
          <img
            src={p2.url}
            alt="Formatrice de T.Maney Academy présentant un corset en pagne"
            className="w-full object-cover"
            style={{ aspectRatio: "4 / 5" }}
            loading="lazy"
          />
          <div className="absolute -bottom-6 -right-4 hidden border border-gold bg-ink px-8 py-6 sm:block">
            <p className="font-display text-4xl text-gold">+250</p>
            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
              Créatrices formées
            </p>
          </div>
        </div>

        <div>
          <p className="eyebrow">L'Académie</p>
          <h2 className="mt-5 text-4xl sm:text-5xl">
            Une maison dédiée à la <span className="gold-text italic">précision</span>
          </h2>
          <div className="gold-rule mt-7 max-w-[10rem]" />
          <p className="mt-8 leading-relaxed text-muted-foreground">
            Fondée à Yaoundé, T.Maney Academy® est une école de mode spécialisée dans la
            corsetterie et les pièces structurées. Nos MasterClass réunissent des promotions
            volontairement réduites afin que chaque participante reçoive un accompagnement
            individuel, du premier relevé de mesures jusqu'à la pièce finie.
          </p>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Nos formations sont sanctionnées par un certificat de compétence, remis lors d'une
            cérémonie de fin de session.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              { icon: Ruler, t: "Patronage sur mesure", d: "Méthode de tracé rigoureuse, adaptée à chaque morphologie." },
              { icon: Scissors, t: "Structure & baleinage", d: "Montage, renforts et tenue parfaite du corset." },
              { icon: Sparkles, t: "Finitions couture", d: "Le niveau de détail attendu d'une pièce de luxe." },
              { icon: Award, t: "Certification", d: "Certificat de compétence remis en fin de MasterClass." },
            ].map((f) => (
              <div key={f.t} className="border border-border bg-card p-6">
                <f.icon className="text-gold" size={22} />
                <h3 className="mt-4 text-xl">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const programs = [
  {
    name: "Corset MasterClass",
    duration: "10 jours intensifs",
    price: "300 000 FCFA",
    points: [
      "Prise de mesures et patronage complet",
      "Montage, baleinage et pose d'œillets",
      "Corset bustier, corset waist et corset pagne",
      "Certificat de compétence",
    ],
    featured: true,
  },
  {
    name: "Bustier & Robe structurée",
    duration: "5 jours",
    price: "Sur demande",
    points: [
      "Bases du bustier intégré",
      "Robes de soirée structurées",
      "Travail du tissu et des renforts",
    ],
    featured: false,
  },
  {
    name: "Accompagnement Pro",
    duration: "Programme personnalisé",
    price: "Sur demande",
    points: [
      "Perfectionnement individuel",
      "Lancement de votre atelier",
      "Suivi post-formation",
    ],
    featured: false,
  },
];

export function Programs() {
  return (
    <section id="formations" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionTitle eyebrow="Nos formations" title="Programmes d'excellence" />

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {programs.map((p) => (
            <article
              key={p.name}
              className={`flex flex-col border p-9 transition-colors ${
                p.featured ? "border-gold bg-card" : "border-border bg-card/60 hover:border-gold/50"
              }`}
            >
              {p.featured && (
                <span className="mb-5 self-start border border-gold px-3 py-1 text-[0.6rem] uppercase tracking-[0.24em] text-gold">
                  Session phare
                </span>
              )}
              <h3 className="text-3xl">{p.name}</h3>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {p.duration}
              </p>
              <ul className="mt-7 flex-1 space-y-3 text-sm text-muted-foreground">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-3">
                    <span className="mt-2 h-px w-4 shrink-0 bg-gold" />
                    {pt}
                  </li>
                ))}
              </ul>
              <p className="mt-8 font-display text-3xl text-gold">{p.price}</p>
              <a
                href="#inscription"
                className={`mt-6 px-6 py-3 text-center text-xs uppercase tracking-[0.24em] transition-opacity ${
                  p.featured
                    ? "bg-gold text-primary-foreground hover:opacity-90"
                    : "border border-gold/60 text-gold hover:border-gold"
                }`}
              >
                Je m'inscris
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const gallery = [
  { url: p4.url, alt: "Remise du certificat de compétence devant le kakémono Corset MasterClass" },
  { url: p3.url, alt: "Promotion de la MasterClass Corset avec leurs certificats" },
  { url: p1.url, alt: "Diplômée posant avec son certificat et son mètre ruban" },
  { url: p2.url, alt: "Corset en pagne bleu et jaune monté sur mannequin de couture" },
];

export function Gallery() {
  return (
    <section id="galerie" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionTitle eyebrow="Galerie" title="Les coulisses de l'académie" />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((g) => (
            <figure key={g.alt} className="group overflow-hidden">
              <img
                src={g.url}
                alt={g.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ aspectRatio: "3 / 4" }}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    quote:
      "Dix jours qui ont transformé ma manière de coudre. Je réalise aujourd'hui des corsets sur mesure pour mes propres clientes.",
    name: "Finela Rachel",
    role: "Promotion Corset MasterClass",
  },
  {
    quote:
      "Un encadrement exigeant et bienveillant. Chaque étape est expliquée, corrigée, recommencée jusqu'à la perfection.",
    name: "Larissa N.",
    role: "Créatrice, Douala",
  },
  {
    quote:
      "J'ai reçu mon certificat et surtout la confiance nécessaire pour ouvrir mon atelier.",
    name: "Aïcha M.",
    role: "Fondatrice d'atelier",
  },
];

export function Testimonials() {
  return (
    <section id="temoignages" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionTitle eyebrow="Témoignages" title="Elles sont passées par ici" />
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="border border-border bg-card p-9">
              <p className="font-display text-2xl leading-relaxed text-foreground/90 italic">
                « {t.quote} »
              </p>
              <footer className="mt-7">
                <p className="text-sm text-gold">{t.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t.role}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

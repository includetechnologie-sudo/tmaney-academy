import { Monitor, BookOpen, Users, Award, X, MapPin, Phone, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Countdown } from "./countdown";
import { Confetti } from "./confetti";
import { GallerySlider } from "./gallery-slider";

const p1 = { url: "/images/photo-p1-diplomee.jpg" };
const academyPhotos = [
  { url: "/images/photo-p2-mannequin.jpg", alt: "Travail d'apprenante - Création haute couture" },
  { url: "/images/photo-p3-mannequin.jpg", alt: "Travail d'apprenante - Robe structurée" },
  { url: "/images/photo-p4-mannequin.jpg", alt: "Travail d'apprenante - Corsetterie" },
  { url: "/images/photo-p5-mannequin.jpg", alt: "Travail d'apprenante - Mode sur mesure" },
  { url: "/images/photo-p6-mannequin.jpg", alt: "Travail d'apprenante - Collection" },
  { url: "/images/photo-p7-mannequin.jpg", alt: "Travail d'apprenante - Design créatif" },
];
const p3 = { url: "/images/photo-p3-groupe.jpg" };
const p4 = { url: "/images/photo-p4-placeholder.jpg" };

const heroImages = [
  { url: "/images/hero-1-diplome.jpg", alt: "Diplômée présentant son certificat de compétence" },
  { url: "/images/hero-2-atelier.jpg", alt: "Atelier T.Maney Academy avec machines professionnelles" },
  { url: "/images/hero-3-robe-blanche.jpg", alt: "Robe de mariée structurée haute couture" },
  { url: "/images/hero-4-robe-rose.jpg", alt: "Création en tulle rose sur podium" },
];

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
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Auto-rotation des photos toutes les 4 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % academyPhotos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % academyPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + academyPhotos.length) % academyPhotos.length);
  };

  return (
    <section id="academie" className="border-t border-border py-16 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 sm:gap-14 sm:px-8 lg:grid-cols-2">
        {/* Carousel de photos */}
        <div className="relative group">
          <div className="relative overflow-hidden">
            {academyPhotos.map((photo, index) => (
              <img
                key={photo.url}
                src={photo.url}
                alt={photo.alt}
                className="w-full object-cover transition-opacity duration-700"
                style={{ 
                  aspectRatio: "4 / 5",
                  opacity: index === currentPhotoIndex ? 1 : 0,
                  position: index === currentPhotoIndex ? 'relative' : 'absolute',
                  inset: index === currentPhotoIndex ? 'auto' : '0',
                }}
                loading="lazy"
              />
            ))}
          </div>

          {/* Flèches de navigation */}
          <button
            type="button"
            onClick={prevPhoto}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-gold opacity-0 transition-all hover:bg-black/80 group-hover:opacity-100"
            aria-label="Photo précédente"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={nextPhoto}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-gold opacity-0 transition-all hover:bg-black/80 group-hover:opacity-100"
            aria-label="Photo suivante"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicateurs */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {academyPhotos.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentPhotoIndex(index)}
                className={`h-1.5 transition-all ${
                  index === currentPhotoIndex ? "w-8 bg-gold" : "w-1.5 bg-white/50"
                }`}
                aria-label={`Aller à la photo ${index + 1}`}
              />
            ))}
          </div>

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
            Le travail de nos <span className="gold-text italic">apprenantes</span>
          </h2>
          <div className="gold-rule mt-7 max-w-[10rem]" />
          <p className="mt-8 leading-relaxed text-muted-foreground">
            Fondée à Yaoundé, T.Maney Academy® est une école de mode spécialisée dans la{" "}
            <strong className="font-semibold text-foreground">Haute couture femme</strong>.{" "}
            <strong className="font-semibold text-foreground">Nous formons les passionnées de couture en stylisme-modélisme</strong>.
          </p>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Nos MasterClass réunissent des promotions volontairement réduites afin que chaque participante reçoive un accompagnement
            individuel, du premier relevé de mesures jusqu'à la pièce finie. Nos formations sont sanctionnées par un certificat de compétence, remis lors d'une
            cérémonie de fin de session.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              { 
                icon: Monitor, 
                t: "100% En Ligne", 
                d: "Formez-vous depuis le confort de votre maison où que vous soyez dans le monde." 
              },
              { 
                icon: BookOpen, 
                t: "Pédagogie Pas-à-Pas", 
                d: "Les techniques les plus complexes expliquées étape par étape." 
              },
              { 
                icon: Users, 
                t: "Suivi et accompagnement", 
                d: "Un groupe privé réservé aux apprenant(e)s pour poser vos questions." 
              },
              { 
                icon: Award, 
                t: "Certification", 
                d: "Certificat de compétence délivrée après la validation de vos travaux." 
              },
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
    name: "Débutant",
    duration: "9 mois",
    tranches: [
      { label: "1ère tranche", price: "150 000 F" },
      { label: "2ème tranche", price: "100 000 F" },
      { label: "3ème tranche", price: "50 000 F" },
    ],
    totalPrice: "300 000 FCFA",
    points: [
      "Bases de la couture professionnelle",
      "Patronage et techniques de coupe",
      "Montage et finitions",
      "Certificat de compétence",
    ],
    featured: true,
  },
  {
    name: "Intermédiaire",
    duration: "9 mois",
    tranches: [
      { label: "1ère tranche", price: "200 000 F" },
      { label: "2ème tranche", price: "150 000 F" },
      { label: "3ème tranche", price: "50 000 F" },
    ],
    totalPrice: "400 000 FCFA",
    points: [
      "Techniques avancées de couture",
      "Création de modèles complexes",
      "Adaptation sur mesure",
      "Certificat de compétence",
    ],
    featured: false,
  },
  {
    name: "Perfectionnement",
    duration: "6 mois",
    tranches: [
      { label: "1ère tranche", price: "200 000 F" },
      { label: "2ème tranche", price: "200 000 F" },
      { label: "3ème tranche", price: "100 000 F" },
    ],
    totalPrice: "500 000 FCFA",
    points: [
      "Maîtrise de la Haute Couture",
      "Techniques de luxe et raffinement",
      "Développement de votre style",
      "Certificat de compétence",
    ],
    featured: false,
  },
];

export function Programs() {
  const targetDate = new Date("2026-10-05T09:00:00");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const checkIfFinished = () => {
      const now = new Date();
      if (now >= targetDate && !isFinished) {
        setIsFinished(true);
        setShowConfetti(true);
        // Confetti pendant 6 secondes
        setTimeout(() => setShowConfetti(false), 6000);
      }
    };

    checkIfFinished();
    const interval = setInterval(checkIfFinished, 1000);
    return () => clearInterval(interval);
  }, [targetDate, isFinished]);

  return (
    <section id="formations" className="border-t border-border py-16 sm:py-24 lg:py-32">
      <Confetti show={showConfetti} />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <SectionTitle eyebrow="Nos formations" title="Programmes d'excellence" />

        {/* Bloc infos avant les programmes */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="rounded-lg border-2 border-gold/30 bg-card p-6 sm:p-8 md:p-10">
            <h3 className="text-center text-2xl font-semibold sm:text-3xl">
              Formez-vous & Devenez <span className="gold-text italic">Styliste Modéliste</span>
            </h3>
            
            <div className="mt-6 space-y-3 text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p className="font-semibold text-foreground">
                Modules : Haute Couture sur mesure • Prêt-à-porter • Fashion Entrepreneuriat
              </p>
            </div>

            {/* Countdown */}
            <div className="my-8 border-y border-border py-8">
              <p className="mb-6 text-center text-xs uppercase tracking-[0.24em] text-gold">
                Prochaine Rentrée
              </p>
              <Countdown targetDate={targetDate} />
            </div>

            {/* Infos pratiques */}
            <div className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 shrink-0 text-gold" size={18} />
                <div>
                  <p className="font-semibold text-foreground">Prochaine Rentrée</p>
                  <p className="text-muted-foreground">05 Octobre 2026</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 shrink-0 text-gold" size={18} />
                <div>
                  <p className="font-semibold text-foreground">Horaires</p>
                  <p className="text-muted-foreground">09h00 à 16h00 (Lundi au Vendredi)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 shrink-0 text-gold" size={18} />
                <div>
                  <p className="font-semibold text-foreground">WhatsApp</p>
                  <a 
                    href="https://wa.me/237697216348" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gold hover:underline"
                  >
                    (+237) 697 21 63 48
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-gold" size={18} />
                <div>
                  <p className="font-semibold text-foreground">Localisation</p>
                  <p className="text-muted-foreground">Descente éleveur, Ngousso (Yaoundé)</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2 border-t border-border pt-6 text-center text-sm">
              <p className="text-foreground">
                <span className="font-semibold text-gold">Frais d'inscription :</span> 50 000 FCFA
              </p>
              <p className="text-muted-foreground">Stage en entreprise • Places limitées</p>
            </div>
          </div>
        </div>

        {/* Grille des programmes */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {programs.map((p) => (
            <article
              key={p.name}
              className={`flex flex-col rounded-lg border p-6 transition-all sm:p-8 ${
                p.featured 
                  ? "border-gold bg-card shadow-[0_0_30px_-10px_var(--gold)]" 
                  : "border-border bg-card/60 hover:border-gold/50 hover:shadow-lg"
              }`}
            >
              {p.featured && (
                <span className="mb-4 self-start rounded-full border border-gold bg-gold/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-gold">
                  🔥 Populaire
                </span>
              )}
              
              <h3 className="text-2xl font-semibold sm:text-3xl">{p.name}</h3>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {p.duration}
              </p>

              {/* Paiement par tranches */}
              <div className="my-6 space-y-2 rounded-lg border border-border bg-background/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Paiement par tranches
                </p>
                {p.tranches.map((tranche) => (
                  <div key={tranche.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{tranche.label}</span>
                    <span className="font-semibold text-foreground">{tranche.price}</span>
                  </div>
                ))}
                <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-gold">{p.totalPrice}</span>
                </div>
              </div>

              <ul className="mb-6 flex-1 space-y-3 text-sm text-muted-foreground">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {pt}
                  </li>
                ))}
              </ul>

              <a
                href="#inscription"
                className={`mt-auto block rounded-lg px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.24em] transition-all ${
                  p.featured
                    ? "bg-gold text-primary-foreground shadow-md hover:opacity-90 hover:shadow-lg"
                    : "border-2 border-gold/60 text-gold hover:border-gold hover:bg-gold/5"
                }`}
              >
                Je m'inscris maintenant
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
  ...heroImages,
];

export function Gallery() {
  const [lightboxImage, setLightboxImage] = useState<{ url: string; alt: string } | null>(null);

  return (
    <>
      <section id="galerie" className="border-t border-border py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <SectionTitle eyebrow="Galerie" title="Les coulisses de l'académie" />
          
          <div className="mt-16">
            <GallerySlider images={gallery} />
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Glissez pour découvrir nos créations • Cliquez pour agrandir
          </p>
        </div>
      </section>

      {/* Lightbox pour agrandissement */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute right-4 top-4 text-gold transition-colors hover:text-gold-soft sm:right-8 sm:top-8"
            aria-label="Fermer"
          >
            <X size={32} />
          </button>
          <img
            src={lightboxImage.url}
            alt={lightboxImage.alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
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
    <section id="temoignages" className="border-t border-border py-16 sm:py-24 lg:py-32">
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

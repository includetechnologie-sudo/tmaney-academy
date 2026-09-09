import { useEffect, useState } from "react";

import { GoldParticles } from "./brand";

const slides = [
  {
    url: "/images/hero-1-diplome.jpg",
    alt: "Diplômée de la MasterClass présentant fièrement son certificat de compétence",
    position: "50% 30%",
  },
  {
    url: "/images/hero-2-atelier.jpg",
    alt: "Atelier T.Maney Academy équipé de machines à coudre professionnelles",
    position: "50% 50%",
  },
  {
    url: "/images/hero-3-robe-blanche.jpg",
    alt: "Magnifique robe de mariée blanche avec traîne structurée",
    position: "50% 40%",
  },
  {
    url: "/images/hero-4-robe-rose.jpg",
    alt: "Création haute couture en tulle rose sur le podium",
    position: "50% 35%",
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="accueil" className="relative flex min-h-screen items-center overflow-hidden">
      {slides.map((s, i) => (
        <img
          key={s.url}
          src={s.url}
          alt={s.alt}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms]"
          style={{ opacity: i === index ? 1 : 0, objectPosition: s.position }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-background" />
      <GoldParticles />

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-32 pb-24 sm:px-8">
        <div className="max-w-3xl fade-up">
          <p className="eyebrow">Yaoundé · Cameroun</p>
          <h1 className="mt-6 text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            L'art du <span className="gold-text italic">corset</span>,
            <br />
            enseigné avec exigence.
          </h1>
          <div className="gold-rule mt-8 max-w-xs" />
          <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg">
            T.Maney Academy forme les couturières et créatrices d'Afrique aux techniques de la
            corsetterie haut de gamme : patronage sur mesure, structure, baleinage et finitions
            couture. Une pédagogie intense, certifiante, et résolument premium.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#inscription"
              className="bg-gold px-9 py-4 text-center text-xs uppercase tracking-[0.24em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Réserver ma place
            </a>
            <a
              href="#formations"
              className="border border-gold/60 px-9 py-4 text-center text-xs uppercase tracking-[0.24em] text-gold transition-colors hover:border-gold"
            >
              Découvrir les formations
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
        {slides.map((s, i) => (
          <button
            key={s.url}
            type="button"
            aria-label={`Visuel ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-px w-10 transition-colors ${i === index ? "bg-gold" : "bg-foreground/30"}`}
          />
        ))}
      </div>
    </section>
  );
}

import { useEffect, useState, useRef } from "react";

import { GoldParticles, MagicSwipeParticles } from "./brand";

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
  const [swipeParticles, setSwipeParticles] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const particleIdCounter = useRef(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => window.clearInterval(id);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartX.current);
    const deltaY = Math.abs(touch.clientY - touchStartY.current);
    
    // Détection swipe horizontal
    if (deltaX > 10 && deltaX > deltaY) {
      // Créer des particules au toucher
      const newParticle = {
        x: touch.clientX,
        y: touch.clientY,
        id: particleIdCounter.current++,
      };
      setSwipeParticles(prev => [...prev, newParticle]);
      
      // Supprimer après animation
      setTimeout(() => {
        setSwipeParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 1500);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;
    
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe droite - image précédente
        setIndex((i) => (i - 1 + slides.length) % slides.length);
      } else {
        // Swipe gauche - image suivante
        setIndex((i) => (i + 1) % slides.length);
      }
    }
  };

  return (
    <section 
      id="accueil" 
      className="relative flex min-h-screen items-center overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((s, i) => (
        <img
          key={s.url}
          src={s.url}
          alt={s.alt}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms]"
          style={{ opacity: i === index ? 1 : 0, objectPosition: s.position }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85" />
      <GoldParticles />
      <MagicSwipeParticles particles={swipeParticles} />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24 md:px-8">
        <div className="max-w-3xl fade-up">
          <p className="eyebrow">Yaoundé · Cameroun</p>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
            L'art du <span className="gold-text italic">corset</span>,
            <br />
            enseigné avec exigence.
          </h1>
          <div className="gold-rule mt-8 max-w-xs" />
          <p className="mt-8 max-w-xl text-sm font-medium leading-relaxed text-foreground sm:text-base md:text-lg">
            T.Maney Academy forme les couturières et créatrices d'Afrique aux techniques de la
            corsetterie haut de gamme : patronage sur mesure, structure, baleinage et finitions
            couture. Une pédagogie intense, certifiante, et résolument premium.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <a
              href="#inscription"
              className="bg-gold px-7 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground transition-opacity hover:opacity-90 sm:px-9 sm:py-4"
            >
              Réserver ma place
            </a>
            <a
              href="#formations"
              className="border border-gold/60 px-7 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.24em] text-gold transition-colors hover:border-gold sm:px-9 sm:py-4"
            >
              Découvrir les formations
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-8 sm:gap-3">
        {slides.map((s, i) => (
          <button
            key={s.url}
            type="button"
            aria-label={`Visuel ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-px w-8 transition-colors sm:w-10 ${i === index ? "bg-gold" : "bg-foreground/30"}`}
          />
        ))}
      </div>
    </section>
  );
}

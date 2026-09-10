import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { GoldParticles, MagicSwipeParticles } from "./brand";

interface GalleryImage {
  url: string;
  alt: string;
}

export function GallerySlider({ images }: { images: GalleryImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swipeParticles, setSwipeParticles] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const particleIdCounter = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Créer le son de poussière de fée au chargement
  useEffect(() => {
    // Créer un son synthétique de poussière de fée
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playMagicSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Fréquences magiques (notes cristallines)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);
      
      oscillator.type = 'sine';
      
      // Envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    audioRef.current = { play: playMagicSound } as any;
  }, []);

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    audioRef.current?.play();
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    audioRef.current?.play();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToIndex = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    audioRef.current?.play();
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

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
      // Créer des particules magiques au toucher
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
        goToPrev();
      } else {
        goToNext();
      }
    }
  };

  return (
    <div className="relative">
      {/* Slider container */}
      <div 
        className="group relative aspect-[4/5] overflow-hidden bg-black/10"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Étincelles dorées permanentes */}
        <GoldParticles />
        
        {/* Particules magiques au toucher */}
        <MagicSwipeParticles particles={swipeParticles} />

        {/* Images */}
        <div className="relative h-full w-full">
          {images.map((img, i) => (
            <img
              key={img.url}
              src={img.url}
              alt={img.alt}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                i === currentIndex 
                  ? "opacity-100 scale-100" 
                  : "opacity-0 scale-105"
              } ${
                isTransitioning ? "blur-sm" : "blur-0"
              }`}
              loading="lazy"
            />
          ))}
        </div>

        {/* Flèches de navigation - visible au hover sur desktop */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-gold opacity-0 backdrop-blur-sm transition-all hover:bg-black/70 group-hover:opacity-100 sm:left-6"
          aria-label="Image précédente"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-gold opacity-0 backdrop-blur-sm transition-all hover:bg-black/70 group-hover:opacity-100 sm:right-6"
          aria-label="Image suivante"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicateurs */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-6">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goToIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex 
                  ? "w-8 bg-gold" 
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Aller à l'image ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Compteur */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <span className="font-semibold text-gold">{currentIndex + 1}</span>
        <span className="mx-2">/</span>
        <span>{images.length}</span>
      </div>
    </div>
  );
}

import { Play, X } from "lucide-react";
import { useState } from "react";

interface VideoTestimonial {
  id: string;
  videoId: string;
  name: string;
  role: string;
  thumbnail: string;
}

const testimonials: VideoTestimonial[] = [
  {
    id: "jeanne",
    videoId: "7520658934659566870",
    name: "ONANA MBOLO Jeanne",
    role: "Ancienne élève",
    thumbnail: "/images/jeanne.jpg",
  },
  {
    id: "denise",
    videoId: "7519962999466003734",
    name: "Mme Denise",
    role: "Créatrice",
    thumbnail: "/images/denise.jpg",
  },
  {
    id: "sandrine",
    videoId: "7518070771437079830",
    name: "Mme MEDOM Sandrine",
    role: "Styliste",
    thumbnail: "/images/sandrine.jpg",
  },
];

export function TestimonialsVideo() {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);

  return (
    <section id="temoignages" className="border-t border-border py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Témoignages</p>
          <h2 className="mt-5 text-4xl sm:text-5xl">Elles sont passées par ici</h2>
          <div className="gold-rule mx-auto mt-7 max-w-[10rem]" />
          <p className="mt-7 leading-relaxed text-muted-foreground">
            Découvrez les témoignages vidéo de nos anciennes élèves
          </p>
        </div>

        {/* Grid des miniatures */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="group relative cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-gold hover:shadow-lg"
              onClick={() => setActiveVideo(testimonial)}
            >
              {/* Miniature */}
              <div className="relative aspect-[9/16] overflow-hidden bg-black/5">
                <img
                  src={testimonial.thumbnail}
                  alt={testimonial.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay avec bouton play */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all group-hover:bg-black/50">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/90 shadow-lg transition-transform group-hover:scale-110">
                    <Play className="ml-1 text-primary-foreground" size={28} fill="currentColor" />
                  </div>
                </div>

                {/* Badge TikTok */}
                <div className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 backdrop-blur-sm">
                  <span className="text-xs font-semibold text-white">📱 TikTok</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 text-center">
                <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Modal de lecture vidéo */}
        {activeVideo && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            onClick={() => setActiveVideo(null)}
          >
            {/* Bouton fermer */}
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute right-4 top-4 rounded-full bg-black/50 p-3 text-gold transition-colors hover:bg-black/70 sm:right-8 sm:top-8"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>

            {/* Player TikTok */}
            <div
              className="relative w-full max-w-[400px] overflow-hidden rounded-lg bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative" style={{ paddingBottom: "177.78%" }}>
                <iframe
                  src={`https://www.tiktok.com/embed/v2/${activeVideo.videoId}?lang=fr-FR`}
                  className="absolute inset-0 h-full w-full"
                  allowFullScreen
                  allow="encrypted-media; autoplay"
                  title={`Témoignage vidéo de ${activeVideo.name}`}
                />
              </div>
            </div>

            {/* Info sous la vidéo */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <p className="text-sm font-semibold text-white">{activeVideo.name}</p>
              <p className="mt-1 text-xs text-white/70">{activeVideo.role}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

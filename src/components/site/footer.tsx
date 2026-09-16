import { Mail, MapPin, Phone, Facebook, Instagram } from "lucide-react";

import { Logo } from "./brand";

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-8 md:grid-cols-3">
        <div>
          <div className="inline-flex items-center justify-center">
            <Logo className="h-12" />
          </div>
          <p className="mt-6 max-w-md text-sm font-bold leading-relaxed text-foreground">
            Agrément du MINEFOP : ARRÊTÉ N°000071/MINEFOP/SG/DFOP/SDGSF/CSACD/CBC DU 05 MARS 2024
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Centre de formation professionnelle agréé par le ministère de l'Emploi et de la
            Formation professionnelle du Cameroun. L'académie est dédiée à l'apprentissage et au
            perfectionnement du métier de styliste-modéliste.
          </p>
        </div>

        <div>
          <h3 className="eyebrow">Navigation</h3>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li>
              <a className="hover:text-gold" href="/#academie">
                L'Académie
              </a>
            </li>
            <li>
              <a className="hover:text-gold" href="/#formations">
                Formations
              </a>
            </li>
            <li>
              <a className="hover:text-gold" href="/formations-en-ligne">
                Formations en ligne
              </a>
            </li>
            <li>
              <a className="hover:text-gold" href="/#galerie">
                Galerie
              </a>
            </li>
            <li>
              <a className="hover:text-gold" href="/#temoignages">
                Témoignages
              </a>
            </li>
            <li>
              <a className="hover:text-gold" href="/#inscription">
                Inscription
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Contact</h3>
          <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 text-gold" />
              Yaoundé, Cameroun
            </li>
            <li className="flex items-start gap-3">
              <Phone size={16} className="mt-0.5 text-gold" />
              <a className="hover:text-gold" href="tel:+237697216348">
                +237 697 216 348
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={16} className="mt-0.5 text-gold" />
              <a className="hover:text-gold" href="mailto:contact@tmaneyacademy.com">
                contact@tmaneyacademy.com
              </a>
            </li>
          </ul>

          <h3 className="eyebrow mt-8">Suivez-nous</h3>
          <div className="mt-5 flex items-center gap-4">
            <a
              href="https://www.facebook.com/tmaneyacademy/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="T.Maney Academy sur Facebook"
              className="text-muted-foreground transition-colors hover:text-gold"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/tmaney_academy/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="T.Maney Academy sur Instagram"
              className="text-muted-foreground transition-colors hover:text-gold"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://www.tiktok.com/@t.maney.academy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="T.Maney Academy sur TikTok"
              className="text-muted-foreground transition-colors hover:text-gold"
            >
              <TikTokIcon size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-6 py-6">
        <div className="flex flex-col items-center justify-center gap-3 text-center text-xs tracking-[0.18em] text-muted-foreground uppercase sm:flex-row sm:gap-6">
          <span>© {new Date().getFullYear()} T.Maney Academy® — tmaneyacademy.com</span>
          <span className="hidden sm:inline">·</span>
          <a
            href="https://includetechnologie.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold transition-colors hover:text-gold-soft"
          >
            Built by Include Technologie
          </a>
        </div>
      </div>
    </footer>
  );
}

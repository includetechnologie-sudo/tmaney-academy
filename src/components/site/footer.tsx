import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "./brand";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-8 md:grid-cols-3">
        <div>
          <div className="inline-flex items-center justify-center">
            <Logo className="h-12" />
          </div>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Centre de formation professionnelle agréé par le ministère de l'Emploi et de la Formation professionnelle du Cameroun. L'académie est dédiée à l'apprentissage et au perfectionnement du métier de styliste-modéliste.
          </p>
        </div>

        <div>
          <h3 className="eyebrow">Navigation</h3>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li><a className="hover:text-gold" href="#academie">L'Académie</a></li>
            <li><a className="hover:text-gold" href="#formations">Formations</a></li>
            <li><a className="hover:text-gold" href="#galerie">Galerie</a></li>
            <li><a className="hover:text-gold" href="#temoignages">Témoignages</a></li>
            <li><a className="hover:text-gold" href="#inscription">Inscription</a></li>
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
              <a className="hover:text-gold" href="tel:+237697216348">+237 697 216 348</a>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={16} className="mt-0.5 text-gold" />
              <a className="hover:text-gold" href="mailto:contact@tmaneyacademy.com">
                contact@tmaneyacademy.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-6 py-6 text-center text-xs tracking-[0.18em] text-muted-foreground uppercase">
        © {new Date().getFullYear()} T.Maney Academy® — tmaneyacademy.com
      </div>
    </footer>
  );
}

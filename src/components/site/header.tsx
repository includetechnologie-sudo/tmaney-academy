import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "./brand";

const links = [
  { href: "#academie", label: "L'Académie" },
  { href: "#formations", label: "Formations" },
  { href: "#galerie", label: "Galerie" },
  { href: "#temoignages", label: "Témoignages" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ink/92 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        <a href="#accueil" className="flex items-center" aria-label="T.Maney Academy — accueil">
          <span className="rounded-sm bg-white px-3 py-2">
            <Logo className={scrolled ? "h-8 sm:h-9" : "h-9 sm:h-11"} />
          </span>
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs uppercase tracking-[0.22em] text-foreground/75 transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#inscription"
            className="border border-gold px-6 py-3 text-xs uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
          >
            S'inscrire
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
          className="text-gold lg:hidden"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-ink/98 px-6 py-8 lg:hidden">
          <div className="flex flex-col gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.24em] text-foreground/80"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#inscription"
              onClick={() => setOpen(false)}
              className="border border-gold px-6 py-3 text-center text-xs uppercase tracking-[0.24em] text-gold"
            >
              S'inscrire
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

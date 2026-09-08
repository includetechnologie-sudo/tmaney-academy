import { createFileRoute } from "@tanstack/react-router";

import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Preloader } from "@/components/site/preloader";
import { Registration } from "@/components/site/registration";
import { About, Gallery, Programs, Testimonials } from "@/components/site/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "T.Maney Academy — MasterClass corsetterie à Yaoundé" },
      {
        name: "description",
        content:
          "Académie de mode spécialisée en corsetterie de luxe à Yaoundé : MasterClass certifiante de 10 jours, patronage sur mesure, baleinage et finitions couture. Inscriptions ouvertes.",
      },
      { property: "og:title", content: "T.Maney Academy — MasterClass corsetterie à Yaoundé" },
      {
        property: "og:description",
        content:
          "MasterClass certifiante en corsetterie haut de gamme. Promotions réduites, certificat de compétence, inscription en ligne.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-ink">
      <Preloader />
      <Header />
      <main>
        <Hero />
        <About />
        <Programs />
        <Gallery />
        <Testimonials />
        <Registration />
      </main>
      <Footer />
    </div>
  );
}

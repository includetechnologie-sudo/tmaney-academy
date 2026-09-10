import { createFileRoute } from "@tanstack/react-router";

import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Map } from "@/components/site/map";
import { MeetYourMentor } from "@/components/site/mentor";
import { OnlinePrograms } from "@/components/site/online-programs";
import { Preloader } from "@/components/site/preloader";
import { Registration } from "@/components/site/registration";
import { About, Gallery, Programs } from "@/components/site/sections";
import { TestimonialsVideo } from "@/components/site/testimonials-video";

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
        <OnlinePrograms />
        <MeetYourMentor />
        <About />
        <Programs />
        <Gallery />
        <TestimonialsVideo />
        <Map />
        <Registration />
      </main>
      <Footer />
    </div>
  );
}

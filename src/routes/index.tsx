import { createFileRoute } from "@tanstack/react-router";

import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { MeetYourMentor } from "@/components/site/mentor";
import { Preloader } from "@/components/site/preloader";
import { Registration } from "@/components/site/registration";
import { About, Gallery, Programs } from "@/components/site/sections";
import { TestimonialsVideo } from "@/components/site/testimonials-video";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "T.Maney Academy — École de Mode Haute Couture à Yaoundé, Cameroun" },
      {
        name: "description",
        content:
          "École de mode agréée par le MINEFOP à Yaoundé, Cameroun. Formations en haute couture, stylisme-modélisme et corsetterie, en ligne ou en présentiel. Certificat de compétence à la clé.",
      },
      {
        name: "keywords",
        content:
          "école de mode Yaoundé, école de mode Cameroun, haute couture, styliste modéliste, formation stylisme modélisme, corsetterie, MasterClass couture, T.Maney Academy, formation couture Cameroun, école de couture Afrique",
      },
      {
        property: "og:title",
        content: "T.Maney Academy — École de Mode Haute Couture à Yaoundé, Cameroun",
      },
      {
        property: "og:description",
        content:
          "Centre de formation agréé par le MINEFOP. Formations en haute couture, stylisme-modélisme et corsetterie, en ligne ou en présentiel. Inscriptions ouvertes.",
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
        <MeetYourMentor />
        <About />
        <Programs />
        <Gallery />
        <TestimonialsVideo />
        <Registration />
      </main>
      <Footer />
    </div>
  );
}

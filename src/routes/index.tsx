import { createFileRoute } from "@tanstack/react-router";

import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Map } from "@/components/site/map";
import { MeetYourMentor } from "@/components/site/mentor";
import { Preloader } from "@/components/site/preloader";
import { Registration } from "@/components/site/registration";
import { About, Gallery, Programs } from "@/components/site/sections";
import { TestimonialsVideo } from "@/components/site/testimonials-video";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "T.Maney Academy — Centre de Formation Agréé en Haute Couture, Cameroun" },
      {
        name: "description",
        content:
          "Centre de formation agréé MINEFOP à Yaoundé, Cameroun : école de mode en haute couture, stylisme-modélisme et corsetterie. Cours en ligne ou en présentiel.",
      },
      {
        name: "keywords",
        content:
          "T.Maney Academy, TManey Academy, T Maney Academy, Tmaney Academy, Tmaney, tmaneyacademy, école de mode Cameroun, école de mode Yaoundé, centre de formation agréé Cameroun, centre de formation agréé MINEFOP, centre de formation haute couture Cameroun, centre de formation stylisme modélisme Cameroun, centre de formation corsetterie Cameroun, styliste modéliste Cameroun, école de couture Cameroun, MasterClass couture, formation couture Cameroun, école de mode Afrique",
      },
      {
        property: "og:title",
        content: "T.Maney Academy — Centre de Formation Agréé en Haute Couture, Cameroun",
      },
      {
        property: "og:description",
        content:
          "Centre de formation agréé par le MINEFOP à Yaoundé. École de mode en haute couture, stylisme-modélisme et corsetterie, en ligne ou en présentiel. Inscriptions ouvertes.",
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
        <Map />
        <Registration />
      </main>
      <Footer />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

import { BridalPrograms } from "@/components/site/bridal-programs";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";

export const Route = createFileRoute("/formations-en-ligne")({
  head: () => ({
    meta: [
      { title: "Nos formations en ligne — Bridal | T.Maney Academy" },
      {
        name: "description",
        content:
          "Formations en ligne de haute couture bridal : modules Bridal 1, 2, 3 ou pack complet avec bonus. École de mode agréée par le MINEFOP à Yaoundé, Cameroun.",
      },
      { property: "og:title", content: "Nos formations en ligne — Bridal | T.Maney Academy" },
      {
        property: "og:description",
        content:
          "Modules Bridal 1, 2, 3 et pack complet avec bonus. Formez-vous à la haute couture bridal à votre rythme.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: FormationsEnLigne,
});

function FormationsEnLigne() {
  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <main className="pt-20">
        <BridalPrograms />
      </main>
      <Footer />
    </div>
  );
}

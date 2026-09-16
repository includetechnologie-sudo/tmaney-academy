import { Header } from "./components/site/header";
import { Hero } from "./components/site/hero";
import { BridalPrograms } from "./components/site/bridal-programs";
import { MeetYourMentor } from "./components/site/mentor";
import { About, Gallery, Programs } from "./components/site/sections";
import { TestimonialsVideo } from "./components/site/testimonials-video";
import { Map } from "./components/site/map";
import { Registration } from "./components/site/registration";
import { Footer } from "./components/site/footer";
import { Preloader } from "./components/site/preloader";

function FormationsEnLignePage() {
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

function HomePage() {
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

function App() {
  if (typeof window !== "undefined" && window.location.pathname === "/formations-en-ligne") {
    return <FormationsEnLignePage />;
  }
  return <HomePage />;
}

export default App;

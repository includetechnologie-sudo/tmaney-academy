export function MeetYourMentor() {
  return (
    <section id="mentor" className="border-t border-border py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image Manuella */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden">
              <img
                src="/images/manuella.jpg"
                alt="Mme Maney - Styliste, modéliste et formatrice en Haute Couture"
                className="w-full object-cover"
                style={{ aspectRatio: "4 / 5" }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>

          {/* Texte biographie */}
          <div className="order-1 lg:order-2">
            <p className="eyebrow">Votre formatrice</p>
            <h2 className="mt-5 text-3xl font-semibold sm:text-4xl lg:text-5xl">
              Meet your <span className="gold-text italic">Mentor</span>
            </h2>
            <div className="gold-rule mt-7 max-w-[10rem]" />
            
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                <strong className="font-semibold text-foreground">Mme Maney</strong> est une styliste, 
                modéliste et formatrice d'exception spécialisée en Haute Couture femme.
              </p>
              
              <p>
                Fort d'une solide expérience sur le terrain et de perfectionnements continus auprès 
                des plus grands ateliers internationaux, elle a développé une méthode d'enseignement 
                rigoureuse axée sur la précision du patronage et les finitions d'exception.
              </p>
              
              <p>
                Ses techniques de confection uniques ont déjà permis à de nombreuses créatrices et 
                couturières à travers l'Afrique et la diaspora de perfectionner leur art et de valoriser 
                leur savoir-faire.
              </p>
              
              <p>
                Sa mission est de transmettre l'exigence de la Haute Couture et d'offrir aux passionnées 
                de mode les compétences techniques et entrepreneuriales nécessaires pour bâtir des ateliers 
                prospères et reconnus.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 rounded-sm border border-gold/30 bg-card px-6 py-4">
                <span className="font-display text-3xl text-gold">15+</span>
                <span className="text-xs uppercase leading-tight tracking-[0.2em] text-muted-foreground">
                  Années<br />d'expérience
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-sm border border-gold/30 bg-card px-6 py-4">
                <span className="font-display text-3xl text-gold">500+</span>
                <span className="text-xs uppercase leading-tight tracking-[0.2em] text-muted-foreground">
                  Élèves<br />formées
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

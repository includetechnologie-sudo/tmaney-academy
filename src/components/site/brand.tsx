export const LOGO_URL = "/images/logo.png";

export function Logo({ className = "h-12" }: { className?: string }) {
  return (
    <img
      src={LOGO_URL}
      alt="T.Maney Academy"
      className={`${className} w-auto object-contain`}
      loading="eager"
    />
  );
}

export function GoldParticles() {
  const particles = Array.from({ length: 35 }, (_, i) => ({
    left: `${(i * 37) % 100}%`,
    size: 3 + ((i * 5) % 5),
    delay: (i * 0.9) % 14,
    duration: 12 + ((i * 3) % 10),
  }));

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full bg-gold"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: 0,
            filter: "blur(0.8px)",
            boxShadow: "0 0 18px 4px var(--gold), 0 0 8px 2px var(--gold-soft)",
            animation: `tm-rise ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

interface MagicParticle {
  x: number;
  y: number;
  id: number;
}

export function MagicSwipeParticles({ particles }: { particles: MagicParticle[] }) {
  const colors = [
    'oklch(0.78 0.107 85)', // gold
    'oklch(0.68 0.19 350)', // rose/magenta du logo
    'oklch(0.58 0.21 310)', // violet du logo
    'oklch(0.88 0.06 90)', // gold-soft
  ];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40">
      {particles.map((particle) => (
        <div key={particle.id} className="absolute" style={{ left: particle.x, top: particle.y }}>
          {/* Particules magiques multiples autour du point de toucher */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const distance = 20 + Math.random() * 80;
            const offsetX = Math.cos(angle) * distance;
            const offsetY = Math.sin(angle) * distance;
            const size = 3 + Math.random() * 6;
            const duration = 0.8 + Math.random() * 0.7;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            return (
              <span
                key={i}
                className="absolute rounded-full animate-magic-float"
                style={{
                  left: 0,
                  top: 0,
                  width: size,
                  height: size,
                  backgroundColor: color,
                  boxShadow: `0 0 12px 3px ${color}`,
                  filter: 'blur(0.6px)',
                  animation: `magic-particle ${duration}s ease-out forwards`,
                  '--offset-x': `${offsetX}px`,
                  '--offset-y': `${offsetY}px`,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

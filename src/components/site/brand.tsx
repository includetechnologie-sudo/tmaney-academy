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
  const particles = Array.from({ length: 22 }, (_, i) => ({
    left: `${(i * 37) % 100}%`,
    size: 2 + ((i * 5) % 4),
    delay: (i * 0.9) % 14,
    duration: 14 + ((i * 3) % 10),
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
            filter: "blur(0.4px)",
            boxShadow: "0 0 8px var(--gold)",
            animation: `tm-rise ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

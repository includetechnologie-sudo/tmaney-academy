import { useEffect, useState } from "react";

interface Confetto {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

export function Confetti({ show }: { show: boolean }) {
  const [confetti, setConfetti] = useState<Confetto[]>([]);

  useEffect(() => {
    if (!show) return;

    // Couleurs inspirées du logo (or, rose, violet)
    const colors = [
      "oklch(0.78 0.107 85)",   // gold
      "oklch(0.68 0.19 350)",    // rose/magenta
      "oklch(0.58 0.21 310)",    // violet
      "oklch(0.88 0.06 90)",     // gold-soft
    ];

    // Créer 150 confettis
    const newConfetti: Confetto[] = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 8 + Math.random() * 12,
      velocity: {
        x: (Math.random() - 0.5) * 4,
        y: Math.random() * 3 + 2,
      },
    }));

    setConfetti(newConfetti);

    // Animer les confettis
    const animationDuration = 6000; // 6 secondes
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed > animationDuration) {
        setConfetti([]);
        return;
      }

      setConfetti((prev) =>
        prev.map((c) => ({
          ...c,
          x: c.x + c.velocity.x,
          y: c.y + c.velocity.y,
          rotation: c.rotation + 5,
          velocity: {
            x: c.velocity.x * 0.99,
            y: c.velocity.y + 0.1, // Gravité
          },
        }))
      );

      requestAnimationFrame(animate);
    };

    animate();
  }, [show]);

  if (confetti.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute rounded-sm"
          style={{
            left: c.x,
            top: c.y,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            transform: `rotate(${c.rotation}deg)`,
            boxShadow: `0 0 8px ${c.color}`,
          }}
        />
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";

import { Logo } from "./brand";

export function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const a = window.setTimeout(() => setLeaving(true), 1400);
    const b = window.setTimeout(() => setHidden(true), 2400);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink transition-opacity duration-1000"
      style={{ opacity: leaving ? 0 : 1 }}
    >
      <div className="fade-up flex flex-col items-center gap-6 px-8">
        <div className="flex items-center justify-center">
          <Logo className="h-16 sm:h-20" />
        </div>
        <p className="eyebrow text-center">L'art de la haute couture</p>
        <div className="relative h-px w-48 overflow-hidden bg-border">
          <span
            className="absolute inset-y-0 left-0 bg-gold"
            style={{
              animation: "tm-load 1.6s cubic-bezier(0.4,0,0.2,1) forwards",
            }}
          />
        </div>
      </div>
      <style>{`@keyframes tm-load{from{width:0}to{width:100%}}`}</style>
    </div>
  );
}

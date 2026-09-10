import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
}

export function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isFinished) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-3 rounded-lg border-2 border-gold bg-gold/10 px-8 py-6">
          <span className="text-2xl">🎓</span>
          <h3 className="text-2xl font-bold text-gold sm:text-3xl">
            Bonne rentrée Scolaire !
          </h3>
          <span className="text-2xl">🎊</span>
        </div>
      </div>
    );
  }

  const blocks = [
    { value: timeLeft.days, label: "Jours" },
    { value: timeLeft.hours, label: "Heures" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Secondes" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {blocks.map((block, i) => (
        <div key={block.label} className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-gold bg-card sm:h-20 sm:w-20">
              <span className="font-display text-3xl font-bold text-gold sm:text-4xl">
                {String(block.value).padStart(2, "0")}
              </span>
            </div>
            <span className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {block.label}
            </span>
          </div>
          {i < blocks.length - 1 && (
            <span className="hidden text-2xl font-bold text-gold sm:block">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const difference = targetDate.getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isFinished: false,
  };
}

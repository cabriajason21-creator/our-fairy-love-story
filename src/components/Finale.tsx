import React, { useState } from "react";

interface FinaleProps {
  finaleMessage: string;
  theme?: "day" | "night";
}

interface ConfettiItem {
  id: number;
  left: string;
  width: string;
  height: string;
  background: string;
  borderRadius: string;
  duration: string;
}

export default function Finale({ finaleMessage, theme }: FinaleProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiItem[]>([]);

  const handleUnlock = () => {
    if (unlocked) return;
    setUnlocked(true);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const colors = ["#EC4899", "#3B82F6", "#F97316", "#FBBF24", "#FF8A8A"];
    const generated: ConfettiItem[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      width: `${8 + Math.random() * 6}px`,
      height: `${8 + Math.random() * 6}px`,
      background: colors[Math.floor(Math.random() * colors.length)],
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      duration: `${2.5 + Math.random() * 2.5}s`,
    }));
    setConfetti(generated);

    setTimeout(() => {
      setConfetti([]);
    }, 5500);
  };

  return (
    <div
      id="finale"
      className="absolute inset-0 overflow-hidden pt-16 pb-8 px-4 flex flex-col items-center justify-center"
    >
      {/* Outer Card with Fixed Dimensions and Center Alignment */}
      <div className="w-full max-w-[760px] bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[32px] p-6 sm:p-8 text-center shadow-[0_8px_0_#4E2512] relative my-auto flex flex-col justify-between overflow-hidden">
        
        {/* Scroll Roller Top Handle */}
        <div className="absolute top-0 inset-x-12 h-2.5 bg-[#854D0E] border-b-2 border-x-2 border-[#4E2512] rounded-b-md shadow-sm" />

        {/* Ribbon decoration top left */}
        <div className="absolute top-0 left-8 w-6 h-9 bg-[#EC4899] border-l-2 border-r-2 border-b-2 border-b-transparent border-[#4E2512] rounded-b-md z-10" />

        {/* Header Title Section */}
        <div className="shrink-0 mb-3 pt-1">
          <span className="text-[11px] font-serif font-black text-[#EC4899] uppercase tracking-widest mb-1 block">
            ✨ The Final Chapter ✨
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#EA580C] mb-1">
            A Letter From My Heart
          </h2>
          <div className="h-[3px] w-28 bg-[#4E2512] mx-auto mb-2 rounded-full" />
        </div>

        {/* Message Box - Fixed spacious height before and after unlock */}
        <div 
          className={`w-full h-[320px] sm:h-[360px] bg-[#FCF6E9] border-2 border-[#4E2512] rounded-2xl p-6 sm:p-8 shadow-[inset_0_2px_5px_rgba(0,0,0,0.06)] overflow-y-auto text-left relative my-2 ${
            unlocked ? "" : "flex flex-col items-center justify-center text-center"
          }`}
        >
          <p
            className={`font-serif text-sm sm:text-base md:text-[17px] font-bold leading-relaxed sm:leading-loose whitespace-pre-wrap transition-all duration-500 select-text ${
              unlocked 
                ? `opacity-100 scale-100 pb-2 ${theme === "night" ? "text-[#FAF4E9]" : "text-[#4E2512]"}` 
                : "opacity-80 scale-95 font-black text-base sm:text-lg text-[#EA580C]"
            }`}
          >
            {unlocked ? finaleMessage : "Click below to unlock my final message"}
          </p>
        </div>

        {/* Unlock Button Container - Preserves slot space so container never shifts */}
        <div className="shrink-0 mt-3 h-[50px] flex items-center justify-center pb-1 z-10">
          <button
            onClick={handleUnlock}
            disabled={unlocked}
            className={`w-full max-w-xs bg-[#EA580C] hover:bg-[#C2410C] text-white font-serif font-black text-sm px-8 py-3 rounded-2xl border-3 border-[#4E2512] shadow-[0_4px_0_#4E2512] active:translate-y-0.5 active:shadow-[0_1px_0_#4E2512] transition-all cursor-pointer uppercase tracking-wider ${
              unlocked ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
             Unlock Message 
          </button>
        </div>

        {/* Scroll Roller Bottom Handle */}
        <div className="absolute bottom-0 inset-x-12 h-2.5 bg-[#854D0E] border-t-2 border-x-2 border-[#4E2512] rounded-t-md shadow-sm" />
      </div>

      {/* Confetti Particle Portal */}
      {confetti.map((particle) => (
        <div
          key={particle.id}
          className="fixed -top-3 z-50 pointer-events-none"
          style={{
            left: particle.left,
            width: particle.width,
            height: particle.height,
            background: particle.background,
            borderRadius: particle.borderRadius,
            animationName: "fall",
            animationTimingFunction: "linear",
            animationFillMode: "forwards",
            animationDuration: particle.duration,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}



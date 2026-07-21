import React, { useState } from "react";
import { Milestone } from "../types";

interface TimelineProps {
  timeline: Milestone[];
  theme?: "day" | "night";
}

export default function Timeline({ timeline, theme }: TimelineProps) {
  const [index, setIndex] = useState(0);

  if (timeline.length === 0) return null;

  const current = timeline[index];

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + timeline.length) % timeline.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % timeline.length);
  };

  return (
    <div
      id="timeline"
      className="absolute inset-0 overflow-hidden pt-24 pb-12 px-4 flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-[540px] bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[24px] p-5 sm:p-8 text-center shadow-[0_6px_0_#4E2512] relative my-auto max-h-[74vh] overflow-y-auto hide-scrollbar">
        {/* Top ribbon corner decoration */}
        <div className="absolute top-0 right-8 w-6 h-8 bg-[#EF4444] border-l-2 border-r-2 border-b-2 border-b-transparent border-[#4E2512] rounded-b-md z-10" />

        <span className="text-[11px] font-serif font-black text-[#EC4899] uppercase tracking-widest mb-1.5 block">
          🏆 Our Quest Logs 🏆
        </span>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-[#EA580C] mb-1">
          Memory Timeline
        </h2>
        <div className="h-[3px] w-24 bg-[#4E2512] mx-auto mb-6 rounded-full" />

        {/* Milestone Content */}
        <div className="min-h-[220px] flex flex-col justify-center select-none bg-[#FCF6E9] border-2 border-[#4E2512] rounded-xl p-4 sm:p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
          {/* Animated Emoji */}
          <span className="text-4xl md:text-5xl mb-3 block animate-bounce" style={{ animationDuration: '2.5s' }}>
            {current.emoji || "💫"}
          </span>

          {/* Milestone Date / Label */}
          <span className="text-xs font-serif font-extrabold tracking-widest text-[#3B82F6] uppercase block mb-1">
            📅 {current.date}
          </span>

          {/* Milestone Title */}
          <h3 className={`font-serif font-black text-lg sm:text-xl mb-3 ${
            theme === "night" ? "text-[#FAF4E9]" : "text-[#4E2512]"
          }`}>
            {current.title}
          </h3>

          {/* Story Text */}
          <p className={`text-sm sm:text-base font-sans font-bold leading-relaxed max-w-lg mx-auto whitespace-pre-wrap ${
            theme === "night" ? "text-[#FAF4E9]" : "text-[#6B4B3E]"
          }`}>
            {current.text}
          </p>
        </div>

        {/* Slider Controls */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-xl bg-[#F97316] hover:bg-[#EA580C] border-2 border-[#4E2512] shadow-[0_3px_0_#4E2512] active:translate-y-0.5 active:shadow-[0_1px_0_#4E2512] text-white text-lg font-black flex items-center justify-center cursor-pointer transition-all"
            aria-label="Previous Milestone"
          >
            ◀
          </button>

          {/* Page Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 max-w-[150px] sm:max-w-[220px]">
            {timeline.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full cursor-pointer transition-all border-2 border-[#4E2512] flex-shrink-0 ${
                  i === index 
                    ? "bg-[#EC4899] scale-110 shadow-[0_1px_0_#4E2512]" 
                    : "bg-[#FED7AA] hover:bg-[#FDBA74]"
                }`}
                aria-label={`Go to milestone ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-xl bg-[#F97316] hover:bg-[#EA580C] border-2 border-[#4E2512] shadow-[0_3px_0_#4E2512] active:translate-y-0.5 active:shadow-[0_1px_0_#4E2512] text-white text-lg font-black flex items-center justify-center cursor-pointer transition-all"
            aria-label="Next Milestone"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}


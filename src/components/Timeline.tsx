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
      <div className="w-full max-w-[540px] md:max-w-[720px] lg:max-w-[800px] bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[24px] md:rounded-[32px] p-5 sm:p-8 md:p-10 lg:p-12 text-center shadow-[0_6px_0_#4E2512] md:shadow-[0_8px_0_#4E2512] relative my-auto max-h-[74vh] md:max-h-[82vh] overflow-y-auto hide-scrollbar">
        {/* Top ribbon corner decoration */}
        <div className="absolute top-0 right-8 md:right-12 w-6 md:w-8 h-8 md:h-10 bg-[#EF4444] border-l-2 border-r-2 border-b-2 border-b-transparent border-[#4E2512] rounded-b-md z-10" />

        <span className="text-[11px] md:text-xs font-serif font-black text-[#EC4899] uppercase tracking-widest mb-1.5 md:mb-2 block">
           Our Quest Logs 
        </span>
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#EA580C] mb-1">
          Memory Timeline
        </h2>
        <div className="h-[3px] md:h-[4px] w-24 md:w-32 bg-[#4E2512] mx-auto mb-6 md:mb-8 rounded-full" />

        {/* Milestone Content */}
        <div className="min-h-[220px] md:min-h-[300px] lg:min-h-[340px] flex flex-col justify-center select-none bg-[#FCF6E9] border-2 md:border-[3px] border-[#4E2512] rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
          {/* Animated Emoji */}
          <span className="text-4xl md:text-6xl lg:text-7xl mb-3 md:mb-4 block animate-bounce" style={{ animationDuration: '2.5s' }}>
            {current.emoji || "💫"}
          </span>

          {/* Milestone Date / Label */}
          <span className="text-xs md:text-sm lg:text-base font-serif font-extrabold tracking-widest text-[#3B82F6] uppercase block mb-1 md:mb-2">
            📅 {current.date}
          </span>

          {/* Milestone Title */}
          <h3 className={`font-serif font-black text-lg sm:text-xl md:text-2xl lg:text-3xl mb-3 md:mb-4 ${
            theme === "night" ? "text-[#FAF4E9]" : "text-[#4E2512]"
          }`}>
            {current.title}
          </h3>

          {/* Story Text */}
          <p className={`text-sm sm:text-base md:text-lg lg:text-xl font-sans font-bold leading-relaxed max-w-lg md:max-w-xl lg:max-w-2xl mx-auto whitespace-pre-wrap ${
            theme === "night" ? "text-[#FAF4E9]" : "text-[#6B4B3E]"
          }`}>
            {current.text}
          </p>
        </div>

        {/* Slider Controls */}
        <div className="flex items-center justify-center gap-6 md:gap-8 mt-6 md:mt-8">
          <button
            onClick={handlePrev}
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#F97316] hover:bg-[#EA580C] border-2 md:border-[2.5px] border-[#4E2512] shadow-[0_3px_0_#4E2512] md:shadow-[0_4px_0_#4E2512] active:translate-y-0.5 active:shadow-[0_1px_0_#4E2512] text-white text-lg md:text-xl font-black flex items-center justify-center cursor-pointer transition-all"
            aria-label="Previous Milestone"
          >
            ◀
          </button>

          {/* Page Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 md:gap-2.5 max-w-[150px] sm:max-w-[220px] md:max-w-[320px]">
            {timeline.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full cursor-pointer transition-all border-2 border-[#4E2512] flex-shrink-0 ${
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
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#F97316] hover:bg-[#EA580C] border-2 md:border-[2.5px] border-[#4E2512] shadow-[0_3px_0_#4E2512] md:shadow-[0_4px_0_#4E2512] active:translate-y-0.5 active:shadow-[0_1px_0_#4E2512] text-white text-lg md:text-xl font-black flex items-center justify-center cursor-pointer transition-all"
            aria-label="Next Milestone"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}


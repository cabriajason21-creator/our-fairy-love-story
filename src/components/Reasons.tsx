import React, { useState, useEffect } from "react";

interface ReasonsProps {
  reasons: string[];
  theme?: "day" | "night";
}

export default function Reasons({ reasons, theme }: ReasonsProps) {
  const [deck, setDeck] = useState<string[]>([]);
  const [currentReason, setCurrentReason] = useState("Draw a card to begin");
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    setDeck([...reasons]);
  }, [reasons]);

  const handleDraw = () => {
    let currentDeck = [...deck];
    if (currentDeck.length === 0) {
      currentDeck = [...reasons];
    }

    const randomIndex = Math.floor(Math.random() * currentDeck.length);
    const chosen = currentDeck.splice(randomIndex, 1)[0];

    setDeck(currentDeck);
    setFlip(false);

    // Trigger standard CSS card flip transition
    setTimeout(() => {
      setCurrentReason(chosen);
      setFlip(true);
    }, 50);
  };

  const cardsLeft = deck.length;

  return (
    <div
      id="reasons"
      className="absolute inset-0 overflow-hidden pt-24 pb-12 px-4 flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-[540px] bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[24px] p-5 sm:p-8 text-center shadow-[0_6px_0_#4E2512] relative my-auto max-h-[74vh] overflow-y-auto hide-scrollbar">
        {/* Cute ribbon top right corner */}
        <div className="absolute top-0 right-10 w-6 h-8 bg-[#EF4444] border-l-2 border-r-2 border-b-2 border-b-transparent border-[#4E2512] rounded-b-md z-10" />

        <span className="text-[11px] font-serif font-black text-[#EC4899] uppercase tracking-widest mb-1.5 block">
          🌸 Secret Scroll 🌸
        </span>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-[#EA580C] mb-1">
          Reasons I Love You
        </h2>
        <div className="h-[3px] w-24 bg-[#4E2512] mx-auto mb-6 rounded-full" />

        {/* Card Deck Wrapper */}
        <div className="mx-auto w-[280px] sm:w-[320px] select-none">
          {/* Card Face - RPG Item style */}
          <div
            className={`bg-gradient-to-br from-[#FCF6E9] to-[#FFF5E6] border-4 border-[#4E2512] rounded-3xl p-8 min-h-[180px] flex flex-col items-center justify-center font-serif text-lg sm:text-xl font-bold shadow-[0_4px_0_#4E2512] transition-transform duration-300 relative ${
              flip ? "animate-flip-card" : ""
            } ${
              theme === "night" ? "text-[#FAF4E9]" : "text-[#4E2512]"
            }`}
          >
            {/* Cute magical stars */}
            <div className="absolute top-2 left-2.5 text-[#F59E0B] text-sm opacity-80">★</div>
            <div className="absolute top-2 right-2.5 text-[#F59E0B] text-sm opacity-80">★</div>
            <div className="absolute bottom-2 left-2.5 text-[#F59E0B] text-sm opacity-80">★</div>
            <div className="absolute bottom-2 right-2.5 text-[#F59E0B] text-sm opacity-80">★</div>

            <p className="leading-relaxed px-2 text-center text-sm sm:text-base">
              {currentReason}
            </p>
          </div>

          {/* Draw Button: Game orange button style */}
          <button
            onClick={handleDraw}
            className="mt-6 w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-serif font-black text-sm px-6 py-3 rounded-2xl border-3 border-[#4E2512] shadow-[0_4px_0_#4E2512] active:translate-y-0.5 active:shadow-[0_1px_0_#4E2512] transition-all cursor-pointer uppercase tracking-wider"
          >
            🎲 Draw a Card 🎲
          </button>

          {/* Deck Counter tag */}
          <div className="mt-4 inline-block bg-[#FAF4E9] border-2 border-[#4E2512] rounded-xl px-3 py-1 shadow-[0_2px_0_#4E2512]">
            <p className={`text-[11px] font-serif font-bold ${
              theme === "night" ? "text-[#FAF4E9]" : "text-[#4E2512]"
            }`}>
              {cardsLeft} Card{cardsLeft === 1 ? "" : "s"} Left (Reshuffles when empty)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


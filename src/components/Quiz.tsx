import React, { useState } from "react";
import { QuizQuestion } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, Award, CheckCircle, AlertCircle } from "lucide-react";

interface QuizProps {
  quiz: QuizQuestion[];
  theme?: "day" | "night";
}

export default function Quiz({ quiz, theme }: QuizProps) {
  const [index, setIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (quiz.length === 0) return null;

  const current = quiz[index];

  const handleSelect = (optIdx: number) => {
    if (locked) return;
    setLocked(true);
    setSelectedIdx(optIdx);

    const isCorrect = optIdx === current.correct;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      setSelectedIdx(null);
      setLocked(false);
      if (index === quiz.length - 1) {
        setIsFinished(true);
      } else {
        setIndex((prev) => (prev + 1));
      }
    }, 1100);
  };

  const handleReset = () => {
    setIndex(0);
    setSelectedIdx(null);
    setLocked(false);
    setScore(0);
    setIsFinished(false);
  };

  const getFeedback = () => {
    if (score === quiz.length) {
      return {
        title: "Perfect Score! 🎉",
        message: "You know us too well! 💖",
        color: "text-[#22C55E]",
        bg: "bg-[#DCFCE7]",
        border: "border-[#22C55E]",
        icon: <Award className="w-12 h-12 text-[#22C55E] animate-bounce" />,
      };
    } else if (score >= Math.ceil(quiz.length / 2)) {
      return {
        title: "Good Effort! ✨",
        message: "Not bad! You're getting there! ✨",
        color: "text-[#3B82F6]",
        bg: "bg-[#E0F2FE]",
        border: "border-[#3B82F6]",
        icon: <CheckCircle className="w-12 h-12 text-[#3B82F6]" />,
      };
    } else {
      return {
        title: "Keep Trying! 💪",
        message: "Oh no... Do you even know me? 🥺💔",
        color: "text-[#EF4444]",
        bg: "bg-[#FEE2E2]",
        border: "border-[#EF4444]",
        icon: <AlertCircle className="w-12 h-12 text-[#EF4444] animate-pulse" />,
      };
    }
  };

  const feedback = getFeedback();

  return (
    <div
      id="quiz"
      className="absolute inset-0 overflow-hidden pt-24 pb-12 px-4 flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-[540px] bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[24px] p-5 sm:p-8 text-center shadow-[0_6px_0_#4E2512] relative my-auto max-h-[74vh] overflow-y-auto hide-scrollbar">
        {/* Ribbon decoration top-left */}
        <div className="absolute top-0 left-8 w-6 h-8 bg-[#EF4444] border-l-2 border-r-2 border-b-2 border-b-transparent border-[#4E2512] rounded-b-md z-10" />

        <span className="text-[11px] font-serif font-black text-[#EC4899] uppercase tracking-widest mb-1.5 block">
           Lovers' Trivia 
        </span>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-[#EA580C] mb-1">
          How Well Do You Know Us?
        </h2>
        <div className="h-[3px] w-24 bg-[#4E2512] mx-auto mb-5 rounded-full" />

        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key="question-box"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              {/* Progress badge */}
              <div className="inline-block bg-[#E0F2FE] border-2 border-[#4E2512] rounded-xl px-3 py-1 shadow-[0_2px_0_#4E2512] mb-5">
                <p className="text-xs font-serif font-extrabold text-[#3B82F6]">
                  Question {index + 1} of {quiz.length}
                </p>
              </div>

              {/* Question Text */}
              <div className={`text-base sm:text-lg font-serif font-black leading-relaxed mb-6 select-none max-w-md mx-auto min-h-[50px] flex items-center justify-center ${
                theme === "night" ? "text-[#FAF4E9]" : "text-[#4E2512]"
              }`}>
                "{current.q}"
              </div>

              {/* Option Grid */}
              <div className="grid grid-cols-1 gap-3.5 max-w-md mx-auto">
                {current.options.map((opt, optIdx) => {
                  let stateClass = `border-2 border-[#4E2512] bg-[#FCF6E9] hover:bg-[#FFE4E6] active:translate-y-0.5 active:shadow-[0_1px_0_#4E2512] shadow-[0_3px_0_#4E2512] ${
                    theme === "night" ? "text-[#FAF4E9]" : "text-[#4E2512]"
                  }`;

                  if (selectedIdx !== null) {
                    if (optIdx === current.correct) {
                      // Correct answer glows green
                      stateClass = "border-3 border-[#22C55E] bg-[#DCFCE7] text-[#15803D] shadow-[0_3px_0_#15803D] font-extrabold scale-[1.02]";
                    } else if (optIdx === selectedIdx) {
                      // Wrong selected answer glows red
                      stateClass = "border-3 border-[#EF4444] bg-[#FEE2E2] text-[#B91C1C] shadow-[0_3px_0_#B91C1C] font-extrabold";
                    } else {
                      // Dim other unselected incorrect options
                      stateClass = `border-2 border-[#4E2512]/30 bg-[#FCF6E9]/50 opacity-40 shadow-none pointer-events-none ${
                        theme === "night" ? "text-[#FAF4E9]/50" : "text-[#4E2512]/50"
                      }`;
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={locked}
                      onClick={() => handleSelect(optIdx)}
                      className={`w-full text-left font-sans font-bold text-[13px] sm:text-[14px] px-5 py-3.5 rounded-xl cursor-pointer transition-all duration-200 ${stateClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="score-box"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-md mx-auto flex flex-col items-center"
            >
              {/* Score summary layout card */}
              <div className="w-full bg-[#FCF6E9] border-[3px] border-[#4E2512] rounded-2xl p-6 sm:p-8 shadow-[0_4px_0_#4E2512] flex flex-col items-center gap-4 mb-6">
                
                {/* Dynamic Icon */}
                <div className="p-3 bg-white rounded-full border-2 border-[#4E2512] shadow-[0_2px_0_#4E2512]">
                  {feedback.icon}
                </div>

                {/* Score Indicator Pill */}
                <div className="bg-[#FFE4E6] border-2 border-[#4E2512] rounded-full px-5 py-2 shadow-[0_3px_0_#4E2512]">
                  <span className="font-serif text-lg sm:text-xl font-black text-[#EC4899] block tracking-wide">
                    Final Score: {score} / {quiz.length}
                  </span>
                </div>

                {/* Feedback Title & Message */}
                <div className="text-center mt-2">
                  <h3 className="font-display font-black text-xl text-[#EA580C] mb-1.5">
                    {feedback.title}
                  </h3>
                  <p className={`font-sans font-bold text-sm leading-relaxed max-w-xs mx-auto ${
                    theme === "night" ? "text-[#FAF4E9]" : "text-[#6B4B3E]"
                  }`}>
                    {feedback.message}
                  </p>
                </div>
              </div>

              {/* Reset Retake Button */}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 justify-center font-serif font-black text-sm uppercase tracking-wider text-white bg-[#EA580C] border-2 border-[#4E2512] px-6 py-3.5 rounded-xl cursor-pointer shadow-[0_4px_0_#4E2512] hover:bg-[#F97316] active:translate-y-0.5 active:shadow-[0_2px_0_#4E2512] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

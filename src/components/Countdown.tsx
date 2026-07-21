import React, { useEffect, useState } from "react";

interface CountdownProps {
  countdownTitle: string;
  countdownDate: string;
  countdownSub: string;
  anniversaryDate?: string;
}

interface TimeDiff {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function formatDate(dateStr: string) {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (monthIdx >= 0 && monthIdx < 12) {
        return `${monthNames[monthIdx]} ${day}, ${year}`;
      }
    }
    const d = new Date(`${dateStr}T00:00:00`);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
  } catch (e) {
    // fallback
  }
  return dateStr;
}

export default function Countdown({
  countdownTitle,
  countdownDate,
  countdownSub,
  anniversaryDate,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeDiff>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [timeElapsed, setTimeElapsed] = useState<TimeDiff>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const activeAnniversaryDate = anniversaryDate || "2024-05-15";

  useEffect(() => {
    function calculateTimes() {
      const now = new Date();

      // Countdown (Future Target)
      const target = new Date(`${countdownDate}T00:00:00`);
      const diffLeft = Math.max(0, target.getTime() - now.getTime());
      setTimeLeft({
        days: Math.floor(diffLeft / 86400000),
        hours: Math.floor((diffLeft % 86400000) / 3600000),
        minutes: Math.floor((diffLeft % 3600000) / 60000),
        seconds: Math.floor((diffLeft % 60000) / 1000),
      });

      // Countup (Past Anniversary)
      const past = new Date(`${activeAnniversaryDate}T00:00:00`);
      const diffElapsed = Math.max(0, now.getTime() - past.getTime());
      setTimeElapsed({
        days: Math.floor(diffElapsed / 86400000),
        hours: Math.floor((diffElapsed % 86400000) / 3600000),
        minutes: Math.floor((diffElapsed % 3600000) / 60000),
        seconds: Math.floor((diffElapsed % 60000) / 1000),
      });
    }

    calculateTimes();
    const interval = setInterval(calculateTimes, 1000);
    return () => clearInterval(interval);
  }, [countdownDate, activeAnniversaryDate]);

  const renderTimerGrid = (units: { label: string; value: number; color: string }[]) => {
    return (
      <div className="flex flex-row gap-1.5 xs:gap-2.5 justify-center select-none w-full max-w-full">
        {units.map((unit, idx) => {
          let bgClass = "bg-[#FFE4E6]";
          let txtClass = "text-[#EC4899]";
          if (unit.color === "blue") {
            bgClass = "bg-[#E0F2FE]";
            txtClass = "text-[#3B82F6]";
          } else if (unit.color === "orange") {
            bgClass = "bg-[#FFEDD5]";
            txtClass = "text-[#F97316]";
          }

          return (
            <div
              key={idx}
              className={`${bgClass} border-[3px] border-[#4E2512] rounded-2xl p-1.5 xs:p-2 sm:px-3 sm:py-3.5 min-w-[54px] xs:min-w-[62px] sm:min-w-[76px] shadow-[0_4px_0_#4E2512] flex-1 flex flex-col items-center justify-center`}
            >
              <span className={`font-serif text-lg xs:text-xl sm:text-2xl md:text-3xl ${txtClass} block font-black leading-tight`}>
                {unit.value}
              </span>
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-serif font-extrabold tracking-wider uppercase text-[#4E2512] mt-0.5">
                {unit.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const countUpUnits = [
    { label: "Days", value: timeElapsed.days, color: "pink" },
    { label: "Hours", value: timeElapsed.hours, color: "blue" },
    { label: "Min", value: timeElapsed.minutes, color: "orange" },
    { label: "Sec", value: timeElapsed.seconds, color: "pink" },
  ];

  const countDownUnits = [
    { label: "Days", value: timeLeft.days, color: "pink" },
    { label: "Hours", value: timeLeft.hours, color: "blue" },
    { label: "Min", value: timeLeft.minutes, color: "orange" },
    { label: "Sec", value: timeLeft.seconds, color: "pink" },
  ];

  return (
    <div
      id="countdown"
      className="absolute inset-0 overflow-y-auto pt-24 pb-12 px-4 flex flex-col items-center justify-start sm:justify-center hide-scrollbar"
    >
      <div className="w-full max-w-[840px] flex flex-col gap-6 my-auto">
        
        {/* Global Page Header */}
        <div className="text-center shrink-0 max-w-sm sm:max-w-md mx-auto w-full bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[20px] py-4 px-5 shadow-[0_4px_0_#4E2512] relative overflow-hidden">
          <span className="text-[10px] sm:text-[11px] font-serif font-black text-[#EC4899] uppercase tracking-widest mb-1 block">
            ⏳ Quest & Love Timers ⏳
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#EA580C] mb-1">
            Our Special Clocks
          </h2>
          <div className="h-[3px] w-20 bg-[#4E2512] mx-auto rounded-full mt-1.5" />
        </div>

        {/* Separated Dual Timer Cards */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch text-center">
          
          {/* Relationship Count-Up Card */}
          <div className="flex-1 bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[24px] p-5 sm:p-6 text-center shadow-[0_6px_0_#4E2512] relative flex flex-col items-center justify-start pb-6">
            {/* Hanging Ribbon decoration */}
            <div className="absolute top-0 right-6 sm:right-8 w-6 h-8 bg-[#F97316] border-l-2 border-r-2 border-b-2 border-b-transparent border-[#4E2512] rounded-b-md z-10" />

            <div className="w-full flex flex-col items-center mb-2.5">
              <span className="text-[9px] sm:text-[10px] font-serif font-black text-[#EC4899] uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#FFE4E6] border-2 border-[#4E2512] shadow-[0_2px_0_#4E2512] inline-block">
                💖 Love Journey 💖
              </span>
              <h3 className="font-display font-black text-base sm:text-lg text-[#EA580C] mt-3.5 mb-0.5">
                Relationship Counter
              </h3>
              <p className="text-[10px] sm:text-[11px] font-serif font-bold text-[#4E2512]/60">
                Since {formatDate(activeAnniversaryDate)}
              </p>
            </div>

            <div className="w-full mt-1">
              {renderTimerGrid(countUpUnits)}
            </div>
          </div>

          {/* Event Count-Down Card */}
          <div className="flex-1 bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[24px] p-5 sm:p-6 text-center shadow-[0_6px_0_#4E2512] relative flex flex-col items-center justify-start pb-6">
            {/* Hanging Ribbon decoration */}
            <div className="absolute top-0 right-6 sm:right-8 w-6 h-8 bg-[#3B82F6] border-l-2 border-r-2 border-b-2 border-b-transparent border-[#4E2512] rounded-b-md z-10" />

            <div className="w-full flex flex-col items-center mb-2.5">
              <span className="text-[9px] sm:text-[10px] font-serif font-black text-[#3B82F6] uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#E0F2FE] border-2 border-[#4E2512] shadow-[0_2px_0_#4E2512] inline-block">
                ⏳ Next Milestone ⏳
              </span>
              <h3 className="font-display font-black text-base sm:text-lg text-[#EA580C] mt-3.5 mb-0.5">
                {countdownTitle}
              </h3>
              <p className="text-[10px] sm:text-[11px] font-serif font-bold text-[#4E2512]/60">
                Until {formatDate(countdownDate)}
              </p>
            </div>

            <div className="w-full mt-1">
              {renderTimerGrid(countDownUnits)}
            </div>
          </div>

        </div>

        {/* Caption */}
        <div className="bg-[#FCF6E9] border-2 border-[#4E2512] rounded-xl p-3.5 sm:p-4 max-w-xl mx-auto w-full shadow-[0_3px_0_#4E2512] text-center shrink-0">
          <p className="font-sans font-bold text-[#6B4B3E] text-xs sm:text-sm leading-relaxed">
            {countdownSub}
          </p>
        </div>

      </div>
    </div>
  );
}

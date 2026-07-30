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
      <div className="flex flex-row gap-2 xs:gap-3 sm:gap-4 md:gap-5 justify-center select-none w-full max-w-full my-auto">
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
              className={`${bgClass} border-[3.5px] sm:border-[4px] border-[#4E2512] rounded-2xl sm:rounded-[22px] p-2 xs:p-3 sm:px-4 sm:py-5 md:py-6 min-w-[58px] xs:min-w-[70px] sm:min-w-[90px] md:min-w-[108px] shadow-[0_4px_0_#4E2512] sm:shadow-[0_6px_0_#4E2512] flex-1 flex flex-col items-center justify-center transition-transform hover:scale-105`}
            >
              <span className={`font-serif text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl ${txtClass} block font-black leading-none drop-shadow-sm`}>
                {unit.value}
              </span>
              <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-serif font-extrabold tracking-wider uppercase text-[#4E2512] mt-1 sm:mt-2">
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
      className="absolute inset-0 overflow-y-auto pt-24 pb-12 px-4 sm:px-6 flex flex-col items-center justify-start md:justify-center hide-scrollbar"
    >
      <div className="w-full max-w-[1020px] flex flex-col gap-6 sm:gap-8 my-auto py-4">
        
        {/* Global Page Header */}
        <div className="text-center shrink-0 max-w-md sm:max-w-lg mx-auto w-full bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[24px] py-4 sm:py-5 px-6 shadow-[0_5px_0_#4E2512] relative overflow-hidden">
          <span className="text-[11px] sm:text-xs font-serif font-black text-[#EC4899] uppercase tracking-widest mb-1 block">
             Quest & Love Timers 
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-[#EA580C] mb-1">
            Our Special Clocks
          </h2>
          <div className="h-[3.5px] w-24 bg-[#4E2512] mx-auto rounded-full mt-2" />
        </div>

        {/* Separated Dual Timer Cards */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 justify-center items-stretch text-center">
          
          {/* Relationship Count-Up Card */}
          <div className="flex-1 bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[28px] p-5 sm:p-7 md:p-8 text-center shadow-[0_8px_0_#4E2512] relative flex flex-col items-center justify-between pb-7 min-h-[250px] sm:min-h-[290px]">
            {/* Hanging Ribbon decoration */}
            <div className="absolute top-0 right-7 sm:right-9 w-7 sm:w-8 h-9 sm:h-10 bg-[#F97316] border-l-2 border-r-2 border-b-2 border-b-transparent border-[#4E2512] rounded-b-md z-10" />

            <div className="w-full flex flex-col items-center mb-3">
              <span className="text-[10px] sm:text-xs md:text-sm font-serif font-black text-[#EC4899] uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-[#FFE4E6] border-2 border-[#4E2512] shadow-[0_2.5px_0_#4E2512] inline-block">
                💖 Love Journey 💖
              </span>
              <h3 className="font-display font-black text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#EA580C] mt-4 mb-1">
                Relationship Counter
              </h3>
              <p className="text-xs sm:text-sm md:text-base font-serif font-bold text-[#4E2512]/70">
                Since {formatDate(activeAnniversaryDate)}
              </p>
            </div>

            <div className="w-full mt-2">
              {renderTimerGrid(countUpUnits)}
            </div>
          </div>

          {/* Event Count-Down Card */}
          <div className="flex-1 bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[28px] p-5 sm:p-7 md:p-8 text-center shadow-[0_8px_0_#4E2512] relative flex flex-col items-center justify-between pb-7 min-h-[250px] sm:min-h-[290px]">
            {/* Hanging Ribbon decoration */}
            <div className="absolute top-0 right-7 sm:right-9 w-7 sm:w-8 h-9 sm:h-10 bg-[#3B82F6] border-l-2 border-r-2 border-b-2 border-b-transparent border-[#4E2512] rounded-b-md z-10" />

            <div className="w-full flex flex-col items-center mb-3">
              <span className="text-[10px] sm:text-xs md:text-sm font-serif font-black text-[#3B82F6] uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border-2 border-[#4E2512] shadow-[0_2.5px_0_#4E2512] inline-block">
                ⏳ Next Milestone ⏳
              </span>
              <h3 className="font-display font-black text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#EA580C] mt-4 mb-1">
                {countdownTitle}
              </h3>
              <p className="text-xs sm:text-sm md:text-base font-serif font-bold text-[#4E2512]/70">
                Until {formatDate(countdownDate)}
              </p>
            </div>

            <div className="w-full mt-2">
              {renderTimerGrid(countDownUnits)}
            </div>
          </div>

        </div>

        {/* Caption */}
        <div className="bg-[#FCF6E9] border-[3px] border-[#4E2512] rounded-2xl p-4 sm:p-5 md:p-6 max-w-2xl mx-auto w-full shadow-[0_4px_0_#4E2512] text-center shrink-0">
          <p className="font-sans font-bold text-[#6B4B3E] text-xs sm:text-sm md:text-base leading-relaxed">
            {countdownSub}
          </p>
        </div>

      </div>
    </div>
  );
}

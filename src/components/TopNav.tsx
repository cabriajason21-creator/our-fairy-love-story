import React, { useState, useRef, useEffect } from "react";

interface TopNavProps {
  hubTitle: string;
  activeRoom: string;
  visible: boolean;
  onNavigate: (room: string) => void;
  onAdminClick: () => void;
  showAdminButton?: boolean;
  theme?: "day" | "night";
}

export default function TopNav({
  hubTitle,
  activeRoom,
  visible,
  onNavigate,
  onAdminClick,
  showAdminButton = true,
  theme,
}: TopNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // 🌟 Horizontal Scroll via Mouse Wheel on Desktop/Laptop 🌟
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      // Prevent standard page vertical scroll when wheeling over the navbar
      e.preventDefault();
      el.scrollBy({
        left: e.deltaY * 1.2,
        behavior: "auto"
      });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // scrolling speed factor
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const links = [
    { id: "timeline", label: "Quest Timeline", color: "pink" },
    { id: "gallery", label: "Memory Log", color: "blue" },
    { id: "countdown", label: "Timer Clock", color: "orange" },
    { id: "reasons", label: "Affection Deck", color: "pink" },
    { id: "quiz", label: "Trivia Quiz", color: "blue" },
    { id: "voice", label: "Music Player", color: "orange" },
    { id: "finale", label: "Final Scroll", color: "pink" },
  ];

  const isNight = theme === "night";

  return (
    <nav
      id="top-nav"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-40 flex items-center rounded-2xl px-4 py-1 shadow-lg transition-all duration-300 select-none
        w-[94%] md:w-auto max-w-full ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      } ${
        isNight
          ? "bg-[#0c1524] border-[3px] border-[#f59e0b] shadow-[0_4px_0_#b45309]"
          : "bg-[#FAF4E9] border-[3px] border-[#4E2512] shadow-[0_4px_0_#4E2512]"
      }`}
    >
      {/* Brand Button */}
      <button
        onClick={() => onNavigate("hub")}
        className={`font-display font-extrabold text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-colors flex-shrink-0 border-2 rounded-lg px-3 py-1.5 mr-3 ${
          isNight
            ? "text-[#FAF4E9] bg-[#1e1b4b] border-[#f59e0b] hover:bg-[#312e81]"
            : "text-[#4E2512] bg-[#FBCFE8] hover:bg-[#F472B6] border-[#4E2512]"
        }`}
      >
        OurFairyLoveStory
      </button>

      {/* 🌟 NATIVE & DRAG SCROLLABLE WRAPPER (Fully operational on mobile and desktop) 🌟 */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`flex-1 min-w-0 mr-3 overflow-x-auto hide-scrollbar touch-pan-x select-none py-1 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div 
          className="flex items-center gap-2 md:gap-2.5 whitespace-nowrap scroll-smooth"
          style={{ 
            display: "inline-flex"
          }}
        >
          {links.map((link) => {
            const isActive = activeRoom === link.id;
            
            let btnClass = isNight
              ? "text-[#FAF4E9] bg-[#162238] border border-transparent hover:bg-[#1e293b] hover:text-white"
              : "text-[#4E2512] bg-[#FCF6E9] border border-transparent hover:bg-[#FFE4E6]";
            
            if (isActive) {
              if (link.color === "pink") {
                btnClass = isNight
                  ? "text-white bg-[#D01C70] border-2 border-[#f59e0b] shadow-[0_2px_0_#b45309]"
                  : "text-white bg-[#EC4899] border-2 border-[#4E2512] shadow-[0_2px_0_#4E2512]";
              } else if (link.color === "blue") {
                btnClass = isNight
                  ? "text-white bg-[#1E40AF] border-2 border-[#f59e0b] shadow-[0_2px_0_#b45309]"
                  : "text-white bg-[#3B82F6] border-2 border-[#4E2512] shadow-[0_2px_0_#4E2512]";
              } else {
                btnClass = isNight
                  ? "text-white bg-[#C2410C] border-2 border-[#f59e0b] shadow-[0_2px_0_#b45309]"
                  : "text-white bg-[#F97316] border-2 border-[#4E2512] shadow-[0_2px_0_#4E2512]";
              }
            }

            return (
              <button
                key={link.id}
                onClick={(e) => {
                  if (hasDraggedRef.current) {
                    e.preventDefault();
                    return;
                  }
                  onNavigate(link.id);
                }}
                className={`font-serif font-extrabold text-[12px] md:text-[13px] px-3.5 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all duration-150 flex-shrink-0 ${btnClass}`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hidden Admin Access Button */}
      {showAdminButton && (
        <button
          onClick={onAdminClick}
          className={`w-3.5 h-3.5 rounded-full mr-0.5 transition-colors cursor-pointer flex-shrink-0 ${
            isNight
              ? "bg-amber-400 border-2 border-[#f59e0b] hover:bg-amber-300"
              : "bg-[#F59E0B] border-2 border-[#4E2512] hover:bg-[#FBBF24]"
          }`}
          title="Admin Control Room"
          aria-label="Admin Access"
        />
      )}
    </nav>
  );
}
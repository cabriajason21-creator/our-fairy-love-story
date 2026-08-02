import React, { useState } from "react";

interface GateProps {
  gateTitle: string;
  gateSub: string;
  onOpen: () => void;
  onStartPlay?: () => void;
}

export default function Gate({ gateTitle, gateSub, onOpen, onStartPlay }: GateProps) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);

    // Request full-screen if on deployed live standalone URL and not in editor iframe
    try {
      const isNotInIframe = window.self === window.top;
      const isNotAiStudioDomain = window.location.hostname !== "aistudio.google.com";
      if (isNotInIframe && isNotAiStudioDomain) {
        const docEl = document.documentElement as any;
        if (
          !document.fullscreenElement &&
          !(document as any).webkitFullscreenElement &&
          !(document as any).msFullscreenElement
        ) {
          if (docEl.requestFullscreen) {
            docEl.requestFullscreen().catch(() => {});
          } else if (docEl.webkitRequestFullscreen) {
            docEl.webkitRequestFullscreen();
          } else if (docEl.msRequestFullscreen) {
            docEl.msRequestFullscreen();
          }
        }
      }
    } catch {
      // Fallback for cross-origin or restricted environment
    }

    if (onStartPlay) {
      onStartPlay();
    }
    // After the door opening animation finishes, tell the parent to transition screens
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div
      id="gate"
      className="fixed inset-0 z-20 overflow-hidden px-4 flex flex-col items-center justify-center select-none"
      style={{
        // 🧱 Atmospheric Repeating Castle Brick Pattern (with rich center lighting and dark vignette)
        background: `
          radial-gradient(circle at 50% 35%, rgba(253, 186, 116, 0.18) 0%, rgba(15, 10, 8, 0.9) 80%),
          linear-gradient(90deg, #1f1814 3px, transparent 3px) 0 0 / 80px 40px,
          linear-gradient(0deg, #1f1814 3px, transparent 3px) 0 0 / 80px 40px,
          linear-gradient(90deg, #1f1814 3px, transparent 3px) 40px 20px / 80px 40px,
          linear-gradient(0deg, #1f1814 3px, transparent 3px) 40px 20px / 80px 40px,
          #3e342c
        `
      }}
    >
      {/* 🏰 Left Side Flanking Castle Tower */}
      <div
        className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 border-r-[6px] border-[#1f1814] shadow-[5px_0_15px_rgba(0,0,0,0.7)] z-0 hidden xs:block"
        style={{
          background: `
            linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 100%),
            linear-gradient(90deg, #1a130f 2px, transparent 2px) 0 0 / 40px 20px,
            linear-gradient(0deg, #1a130f 2px, transparent 2px) 0 0 / 40px 20px,
            linear-gradient(90deg, #1a130f 2px, transparent 2px) 20px 10px / 40px 20px,
            linear-gradient(0deg, #1a130f 2px, transparent 2px) 20px 10px / 40px 20px,
            #332922
          `
        }}
      >
        {/* Battlements/Crenellations details at the top */}
        <div className="absolute top-0 left-0 right-0 h-8 flex gap-2 p-1">
          <div className="flex-1 bg-[#1a130f] rounded-b-md" />
          <div className="flex-1 bg-[#1a130f] rounded-b-md" />
        </div>
      </div>

      {/* 🏰 Right Side Flanking Castle Tower */}
      <div
        className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 border-l-[6px] border-[#1f1814] shadow-[-5px_0_15px_rgba(0,0,0,0.7)] z-0 hidden xs:block"
        style={{
          background: `
            linear-gradient(-90deg, rgba(0,0,0,0.5) 0%, transparent 100%),
            linear-gradient(90deg, #1a130f 2px, transparent 2px) 0 0 / 40px 20px,
            linear-gradient(0deg, #1a130f 2px, transparent 2px) 0 0 / 40px 20px,
            linear-gradient(90deg, #1a130f 2px, transparent 2px) 20px 10px / 40px 20px,
            linear-gradient(0deg, #1a130f 2px, transparent 2px) 20px 10px / 40px 20px,
            #332922
          `
        }}
      >
        {/* Battlements/Crenellations details at the top */}
        <div className="absolute top-0 left-0 right-0 h-8 flex gap-2 p-1">
          <div className="flex-1 bg-[#1a130f] rounded-b-md" />
          <div className="flex-1 bg-[#1a130f] rounded-b-md" />
        </div>
      </div>

      {/* 🔥 Flickering Torch on Left Wall */}
      <div className="absolute left-[14%] sm:left-[22%] top-1/3 -translate-y-1/2 flex flex-col items-center z-10 hidden sm:flex">
        {/* Flame */}
        <div 
          className="w-5 h-8 bg-gradient-to-t from-red-600 via-amber-500 to-yellow-100 rounded-full filter blur-[1px] shadow-[0_0_24px_rgba(245,158,11,0.9)] origin-bottom scale-y-110"
          style={{
            animation: "torchFlicker 150ms infinite alternate ease-in-out"
          }}
        />
        {/* Sconce bracket */}
        <div className="w-2.5 h-10 bg-zinc-800 border border-zinc-950 rounded-b shadow-lg" />
        <div className="w-6 h-1.5 bg-zinc-700 border-b border-zinc-900" />
      </div>

      {/* 🔥 Flickering Torch on Right Wall */}
      <div className="absolute right-[14%] sm:right-[22%] top-1/3 -translate-y-1/2 flex flex-col items-center z-10 hidden sm:flex">
        {/* Flame */}
        <div 
          className="w-5 h-8 bg-gradient-to-t from-red-600 via-amber-500 to-yellow-100 rounded-full filter blur-[1px] shadow-[0_0_24px_rgba(245,158,11,0.9)] origin-bottom scale-y-110"
          style={{
            animation: "torchFlicker 180ms infinite alternate ease-in-out"
          }}
        />
        {/* Sconce bracket */}
        <div className="w-2.5 h-10 bg-zinc-800 border border-zinc-950 rounded-b shadow-lg" />
        <div className="w-6 h-1.5 bg-zinc-700 border-b border-zinc-900" />
      </div>

      {/* 🛤️ Ground Cobblestone Pathway Structure */}
      <div className="absolute bottom-0 left-0 right-0 h-[100px] sm:h-[130px] md:h-[160px] bg-gradient-to-t from-[#0e0a08] via-[#1f1915] to-[#2d2520] border-t-[6px] border-[#1a1411] shadow-[inset_0_12px_24px_rgba(0,0,0,0.9)] z-0">
        <div 
          className="absolute inset-0 opacity-40" 
          style={{
            background: `
              linear-gradient(90deg, #0a0706 2px, transparent 2px) 0 0 / 40px 20px,
              linear-gradient(0deg, #0a0706 2px, transparent 2px) 0 0 / 40px 20px,
              linear-gradient(90deg, #0a0706 2px, transparent 2px) 20px 10px / 40px 20px,
              linear-gradient(0deg, #0a0706 2px, transparent 2px) 20px 10px / 40px 20px
            `
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
      </div>

      {/* Main Content Area */}
      <div className="text-center w-full max-w-lg flex flex-col items-center justify-center select-none relative z-10 px-4">
        
        {/* Gate Title Card styled like an aged parchment announcement scroll */}
        <div className="inline-block bg-[#2d1606] border-[5px] border-[#a7651c] rounded-2xl px-8 py-4.5 shadow-[0_6px_0_#1f1008] mb-10 animate-fade-in relative">
          {/* Inner aged line border */}
          <div className="absolute inset-1.5 border border-[#a7651c]/20 rounded-lg pointer-events-none" />
          
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-display tracking-wide"
            style={{ color: "#FFF5EA", fontWeight: 800 }}
          >
            {gateTitle}
          </h2>
          <p 
            className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest mt-2"
            style={{ color: "#FFDE7D", fontWeight: 800, opacity: 1 }}
          >
            {gateSub}
          </p>
        </div>

        {/* Proportionally upscaled (approx 30% larger) & responsive Castle Double Doors */}
        <div
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleOpen();
          }}
          role="button"
          tabIndex={0}
          className="relative mx-auto w-[290px] h-[370px] sm:w-[360px] sm:h-[460px] md:w-[400px] md:h-[520px] max-w-[90vw] max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] perspective-[1800px] cursor-pointer group focus-visible:outline-none z-10 transition-transform duration-300 hover:scale-[1.01]"
          title="Unlatch the castle door to enter!"
          aria-label="Click Castle Door to Enter"
        >
          {/* Stone Archway Border / Gate Frame - Medieval rustic style */}
          <div className="absolute inset-[-12px] border-[12px] border-[#524a41] bg-[#1a1411]/70 rounded-t-[170px] sm:rounded-t-[200px] md:rounded-t-[220px] shadow-[0_16px_36px_rgba(0,0,0,0.85)] border-double pointer-events-none z-0" />

          {/* 🌟 Depth Portal Light Burst (Emits from behind the doors as they part) */}
          {opening && (
            <div 
              className="absolute inset-0 rounded-t-[160px] sm:rounded-t-[190px] md:rounded-t-[210px] bg-gradient-to-t from-amber-400 via-white to-amber-100 z-[5] pointer-events-none flex items-center justify-center filter blur-[2px] overflow-hidden"
              style={{
                animation: "portalLightGlow 1200ms cubic-bezier(0.4, 0, 0.2, 1) forwards"
              }}
            >
              {/* Extra intense core flare */}
              <div className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,rgba(249,115,22,0.8)_35%,rgba(251,191,36,0.5)_60%,transparent_100%)] animate-pulse" />
            </div>
          )}

          {/* Door Panels Container */}
          <div className="absolute inset-0 rounded-t-[160px] sm:rounded-t-[190px] md:rounded-t-[210px] overflow-hidden flex z-10">
            
            {/* Left Door Panel */}
            <div
              className="w-1/2 h-full bg-gradient-to-br from-[#7e4a13] via-[#915617] to-[#5a330b] border-y-[4px] border-l-[4px] border-r-[2px] border-[#311a0b] rounded-tl-[160px] sm:rounded-tl-[190px] md:rounded-tl-[210px] shadow-[inset_0_4px_0_rgba(255,255,255,0.25)] transition-transform duration-[1200ms] ease-in-out origin-left flex relative overflow-hidden"
              style={{
                transform: opening ? "rotateY(115deg)" : "rotateY(0deg)",
              }}
            >
              {/* Wooden Planks Vertical Joints */}
              <div className="absolute inset-0 flex">
                <div className="w-1/3 h-full border-r border-[#311a0b]/40 bg-black/5" />
                <div className="w-1/3 h-full border-r border-[#311a0b]/40 bg-black/0" />
                <div className="w-1/3 h-full bg-black/10" />
              </div>

              {/* Decorative Heavy Medieval Iron Hinges */}
              <div className="absolute top-[20%] left-0 w-4/5 h-[16px] bg-[#2d3139] border-y-2 border-r-2 border-[#12141a] rounded-r flex items-center justify-around px-1 shadow-md">
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
              </div>
              <div className="absolute bottom-[25%] left-0 w-4/5 h-[16px] bg-[#2d3139] border-y-2 border-r-2 border-[#12141a] rounded-r flex items-center justify-around px-1 shadow-md">
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
              </div>

              {/* Left Door Ring Handle */}
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full border-[3px] border-[#311a0b] bg-[#eab308]/20 shadow-lg flex items-center justify-center transition-transform group-hover:scale-110">
                  <div className="w-6 h-6 rounded-full border-2 border-[#311a0b] bg-[#ecdcb9]/50" />
                </div>
              </div>
            </div>

            {/* Right Door Panel */}
            <div
              className="w-1/2 h-full bg-gradient-to-br from-[#7e4a13] via-[#915617] to-[#5a330b] border-y-[4px] border-r-[4px] border-l-[2px] border-[#311a0b] rounded-tr-[160px] sm:rounded-tr-[190px] md:rounded-tr-[210px] shadow-[inset_0_4px_0_rgba(255,255,255,0.25)] transition-transform duration-[1200ms] ease-in-out origin-right flex relative overflow-hidden"
              style={{
                transform: opening ? "rotateY(-115deg)" : "rotateY(0deg)",
              }}
            >
              {/* Wooden Planks Vertical Joints */}
              <div className="absolute inset-0 flex">
                <div className="w-1/3 h-full border-r border-[#311a0b]/40 bg-black/10" />
                <div className="w-1/3 h-full border-r border-[#311a0b]/40 bg-black/0" />
                <div className="w-1/3 h-full bg-black/5" />
              </div>

              {/* Decorative Heavy Medieval Iron Hinges */}
              <div className="absolute top-[20%] right-0 w-4/5 h-[16px] bg-[#2d3139] border-y-2 border-l-2 border-[#12141a] rounded-l flex items-center justify-around px-1 shadow-md">
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
              </div>
              <div className="absolute bottom-[25%] right-0 w-4/5 h-[16px] bg-[#2d3139] border-y-2 border-l-2 border-[#12141a] rounded-l flex items-center justify-around px-1 shadow-md">
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
              </div>

              {/* Right Door Ring Handle */}
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full border-[3px] border-[#311a0b] bg-[#eab308]/20 shadow-lg flex items-center justify-center transition-transform group-hover:scale-110">
                  <div className="w-6 h-6 rounded-full border-2 border-[#311a0b] bg-[#ecdcb9]/50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle, beautiful ambient door halo backing */}
        {!opening && (
          <div className="absolute w-[250px] h-[330px] bg-amber-400/10 rounded-t-[130px] filter blur-2xl opacity-50 animate-pulse pointer-events-none z-0" />
        )}
      </div>

      {/* 📺 Viewport Exposure Flare (Screen-space transition layer) */}
      {opening && (
        <div 
          className="fixed inset-0 pointer-events-none z-[99999]"
          style={{
            animation: "gateFlash 1200ms cubic-bezier(0.4, 0, 0.2, 1) forwards"
          }}
        />
      )}

      {/* Encapsulated Custom Keyframe Styling */}
      <style>{`
        @keyframes torchFlicker {
          0% {
            transform: scaleX(0.95) scaleY(0.95);
            filter: blur(1px) brightness(0.9);
          }
          100% {
            transform: scaleX(1.05) scaleY(1.15);
            filter: blur(1.5px) brightness(1.15);
          }
        }

        @keyframes portalLightGlow {
          0% {
            transform: scale(0.4);
            opacity: 0;
            filter: blur(8px);
          }
          20% {
            opacity: 0.8;
            filter: blur(4px);
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: scale(3.5);
            filter: blur(0px);
          }
        }

        @keyframes gateFlash {
          0% {
            opacity: 0;
            background: radial-gradient(circle at 50% 55%, rgba(255, 255, 255, 1) 0%, rgba(253, 186, 116, 0.4) 20%, transparent 60%);
          }
          30% {
            opacity: 0.85;
            background: radial-gradient(circle at 50% 55%, rgba(255, 255, 255, 1) 0%, rgba(253, 186, 116, 0.7) 35%, rgba(253, 186, 116, 0.1) 75%);
          }
          75% {
            opacity: 1;
            background: radial-gradient(circle at 50% 55%, rgba(255, 255, 255, 1) 40%, rgba(254, 243, 199, 1) 75%, rgba(255, 255, 255, 1) 100%);
          }
          100% {
            opacity: 1;
            background: #ffffff;
          }
        }
      `}</style>
    </div>
  );
}

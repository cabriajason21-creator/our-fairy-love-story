import React from "react";

interface VoiceProps {
  voiceNote: string;
  audioName: string;
  youtubeUrl: string;
  hidePlayerVisuals: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export default function Voice({
  voiceNote,
  audioName,
  youtubeUrl,
  hidePlayerVisuals,
  isPlaying,
  onTogglePlay,
}: VoiceProps) {
  return (
    <div
      id="voice"
      className="absolute inset-0 overflow-hidden pt-24 pb-12 px-4 flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-[540px] bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[24px] p-5 sm:p-8 text-center shadow-[0_6px_0_#4E2512] relative my-auto max-h-[74vh] overflow-y-auto hide-scrollbar">
        {/* Ribbon decoration top right */}
        <div className="absolute top-0 right-10 w-6 h-8 bg-[#3B82F6] border-l-2 border-r-2 border-b-2 border-b-transparent border-[#4E2512] rounded-b-md z-10" />

        <span className="text-[11px] font-serif font-black text-[#EC4899] uppercase tracking-widest mb-1.5 block">
           Love Jukebox 
        </span>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-[#EA580C] mb-1">
          A Little Song For You
        </h2>
        <div className="h-[3px] w-24 bg-[#4E2512] mx-auto mb-6 rounded-full" />

        {/* Note wrapper */}
        <div className="bg-[#FCF6E9] border-2 border-[#4E2512] rounded-xl p-4 max-w-md mx-auto mb-4">
          <p className="font-sans font-bold text-[#6B4B3E] text-sm leading-relaxed">
            {voiceNote}
          </p>
        </div>

        {/* Responsive YouTube Placeholder Frame */}
        {!hidePlayerVisuals && youtubeUrl ? (
          <div
            id="yt-placeholder"
            className="w-full aspect-video rounded-xl border-[3px] border-[#4E2512] bg-black shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] relative overflow-hidden my-4 animate-fade-in"
          >
            {/* The actual iframe will be dynamically matched and overlayed on top of this container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-cream/40 bg-[#1A0D07] select-none p-4">
              <span className="text-2xl animate-pulse mb-2">✨</span>
              <p className="text-[10px] font-mono tracking-wider">LOADING MUSIC VIDEO FRAME...</p>
            </div>
          </div>
        ) : hidePlayerVisuals && youtubeUrl ? (
          <div className="my-4 bg-[#FCF6E9] border-2 border-dashed border-[#4E2512]/30 rounded-xl p-4 text-center">
            <p className="text-xs font-serif font-extrabold text-[#EC4899]">
              📻 Background Music Mode Active
            </p>
            <p className="text-[10px] text-[#6B4B3E]/80 mt-1">
              Visuals are hidden. Music is playing strictly in the background!
            </p>
          </div>
        ) : (
          <div className="my-4 bg-red-50 border-2 border-dashed border-red-200 rounded-xl p-4 text-center text-red-500 font-bold text-xs">
            No YouTube URL pasted yet. Please add one in settings!
          </div>
        )}

        {/* Player Button - RPG Item style */}
        <button
          onClick={onTogglePlay}
          className="w-16 h-16 rounded-full bg-[#EC4899] hover:bg-[#DB2777] border-[3.5px] border-[#4E2512] shadow-[0_5px_0_#4E2512] active:translate-y-1 active:shadow-[0_1px_0_#4E2512] flex items-center justify-center text-white text-2xl transition-all duration-150 mx-auto my-4 cursor-pointer"
          title={isPlaying ? "Pause Track" : "Play Track"}
          aria-label={isPlaying ? "Pause Track" : "Play Track"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        {/* Current Track Info */}
        <div className="inline-block bg-[#E0F2FE] border-2 border-[#4E2512] rounded-xl px-3 py-1 shadow-[0_2px_0_#4E2512] max-w-xs truncate">
          <p className="text-xs font-serif font-extrabold text-[#3B82F6]">
            📻 {audioName || "Background Jukebox"}
          </p>
        </div>
      </div>
    </div>
  );
}


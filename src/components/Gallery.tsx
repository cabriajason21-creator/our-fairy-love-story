import React, { useState } from "react";
import { GalleryItem } from "../types";
import { X, ZoomIn } from "lucide-react";

interface GalleryProps {
  gallery: GalleryItem[];
  theme?: "day" | "night";
}

export default function Gallery({ gallery, theme }: GalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <div
      id="gallery"
      className="absolute inset-0 overflow-hidden pt-24 pb-12 px-4 flex flex-col items-center justify-center"
    >
      {/* Parchment Album Wrapper */}
      <div className="w-full max-w-5xl bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[24px] p-5 sm:p-8 text-center shadow-[0_6px_0_#4E2512] relative my-auto flex flex-col max-h-[82vh]">
        {/* Ribbon decoration top left */}
        <div className="absolute top-0 left-8 w-6 h-8 bg-[#3B82F6] border-l-2 border-r-2 border-b-2 border-b-transparent border-[#4E2512] rounded-b-md z-10" />

        <div className="mb-4 shrink-0">
          <span className="text-[11px] font-serif font-black text-[#EC4899] uppercase tracking-widest mb-1.5 block">
            🔮 Memory Log 🔮
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#EA580C] mb-1">
            Memory Album
          </h2>
          <div className="h-[3px] w-24 bg-[#4E2512] mx-auto mb-2 rounded-full" />
        </div>

        {/* Polaroid Grid with custom auto-adjusting layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-2 overflow-y-auto overflow-x-hidden px-4 pt-3 pb-6 flex-1 min-h-0 items-start">
          {gallery.map((item, index) => {
            // Alternating random slight rotation angles for cute messy game look
            const rotations = ["-rotate-2", "rotate-2", "-rotate-1", "rotate-1", "-rotate-3", "rotate-3"];
            const rClass = rotations[index % rotations.length];

            return (
              <div
                key={index}
                onClick={() => setSelectedItem(item)}
                className={`w-full bg-[#FCF6E9] p-3 sm:p-4 pb-4 sm:pb-5 rounded-xl border-2 border-[#4E2512] shadow-[0_4px_0_#4E2512] transition-all duration-200 hover:rotate-0 hover:scale-105 hover:shadow-[0_6px_0_#4E2512] hover:z-10 cursor-pointer flex flex-col items-center group ${rClass} ${
                  theme === "night" ? "text-[#FAF4E9]" : "text-[#4E2512]"
                }`}
              >
                {/* Photo Frame Container - landscape/portrait friendly */}
                <div className="w-full rounded-lg overflow-hidden flex items-center justify-center bg-[#FFE4E6] border-2 border-[#4E2512] mb-3 sm:mb-4 relative select-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                  {item.media ? (
                    item.mediaType === "video" ? (
                      <video
                        src={item.media}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-auto block"
                      />
                    ) : (
                      <img
                        src={item.media}
                        alt={item.caption || "Memory"}
                        className="w-full h-auto block transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    )
                  ) : (
                    <span className="text-3xl filter drop-shadow-[0_2px_0_rgba(0,0,0,0.1)] py-8">
                      📷
                    </span>
                  )}

                  {/* Zoom indicator on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                    <ZoomIn className="w-6 h-6 drop-shadow" />
                  </div>
                </div>

                {/* Polaroid Caption */}
                <div className={`font-serif font-extrabold text-[13px] md:text-sm leading-tight text-center w-full px-1 truncate ${
                  theme === "night" ? "text-[#FAF4E9]" : "text-[#4E2512]"
                }`}>
                  {item.caption || "A sweet memory"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox / Zoom-in Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          {/* Modal Container */}
          <div
            className="relative bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[24px] p-4 sm:p-5 text-center shadow-[0_12px_24px_rgba(0,0,0,0.3)] flex flex-col items-center animate-scale-up max-h-[90vh] max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-5xl w-fit h-fit mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute -top-3 -right-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-black border-[3px] border-[#4E2512] rounded-full w-9 h-9 flex items-center justify-center shadow-[0_3px_0_#4E2512] transition-transform hover:scale-110 active:scale-95 focus:outline-none z-10"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title / Media Wrapper */}
            <div className="bg-[#FFE4E6] border-2 border-[#4E2512] rounded-xl overflow-hidden flex items-center justify-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)] relative max-h-[60vh] max-w-full w-fit h-fit">
              {selectedItem.media ? (
                selectedItem.mediaType === "video" ? (
                  <video
                    src={selectedItem.media}
                    controls
                    autoPlay
                    loop
                    className="max-h-[60vh] max-w-full w-auto h-auto object-contain block"
                  />
                ) : (
                  <img
                    src={selectedItem.media}
                    alt={selectedItem.caption || "Zoomed Memory"}
                    className="max-h-[60vh] max-w-full w-auto h-auto object-contain block"
                    referrerPolicy="no-referrer"
                  />
                )
              ) : (
                <span className="text-5xl py-12 px-16">📷</span>
              )}
            </div>

            {/* Captions / Description Container */}
            <div className="mt-4 bg-[#FCF6E9] border-2 border-[#4E2512] rounded-xl p-3 sm:p-4 w-full max-w-[500px] md:max-w-[700px] shadow-[0_3px_0_#4E2512] text-left">
              <p className={`font-serif font-black text-xs sm:text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap ${
                theme === "night" ? "text-[#FAF4E9]" : "text-[#4E2512]"
              }`}>
                {selectedItem.caption || "A sweet memory in our love story."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

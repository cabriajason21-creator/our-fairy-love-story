import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { GalleryItem } from "../types";
import { getFrameAsset } from "../constants";
import AmbientWeather, { WeatherEffect } from "./AmbientWeather";

interface HubProps {
  hubTitle: string;
  gallery: GalleryItem[];
  onNavigate: (room: string) => void;
  frameStyle?: string;
  theme?: "day" | "night";
  weather?: WeatherEffect;
}

export default function Hub({ hubTitle, gallery, frameStyle, theme, weather = "none" }: HubProps) {
  const activeFrameAsset = getFrameAsset(frameStyle);

  // Lightbox Zoom state
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Mouse drag-to-scroll references & states
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // State para ma-track kung naka-hover ang mouse para ma-pause ang auto-scroll
  const [isHovered, setIsHovered] = useState(false);

  // Active Index purely to track which frame is centered
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Filter out empty placeholder gallery items
  const itemsToRender: GalleryItem[] = gallery && gallery.length > 0 
    ? gallery 
    : [{ caption: "Our first memory", media: "", mediaType: "image" }];

  const SET_COUNT = 5;
  const multipliedItems = Array(SET_COUNT).fill(itemsToRender).flat();

  // Function to calculate which frame is currently in the exact center
  const updateCenterIndex = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const centerPosition = container.scrollLeft + container.clientWidth / 2;
    let minDistance = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < container.children.length; i++) {
      const child = container.children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(centerPosition - childCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    if (activeIndex !== closestIndex) {
      setActiveIndex(closestIndex);
    }
  };

  // Keep container centered on initialization and layout resizing
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const initScroll = () => {
      const singleSetWidth = container.scrollWidth / SET_COUNT;
      if (singleSetWidth > 0) {
        container.scrollLeft = singleSetWidth * 2;
        setTimeout(updateCenterIndex, 50);
      }
    };

    initScroll();
    const timeoutId = setTimeout(initScroll, 150);
    const resizeObserver = new ResizeObserver(() => {
      initScroll();
    });
    resizeObserver.observe(container);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [itemsToRender.length]);

  // 🌟 CONTINUOUS LOOPS AUTOPLAY EFFECT (Controlled Speed via Time) 🌟
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let lastUpdateTime = 0;

    // DITO MO KONTROLIN ANG BAGAL:
    // Mas MATAAS ang number, mas MABAGAL ang scroll (e.g., 40 = mabagal, 60 = napakabagal)
    const scrollInterval = 40; 

    const autoScroll = (timestamp: number) => {
      if (!isDragging && !isHovered && !selectedItem) {
        if (!lastUpdateTime) lastUpdateTime = timestamp;
        
        // Titingnan kung lumipas na ang tamang millisecond bago igalaw ng 1 pixel
        if (timestamp - lastUpdateTime >= scrollInterval) {
          container.scrollLeft += 1; 
          updateCenterIndex();
          lastUpdateTime = timestamp;
        }
      } else {
        lastUpdateTime = 0; // I-reset kapag naka-pause o habang nag-ddrag
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    const startTimeout = setTimeout(() => {
      animationFrameId = requestAnimationFrame(autoScroll);
    }, 300);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDragging, isHovered, selectedItem]);

  // Mouse Drag Events
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 8) {
      setHasMoved(true);
    }
    
    let targetScroll = scrollLeft - walk;
    const singleSetWidth = scrollContainerRef.current.scrollWidth / SET_COUNT;
    
    if (singleSetWidth > 0) {
      if (targetScroll < singleSetWidth * 2) {
        targetScroll += singleSetWidth;
        setScrollLeft(prev => prev + singleSetWidth);
      } 
      else if (targetScroll >= singleSetWidth * 3) {
        targetScroll -= singleSetWidth;
        setScrollLeft(prev => prev - singleSetWidth);
      }
    }
    scrollContainerRef.current.scrollLeft = targetScroll;
    updateCenterIndex();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleScroll = () => {
    updateCenterIndex();
    const container = scrollContainerRef.current;
    if (!container) return;

    const singleSetWidth = container.scrollWidth / SET_COUNT;
    if (singleSetWidth <= 0) return;

    if (container.scrollLeft < singleSetWidth * 2) {
      container.scrollLeft += singleSetWidth;
      updateCenterIndex();
    } else if (container.scrollLeft >= singleSetWidth * 3) {
      container.scrollLeft -= singleSetWidth;
      updateCenterIndex();
    }
  };

  const handleFrameClick = (item: GalleryItem) => {
    if (hasMoved) return;
    setSelectedItem(item);
  };

  return (
    <div
      id="hub"
      className="absolute inset-0 z-10 overflow-hidden px-4 pb-4 select-none flex flex-col items-center"
    >
      {/* Safe Zone Top Spacer */}
      <div className="h-20 sm:h-24 flex-shrink-0 w-full" />

      {/* Hub Heading Plaque */}
      <div className="text-center mb-4 sm:mb-6 flex-shrink-0 z-10 animate-fade-in bg-[#FCF6E9] border-[3px] border-[#4E2512] rounded-2xl px-6 sm:px-8 py-2 sm:py-3 shadow-[0_4px_0_#4E2512] max-w-xs sm:max-w-sm">
        <h1 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-[#EA580C] tracking-wide mb-0.5">
          OurFairyLoveStory
        </h1>
        <p className="font-serif font-bold text-[10px] sm:text-[12px] text-[#EC4899] uppercase tracking-widest">
          🌸 Our Magical Album 🌸
        </p>
      </div>

      {/* Slideable Gallery Wall Container */}
      <div 
        className="flex-1 w-full max-w-7xl mx-auto flex items-center min-h-0 relative z-10 select-none"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)"
        }}
      >
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={() => {
            handleMouseUpOrLeave();
            setIsHovered(false);
          }}
          onScroll={handleScroll}
          onMouseEnter={() => setIsHovered(true)}
          className={`w-full overflow-x-auto hide-scrollbar flex items-center gap-8 sm:gap-12 px-[35vw] py-10 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          } select-none`}
          style={{ transform: "translateZ(0)" }}
        >
          {multipliedItems.map((item, index) => {
            const originalIndex = index % itemsToRender.length;
            const distance = Math.abs(index - activeIndex);

            // Wavy layout class purely for vertical floating
            const floatDelayClass =
              originalIndex % 3 === 0
                ? "animation-delay-0"
                : originalIndex % 3 === 1
                ? "animation-delay-2000 -translate-y-1 sm:-translate-y-2"
                : "animation-delay-4000 translate-y-1 sm:translate-y-2";

            // Center is normal scale (1.0), sides are scaled down (0.8)
            let scaleValue = 0.75;
            let opacityValue = 0.3;
            let blurValue = "2px";

            if (distance === 0) {
              scaleValue = 1.05; // Center piece: Normal size (won't hit top bar)
              opacityValue = 1.0;
              blurValue = "0px";
            } else if (distance === 1) {
              scaleValue = 0.84; // Immediate neighbors: Noticeably smaller
              opacityValue = 0.7; 
              blurValue = "0px"; 
            }

            return (
              <div
                key={index}
                className={`flex-shrink-0 animate-frame-float ${floatDelayClass}`}
                style={{
                  animationDelay: originalIndex % 3 === 1 ? "-2s" : originalIndex % 3 === 2 ? "-4s" : "0s",
                }}
              >
                {/* 
                  SEPARATED inner div handles the zoom/fade scaling 
                  so it doesn't fight with the floating animation! 
                */}
                <div
                  className="flex flex-col items-center origin-center transition-all duration-300 ease-out will-change-transform transform-gpu [backface-visibility:hidden] [transform-style:preserve-3d]"
                  style={{
                    transform: `scale(${scaleValue}) translateZ(0)`,
                    opacity: opacityValue,
                    filter: `blur(${blurValue})`,
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <button
                    type="button"
                    onClick={() => handleFrameClick(item)}
                    className="relative group block w-[20vh] sm:w-[26vh] md:w-[32vh] max-w-[260px] min-w-[150px] aspect-[664/960] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
                  >
                    {/* Media Wrapper */}
                    <div 
                      className="absolute inset-[9%] bg-[#FFFBF7] rounded-[2px] overflow-hidden select-none transform-gpu backface-hidden"
                      style={{
                        transform: "translateZ(0)",
                        backfaceVisibility: "hidden",
                        willChange: "transform",
                        aspectRatio: "664/960"
                      }}
                    >
                      {item.media ? (
                        item.mediaType === "video" ? (
                          <video
                            src={item.media}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover pointer-events-none transform-gpu backface-hidden"
                            style={{
                              transform: "translateZ(0)",
                              backfaceVisibility: "hidden",
                              willChange: "transform",
                              aspectRatio: "664/960"
                            }}
                          />
                        ) : (
                          <img
                            src={item.media}
                            alt={item.caption || "Love Memory"}
                            draggable={false}
                            className="w-full h-full object-cover pointer-events-none select-none"
                          />
                        )
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#FEE2E2] to-[#E0F2FE] flex items-center justify-center text-3xl">
                          💖
                        </div>
                      )}
                    </div>

                    {/* Overlaid Gold Border */}
                    <img
                      src={activeFrameAsset}
                      alt=""
                      draggable={false}
                      className="absolute inset-0 w-full h-full z-10 pointer-events-none select-none"
                    />
                  </button>

                  {/* Plaque text label below */}
                  {item.caption && (
                    <div
                      className={`mt-4 max-w-[150px] sm:max-w-[220px] font-serif font-extrabold text-[11px] sm:text-xs bg-[#FAF4E9] border-2 border-[#4E2512] rounded-xl px-3 py-1 shadow-[0_2px_0_#4E2512] truncate select-none transition-all duration-300 antialiased [backface-visibility:hidden] [transform-style:preserve-3d] will-change-transform transform-gpu ${
                        theme === "night" ? "text-[#FAF4E9]" : "text-[#4E2512]"
                      }`}
                      style={{
                        textRendering: "geometricPrecision",
                        WebkitFontSmoothing: "subpixel-antialiased",
                        transform: "translate3d(0, 0, 0) rotate(0.001deg)",
                      }}
                    >
                      {item.caption}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guide hint at the bottom */}
      <div className="mt-3 sm:mt-5 flex-shrink-0 relative z-10 bg-[#FAF4E9] border-2 border-[#4E2512] rounded-xl px-4 py-1.5 shadow-[0_2px_0_#4E2512]">
        <p className={`text-xs font-serif font-bold tracking-wider text-center ${
          theme === "night" ? "text-[#FAF4E9]" : "text-[#4E2512]"
        }`}>
          drag left or right to explore • click any frame to zoom in
        </p>
      </div>

      {/* 🌟 INTERACTIVE LIGHTBOX ZOOM MODAL 🌟 */}
      {selectedItem && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedItem(null);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pt-24 pb-8 overflow-y-auto animate-fade-in cursor-default"
        >
          <div className="relative flex flex-col items-center bg-[#FCF6E9] border-[4px] border-[#4E2512] rounded-[24px] p-4 sm:p-6 pt-10 sm:pt-12 shadow-[0_12px_24px_rgba(0,0,0,0.3)] max-h-[80vh] max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-5xl w-fit h-fit overflow-y-auto hide-scrollbar select-text my-auto animate-scale-up">
            
            {/* Ribbon Decoration */}
            <div className="absolute top-0 left-6 w-8 h-12 bg-[#EF4444] border-l-2 border-r-2 border-b-2 border-b-transparent border-[#4E2512] rounded-b-md flex items-end justify-center pb-2.5 z-20">
              <span className="text-xs text-white font-extrabold">♥</span>
            </div>

            {/* Close Button top-right */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-black border-[3px] border-[#4E2512] rounded-full w-9 h-9 flex items-center justify-center shadow-[0_3px_0_#4E2512] transition-transform hover:scale-110 active:scale-95 focus:outline-none z-20"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#EA580C] mb-4 text-center">
              Memory Details
            </h3>

            {/* Dynamic & Adaptive Image/Video Wrapper */}
            <div className="bg-[#FFE4E6] border-2 border-[#4E2512] rounded-xl overflow-hidden flex items-center justify-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)] relative max-h-[50vh] max-w-full w-fit h-fit">
              {selectedItem.media ? (
                selectedItem.mediaType === "video" ? (
                  <video
                    src={selectedItem.media}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="max-h-[50vh] max-w-full w-auto h-auto object-contain block"
                  />
                ) : (
                  <img
                    src={selectedItem.media}
                    alt={selectedItem.caption}
                    draggable={false}
                    className="max-h-[50vh] max-w-full w-auto h-auto object-contain block select-none"
                    referrerPolicy="no-referrer"
                  />
                )
              ) : (
                <div className="w-56 h-56 bg-gradient-to-br from-[#FEE2E2] to-[#E0F2FE] flex items-center justify-center text-5xl">
                  💖
                </div>
              )}
            </div>

            {selectedItem.caption && (
              <div className="mt-5 w-full max-w-[500px] md:max-w-[700px] bg-[#FAF4E9] border-2 border-[#4E2512] rounded-xl p-3 sm:p-4 shadow-[0_3px_0_#4E2512] text-center select-text relative">
                <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[#4E2512]" />
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#4E2512]" />
                <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-[#4E2512]" />
                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#4E2512]" />

                <p className={`font-serif font-bold text-sm leading-relaxed ${
                  theme === "night" ? "text-[#FAF4E9]" : "text-[#4E2512]"
                }`}>
                  {selectedItem.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
import React, { useEffect, useState } from "react";

interface DustMote {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: string;
  dx: string;
}

interface AtmosphereProps {
  theme?: "day" | "night";
}

export default function Atmosphere({ theme }: AtmosphereProps) {
  const [motes, setMotes] = useState<DustMote[]>([]);
  const isNight = theme === "night";

  useEffect(() => {
    // Generate 25 glowing dust motes with random parameters
    const generated: DustMote[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * -15}s`, // Negative delay so they start already scattered
      duration: `${10 + Math.random() * 12}s`,
      size: `${2 + Math.random() * 3}px`,
      dx: `${Math.random() * 80 - 40}px`,
    }));
    setMotes(generated);
  }, []);

  return (
    <div
      id="atmosphere"
      className={`fixed inset-0 z-0 overflow-hidden pointer-events-none select-none transition-colors duration-500 ${
        isNight ? "bg-[#090D1A]" : "bg-[#FFF0F3]"
      }`}
    >
      {/* Light pink & blue dreamy background */}
      <div
        className="absolute inset-0 animate-wall-drift origin-center"
        style={{
          backgroundImage: isNight
            ? `
              radial-gradient(circle at 80% 20%, rgba(147, 197, 253, 0.15) 0%, rgba(0,0,0,0) 50%),
              radial-gradient(circle at 10% 80%, rgba(139, 92, 246, 0.15) 0%, rgba(0,0,0,0) 60%),
              radial-gradient(circle at 50% 50%, rgba(253, 244, 180, 0.1) 0%, rgba(0,0,0,0) 50%),
              linear-gradient(135deg, #090d1a 0%, #0F172A 45%, #1E293B 100%)
            `
            : `
              radial-gradient(circle at 10% 20%, rgba(224, 242, 254, 0.85) 0%, rgba(255, 255, 255, 0) 50%),
              radial-gradient(circle at 90% 80%, rgba(253, 242, 248, 0.95) 0%, rgba(255, 255, 255, 0) 60%),
              radial-gradient(circle at 50% 50%, rgba(254, 243, 199, 0.4) 0%, rgba(255, 255, 255, 0) 50%),
              linear-gradient(135deg, #FFE4E6 0%, #F5F3FF 35%, #E0F2FE 100%)
            `,
          backgroundSize: "130% 130%",
        }}
      />

      {/* Gentle bright fairytale vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: isNight
            ? "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 40%, rgba(6, 11, 25, 0.6) 100%)"
            : "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0) 50%, rgba(255,240,243,0.35) 100%)",
        }}
      />

      {/* Swaying beam of warm celestial gold light */}
      <div
        className="absolute -top-[10%] left-[36%] w-[32%] h-[120%] opacity-80 blur-[8px] rotate-[8deg] animate-beam-sway"
        style={{
          background: isNight
            ? "linear-gradient(200deg, rgba(147, 197, 253, 0.08), rgba(147, 197, 253, 0) 65%)"
            : "linear-gradient(200deg, rgba(197,160,89,0.18), rgba(197,160,89,0) 65%)",
        }}
      />

      {/* Floating fairytale golden dust motes */}
      <div className="absolute inset-0 overflow-hidden">
        {motes.map((mote) => (
          <div
            key={mote.id}
            className={`absolute rounded-full opacity-0 ${isNight ? "bg-amber-100" : "bg-gold"}`}
            style={{
              left: mote.left,
              bottom: "-20px",
              width: mote.size,
              height: mote.size,
              boxShadow: isNight
                ? "0 0 6px rgba(253, 244, 180, 0.8)"
                : "0 0 6px rgba(197,160,89,0.65)",
              animationName: "floatUp",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDuration: mote.duration,
              animationDelay: mote.delay,
              "--dx": mote.dx,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

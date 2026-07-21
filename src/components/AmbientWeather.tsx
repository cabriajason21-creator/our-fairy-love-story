import React, { useEffect, useState } from "react";

export type WeatherEffect = "none" | "petals" | "sparkles" | "fireflies" | "snow" | "rain";

interface WeatherParticle {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  swayDistance: string;
  rotationSpeed: string;
  opacity: number;
  scale: number;
}

interface AmbientWeatherProps {
  weather?: WeatherEffect;
  theme?: "day" | "night";
}

export default function AmbientWeather({ weather = "none", theme = "day" }: AmbientWeatherProps) {
  const [particles, setParticles] = useState<WeatherParticle[]>([]);
  const isNight = theme === "night";

  useEffect(() => {
    if (weather === "none") {
      setParticles([]);
      return;
    }

    // Determine firefly constraint: fireflies are only visible at night
    if (weather === "fireflies" && !isNight) {
      setParticles([]);
      return;
    }

    // Generate 35 particles with random parameters
    const particleCount = weather === "sparkles" ? 40 : weather === "fireflies" ? 25 : weather === "rain" ? 50 : 30;
    const list: WeatherParticle[] = Array.from({ length: particleCount }, (_, i) => {
      const leftVal = Math.random() * 100;
      // Start some already distributed vertically, and others off-screen top
      const topVal = Math.random() * -100; // negative so they fall/rise into screen
      const sizeVal = weather === "snow" 
        ? 3 + Math.random() * 5 
        : weather === "petals" 
        ? 6 + Math.random() * 8
        : weather === "fireflies"
        ? 5 + Math.random() * 4
        : weather === "rain"
        ? 1.5 + Math.random() * 1.5
        : 4 + Math.random() * 5; // sparkles

      const delayVal = `${Math.random() * -20}s`; // negative delay so they are pre-warmed
      const durationVal = weather === "fireflies"
        ? `${12 + Math.random() * 12}s`
        : weather === "petals"
        ? `${8 + Math.random() * 10}s`
        : weather === "snow"
        ? `${6 + Math.random() * 8}s`
        : weather === "rain"
        ? `${1.2 + Math.random() * 1.0}s`
        : `${10 + Math.random() * 10}s`; // sparkles

      const swayDistanceVal = `${20 + Math.random() * 50}px`;
      const rotationSpeedVal = `${3 + Math.random() * 6}s`;
      const opacityVal = 0.5 + Math.random() * 0.5;
      const scaleVal = 0.7 + Math.random() * 0.6;

      return {
        id: i,
        left: `${leftVal}%`,
        top: `${topVal}%`,
        size: sizeVal,
        delay: delayVal,
        duration: durationVal,
        swayDistance: swayDistanceVal,
        rotationSpeed: rotationSpeedVal,
        opacity: opacityVal,
        scale: scaleVal,
      };
    });

    setParticles(list);
  }, [weather, isNight]);

  if (weather === "none" || particles.length === 0) return null;

  // Render different types of particle elements
  const renderParticle = (p: WeatherParticle) => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: p.left,
      width: `${p.size}px`,
      height: `${p.size}px`,
      animationDelay: p.delay,
      animationDuration: p.duration,
      animationIterationCount: "infinite",
      animationTimingFunction: "linear",
      opacity: p.opacity,
      transform: `scale(${p.scale})`,
      pointerEvents: "none",
      "--sway-dx": p.swayDistance,
      "--rot-speed": p.rotationSpeed,
    } as React.CSSProperties;

    if (weather === "petals") {
      // Rose petals / cherry blossom look: pink, custom rounded corners for organic shape
      return (
        <div
          key={p.id}
          className="bg-[#FDA4AF] bg-opacity-90 rounded-tr-[12px] rounded-bl-[12px] shadow-sm animate-petal-fall"
          style={{
            ...baseStyle,
            boxShadow: "0 1px 3px rgba(251, 113, 133, 0.2)",
            transform: `scale(${p.scale}) rotate(${Math.random() * 360}deg)`,
          }}
        />
      );
    }

    if (weather === "sparkles") {
      // Sparkles: Glowing golden diamond or 4-point star shapes
      return (
        <div
          key={p.id}
          className="flex items-center justify-center animate-sparkle-float"
          style={baseStyle}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`${isNight ? "text-[#FEF08A]" : "text-[#F59E0B]"} drop-shadow-[0_0_4px_currentColor]`}
            style={{ width: "100%", height: "100%" }}
          >
            <path
              d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      );
    }

    if (weather === "fireflies" && isNight) {
      // Fireflies: Glowing amber-green soft orb drifting and pulsing
      return (
        <div
          key={p.id}
          className="bg-[#A7F3D0] rounded-full shadow-[0_0_8px_#34D399,0_0_15px_#10B981] animate-firefly-drift opacity-90"
          style={{
            ...baseStyle,
            top: `${50 + Math.random() * 50}%`, // fireflies hover around lower/mid area more
            boxShadow: "0 0 8px #A7F3D0, 0 0 16px rgba(167, 243, 208, 0.8)",
          }}
        />
      );
    }

    if (weather === "snow") {
      // Snow: Soft white circular crystals
      return (
        <div
          key={p.id}
          className="bg-white rounded-full bg-opacity-90 shadow-[0_0_4px_rgba(255,255,255,0.8)] animate-snow-fall"
          style={baseStyle}
        />
      );
    }

    if (weather === "rain") {
      // Rain: Thin, fast translucent light blue streaks
      return (
        <div
          key={p.id}
          className="bg-[#A5F3FC] rounded-full bg-opacity-60 animate-rain-fall"
          style={{
            ...baseStyle,
            height: `${p.size * 12}px`, // makes a long teardrop/streak shape
            boxShadow: "0 0 2px rgba(165, 243, 252, 0.4)",
          }}
        />
      );
    }

    return null;
  };

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none"
      style={{ mixBlendMode: "screen", transform: "translateZ(0)" }}
    >
      {particles.map((p) => renderParticle(p))}
    </div>
  );
}

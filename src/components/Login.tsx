import React, { useState } from "react";
import { Heart, Lock, User, Sparkles, Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLoginSuccess: (role: "creator" | "client", username: string, clientId?: string) => void;
  clients: Array<{ id: string; username: string; password: string }>;
}

export default function Login({ onLoginSuccess, clients }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in both fields! ✨");
      return;
    }

    setLoading(true);
    setError("");

    // Mimic database call with high-fidelity delays
    setTimeout(() => {
      const normalizedUser = username.trim().toLowerCase();
      const rawPassword = password.trim();

      // Check Creator hardcoded blueprint
      if (normalizedUser === "jasoncabria" && rawPassword === "1829") {
        onLoginSuccess("creator", "jasoncabria");
        setLoading(false);
        return;
      }

      // Check Clients list
      const matchedClient = clients.find(
        (c) => c.username.toLowerCase() === normalizedUser && c.password === rawPassword
      );

      if (matchedClient) {
        onLoginSuccess("client", matchedClient.username, matchedClient.id);
      } else {
        setError("Invalid credentials. Please ask your Creator for access! 🌸");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div
      id="login-screen"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-[#FFE4E6] via-[#F3E8FF] to-[#E0F2FE]"
    >
      {/* Floating sparkles decoration */}
      <div className="absolute top-[10%] left-[15%] text-pink-400 animate-pulse text-2xl">✨</div>
      <div className="absolute bottom-[15%] right-[10%] text-blue-400 animate-pulse delay-500 text-3xl">💖</div>
      <div className="absolute top-[25%] right-[20%] text-purple-400 animate-pulse delay-1000 text-xl">★</div>
      <div className="absolute bottom-[25%] left-[12%] text-amber-400 animate-pulse delay-200 text-2xl">🌸</div>

      <div className="w-full max-w-[380px] bg-[#FAF4E9] border-[4px] border-[#4E2512] rounded-[24px] p-6 text-center shadow-[0_8px_0_#4E2512] relative select-none flex flex-col items-center animate-fade-in">
        {/* Ribbon banner on top */}
        <div className="absolute top-0 left-12 w-8 h-10 bg-[#EC4899] border-l-[3px] border-r-[3px] border-b-[3px] border-b-transparent border-[#4E2512] rounded-b-md z-10 shadow-md flex items-center justify-center text-white text-xs">
          ♥
        </div>

        {/* Brand Header */}
        <div className="mt-4 mb-6">
          <div className="inline-flex items-center gap-1 text-[11px] font-serif font-black text-[#EC4899] uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Magical Album Portal <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#EA580C] leading-none mb-2">
            Login Entry
          </h1>
          <div className="h-[3.5px] w-16 bg-[#4E2512] mx-auto rounded-full" />
          <p className="text-xs font-serif font-medium text-[#4E2512]/80 mt-2.5 max-w-[280px]">
            Please enter your credentials to open your magical fairytale space.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Username Input */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-serif font-black uppercase tracking-wider text-[#4E2512]/70 flex items-center gap-1.5 ml-1">
              <User className="w-3.5 h-3.5 text-[#EA580C]" /> Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-4 pr-4 py-2.5 rounded-xl border-2 border-[#4E2512] bg-white text-[#4E2512] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-all"
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-serif font-black uppercase tracking-wider text-[#4E2512]/70 flex items-center gap-1.5 ml-1">
              <Lock className="w-3.5 h-3.5 text-[#EA580C]" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full pl-4 pr-11 py-2.5 rounded-xl border-2 border-[#4E2512] bg-white text-[#4E2512] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4E2512]/60 hover:text-[#4E2512] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-xs font-serif font-bold text-[#E11D48] bg-rose-50 border-2 border-[#E11D48]/30 rounded-xl px-3 py-2 animate-pulse">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-serif font-black text-sm py-3 rounded-xl border-2 border-[#4E2512] shadow-[0_4px_0_#4E2512] active:translate-y-0.5 active:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 select-none uppercase tracking-wide disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-bounce" />
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-bounce delay-100" />
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-bounce delay-200" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                ENTER PORTAL
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

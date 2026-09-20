"use client";

import React, { useState } from "react";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, Tv, Flame } from "lucide-react";

interface LoginViewProps {
  onLoginSuccess: (userEmail: string) => void;
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Tafadhali jaza barua pepe na neno la siri.");
      return;
    }

    setLoading(true);

    // Mfumo wa kuingia kisasa (Simulated secure auth or Supabase connection)
    setTimeout(() => {
      if (email && password.length >= 4) {
        localStorage.setItem("techstream_user", email);
        onLoginSuccess(email);
      } else {
        setError("Neno la siri au barua pepe si sahihi.");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center px-6 py-12 relative overflow-hidden selection:bg-red-600 selection:text-white">
      {/* Background Glow Effects */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-red-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-rose-600/20 rounded-full blur-[120px]"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-6">
        
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex w-16 h-16 bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 rounded-3xl items-center justify-center shadow-2xl shadow-red-600/50 border border-red-400/30">
            <Flame className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              KARIBU TECHSTREAM
            </h2>
            <p className="text-xs text-zinc-400 font-medium mt-1">
              Ingia kwenye akaunti yako ili uanze kufurahia burudani
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-950/80 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-6 shadow-2xl space-y-6">
          {error && (
            <div className="bg-red-950/40 border border-red-600/50 text-red-400 text-xs font-semibold p-3.5 rounded-2xl text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 ml-1">
                Barua Pepe (Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mfano@gmail.com"
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all placeholder:text-zinc-600 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 ml-1">
                Neno la Siri (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all placeholder:text-zinc-600 shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-xl shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center space-x-2 border border-red-500/30"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Ingia Sasa</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-zinc-900">
            <p className="text-[10px] text-zinc-500 font-medium">
              Kwa kuendelea, unakubaliana na masharti na vigezo vya huduma ya TechStream Live.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

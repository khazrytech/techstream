"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, Eye, EyeOff, Play, ShieldCheck, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          setSuccessMsg("Akaunti imetengenezwa! Sasa unaweza kuingia.");
          setIsSignUp(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setSuccessMsg("Umefanikiwa kuingia! Inakuhamisha...");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Kuna tatizo limetokea. Jaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden select-none">
      {/* Background Lighting Effects */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-red-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-red-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Logo & Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-red-700 to-red-500 rounded-2xl shadow-xl shadow-red-600/30 mb-2 border border-red-400/20">
            <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
          </div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-neutral-200 to-red-500 bg-clip-text text-transparent">
            TechStream
          </h1>
          <p className="text-xs text-neutral-400 font-medium">
            {isSignUp ? "Tengeneza akaunti mpya kuanza kuangalia Live TV" : "Ingia ili kuendelea na vipindi vyako unavyopenda"}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-neutral-900/80 backdrop-blur-2xl border border-neutral-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-neutral-950/80 rounded-2xl border border-neutral-800/60">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMsg(""); setSuccessMsg(""); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                !isSignUp ? "bg-red-600 text-white shadow-lg shadow-red-600/30" : "text-neutral-400 hover:text-white"
              }`}
            >
              Ingia
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMsg(""); setSuccessMsg(""); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                isSignUp ? "bg-red-600 text-white shadow-lg shadow-red-600/30" : "text-neutral-400 hover:text-white"
              }`}
            >
              Tengeneza Akaunti
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center space-x-2 animate-shake">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
              <span>✅</span>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-300">Barua Pepe (Email)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jina@email.com"
                  className="w-full bg-neutral-950/70 border border-neutral-800 text-xs text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-red-600 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-300">Neno la Siri (Password)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-950/70 border border-neutral-800 text-xs text-white pl-10 pr-10 py-3 rounded-xl focus:outline-none focus:border-red-600 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-extrabold py-3.5 rounded-xl transition-all shadow-xl shadow-red-600/30 flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-95 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isSignUp ? "Kamilisha Usajili" : "Ingia Sasa"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Badge */}
          <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-center space-x-1.5 text-neutral-500 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
            <span>Mfumo wa ulinzi wa Supabase Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

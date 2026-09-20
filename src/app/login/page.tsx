"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Tv, Mail, Lock, KeyRound, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"auth" | "otp">("auth");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        setMessage({ type: "success", text: "Kodi ya OTP imetumwa kwenye barua pepe yako!" });
        setStep("otp");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage({ type: "success", text: "Umeingia kikamilifu!" });
        router.push("/");
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Kuna hitilafu imetokea!" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode.trim(),
        type: isSignUp ? "signup" : "email",
      });

      if (error) throw error;

      setMessage({ type: "success", text: "Uthibitisho umefanikiwa! Unaelekezwa kwenye app..." });
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Kodi ya OTP siyo sahihi au imeisha muda wake!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 selection:bg-red-600 selection:text-white relative overflow-hidden">
      <div className="absolute w-80 h-80 bg-red-600/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-sm bg-zinc-950/90 border border-zinc-800/80 p-6 rounded-3xl shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/40 border border-red-400/30 mx-auto">
            <Tv className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">TechStream</h1>
          <p className="text-xs text-zinc-400 font-medium">Thibitisha Akaunti Yako</p>
        </div>

        {message && (
          <div
            className={`p-3.5 rounded-2xl border text-xs flex items-center space-x-2.5 ${
              message.type === "error"
                ? "bg-red-950/40 border-red-800/80 text-red-400"
                : "bg-emerald-950/40 border-emerald-800/80 text-emerald-400"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {step === "auth" ? (
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="grid grid-cols-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`py-2 rounded-lg transition-all ${
                  !isSignUp ? "bg-zinc-800 text-white shadow" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Ingia
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`py-2 rounded-lg transition-all ${
                  isSignUp ? "bg-red-600 text-white shadow-lg shadow-red-600/30" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Jisajili
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Barua Pepe
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mfano@gmail.com"
                  className="w-full bg-zinc-900/90 border border-zinc-800 text-xs text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Neno la Siri
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/90 border border-zinc-800 text-xs text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Inasindika...</span>
              ) : (
                <>
                  <span>{isSignUp ? "Jisajili Sasa" : "Ingia Sasa"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center space-y-1">
              <p className="text-xs text-zinc-300">
                Tumeutuma kodi ya OTP kwenda:
              </p>
              <p className="text-xs font-bold text-red-400 truncate">{email}</p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider text-center">
                Ingiza Kodi ya OTP (Tarakimu 8)
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  maxLength={8}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="12345678"
                  className="w-full bg-zinc-900/90 border border-zinc-800 text-center text-base tracking-[6px] font-black text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700 placeholder:tracking-normal placeholder:font-normal placeholder:text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <span>Inathibitisha...</span> : <span>THIBITISHA OTP</span>}
            </button>

            <button
              type="button"
              onClick={() => setStep("auth")}
              className="w-full text-zinc-500 hover:text-zinc-300 text-xs text-center font-bold pt-2 block"
            >
              Rudi nyuma
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

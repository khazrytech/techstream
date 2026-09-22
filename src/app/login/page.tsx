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

  // Kuingia kwa kutumia Google OAuth
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Imeshindwa kuingia na Google!" });
      setLoading(false);
    }
  };

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

        setMessage({ type: "success", text: "Kodi ya OTP ya tarakimu 6 imetumwa kwenye barua pepe yako!" });
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
          <div className="space-y-4">
            {/* GOOGLE LOGIN BUTTON */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center space-x-3 shadow-md active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.3L1.9 15.6C3.7 19.4 7.5 23 12 23z"
                />
              </svg>
              <span>Endelea na Google</span>
            </button>

            <div className="flex items-center my-3">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="px-3 text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Au barua pepe</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

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

            <form onSubmit={handleAuth} className="space-y-4">
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
          </div>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center space-y-1">
              <p className="text-xs text-zinc-300">
                Tumeutuma kodi ya OTP (tarakimu 6) kwenda:
              </p>
              <p className="text-xs font-bold text-red-400 truncate">{email}</p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider text-center">
                Ingiza Kodi ya OTP
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
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

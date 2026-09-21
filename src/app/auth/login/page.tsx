"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Tv, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push("/");
      }
    } catch {
      setErrorMsg("Hitilafu imetokea. Jaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-600/30">
            <Tv className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-wider text-white">TECHSTREAM</h2>
          <p className="text-xs text-zinc-400">Ingia kuendelea kuangalia vipindi vyako</p>
        </div>

        {errorMsg && (
          <div className="bg-red-950/80 border border-red-600/50 text-red-300 text-xs p-3 rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Barua Pepe (Email)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mteja@techstream.tv"
                className="w-full bg-black border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Nenosiri (Password)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
          >
            {loading ? "Inahakiki..." : "INGIA KISHA TAZAMA"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-zinc-800/80">
          <p className="text-xs text-zinc-500">
            Huna akaunti bado?{" "}
            <Link href="/auth/signup" className="text-red-500 font-bold hover:underline">
              Jisajili Hapa
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

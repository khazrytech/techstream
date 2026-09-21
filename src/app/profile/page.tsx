"use client";

import React from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { User, ShieldCheck, Smartphone, Calendar, LogOut } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <Header />

      <main className="max-w-3xl mx-auto px-4 pt-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl mb-6 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white mb-3 shadow-lg border-2 border-purple-400/30">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-lg font-black text-white">Mteja wa TechStream</h2>
          <p className="text-xs text-zinc-400">user@techstream.tv</p>

          <span className="mt-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-purple-400/30">
            KIFURUKI: STANDARD
          </span>
        </div>

        {/* SUBSCRIPTION DETAILS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 mb-6">
          <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
            Taarifa za Kifurushi
          </h3>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Hali ya Akaunti</span>
            </div>
            <span className="text-emerald-400 font-bold">Hai (Active)</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Inaisha Tarehe</span>
            </div>
            <span className="text-white font-mono font-bold">31 Desemba 2026</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span>Kikomo cha Vifaa (Max Streams)</span>
            </div>
            <span className="text-white font-mono font-bold">Vifaa 2 / Vimeunganishwa 1</span>
          </div>
        </div>

        <button className="w-full py-3 bg-zinc-900 hover:bg-red-950/50 text-red-500 hover:text-red-400 font-bold text-xs rounded-xl border border-zinc-800 hover:border-red-600/40 flex items-center justify-center gap-2 transition">
          <LogOut className="w-4 h-4" /> Ondoka kwenye Akaunti (Logout)
        </button>
      </main>

      <BottomNav />
    </div>
  );
}

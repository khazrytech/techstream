"use client";

import React from "react";
import { User, ShieldCheck, LogOut, Smartphone, Calendar, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white p-4 pb-36 space-y-5">
      
      {/* Header */}
      <div className="border-b border-zinc-800 pb-3">
        <h1 className="font-black text-lg text-white tracking-wider uppercase">Profile ya Akaunti</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex flex-col items-center text-center space-y-3">
        <div className="w-16 h-16 bg-red-600/20 border border-red-600/40 rounded-full flex items-center justify-center text-red-500 shadow-lg">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Mteja wa TechStream</h2>
          <p className="text-xs text-zinc-400">user@techstream.tv</p>
        </div>
        <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
          KIFURUKI: STANDARD
        </span>
      </div>

      {/* Subscription Details */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">TAARIFA ZA KIFURUKI</h3>
        
        <div className="flex justify-between items-center py-2 border-b border-zinc-800/60 text-xs">
          <span className="text-zinc-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Hali ya Akaunti
          </span>
          <span className="font-bold text-emerald-400">Hai (Active)</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-zinc-800/60 text-xs">
          <span className="text-zinc-400 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-400" /> Inaisha Tarehe
          </span>
          <span className="font-bold text-white">31 Desemba 2026</span>
        </div>

        <div className="flex justify-between items-center py-2 text-xs">
          <span className="text-zinc-400 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-zinc-400" /> Kikomo cha Vifaa
          </span>
          <span className="font-bold text-white">Vifaa 2 / Vimeunganishwa 1</span>
        </div>
      </div>

      {/* Logout Action */}
      <button 
        onClick={() => alert("Umetoka kwenye Akaunti.")}
        className="w-full bg-red-600/10 border border-red-600/30 hover:bg-red-600/20 text-red-500 font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 text-xs transition-all active:scale-95"
      >
        <LogOut className="w-4 h-4" />
        <span>Ondoka kwenye Akaunti (Logout)</span>
      </button>

    </div>
  );
}

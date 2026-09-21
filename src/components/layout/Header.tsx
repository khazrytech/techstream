"use client";

import React from "react";
import { Search, Bell, User } from "lucide-react";

interface HeaderProps {
  userPlan?: string;
  onSearchClick?: () => void;
}

export default function Header({ userPlan = "STANDARD", onSearchClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-indigo-500">
          TECHSTREAM
        </h1>
        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest border border-purple-400/30">
          [{userPlan}]
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onSearchClick}
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition"
          aria-label="Tafuta"
        >
          <Search className="w-4 h-4" />
        </button>
        <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-lg border border-purple-400/30">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}

"use client";
import React, { useState } from "react";
import { Clapperboard, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SeriesPage() {
  const [series] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-28 space-y-6">
      <div className="flex items-center space-x-3 pt-2">
        <Link href="/" className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-black tracking-wider text-white">SERIES & TAMTHILIA</h1>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tafuta tamthilia..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-red-500"
        />
      </div>

      {series.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3 text-center">
          <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center text-zinc-600">
            <Clapperboard className="w-7 h-7" />
          </div>
          <p className="text-xs text-zinc-400 font-bold">Hakuna tamthilia zilizopatikana kwa sasa.</p>
          <p className="text-[10px] text-zinc-600">Tamthilia mpya zikiongezwa kwenye mfumo zitaonekana hapa.</p>
        </div>
      ) : null}
    </div>
  );
}

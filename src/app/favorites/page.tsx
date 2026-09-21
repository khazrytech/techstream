"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { Heart, Play, Trash2 } from "lucide-react";
import { IPTVChannel } from "@/types/techstream";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<IPTVChannel[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("techstream_favs");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch {
        // Fallback
      }
    }
  }, []);

  const removeFavorite = (id: string) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    localStorage.setItem("techstream_favs", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <Header />

      <main className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="w-5 h-5 text-red-600 fill-red-600" />
          <h2 className="text-xl font-black text-white tracking-wide">CHANELI ZANGU ZINAZOPENDWA</h2>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-12 text-center space-y-3">
            <Heart className="w-10 h-10 text-zinc-600 mx-auto stroke-1" />
            <p className="text-xs text-zinc-400">Bado hujaweka chaneli yoyote kwenye vipendwa.</p>
            <p className="text-[10px] text-zinc-600">Bofya alama ya moyo kwenye chaneli yoyote ili uiunganishe hapa.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((ch) => (
              <div
                key={ch.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between hover:border-zinc-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black border border-zinc-800 flex items-center justify-center overflow-hidden">
                    {ch.logoUrl ? (
                      <img src={ch.logoUrl} alt={ch.name} className="w-full h-full object-contain" />
                    ) : (
                      <Play className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{ch.name}</h4>
                    <p className="text-[10px] text-zinc-500">{ch.category}</p>
                  </div>
                </div>

                <button
                  onClick={() => removeFavorite(ch.id)}
                  className="p-2 text-zinc-500 hover:text-red-500 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

"use client";

import React from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { Tv, Play } from "lucide-react";

export default function SeriesPage() {
  const dummySeries = [
    { id: "1", title: "Siri za Mtaa", seasons: "Season 2", episodes: "24 Episodes", poster: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400" },
    { id: "2", title: "Empire of Shadows", seasons: "Season 5", episodes: "60 Episodes", poster: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <Header />

      <main className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex items-center gap-2 mb-6">
          <Tv className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-black text-white tracking-wide">TAMTHILIA NA SERIES</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {dummySeries.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group cursor-pointer hover:border-red-600/50 transition relative"
            >
              <div className="relative aspect-[2/3] bg-zinc-950 overflow-hidden">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <div className="p-3 bg-red-600 rounded-full text-white shadow-xl">
                    <Play className="w-6 h-6 fill-white" />
                  </div>
                </div>
              </div>

              <div className="p-3">
                <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                  <span>{item.seasons}</span>
                  <span>{item.episodes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

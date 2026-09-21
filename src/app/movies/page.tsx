"use client";

import React from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { Film, Play } from "lucide-react";

export default function MoviesPage() {
  const dummyMovies = [
    { id: "1", title: "Action Thriller 2026", duration: "1h 45m", quality: "4K", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400" },
    { id: "2", title: "Bongo Movie Premier", duration: "2h 10m", quality: "1080p", poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400" },
    { id: "3", title: "Sci-Fi Dimension", duration: "1h 55m", quality: "4K", poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <Header />

      <main className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex items-center gap-2 mb-6">
          <Film className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-black text-white tracking-wide">FILAMU NA SINEMA (VOD)</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {dummyMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group cursor-pointer hover:border-red-600/50 transition relative flex flex-col justify-between"
            >
              <div className="relative aspect-[2/3] bg-zinc-950 overflow-hidden">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <div className="p-3 bg-red-600 rounded-full text-white shadow-xl">
                    <Play className="w-6 h-6 fill-white" />
                  </div>
                </div>
                <span className="absolute top-2 right-2 bg-black/80 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-zinc-700">
                  {movie.quality}
                </span>
              </div>

              <div className="p-3">
                <h4 className="text-xs font-bold text-white line-clamp-1">{movie.title}</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">{movie.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

"use client";

import React from "react";
import { Play, Info, Radio } from "lucide-react";
import { IPTVChannel } from "@/types/techstream";

interface HeroBannerProps {
  channel?: IPTVChannel;
  onPlayClick?: (channel: IPTVChannel) => void;
}

export default function HeroBanner({ channel, onPlayClick }: HeroBannerProps) {
  if (!channel) return null;

  return (
    <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 mb-6 shadow-2xl group">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{
          backgroundImage: `url(${channel.logoUrl || '/hero-bg.jpg'})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

      <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col items-start gap-2 z-10">
        <span className="bg-red-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
          <Radio className="w-3 h-3 animate-pulse" /> LIVE SPOTLIGHT
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide line-clamp-1">
          {channel.name}
        </h2>

        <p className="text-xs text-zinc-400 line-clamp-2 max-w-md">
          Kipengele: <span className="text-zinc-200 font-semibold">{channel.category}</span> • Quality: <span className="text-red-400 font-semibold">{channel.quality}</span>
        </p>

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => onPlayClick && onPlayClick(channel)}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full flex items-center gap-2 shadow-lg transition active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" /> Tazama Sasa
          </button>
          <button className="px-4 py-2.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs rounded-full border border-zinc-700 backdrop-blur-md flex items-center gap-1.5 transition">
            <Info className="w-4 h-4" /> Maelezo
          </button>
        </div>
      </div>
    </div>
  );
}

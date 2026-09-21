"use client";

import React from "react";
import { IPTVChannel } from "@/types/techstream";
import { Play } from "lucide-react";

interface ChannelCarouselProps {
  title: string;
  channels: IPTVChannel[];
  onSelectChannel: (channel: IPTVChannel) => void;
}

export default function ChannelCarousel({
  title,
  channels,
  onSelectChannel,
}: ChannelCarouselProps) {
  if (channels.length === 0) return null;

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-base font-extrabold text-white tracking-wide border-l-4 border-red-600 pl-2">
          {title}
        </h3>
        <span className="text-xs text-zinc-500 font-medium">
          {channels.length} Channels
        </span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory">
        {channels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => onSelectChannel(channel)}
            className="flex-none w-36 sm:w-44 bg-zinc-900/90 border border-zinc-800 hover:border-red-600/50 rounded-xl p-3 cursor-pointer transition-all duration-200 group snap-start relative flex flex-col justify-between h-44"
          >
            <div className="relative w-full h-24 bg-black/50 rounded-lg overflow-hidden flex items-center justify-center p-2 mb-2 border border-zinc-800/80">
              {channel.logoUrl ? (
                <img
                  src={channel.logoUrl}
                  alt={channel.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <span className="text-zinc-600 font-black text-xl">
                  {channel.name.slice(0, 2).toUpperCase()}
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <Play className="w-8 h-8 text-red-500 fill-red-500" />
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-white line-clamp-1 group-hover:text-red-400 transition">
                {channel.name}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-zinc-500">{channel.category}</span>
                <span className="text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  {channel.quality}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Channel, CategoryGroup } from "@/lib/iptv-parser";

export default function TechStreamIPTV() {
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    fetch("/api/iptv")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories.length > 0) {
          setCategories(data.categories);
          if (data.categories[0].channels.length > 0) {
            setSelectedChannel(data.categories[0].channels[0]);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hitilafu:", err);
        setLoading(false);
      });
  }, []);

  const allChannels = categories.flatMap((cat) => cat.channels);
  const featured = allChannels.slice(0, 5);

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-bold text-lg">
        Inapakia orodha ya chaneli za TechStream IPTV...
      </div>
    );
  }

  const currentHero = featured[heroIndex] || allChannels[0];

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HERO SLIDE SECTION */}
        {currentHero && (
          <div className="relative w-full h-[400px] md:h-[460px] rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl mb-8 border border-zinc-800">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center opacity-20 blur-md">
              {currentHero.logo ? (
                <img src={currentHero.logo} alt={currentHero.name} className="w-64 h-64 object-contain" />
              ) : (
                <div className="text-6xl font-bold">{currentHero.name}</div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20 flex flex-col items-start space-y-3">
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                LIVE • {currentHero.group}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                {currentHero.name}
              </h1>
              <button
                onClick={() => setSelectedChannel(currentHero)}
                className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all cursor-pointer shadow-lg shadow-red-600/30"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Tazama Sasa</span>
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE PLAYER */}
        {selectedChannel && (
          <div className="mb-10 p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
            <h2 className="text-lg font-bold mb-3 flex items-center space-x-2">
              <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
              <span>Inacheza Sasa: <span className="text-red-500">{selectedChannel.name}</span></span>
            </h2>
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
              <video 
                src={selectedChannel.url} 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* CATEGORIES & CHANNELS LIST */}
        <div className="space-y-10">
          {categories.map((group) => (
            <div key={group.category} className="space-y-4">
              <h3 className="text-xl font-bold tracking-tight border-l-4 border-red-600 pl-3">
                {group.category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {group.channels.map((channel) => (
                  <div
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className="bg-zinc-900/80 hover:bg-zinc-800 p-4 rounded-xl border border-zinc-800 cursor-pointer transition-all flex flex-col items-center text-center space-y-3 group"
                  >
                    <div className="w-16 h-16 rounded-lg bg-zinc-950 flex items-center p-2 overflow-hidden border border-zinc-800 group-hover:border-red-600 transition-all">
                      {channel.logo ? (
                        <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[10px] font-bold text-zinc-500">NO LOGO</span>
                      )}
                    </div>
                    <span className="text-sm font-medium line-clamp-1 group-hover:text-red-500 transition-colors">
                      {channel.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Search, Bell, User, Tv, Play, Film, Radio } from "lucide-react";
import { useRouter } from "next/navigation";

interface Channel {
  id: string;
  name: string;
  group: string;
  logo: string;
  url: string;
}

interface CategoryGroup {
  name: string;
  channels: Channel[];
}

interface IPTVViewProps {
  pageType?: "home" | "movies" | "series" | "live-tv";
}

export function IPTVView({ pageType = "home" }: IPTVViewProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/iptv")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getFilteredCategories = () => {
    if (!categories) return [];

    return categories.map((cat) => {
      let filtered = cat.channels || [];
      const catLower = (cat.name || "").toLowerCase();

      if (pageType === "movies") {
        filtered = filtered.filter(c => 
          /movie|cinema|film|vod|action|comedy|horror|swahili/i.test(c.group + " " + c.name) ||
          /movie|cinema|film|vod/i.test(catLower)
        );
      } else if (pageType === "series") {
        filtered = filtered.filter(c => 
          /series|season|episode|tamthilia/i.test(c.group + " " + c.name) ||
          /series|tamthilia/i.test(catLower)
        );
      } else if (pageType === "live-tv") {
        filtered = filtered.filter(c => 
          !/movie|cinema|film|vod|series/i.test(c.group)
        );
      }

      return { ...cat, channels: filtered };
    }).filter(cat => cat.channels.length > 0);
  };

  const processedCategories = getFilteredCategories();
  const allChannels = processedCategories.flatMap(c => c.channels);

  useEffect(() => {
    if (allChannels.length > 0 && !selectedChannel) {
      setSelectedChannel(allChannels[0]);
    }
  }, [allChannels, selectedChannel]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-zinc-400 font-bold">Inapakua Orodha Halisi ya Chaneli na Filamu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-32 space-y-4">
      
      {/* 1. SAFI HEADER BAR (BILA KUBANANA) */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-900 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black text-white">
            T
          </div>
          <span className="font-black text-base tracking-wider text-white">TECHSTREAM</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="bg-zinc-900 border border-zinc-800 text-red-500 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
            STANDARD
          </span>
          <button 
            onClick={() => router.push("/profile")}
            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 active:scale-95"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tafuta chaneli au filamu halisi..."
          className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
        />
      </div>

      {/* 3. PLAYER YA KUTAZAMA */}
      {selectedChannel && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-2 space-y-2 shadow-2xl">
          <div className="flex items-center justify-between px-2 pt-1">
            <span className="text-xs font-bold text-white truncate max-w-[200px]">
              {selectedChannel.name}
            </span>
            <span className="text-[10px] text-red-500 font-bold uppercase flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" /> LIVE STREAM
            </span>
          </div>

          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-zinc-900">
            <video
              src={selectedChannel.url}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* 4. CHANELI NA FILAMU HALISI KUTOKA KWALINK */}
      {processedCategories.length === 0 ? (
        <div className="text-center py-10 bg-zinc-900/30 rounded-2xl border border-zinc-800 text-zinc-500 text-xs">
          Hakuna chaneli zilizopatikana kwenye kundi hili la M3U link yako.
        </div>
      ) : (
        <div className="space-y-5 pt-2">
          {processedCategories.map((cat) => {
            const filteredCatChannels = cat.channels.filter(ch =>
              ch.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredCatChannels.length === 0) return null;

            return (
              <div key={cat.name} className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-black text-zinc-300 uppercase tracking-wider">{cat.name}</h3>
                  <span className="text-[10px] text-zinc-500">{filteredCatChannels.length} Item</span>
                </div>

                <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
                  {filteredCatChannels.map((ch) => (
                    <div
                      key={ch.id || Math.random()}
                      onClick={() => setSelectedChannel(ch)}
                      className={`min-w-[140px] max-w-[140px] bg-zinc-900/80 border rounded-xl p-2.5 cursor-pointer transition-all active:scale-95 flex-shrink-0 ${
                        selectedChannel?.id === ch.id ? "border-red-600 bg-red-950/20" : "border-zinc-800"
                      }`}
                    >
                      <div className="w-full h-16 bg-zinc-950 rounded-lg flex items-center justify-center p-2 mb-2 border border-zinc-800/80">
                        {ch.logo ? (
                          <img src={ch.logo} alt={ch.name} className="w-full h-full object-contain" />
                        ) : (
                          <Tv className="w-6 h-6 text-zinc-700" />
                        )}
                      </div>
                      <h4 className="text-[11px] font-bold text-white truncate">{ch.name}</h4>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

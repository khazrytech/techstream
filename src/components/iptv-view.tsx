"use client";

import React, { useEffect, useState } from "react";
import { Search, Heart, Play, Bell, User, Tv, Sparkles, ShieldCheck } from "lucide-react";
import { Channel, CategoryGroup } from "@/lib/iptv-parser";

interface IPTVViewProps {
  pageType?: "home" | "movies" | "series" | "live-tv";
}

// Safisha majina ya chaneli kikamilifu
const cleanName = (name: string): string => {
  return name
    .replace(/[\(\[\{].*?[\)\]\}]/g, "")
    .replace(/(360p|720p|1080p|4k|hd|sd|24\/7|not 24\/7)/gi, "")
    .trim();
};

export function IPTVView({ pageType = "home" }: IPTVViewProps) {
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavs = localStorage.getItem("techstream_favs");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    fetch("/api/iptv")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories.length > 0) {
          setCategories(data.categories);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hitilafu ya kupakia chaneli:", err);
        setLoading(false);
      });
  }, []);

  const allChannels = categories.flatMap((cat) => cat.channels);

  // Kuchuja kulingana na ukurasa kwa ukamilifu
  const getPageFilteredCategories = () => {
    return categories.map((cat) => {
      let filtered = cat.channels;
      const catNameLower = cat.name.toLowerCase();

      if (pageType === "movies") {
        filtered = cat.channels.filter(
          (c) =>
            (/movie|cinema|film|vod|action|hbo|box|thriller|comedy|horror/i.test(
              c.name + " " + c.group
            ) || /movie|cinema|film|vod/i.test(catNameLower)) &&
            !/news|tbc|bbc|cnn|live|sports|habari/i.test(c.name + " " + c.group)
        );
      } else if (pageType === "series") {
        filtered = cat.channels.filter(
          (c) =>
            (/series|serial|drama|show|season|episode/i.test(
              c.name + " " + c.group
            ) || /series|serial|drama/i.test(catNameLower)) &&
            !/news|tbc|bbc|live/i.test(c.name + " " + c.group)
        );
      } else if (pageType === "live-tv") {
        filtered = cat.channels.filter(
          (c) =>
            /live|news|sport|habari|michezo|tbc|bbc|cnn|supersport|tv/i.test(
              c.name + " " + c.group
            ) && !/vod|movie|series/i.test(c.group)
        );
      }

      return {
        ...cat,
        channels: filtered,
      };
    }).filter((cat) => cat.channels.length > 0);
  };

  const processedCategories = getPageFilteredCategories();
  const flattenedPageChannels = processedCategories.flatMap((cat) => cat.channels);

  // Auto-play chaneli ya kwanza
  useEffect(() => {
    if (flattenedPageChannels.length > 0 && !selectedChannel) {
      setSelectedChannel(flattenedPageChannels[0]);
    }
  }, [flattenedPageChannels, selectedChannel]);

  const toggleFavorite = (chId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (favorites.includes(chId)) {
      updated = favorites.filter((id) => id !== chId);
    } else {
      updated = [...favorites, chId];
    }
    setFavorites(updated);
    localStorage.setItem("techstream_favs", JSON.stringify(updated));
  };

  // MASSIVE MODERN LOADER (BIG, GLOWING, NO TEXT, NO VERSION TAG)
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-red-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="relative flex items-center justify-center">
          <div className="w-28 h-28 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-600/40">
            <Tv className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>
    );
  }

  const heroChannel = selectedChannel || flattenedPageChannels[0];

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-36 space-y-5 selection:bg-red-600 selection:text-white">
      
      {/* 1. TOP HEADER APP BAR (NO VERSION TAG) */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/40 border border-red-400/30">
              <Tv className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-lg text-white tracking-tight">TECHSTREAM</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium tracking-wide">Next-Gen Streaming Experience</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="w-10 h-10 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-95">
            <Bell className="w-4.5 h-4.5" />
          </button>
          <button className="w-10 h-10 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-95">
            <User className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tafuta chaneli, muvi au kipindi..."
          className="w-full bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/80 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all placeholder:text-zinc-500 shadow-inner"
        />
      </div>

      {/* 3. STICKY ACTIVE VIDEO PLAYER (HAPOTEI WAKATI WA KUSLIDE) */}
      {heroChannel && (
        <div className="sticky top-2 z-30 bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-3 shadow-2xl space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-lg shadow-red-600/50 flex-shrink-0"></span>
              <h2 className="text-xs font-black text-white truncate tracking-wide">
                {cleanName(heroChannel.name)}
              </h2>
            </div>
            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>ULTRA HD</span>
            </span>
          </div>

          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative border border-zinc-800/80">
            <video
              src={heroChannel.url}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* 4. CATEGORIES AS HORIZONTAL ROWS (KAMA NETFLIX/YOUTUBE - SLIDE KUSHOTO KWENDA KULIA) */}
      {processedCategories.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/40 rounded-3xl border border-zinc-800/50 text-zinc-500 text-xs font-bold">
          Hakuna maudhui yaliyopatikana kwa sasa.
        </div>
      ) : (
        <div className="space-y-6 pt-2">
          {processedCategories.map((cat) => {
            // Kama kuna search query, chuja chaneli zinazohusika kwenye kundi hili
            const filteredCatChannels = cat.channels.filter((ch) =>
              cleanName(ch.name).toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredCatChannels.length === 0) return null;

            return (
              <div key={cat.name} className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-300">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-zinc-500 font-bold">
                    {filteredCatChannels.length} zinapatikana
                  </span>
                </div>

                {/* HORIZONTAL CAROUSEL (SLIDE KUSHOTO KWENDA KULIA) */}
                <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2 pt-1">
                  {filteredCatChannels.map((ch) => {
                    const cleanedName = cleanName(ch.name);
                    const isSelected = selectedChannel?.id === ch.id;
                    const isFav = favorites.includes(ch.id);

                    return (
                      <div
                        key={ch.id}
                        onClick={() => setSelectedChannel(ch)}
                        className={`min-w-[170px] max-w-[170px] bg-zinc-900/80 backdrop-blur-md border rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all active:scale-95 flex-shrink-0 ${
                          isSelected
                            ? "border-red-600 bg-red-950/20 ring-1 ring-red-600/40 shadow-xl shadow-red-600/20"
                            : "border-zinc-800/80 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center p-1.5 border border-zinc-800/80 flex-shrink-0">
                            {ch.logo ? (
                              <img src={ch.logo} alt={cleanedName} className="w-full h-full object-contain" />
                            ) : (
                              <Tv className="w-5 h-5 text-zinc-600" />
                            )}
                          </div>
                          <button
                            onClick={(e) => toggleFavorite(ch.id, e)}
                            className="text-zinc-600 hover:text-red-500 transition-colors"
                          >
                            <Heart
                              className={`w-4 h-4 ${isFav ? "fill-red-600 text-red-600" : ""}`}
                            />
                          </button>
                        </div>

                        <div>
                          <h4 className="text-xs font-extrabold text-white line-clamp-1">
                            {cleanedName}
                          </h4>
                          <p className="text-[10px] text-zinc-500 line-clamp-1 font-medium mt-0.5">
                            {cat.name}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Search, Heart, Play, Bell, User, Tv, Sparkles, Volume2, ShieldCheck, Info } from "lucide-react";
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

  // Filter kulingana na ukurasa
  const getPageFilteredChannels = () => {
    if (pageType === "movies") {
      return allChannels.filter(
        (c) =>
          /movie|cinema|film|vod|action|hbo|box|thriller|comedy|horror/i.test(
            c.name + " " + c.group
          ) && !/news|tbc|bbc|cnn|live|sports|habari/i.test(c.name + " " + c.group)
      );
    }
    if (pageType === "series") {
      return allChannels.filter(
        (c) =>
          /series|serial|drama|show|season|episode/i.test(c.name + " " + c.group) &&
          !/news|tbc|bbc|live/i.test(c.name + " " + c.group)
      );
    }
    if (pageType === "live-tv") {
      return allChannels.filter(
        (c) =>
          /live|news|sport|habari|michezo|tbc|bbc|cnn|supersport|tv/i.test(
            c.name + " " + c.group
          ) && !/vod|movie|series/i.test(c.group)
      );
    }
    return allChannels;
  };

  const pageChannels = getPageFilteredChannels();

  // Auto-play ya chaneli ya kwanza
  useEffect(() => {
    if (pageChannels.length > 0 && !selectedChannel) {
      setSelectedChannel(pageChannels[0]);
    }
  }, [pageChannels, selectedChannel]);

  const rawCategories = Array.from(
    new Set(
      pageChannels
        .map((c) => c.group.split(";")[0].trim())
        .filter((g) => g.length > 0)
    )
  );
  const cleanCategoryList = ["All", ...rawCategories];

  const finalFilteredChannels = pageChannels.filter((ch) => {
    const matchesSearch = cleanName(ch.name)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All"
        ? true
        : ch.group.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

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

  // ULTRA PRO MINIMALIST LOADING SCREEN (NO TEXT)
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-xl shadow-red-600/20">
            <Tv className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    );
  }

  const heroChannel = selectedChannel || pageChannels[0];

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-32 space-y-5 selection:bg-red-600 selection:text-white">
      
      {/* 1. TOP HEADER APP BAR */}
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
              <span className="bg-red-600/20 border border-red-500/30 text-red-500 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                PRO V5
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium tracking-wide">Next-Gen Streaming Experience</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="w-10 h-10 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95">
            <Bell className="w-4.5 h-4.5" />
          </button>
          <button className="w-10 h-10 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95">
            <User className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* 2. SEARCH BAR WITH GLASS EFFECT */}
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

      {/* 3. HERO ACTIVE STREAM / PLAYER (ULTRA PRO DISPLAY) */}
      {heroChannel && (
        <div className="relative bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800/90 rounded-3xl p-3 shadow-2xl overflow-hidden space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-lg shadow-red-600/50 flex-shrink-0"></span>
              <h2 className="text-xs font-black text-white truncate tracking-wide">
                {cleanName(heroChannel.name)}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>ULTRA HD</span>
              </span>
            </div>
          </div>

          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative border border-zinc-800/80 group">
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

      {/* 4. CATEGORY PILLS */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
        {cleanCategoryList.slice(0, 12).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap active:scale-95 ${
              activeCategory.toLowerCase() === cat.toLowerCase()
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
                : "bg-zinc-900/80 border border-zinc-800/90 text-zinc-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 5. CHANNEL GRID */}
      {finalFilteredChannels.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/40 rounded-3xl border border-zinc-800/50 text-zinc-500 text-xs font-bold">
          Hakuna maudhui yaliyopatikana kwa sasa.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {finalFilteredChannels.map((ch) => {
            const cleanedName = cleanName(ch.name);
            const isSelected = selectedChannel?.id === ch.id;
            const isFav = favorites.includes(ch.id);

            return (
              <div
                key={ch.id}
                onClick={() => setSelectedChannel(ch)}
                className={`group bg-zinc-900/60 backdrop-blur-md border rounded-2xl p-3 flex items-center justify-between cursor-pointer transition-all active:scale-95 ${
                  isSelected
                    ? "border-red-600 bg-red-950/20 ring-1 ring-red-600/40 shadow-lg shadow-red-600/10"
                    : "border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-11 h-11 rounded-xl bg-zinc-950 flex items-center justify-center p-1.5 border border-zinc-800/80 flex-shrink-0 group-hover:scale-105 transition-transform">
                    {ch.logo ? (
                      <img src={ch.logo} alt={cleanedName} className="w-full h-full object-contain" />
                    ) : (
                      <Tv className="w-5 h-5 text-zinc-600" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-extrabold text-white line-clamp-1 group-hover:text-red-400 transition-colors">
                      {cleanedName}
                    </h4>
                    <p className="text-[10px] text-zinc-500 line-clamp-1 font-medium">
                      {ch.group.split(";")[0]}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => toggleFavorite(ch.id, e)}
                  className="text-zinc-600 hover:text-red-500 transition-colors ml-1 flex-shrink-0"
                >
                  <Heart
                    className={`w-4 h-4 ${isFav ? "fill-red-600 text-red-600" : ""}`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  Heart, 
  Play, 
  Bell, 
  User, 
  Tv, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Radio, 
  Film, 
  Tv2, 
  Layers, 
  Maximize2, 
  Volume2, 
  Share2, 
  Info,
  CheckCircle2,
  RefreshCcw,
  Star
} from "lucide-react";
import { Channel, CategoryGroup } from "@/lib/iptv-parser";

interface IPTVViewProps {
  pageType?: "home" | "movies" | "series" | "live-tv";
}

const cleanName = (name: string): string => {
  if (!name) return "TechStream Channel";
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
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Load favorites & fetch IPTV lists on mount
  useEffect(() => {
    const savedFavs = localStorage.getItem("techstream_favs");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error("Error loading favorites:", e);
      }
    }

    fetch("/api/iptv")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hitilafu ya mtandao:", err);
        setLoading(false);
      });
  }, []);

  // Filter categories and channels dynamically based on page type
  const processedCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    return categories.map((cat) => {
      let filteredChannels = cat.channels || [];
      const catNameLower = (cat.name || "").toLowerCase();

      if (pageType === "movies") {
        filteredChannels = filteredChannels.filter(
          (c) =>
            (/movie|cinema|film|vod|action|hbo|box|thriller|comedy|horror/i.test(
              (c.name || "") + " " + (c.group || "")
            ) || /movie|cinema|film|vod/i.test(catNameLower)) &&
            !/news|tbc|bbc|cnn|live|sports|habari/i.test((c.name || "") + " " + (c.group || ""))
        );
      } else if (pageType === "series") {
        filteredChannels = filteredChannels.filter(
          (c) =>
            (/series|serial|drama|show|season|episode/i.test(
              (c.name || "") + " " + (c.group || "")
            ) || /series|serial|drama/i.test(catNameLower)) &&
            !/news|tbc|bbc|live/i.test((c.name || "") + " " + (c.group || ""))
        );
      } else if (pageType === "live-tv") {
        filteredChannels = filteredChannels.filter(
          (c) =>
            /live|news|sport|habari|michezo|tbc|bbc|cnn|supersport|tv/i.test(
              (c.name || "") + " " + (c.group || "")
            ) && !/vod|movie|series/i.test(c.group || "")
        );
      }

      return {
        ...cat,
        channels: filteredChannels,
      };
    }).filter((cat) => cat.channels && cat.channels.length > 0);
  }, [categories, pageType]);

  const flattenedChannels = useMemo(() => {
    return processedCategories.flatMap((cat) => cat.channels);
  }, [processedCategories]);

  // Set default playing channel
  useEffect(() => {
    if (flattenedChannels.length > 0 && !selectedChannel) {
      setSelectedChannel(flattenedChannels[0]);
    }
  }, [flattenedChannels, selectedChannel]);

  // Toggle Favorites
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

  // Modern Loader Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[120px] animate-pulse"></div>
        <div className="relative flex flex-col items-center space-y-6">
          <div className="relative flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
            <div className="absolute w-18 h-18 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-600/50">
              <Flame className="w-8 h-8 text-red-600 animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-sm font-black tracking-widest text-white uppercase">TECHSTREAM PRO</h2>
            <p className="text-[11px] text-zinc-500 font-medium">Inapakia rasilimali za IPTV...</p>
          </div>
        </div>
      </div>
    );
  }

  const heroChannel = selectedChannel || flattenedChannels[0];

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-40 space-y-6 selection:bg-red-600 selection:text-white font-sans">
      
      {/* 1. TOP APP BAR HEADER */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/40 border border-red-400/30">
              <Tv className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-lg tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                TECHSTREAM
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-semibold tracking-wider">Ultimate Streaming Platform</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button 
            onClick={() => setShowInfoModal(true)}
            className="w-10 h-10 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-95 shadow-md"
          >
            <Info className="w-4.5 h-4.5" />
          </button>
          <button className="w-10 h-10 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-95 shadow-md">
            <User className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* 2. SEARCH INPUT BAR */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tafuta chaneli, vipindi au maudhui..."
          className="w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/90 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all placeholder:text-zinc-500 shadow-inner"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] bg-zinc-800 px-2 py-1 rounded-lg text-zinc-400 hover:text-white"
          >
            Futa
          </button>
        )}
      </div>

      {/* 3. STICKY VIDEO PLAYER (HAISOGEI, INASUBIRI KUTAZAMWA) */}
      {heroChannel && (
        <div className="sticky top-2 z-30 bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-3 shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping shadow-lg shadow-red-600/60 flex-shrink-0"></span>
              <h2 className="text-xs font-black text-white truncate tracking-wide">
                {cleanName(heroChannel.name)}
              </h2>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>LIVE HD</span>
              </span>
            </div>
          </div>

          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative border border-zinc-800/80 shadow-inner">
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

      {/* 4. CATEGORIES ROWS (HORIZONTAL CAROUSELS - 10+ CHANNELS PER ROW) */}
      {processedCategories.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 text-zinc-500 text-xs font-bold space-y-2">
          <Tv className="w-8 h-8 mx-auto text-zinc-600 animate-bounce" />
          <p>Hakuna maudhui yaliyopatikana kwa sasa.</p>
        </div>
      ) : (
        <div className="space-y-6 pt-1">
          {processedCategories.map((cat) => {
            const filteredCatChannels = (cat.channels || []).filter((ch) =>
              cleanName(ch.name || "").toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredCatChannels.length === 0) return null;

            return (
              <div key={cat.name} className="space-y-3">
                {/* CATEGORY HEADER */}
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-200 flex items-center space-x-2">
                    <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span>{cat.name}</span>
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-bold bg-zinc-900/90 px-2.5 py-1 rounded-full border border-zinc-800 shadow-sm">
                    {filteredCatChannels.length} Chaneli
                  </span>
                </div>

                {/* HORIZONTAL CAROUSEL (SLIDE KUSHOTO KWENDA KULIA) */}
                <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-3 pt-1 px-0.5">
                  {filteredCatChannels.map((ch) => {
                    const cleanedName = cleanName(ch.name);
                    const isSelected = selectedChannel?.id === ch.id;
                    const isFav = favorites.includes(ch.id);

                    return (
                      <div
                        key={ch.id || Math.random()}
                        onClick={() => setSelectedChannel(ch)}
                        className={`min-w-[160px] max-w-[160px] bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 backdrop-blur-xl border rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition-all active:scale-95 flex-shrink-0 shadow-xl ${
                          isSelected
                            ? "border-red-600 bg-red-950/30 ring-1 ring-red-600/60 shadow-red-600/30 scale-102"
                            : "border-zinc-800/80 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center p-1.5 border border-zinc-800/90 flex-shrink-0 shadow-inner">
                            {ch.logo ? (
                              <img src={ch.logo} alt={cleanedName} className="w-full h-full object-contain" />
                            ) : (
                              <Tv className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          <button
                            onClick={(e) => toggleFavorite(ch.id, e)}
                            className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                          >
                            <Heart
                              className={`w-4 h-4 ${isFav ? "fill-red-600 text-red-600" : ""}`}
                            />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-white line-clamp-1 tracking-tight">
                            {cleanedName}
                          </h4>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                              HD Stream
                            </span>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                            )}
                          </div>
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

      {/* 5. INFO MODAL (DIRISHA LA TAARIFA ZA APP) */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center font-black">
                  ▶
                </div>
                <h3 className="font-extrabold text-sm text-white">TechStream IPTV</h3>
              </div>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="text-zinc-400 hover:text-white text-xs bg-zinc-800 px-2.5 py-1 rounded-full font-bold"
              >
                Funga
              </button>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Mfumo kamili wa kisasa wa kurusha matangazo ya moja kwa moja ya IPTV kwa kasi ya juu na muonekano wa kipekee wa kimataifa (Pro UI/UX).
            </p>
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Hali ya Mfumo: Imara</span>
              <span className="text-emerald-400 font-bold">Online</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

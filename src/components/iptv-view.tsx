"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  Heart, 
  Play, 
  Bell, 
  User, 
  Tv, 
  ShieldCheck, 
  Flame, 
  Radio, 
  X,
  CheckCircle2
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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Notifications state list
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Karibu TechStream", desc: "Furahia huduma ya Streaming ya viwango vya juu.", time: "Punde si punde", read: false },
    { id: 2, title: "Updates za Live TV", desc: "Chaneli mpya za michezo na burudani zimeongezwa.", time: "Saa 1 iliyopita", read: false }
  ]);

  useEffect(() => {
    const savedFavs = localStorage.getItem("techstream_favs");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error(e);
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
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Process categories & limit channels to max 10 per category for smooth sliding
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

      // Limit to 10 channels per category as requested
      const limitedChannels = filteredChannels.slice(0, 10);

      return {
        ...cat,
        channels: limitedChannels,
      };
    }).filter((cat) => cat.channels && cat.channels.length > 0);
  }, [categories, pageType]);

  const flattenedChannels = useMemo(() => {
    return processedCategories.flatMap((cat) => cat.channels);
  }, [processedCategories]);

  useEffect(() => {
    if (flattenedChannels.length > 0 && !selectedChannel) {
      setSelectedChannel(flattenedChannels[0]);
    }
  }, [flattenedChannels, selectedChannel]);

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

  // Clean Loader Screen (No text as requested)
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="relative flex items-center justify-center">
          <div className="w-28 h-28 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-600/40">
            <Flame className="w-7 h-7 text-red-600" />
          </div>
        </div>
      </div>
    );
  }

  const heroChannel = selectedChannel || flattenedChannels[0];

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-40 space-y-6 selection:bg-red-600 selection:text-white font-sans">
      
      {/* 1. TOP APP BAR */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/40 border border-red-400/30">
              <Tv className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full animate-pulse"></span>
          </div>
          <div>
            <span className="font-black text-lg tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              TECHSTREAM
            </span>
            <p className="text-[10px] text-zinc-500 font-semibold tracking-wider">Ultimate Streaming</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* NOTIFICATION BUTTON */}
          <button 
            onClick={() => setShowNotifications(true)}
            className="w-10 h-10 rounded-2xl bg-zinc-900/85 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-95 shadow-md relative"
          >
            <Bell className="w-4.5 h-4.5" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
            )}
          </button>
          
          <button className="w-10 h-10 rounded-2xl bg-zinc-900/85 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-95 shadow-md">
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
          placeholder="Tafuta chaneli yoyote..."
          className="w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/90 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all placeholder:text-zinc-500 shadow-inner"
        />
      </div>

      {/* 3. STICKY VIDEO PLAYER */}
      {heroChannel && (
        <div className="sticky top-2 z-30 bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-3 shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping shadow-lg shadow-red-600/60 flex-shrink-0"></span>
              <h2 className="text-xs font-black text-white truncate tracking-wide">
                {cleanName(heroChannel.name)}
              </h2>
            </div>
            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>LIVE HD</span>
            </span>
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

      {/* 4. CATEGORIES WITH MAX 10 CHANNELS & HORIZONTAL SLIDER */}
      {processedCategories.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 text-zinc-500 text-xs font-bold space-y-2">
          <Tv className="w-8 h-8 mx-auto text-zinc-600" />
          <p>Hakuna maudhui yaliyopatikana.</p>
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
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-200 flex items-center space-x-2">
                    <Radio className="w-3.5 h-3.5 text-red-500" />
                    <span>{cat.name}</span>
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-bold bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800 shadow-sm">
                    {filteredCatChannels.length} / 10 Chaneli
                  </span>
                </div>

                {/* HORIZONTAL SLIDER (MAX 10 ITEMS) */}
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
                            ? "border-red-600 bg-red-950/30 ring-1 ring-red-600/60 shadow-red-600/30"
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
                          <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                            HD Stream
                          </span>
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

      {/* 5. NOTIFICATIONS MODAL (ZIMETOLEWA MAELEZO YA ZAMANI, ZIMEWEKWA NOTIFICATIONS HALISI) */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-red-500" />
                <h3 className="font-extrabold text-sm text-white">Taarifa & Ujumbe</h3>
              </div>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-zinc-400 hover:text-white bg-zinc-800 p-1.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
              {notifications.map((n) => (
                <div key={n.id} className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{n.title}</h4>
                    <span className="text-[9px] text-zinc-500">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">{n.desc}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowNotifications(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-2xl transition-all shadow-lg shadow-red-600/30"
            >
              Funga
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

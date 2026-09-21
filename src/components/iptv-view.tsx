"use client";

import React, { useEffect, useState } from "react";
import { Search, Heart, Bell, User, Tv, ShieldCheck, LogOut } from "lucide-react";
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
  pageType?: "home" | "movies" | "series" | "live-tv" | "profile";
}

const cleanName = (name: string): string => {
  if (!name) return "Channel";
  return name
    .replace(/[\(\[\{].*?[\)\]\}]/g, "")
    .replace(/(360p|720p|1080p|4k|hd|sd|24\/7|not 24\/7)/gi, "")
    .trim();
};

export function IPTVView({ pageType = "home" }: IPTVViewProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavs = localStorage.getItem("techstream_favs");
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch (e) {}
    }

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
    if (!categories || categories.length === 0) return [];

    return categories.map((cat) => {
      let filtered = cat.channels || [];
      const catNameLower = (cat.name || "").toLowerCase();

      if (pageType === "movies") {
        filtered = filtered.filter(
          (c) =>
            /movie|cinema|film|vod|action|hbo|box|thriller|comedy|horror/i.test((c.name || "") + " " + (c.group || "")) ||
            /movie|cinema|film|vod/i.test(catNameLower)
        );
      } else if (pageType === "series") {
        filtered = filtered.filter(
          (c) =>
            /series|serial|drama|show|season|episode/i.test((c.name || "") + " " + (c.group || "")) ||
            /series|serial|drama/i.test(catNameLower)
        );
      } else if (pageType === "live-tv") {
        filtered = filtered.filter(
          (c) =>
            /live|news|sport|habari|michezo|tbc|bbc|cnn|supersport|tv/i.test((c.name || "") + " " + (c.group || "")) &&
            !/vod|movie|series/i.test(c.group || "")
        );
      }

      return { ...cat, channels: filtered };
    }).filter((cat) => cat.channels && cat.channels.length > 0);
  };

  const processedCategories = getFilteredCategories();
  const flattenedChannels = processedCategories.flatMap((cat) => cat.channels);

  useEffect(() => {
    if (flattenedChannels.length > 0 && !selectedChannel) {
      setSelectedChannel(flattenedChannels[0]);
    }
  }, [flattenedChannels, selectedChannel]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="w-24 h-24 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
        <div className="absolute w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center">
          <Tv className="w-6 h-6 text-red-600" />
        </div>
      </div>
    );
  }

  // UI YA PROFILE PAGE
  if (pageType === "profile") {
    return (
      <div className="min-h-screen bg-black text-white p-4 pb-36 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <span className="font-black text-xl text-white tracking-wider">PROFILE</span>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center text-center space-y-3">
          <div className="w-20 h-20 bg-gradient-to-tr from-red-600 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-red-600/30">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Mteja wa TechStream</h2>
            <p className="text-xs text-zinc-400">user@techstream.tv</p>
          </div>
          <span className="bg-red-600/20 border border-red-600/40 text-red-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            KIFURUKI: VIP PREMIUM
          </span>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">TAARIFA ZA KIFURUKI</h3>
          <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
            <span className="text-xs text-zinc-300">Hali ya Akaunti</span>
            <span className="text-xs font-bold text-emerald-400">Hai (Active)</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
            <span className="text-xs text-zinc-300">Inaisha Tarehe</span>
            <span className="text-xs font-bold text-white">31 Desemba 2026</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-xs text-zinc-300">Kikomo cha Vifaa</span>
            <span className="text-xs font-bold text-white">Vifaa 2 / Vimeunganishwa 1</span>
          </div>
        </div>

        <button className="w-full bg-red-600/10 border border-red-600/30 hover:bg-red-600/20 text-red-500 font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all">
          <LogOut className="w-4 h-4" />
          <span className="text-xs">Ondoka kwenye Akaunti (Logout)</span>
        </button>
      </div>
    );
  }

  const heroChannel = selectedChannel || flattenedChannels[0];

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-36 space-y-5 selection:bg-red-600 selection:text-white">
      
      {/* 1. TOP HEADER BAR WITH WORKING PROFILE & SPACING */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-9 h-9 bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30 flex-shrink-0">
            <Tv className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-base text-white tracking-tight truncate">TECHSTREAM</span>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <button className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 active:scale-95">
            <Bell className="w-4 h-4" />
          </button>
          <button 
            onClick={() => router.push("/profile")}
            className="w-9 h-9 rounded-xl bg-red-600 border border-red-500 flex items-center justify-center text-white active:scale-95 cursor-pointer shadow-md shadow-red-600/30"
          >
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
          placeholder="Tafuta chaneli au filamu..."
          className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 placeholder:text-zinc-500 shadow-inner"
        />
      </div>

      {/* 3. STICKY VIDEO PLAYER */}
      {heroChannel && (
        <div className="sticky top-2 z-30 bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-3 shadow-2xl space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-lg shadow-red-600/50 flex-shrink-0"></span>
              <h2 className="text-xs font-black text-white truncate tracking-wide">
                {cleanName(heroChannel.name)}
              </h2>
            </div>
            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>LIVE</span>
            </span>
          </div>

          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative border border-zinc-800">
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

      {/* 4. REAL M3U CATEGORIES & CHANNELS */}
      {processedCategories.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/40 rounded-3xl border border-zinc-800 text-zinc-500 text-xs font-bold">
          Hakuna chaneli zilizopatikana kwenye M3U link kwa sasa.
        </div>
      ) : (
        <div className="space-y-6 pt-2">
          {processedCategories.map((cat) => {
            const filteredCatChannels = (cat.channels || []).filter((ch) =>
              cleanName(ch.name || "").toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredCatChannels.length === 0) return null;

            return (
              <div key={cat.name} className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-300">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-zinc-500 font-bold">
                    {filteredCatChannels.length} chaneli
                  </span>
                </div>

                <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2 pt-1">
                  {filteredCatChannels.map((ch) => {
                    const cleanedName = cleanName(ch.name);
                    const isSelected = selectedChannel?.id === ch.id;

                    return (
                      <div
                        key={ch.id || Math.random()}
                        onClick={() => setSelectedChannel(ch)}
                        className={`min-w-[160px] max-w-[160px] bg-zinc-900/80 border rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all active:scale-95 flex-shrink-0 ${
                          isSelected
                            ? "border-red-600 bg-red-950/20 ring-1 ring-red-600/40 shadow-xl shadow-red-600/20"
                            : "border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center p-1.5 border border-zinc-800 mb-3">
                          {ch.logo ? (
                            <img src={ch.logo} alt={cleanedName} className="w-full h-full object-contain" />
                          ) : (
                            <Tv className="w-5 h-5 text-zinc-600" />
                          )}
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

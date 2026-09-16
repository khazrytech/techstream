"use client";

import React, { useEffect, useState } from "react";
import { Search, Heart, Lock, UserPlus, Loader2, Play } from "lucide-react";
import { Channel, CategoryGroup } from "@/lib/iptv-parser";

interface IPTVViewProps {
  pageType?: "home" | "movies" | "series" | "live-tv";
}

export function IPTVView({ pageType = "home" }: IPTVViewProps) {
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("techstream_user");
    if (savedUser) setIsLoggedIn(true);

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

  // 1. KUCHUJA KIKAMILIFU KULINGANA NA UKURASA
  const getPageFilteredChannels = () => {
    if (pageType === "movies") {
      return allChannels.filter((c) =>
        /movie|cinema|film|vod|action|hbo|box|thriller|comedy|horror|blockbuster|hollywood/i.test(
          c.name + " " + c.group
        ) && !/news|tbc|bbc|cnn|live|sports|habari/i.test(c.name + " " + c.group)
      );
    }
    if (pageType === "series") {
      return allChannels.filter((c) =>
        /series|serial|drama|show|season|episode|novel/i.test(c.name + " " + c.group) &&
        !/news|tbc|bbc|live/i.test(c.name + " " + c.group)
      );
    }
    if (pageType === "live-tv") {
      return allChannels.filter((c) =>
        /live|news|sport|habari|michezo|tbc|bbc|cnn|supersport|sky|tv/i.test(
          c.name + " " + c.group
        ) && !/vod|movie|series/i.test(c.group)
      );
    }
    return allChannels;
  };

  const pageChannels = getPageFilteredChannels();

  // Weka chaneli ya kwanza iliyochujwa mara tu inapopakia
  useEffect(() => {
    if (pageChannels.length > 0 && !selectedChannel) {
      setSelectedChannel(pageChannels[0]);
    }
  }, [pageChannels, selectedChannel]);

  // 2. KUSAFISHA KATEGORIA
  const rawCategories = Array.from(
    new Set(
      pageChannels
        .map((c) => c.group.split(";")[0].trim())
        .filter((g) => g.length > 0)
    )
  );
  const cleanCategoryList = ["All", ...rawCategories];

  // 3. KUCHUJA KULINGANA NA SEARCH NA KATEGORIA
  const finalFilteredChannels = pageChannels.filter((ch) => {
    const matchesSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase());
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

  const handleSelectChannel = (channel: Channel) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    setSelectedChannel(channel);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    localStorage.setItem("techstream_user", username);
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  const pageTitle =
    pageType === "movies"
      ? "🎬 Movies & Filamu"
      : pageType === "series"
      ? "📺 TV Series & Tamthilia"
      : pageType === "live-tv"
      ? "📡 Live TV & News"
      : null;

  // LOADING SCREEN YA KISASA (MODERN SPINNER + SKELETON)
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 space-y-6 flex flex-col justify-center items-center">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
          <Play className="w-6 h-6 text-red-600 absolute fill-red-600" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold tracking-wider text-zinc-200 uppercase">TechStream</h3>
          <p className="text-xs text-zinc-500 animate-pulse">Inaandaa Mipangilio Ya Kisasa...</p>
        </div>
      </div>
    );
  }

  const headerItems = pageChannels.slice(0, 6);

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-28 space-y-5">
      {/* HEADER TITLE */}
      {pageTitle && (
        <h1 className="text-xl font-extrabold text-white tracking-wide">{pageTitle}</h1>
      )}

      {/* SEARCH BAR */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tafuta hapa..."
          className="w-full bg-zinc-900/90 border border-zinc-800/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-500"
        />
      </div>

      {/* FEATURED / LIVE CAROUSEL */}
      {headerItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
            <span className="text-xs font-black tracking-wider text-red-500 uppercase">
              {pageType === "movies"
                ? "POPULAR MOVIES"
                : pageType === "series"
                ? "TRENDING SERIES"
                : "LIVE SASA"}
            </span>
          </div>

          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1">
            {headerItems.map((ch) => (
              <div
                key={ch.id}
                onClick={() => handleSelectChannel(ch)}
                className="min-w-[170px] bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-3 relative flex flex-col justify-between cursor-pointer hover:border-zinc-700 transition-all"
              >
                <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                  {pageType === "movies" ? "HD" : "LIVE"}
                </span>
                <div className="w-10 h-10 bg-zinc-950 rounded-xl p-1 mb-2 flex items-center justify-center border border-zinc-800">
                  {ch.logo ? (
                    <img src={ch.logo} alt={ch.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[9px] text-zinc-600 font-bold">STREAM</span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{ch.name}</h4>
                  <p className="text-[10px] text-zinc-500 line-clamp-1">{ch.group.split(";")[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE VIDEO PLAYER */}
      {selectedChannel && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 relative overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-red-500 flex items-center space-x-1">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              <span className="line-clamp-1">{selectedChannel.name}</span>
            </span>
          </div>

          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center relative border border-zinc-800">
            {isLoggedIn ? (
              <video
                src={selectedChannel.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center border border-red-600/40">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Ingia au Jisajili Kutazama</h3>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-600/30 flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Jisajili Bure</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CATEGORY FILTER PILLS */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
        {cleanCategoryList.slice(0, 10).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory.toLowerCase() === cat.toLowerCase()
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID LIST */}
      {finalFilteredChannels.length === 0 ? (
        <div className="text-center py-10 text-zinc-500 text-xs font-semibold">
          Hakuna maudhui yaliyopatikana.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {finalFilteredChannels.map((ch) => {
            const isSelected = selectedChannel?.id === ch.id;
            const isFav = favorites.includes(ch.id);

            return (
              <div
                key={ch.id}
                onClick={() => handleSelectChannel(ch)}
                className={`bg-zinc-900/90 border rounded-2xl p-3 flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? "border-red-600 ring-1 ring-red-600/50"
                    : "border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center p-1 border border-zinc-800 flex-shrink-0">
                    {ch.logo ? (
                      <img src={ch.logo} alt={ch.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[9px] font-bold text-zinc-600">MEDIA</span>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{ch.name}</h4>
                    <p className="text-[10px] text-zinc-500 line-clamp-1">{ch.group.split(";")[0]}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => toggleFavorite(ch.id, e)}
                  className="text-zinc-500 hover:text-white transition-colors ml-1 flex-shrink-0"
                >
                  <Heart
                    className={`w-4 h-4 ${isFav ? "fill-red-600 text-red-600" : "text-zinc-600"}`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-white text-center">Jisajili TechStream</h2>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Weka jina la mtumiaji..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
              />
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-600/30"
              >
                Kamilisha
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

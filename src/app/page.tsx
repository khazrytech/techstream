"use client";

import React, { useState } from "react";
import { 
  Search, Bell, User, Play, Plus, Heart, Share2, TV, Film, 
  Clapperboard, Trophy, Home as HomeIcon, Flame, Radio, Clock
} from "lucide-react";
import { IPTVPlayerEngine } from "@/components/iptv-player-engine";
import { SportsCenter } from "@/components/sports-center";

export default function TechStreamHome() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeCategory, setActiveCategory] = useState("Home");
  const [selectedStream, setSelectedStream] = useState<{ name: string; url: string } | null>({
    name: "Dodoma TV Live",
    url: "https://example.com/stream.m3u8"
  });

  const categories = ["All", "Live TV", "Sports", "News", "Movies", "Series", "Kids", "Music"];

  const dummyLiveChannels = [
    { id: "1", name: "Dodoma TV", logo: "📺", quality: "HD", isLive: true },
    { id: "2", name: "TBC 1", logo: "📡", quality: "FHD", isLive: true },
    { id: "3", name: "Channel 10", logo: "📽️", quality: "HD", isLive: true },
    { id: "4", name: "Clouds TV", logo: "🌟", quality: "HD", isLive: true },
  ];

  const dummyMovies = [
    { id: "m1", title: "Black Panther", year: "2022", rating: "8.5", quality: "4K" },
    { id: "m2", title: "Mission Impossible", year: "2023", rating: "8.8", quality: "FHD" },
    { id: "m3", title: "Extraction 2", year: "2023", rating: "7.9", quality: "HD" },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-24 selection:bg-indigo-600 selection:text-white">
      
      {/* 1. HEADER (Compact Badge & Profile) */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            TECHSTREAM
          </span>
          <span className="bg-indigo-950 border border-indigo-700/60 text-indigo-300 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
            STANDARD
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 bg-zinc-900 text-zinc-300 hover:text-white rounded-xl border border-zinc-800 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>
          </button>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-[1px] cursor-pointer">
            <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center font-black text-xs text-indigo-400">
              T
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6 max-w-7xl mx-auto">

        {/* 2. GLOBAL SEARCH BAR */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search channels, sports, movies, series..."
            className="w-full bg-zinc-900/90 border border-zinc-800/80 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
          />
        </div>

        {/* 3. CATEGORIES CAROUSEL */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat.toLowerCase())}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                activeTab === cat.toLowerCase()
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4. ACTIVE PLAYER (IF SELECTED) */}
        {selectedStream && (
          <section className="space-y-2">
            <IPTVPlayerEngine
              streamUrl={selectedStream.url}
              channelName={selectedStream.name}
              backupUrls={["https://backup1.com/stream.m3u8", "https://backup2.com/stream.m3u8"]}
            />
          </section>
        )}

        {/* 5. HERO / FEATURED SECTION */}
        <section className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-gradient-to-t from-zinc-950 via-zinc-900 to-indigo-950/40 p-6 space-y-4 shadow-2xl">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md animate-pulse">
              <Radio className="w-3 h-3" />
              <span>FEATURED LIVE</span>
            </span>
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest">Tanzania Premiere</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-white">Simba SC vs Yanga SC — Derby Day</h1>
            <p className="text-xs text-zinc-400 line-clamp-2">
              Tazama pambano kuu la Kariakoo Derby mubashara kupitia TechStream Sports Center yenye kiwango cha juu cha picha (FHD).
            </p>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs py-3 rounded-2xl shadow-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity">
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Live Now</span>
            </button>
            <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-300 hover:text-white">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-300 hover:text-white">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 6. SPORTS CENTER SECTION */}
        <SportsCenter />

        {/* 7. LIVE NOW CAROUSEL */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <h2 className="text-xs font-black uppercase tracking-wider text-white">🔴 Live Channels</h2>
            </div>
            <a href="#" className="text-[11px] font-bold text-indigo-400 hover:underline">See All</a>
          </div>

          <div className="flex space-x-3 overflow-x-auto no-scrollbar snap-x snap-mandatory">
            {dummyLiveChannels.map((ch) => (
              <div
                key={ch.id}
                onClick={() => setSelectedStream({ name: ch.name, url: "https://example.com/stream.m3u8" })}
                className="snap-start flex-shrink-0 w-36 bg-zinc-900/90 border border-zinc-800/80 hover:border-indigo-500 rounded-2xl p-3 space-y-3 cursor-pointer transition-all group"
              >
                <div className="w-full aspect-video bg-zinc-950 rounded-xl flex items-center justify-center text-2xl border border-zinc-800 group-hover:scale-105 transition-transform">
                  {ch.logo}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-emerald-400">● LIVE</span>
                    <span className="text-[9px] font-extrabold text-zinc-500">{ch.quality}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white truncate">{ch.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. MOVIES CAROUSEL */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <h2 className="text-xs font-black uppercase tracking-wider text-white">🎬 Blockbuster Movies</h2>
            </div>
            <a href="#" className="text-[11px] font-bold text-indigo-400 hover:underline">Explore</a>
          </div>

          <div className="flex space-x-3 overflow-x-auto no-scrollbar snap-x snap-mandatory">
            {dummyMovies.map((m) => (
              <div
                key={m.id}
                className="snap-start flex-shrink-0 w-32 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-2.5 space-y-2 cursor-pointer transition-all hover:border-purple-500"
              >
                <div className="w-full aspect-[2/3] bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 text-zinc-600 font-black text-xs">
                  POSTER
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between text-[9px] font-bold text-amber-400">
                    <span>★ {m.rating}</span>
                    <span className="text-zinc-500">{m.year}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white truncate">{m.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 9. BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-900 px-6 py-2.5 flex items-center justify-between z-50 max-w-md mx-auto">
        {[
          { label: "Home", icon: HomeIcon, key: "Home" },
          { label: "Live", icon: Radio, key: "Live" },
          { label: "Sports", icon: Trophy, key: "Sports" },
          { label: "Movies", icon: Film, key: "Movies" },
          { label: "Profile", icon: User, key: "Profile" }
        ].map((nav) => {
          const Icon = nav.icon;
          const isActive = activeCategory === nav.key;

          return (
            <button
              key={nav.key}
              onClick={() => setActiveCategory(nav.key)}
              className={`flex flex-col items-center space-y-1 transition-colors ${
                isActive ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold tracking-tight">{nav.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Bell, User, Play, Heart, Share2, Radio, Trophy, Film, Home as HomeIcon, X
} from "lucide-react";
import { IPTVPlayerEngine } from "@/components/iptv-player-engine";

interface Channel {
  id: string;
  name: string;
  logo?: string;
  stream_url: string;
  category?: string;
  quality?: string;
  channel_backups?: { stream_url: string }[];
}

export default function TechStreamHome() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeCategory, setActiveCategory] = useState("Home");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStream, setSelectedStream] = useState<Channel | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Fetch Real IPTV Channels from API
  useEffect(() => {
    async function fetchChannels() {
      try {
        setLoading(true);
        const res = await fetch("/api/iptv");
        const data = await res.json();
        if (data.success && data.channels && data.channels.length > 0) {
          setChannels(data.channels);
          setSelectedStream(data.channels[0]); // Auto-select first real channel
        }
      } catch (err) {
        console.error("Error fetching IPTV channels:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchChannels();
  }, []);

  const filteredChannels = activeTab === "all" 
    ? channels 
    : channels.filter(c => c.category?.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-24">
      
      {/* 1. HEADER (Interactive Profile Button) */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            TECHSTREAM
          </span>
          <span className="bg-indigo-950 border border-indigo-700/60 text-indigo-300 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
            STANDARD
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 bg-zinc-900 text-zinc-300 hover:text-white rounded-xl border border-zinc-800">
            <Bell className="w-4 h-4" />
          </button>
          
          {/* PROFILE BUTTON - NOW WORKING */}
          <button 
            onClick={() => setShowProfileModal(true)}
            className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-[1px] hover:scale-105 transition-transform"
          >
            <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center font-black text-xs text-indigo-400">
              T
            </div>
          </button>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6 max-w-7xl mx-auto">

        {/* 2. SEARCH BAR */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search active IPTV channels..."
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* 3. ACTIVE LIVE PLAYER */}
        {selectedStream ? (
          <section className="space-y-2">
            <IPTVPlayerEngine
              streamUrl={selectedStream.stream_url}
              channelName={selectedStream.name}
              quality={selectedStream.quality || "HD"}
              backupUrls={selectedStream.channel_backups?.map(b => b.stream_url) || []}
            />
          </section>
        ) : (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center text-xs text-zinc-500">
            {loading ? "Loading live IPTV streams..." : "No active channel selected."}
          </div>
        )}

        {/* 4. REAL LIVE CHANNELS GRID */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <h2 className="text-xs font-black uppercase tracking-wider text-white">🔴 Live Channels</h2>
            </div>
          </div>

          {loading ? (
            <div className="text-xs text-zinc-500">Connecting to IPTV Server...</div>
          ) : filteredChannels.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredChannels.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => setSelectedStream(ch)}
                  className={`bg-zinc-900 border rounded-2xl p-3 space-y-2 cursor-pointer transition-all ${
                    selectedStream?.id === ch.id ? "border-indigo-500 bg-indigo-950/20" : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="w-full aspect-video bg-zinc-950 rounded-xl flex items-center justify-center text-xl overflow-hidden border border-zinc-800">
                    {ch.logo ? (
                      <img src={ch.logo} alt={ch.name} className="w-full h-full object-contain" />
                    ) : (
                      <span>📺</span>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-emerald-400">● LIVE</span>
                    <h3 className="text-xs font-bold text-white truncate">{ch.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-zinc-500">No IPTV channels found in database.</div>
          )}
        </section>

      </main>

      {/* 5. PROFILE / USER MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">User Profile</h3>
              <button onClick={() => setShowProfileModal(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center space-x-3 bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white">
                T
              </div>
              <div>
                <p className="text-xs font-bold text-white">techboytz</p>
                <p className="text-[10px] text-indigo-400 font-semibold">Standard Subscriber</p>
              </div>
            </div>
            <button 
              onClick={() => setShowProfileModal(false)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 6. BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-900 px-6 py-2.5 flex items-center justify-between z-40 max-w-md mx-auto">
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
              onClick={() => {
                setActiveCategory(nav.key);
                if (nav.key === "Profile") setShowProfileModal(true);
              }}
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

"use client";
import { useState, useEffect } from "react";

const liveChannels = [
  { id: 1, name: "Azam Sports HD", category: "Sports", viewers: "12.4k", logo: "⚽", currentProgram: "VPL Live: Simba SC vs Yanga SC", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { id: 2, name: "SuperSport Premier League", category: "Sports", viewers: "18.2k", logo: "🏆", currentProgram: "Live Match Analysis & Build-up", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
  { id: 3, name: "ITV Tanzania", category: "News & Entertainment", viewers: "9.1k", logo: "📺", currentProgram: "Habari za Saa Mbili Usiku", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { id: 4, name: "Clouds TV", category: "Entertainment", viewers: "15.6k", logo: "☁️", currentProgram: "Freestyle Friday Live", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
  { id: 5, name: "ESPN Africa", category: "Sports", viewers: "8.3k", logo: "🏀", currentProgram: "NBA Highlights & Live Coverage", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
];

const categories = ["All", "Sports", "News & Entertainment", "Entertainment", "Documentary"];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mwanzo");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeChannel, setActiveChannel] = useState(liveChannels[0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium text-gray-400 tracking-wider animate-pulse">Inapakia TechStream IPTV...</p>
      </div>
    );
  }

  const filteredChannels = selectedCategory === "All" 
    ? liveChannels 
    : liveChannels.filter(c => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 font-sans">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/30">
            <span className="text-white font-bold text-lg">▶</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">
            TechStream
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-300 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-all shadow-md shadow-red-600/30">
            Ingia
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {activeTab === "mwanzo" && (
        <main>
          {/* IPTV Hero Section */}
          <section className="relative w-full bg-gradient-to-b from-neutral-900 to-[#0a0a0a] pt-4 pb-6 px-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                🔴 Live IPTV Featured
              </span>
              <span className="text-xs text-neutral-400">Watazamaji: {activeChannel.viewers}</span>
            </div>

            <div className="relative w-full aspect-video bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/60 backdrop-blur-sm">
                <div className="text-center px-4">
                  <div className="text-5xl mb-2">{activeChannel.logo}</div>
                  <h2 className="text-2xl font-black text-white mb-1">{activeChannel.name}</h2>
                  <p className="text-sm text-neutral-300 mb-4">{activeChannel.currentProgram}</p>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center mx-auto space-x-2 shadow-lg shadow-red-600/40 transition-transform active:scale-95">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    <span>Tazama Live Sasa</span>
                  </button>
                </div>
              </div>
              <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase animate-pulse">
                LIVE
              </div>
            </div>

            {/* Channel Quick Bar */}
            <div className="mt-4">
              <h3 className="text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">Chaneli Zinazovuma</h3>
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
                {liveChannels.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch)}
                    className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all ${
                      activeChannel.id === ch.id 
                        ? 'bg-red-600/20 border-red-600 text-white' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-lg">{ch.logo}</span>
                    <div className="text-left">
                      <p className="text-xs font-bold truncate max-w-[100px]">{ch.name}</p>
                      <p className="text-[10px] text-neutral-500">{ch.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Categories Horizontal Scroll */}
          <section className="px-4 py-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Makundi (Categories)</h3>
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                      : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* IPTV Channels List */}
          <section className="px-4 py-3">
            <div className="grid grid-cols-1 gap-3">
              {filteredChannels.map((channel) => (
                <div 
                  key={channel.id}
                  onClick={() => setActiveChannel(channel)}
                  className="bg-neutral-900/80 border border-neutral-800/80 rounded-xl p-3 flex items-center justify-between hover:border-red-600/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                      {channel.logo}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-red-500 transition-colors">{channel.name}</h4>
                      <p className="text-xs text-neutral-400">{channel.currentProgram}</p>
                      <span className="inline-block mt-1 text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                        {channel.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="w-9 h-9 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                      ▶
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {activeTab === "movies" && (
        <div className="px-4 py-6 text-center">
          <h2 className="text-lg font-bold mb-2">Movies Catalog</h2>
          <p className="text-sm text-neutral-400">Sinema zinakuja hivi karibuni...</p>
        </div>
      )}

      {activeTab === "series" && (
        <div className="px-4 py-6 text-center">
          <h2 className="text-lg font-bold mb-2">Series Catalog</h2>
          <p className="text-sm text-neutral-400">Tamthilia zinakuja hivi karibuni...</p>
        </div>
      )}

      {activeTab === "livetv" && (
        <div className="px-4 py-4">
          <h2 className="text-base font-bold mb-3">Live TV Channels</h2>
          <div className="grid grid-cols-2 gap-3">
            {liveChannels.map(ch => (
              <div key={ch.id} onClick={() => setActiveChannel(ch)} className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-center cursor-pointer hover:border-red-600 transition-all">
                <div className="text-3xl mb-2">{ch.logo}</div>
                <h4 className="font-bold text-xs truncate">{ch.name}</h4>
                <p className="text-[10px] text-neutral-400 mt-1">{ch.viewers} viewing</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="px-4 py-6 text-center">
          <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 font-bold">
            T
          </div>
          <h2 className="text-lg font-bold">techboytz</h2>
          <p className="text-sm text-neutral-400 mb-4">Akaunti ya TechStream IPTV</p>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-neutral-800 px-2 py-2 flex justify-around items-center z-50">
        <button
          onClick={() => setActiveTab("mwanzo")}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            activeTab === "mwanzo" ? "text-red-600 font-bold" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="text-[10px]">Mwanzo</span>
        </button>

        <button
          onClick={() => setActiveTab("movies")}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            activeTab === "movies" ? "text-red-600 font-bold" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>
          <span className="text-[10px]">Movies</span>
        </button>

        <button
          onClick={() => setActiveTab("series")}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            activeTab === "series" ? "text-red-600 font-bold" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>
          <span className="text-[10px]">Series</span>
        </button>

        <button
          onClick={() => setActiveTab("livetv")}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            activeTab === "livetv" ? "text-red-600 font-bold" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zM8 15h2v-2H8v2zm3 0h2v-2h-2v2zm3 0h2v-2h-2v2z"/></svg>
          <span className="text-[10px]">Live TV</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            activeTab === "profile" ? "text-red-600 font-bold" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </div>
  );
}

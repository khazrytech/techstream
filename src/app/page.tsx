"use client";
import { useState, useEffect } from "react";

interface Channel {
  id: string;
  name: string;
  logo: string;
  category: string;
  url: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mwanzo");
  const [m3uUrl, setM3uUrl] = useState("https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);

  const parseM3U = (m3uText: string) => {
    const lines = m3uText.split("\n");
    const parsedChannels: Channel[] = [];
    let currentChannel: Partial<Channel> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("#EXTINF:")) {
        const logoMatch = line.match(/tvg-logo="([^"]*)"/);
        const groupMatch = line.match(/group-title="([^"]*)"/);
        const nameParts = line.split(",");
        const name = nameParts.length > 1 ? nameParts[nameParts.length - 1].trim() : "Channel";

        currentChannel = {
          id: Math.random().toString(36).substring(2, 9),
          name: name,
          logo: logoMatch ? logoMatch[1] : "📺",
          category: groupMatch ? groupMatch[1] : "General",
        };
      } else if (line && !line.startsWith("#")) {
        if (currentChannel.name) {
          currentChannel.url = line;
          parsedChannels.push(currentChannel as Channel);
          currentChannel = {};
        }
      }
    }
    return parsedChannels;
  };

  const loadPlaylist = async (urlToFetch: string) => {
    setIsLoadingPlaylist(true);
    try {
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(urlToFetch)}`);
      const text = await res.text();
      const parsed = parseM3U(text);
      if (parsed.length > 0) {
        setChannels(parsed);
        const cats = ["All", ...Array.from(new Set(parsed.map(c => c.category)))];
        setCategories(cats);
        setActiveChannel(parsed[0]);
      }
    } catch (e) {
      console.error("Error fetching playlist:", e);
    } finally {
      setIsLoadingPlaylist(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylist(m3uUrl);
  }, []);

  const filteredChannels = selectedCategory === "All" 
    ? channels 
    : channels.filter(c => c.category === selectedCategory);

  const heroChannels = channels.slice(0, 15);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4 shadow-lg shadow-red-600/50"></div>
        <p className="text-xs font-semibold text-neutral-400 tracking-widest uppercase animate-pulse">Inapakia chaneli za TechStream IPTV...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 font-sans select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between px-3 py-3 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-800/80">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/40">
            <span className="text-white font-black text-base">▶</span>
          </div>
          <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">
            TechStream
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <input 
            type="text" 
            value={m3uUrl} 
            onChange={(e) => setM3uUrl(e.target.value)}
            placeholder="M3U Link..."
            className="bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 px-2.5 py-1.5 rounded-full w-32 focus:outline-none focus:border-red-600"
          />
          <button 
            onClick={() => loadPlaylist(m3uUrl)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md shadow-red-600/30"
          >
            {isLoadingPlaylist ? "..." : "Fetch"}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {activeTab === "mwanzo" && (
        <main className="space-y-4 pt-3">
          {/* Hero Slider Section for IPTV Channels */}
          <section className="px-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>Live IPTV Hero Slider</span>
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">{channels.length} Chaneli</span>
            </div>

            <div className="flex space-x-3 overflow-x-auto pb-3 scrollbar-none snap-x">
              {heroChannels.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => { setActiveChannel(ch); setIsPlaying(true); }}
                  className={`min-w-[260px] max-w-[260px] snap-center rounded-2xl p-4 bg-gradient-to-br from-neutral-900 to-neutral-950 border transition-all cursor-pointer relative overflow-hidden shadow-xl ${
                    activeChannel?.id === ch.id ? 'border-red-600 shadow-red-600/20' : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded tracking-widest uppercase">
                    LIVE
                  </div>
                  <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center text-2xl mb-3 overflow-hidden">
                    {ch.logo.startsWith("http") ? (
                      <img src={ch.logo} alt="" className="w-full h-full object-contain" onError={(e)=>{(e.target as HTMLElement).style.display='none';}} />
                    ) : (
                      <span>{ch.logo}</span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm text-white truncate">{ch.name}</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5 truncate">{ch.category}</p>
                  
                  <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-neutral-800/60">
                    <span className="text-[10px] text-neutral-400">🔗 Free-TV M3U</span>
                    <span className="text-xs bg-red-600/20 text-red-500 px-2.5 py-1 rounded-md font-bold">Tazama ▶</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Active Stream Player View */}
          {activeChannel && (
            <section className="px-4">
              <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative aspect-video bg-neutral-950 flex items-center justify-center">
                  {isPlaying ? (
                    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-4">
                      <div className="text-4xl mb-2">{activeChannel.logo.startsWith("http") ? <img src={activeChannel.logo} className="w-12 h-12 object-contain" /> : activeChannel.logo}</div>
                      <p className="text-sm font-bold text-white text-center">{activeChannel.name}</p>
                      <p className="text-[10px] text-red-500 mt-1 truncate max-w-xs">{activeChannel.url}</p>
                      <div className="flex space-x-2 mt-4">
                        <a 
                          href={activeChannel.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-red-600 text-white text-xs px-4 py-2 rounded-xl font-bold shadow-lg shadow-red-600/30"
                        >
                          Fungua Player ↗
                        </a>
                        <button 
                          onClick={() => setIsPlaying(false)}
                          className="bg-neutral-800 hover:bg-neutral-700 text-xs px-4 py-2 rounded-xl text-neutral-300 font-semibold"
                        >
                          Ficha
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-center p-4 text-center">
                      <h2 className="text-base font-bold text-white mb-1">{activeChannel.name}</h2>
                      <p className="text-xs text-neutral-400 mb-3">Kundi: {activeChannel.category}</p>
                      <button 
                        onClick={() => setIsPlaying(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-red-600/40 transition-transform active:scale-95"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        <span>Anzisha Stream Sasa</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Category Filter Pills */}
          <section className="px-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Makundi ya Chaneli (Categories)</h3>
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                      : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
                  }`}
                >
                  {cat} ({cat === "All" ? channels.length : channels.filter(c => c.category === cat).length})
                </button>
              ))}
            </div>
          </section>

          {/* Filtered Channel List */}
          <section className="px-4 pb-4">
            <div className="grid grid-cols-1 gap-2.5">
              {filteredChannels.map((channel) => (
                <div 
                  key={channel.id}
                  onClick={() => { setActiveChannel(channel); setIsPlaying(true); }}
                  className="bg-neutral-900/90 border border-neutral-800/80 rounded-xl p-3 flex items-center justify-between hover:border-red-600/60 transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 bg-neutral-800 rounded-xl flex items-center justify-center text-lg group-hover:scale-105 transition-transform overflow-hidden">
                      {channel.logo.startsWith("http") ? (
                        <img src={channel.logo} alt="" className="w-full h-full object-contain" onError={(e)=>{(e.target as HTMLElement).style.display='none';}} />
                      ) : (
                        <span>{channel.logo}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-red-500 transition-colors">{channel.name}</h4>
                      <span className="inline-block mt-1 text-[9px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-medium">
                        {channel.category}
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all text-xs font-bold">
                    ▶
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {activeTab === "movies" && (
        <div className="px-4 py-10 text-center">
          <h2 className="text-base font-bold mb-1">Movies</h2>
          <p className="text-xs text-neutral-400">Orodha ya sinema inakuja hivi karibuni...</p>
        </div>
      )}

      {activeTab === "series" && (
        <div className="px-4 py-10 text-center">
          <h2 className="text-base font-bold mb-1">Series</h2>
          <p className="text-xs text-neutral-400">Tamthilia zinakuja hivi karibuni...</p>
        </div>
      )}

      {activeTab === "livetv" && (
        <div className="px-4 py-4">
          <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-neutral-400">All IPTV Channels ({channels.length})</h2>
          <div className="grid grid-cols-2 gap-3">
            {channels.map(ch => (
              <div 
                key={ch.id} 
                onClick={() => { setActiveChannel(ch); setActiveTab("mwanzo"); setIsPlaying(true); }}
                className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-center cursor-pointer hover:border-red-600 transition-all"
              >
                <div className="w-10 h-10 mx-auto mb-2 bg-neutral-800 rounded-lg flex items-center justify-center overflow-hidden">
                  {ch.logo.startsWith("http") ? <img src={ch.logo} className="w-full h-full object-contain" /> : ch.logo}
                </div>
                <h4 className="font-bold text-xs truncate text-white">{ch.name}</h4>
                <p className="text-[10px] text-neutral-400 mt-1">{ch.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="px-4 py-10 text-center">
          <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center text-xl mx-auto mb-3 font-extrabold border border-red-600/30">
            TB
          </div>
          <h2 className="text-base font-bold text-white">techboytz</h2>
          <p className="text-xs text-neutral-400 mt-1">TechStream IPTV Pro Account</p>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-neutral-800/80 px-2 py-2 flex justify-around items-center z-50">
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

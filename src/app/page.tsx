"use client";
import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

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
          logo: logoMatch ? logoMatch[1] : "",
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
        if (!activeChannel) setActiveChannel(parsed[0]);
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
    const savedFavs = localStorage.getItem("techstream_favs");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(fav => fav !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("techstream_favs", JSON.stringify(updated));
  };

  // HLS Player Management
  useEffect(() => {
    if (!activeChannel || !isPlaying) return;
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = activeChannel.url;
      video.play().catch(() => {});
    } else if (Hls.isSupported()) {
      hls = new Hls({ maxBufferLength: 30, liveSyncDurationCount: 3 });
      hls.loadSource(activeChannel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [activeChannel, isPlaying]);

  const filteredChannels = channels.filter(c => {
    const matchesCategory = selectedCategory === "All" ? true : selectedCategory === "Favorites" ? favorites.includes(c.id) : c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const heroChannels = channels.slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4 shadow-xl shadow-red-600/40"></div>
        <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase animate-pulse">Inapakia TechStream Pro v2.0...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-28 font-sans select-none antialiased">
      {/* Top Navigation Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50 border-b border-neutral-800/60 shadow-lg">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-gradient-to-tr from-red-700 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/40">
            <span className="text-white font-black text-lg">▶</span>
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight bg-gradient-to-r from-white via-neutral-200 to-red-500 bg-clip-text text-transparent">
              TechStream
            </h1>
            <p className="text-[9px] text-red-500 font-extrabold tracking-widest uppercase">PRO IPTV</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="text" 
            value={m3uUrl} 
            onChange={(e) => setM3uUrl(e.target.value)}
            placeholder="Weka M3U Link..."
            className="bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-200 px-3 py-1.5 rounded-full w-28 sm:w-40 focus:outline-none focus:border-red-600 transition-all shadow-inner"
          />
          <button 
            onClick={() => loadPlaylist(m3uUrl)}
            className="bg-red-600 hover:bg-red-700 active:scale-95 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-md shadow-red-600/30"
          >
            {isLoadingPlaylist ? "..." : "Badili"}
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      {activeTab === "mwanzo" && (
        <main className="space-y-5 pt-3">
          {/* Active Stream Player View */}
          {activeChannel && (
            <section className="px-3 sm:px-4">
              <div className="w-full bg-neutral-900 border border-neutral-800/80 rounded-2xl overflow-hidden shadow-2xl relative group">
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  {isPlaying ? (
                    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
                      <video 
                        ref={videoRef}
                        controls 
                        autoPlay 
                        playsInline
                        className="w-full h-full object-contain bg-black"
                      />
                      <div className="absolute top-3 left-3 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 z-10">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                        <span className="text-[10px] font-bold text-white truncate max-w-[150px]">{activeChannel.name}</span>
                      </div>
                      <button 
                        onClick={() => setIsPlaying(false)}
                        className="absolute top-3 right-3 bg-neutral-900/80 hover:bg-red-600 text-white text-[11px] px-3 py-1 rounded-full backdrop-blur-md z-10 transition-all font-bold border border-neutral-700"
                      >
                        Ficha Player ✕
                      </button>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-14 h-14 bg-neutral-800 border border-neutral-700 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-lg overflow-hidden">
                        {activeChannel.logo ? (
                          <img src={activeChannel.logo} className="w-full h-full object-contain" onError={(e)=>{(e.target as HTMLElement).style.display='none';}} />
                        ) : "📺"}
                      </div>
                      <h2 className="text-base font-extrabold text-white mb-1">{activeChannel.name}</h2>
                      <p className="text-xs text-neutral-400 mb-4 bg-neutral-800/60 px-3 py-1 rounded-full border border-neutral-700/50">Kundi: {activeChannel.category}</p>
                      <button 
                        onClick={() => setIsPlaying(true)}
                        className="bg-red-600 hover:bg-red-700 active:scale-95 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-xl shadow-red-600/40 transition-all"
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

          {/* Search Bar Section */}
          <section className="px-3 sm:px-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-400">🔍</span>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tafuta chaneli yoyote kwa jina au kundi..."
                className="w-full bg-neutral-900/90 border border-neutral-800 text-xs text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-red-600 transition-all shadow-inner"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white text-xs">
                  Futa ✕
                </button>
              )}
            </div>
          </section>

          {/* Hero Slider / Featured Channels */}
          {!searchQuery && (
            <section className="px-3 sm:px-4">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-500 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span>Featured Live Hero</span>
                </span>
                <span className="text-[11px] text-neutral-400 font-semibold">{channels.length} Total Channels</span>
              </div>

              <div className="flex space-x-3.5 overflow-x-auto pb-3 scrollbar-none snap-x">
                {heroChannels.map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => { setActiveChannel(ch); setIsPlaying(true); }}
                    className={`min-w-[270px] max-w-[270px] snap-center rounded-2xl p-4 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border transition-all cursor-pointer relative overflow-hidden shadow-xl ${
                      activeChannel?.id === ch.id ? 'border-red-600 ring-1 ring-red-600/50 shadow-red-600/20' : 'border-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <div className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded tracking-widest uppercase shadow-md">
                      LIVE
                    </div>
                    <div className="w-12 h-12 bg-neutral-800/80 border border-neutral-700/50 rounded-xl flex items-center justify-center text-2xl mb-3 overflow-hidden shadow-inner">
                      {ch.logo ? (
                        <img src={ch.logo} alt="" className="w-full h-full object-contain" onError={(e)=>{(e.target as HTMLElement).style.display='none';}} />
                      ) : "📺"}
                    </div>
                    <h3 className="font-extrabold text-sm text-white truncate">{ch.name}</h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5 truncate">{ch.category}</p>
                    
                    <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-neutral-800/60">
                      <button onClick={(e) => toggleFavorite(ch.id, e)} className={`text-xs p-1 rounded-full ${favorites.includes(ch.id) ? 'text-red-500' : 'text-neutral-500 hover:text-white'}`}>
                        {favorites.includes(ch.id) ? '❤️ Pendwa' : '🤍 Penda'}
                      </button>
                      <span className="text-xs bg-red-600/20 text-red-400 px-3 py-1 rounded-lg font-extrabold border border-red-600/30">Tazama ▶</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Category Filter Pills */}
          <section className="px-3 sm:px-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2.5">Makundi ya Chaneli</h3>
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedCategory("Favorites")}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-md ${
                  selectedCategory === "Favorites" ? 'bg-red-600 text-white shadow-red-600/30' : 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                ❤️ Favorites ({favorites.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-md ${
                    selectedCategory === cat 
                      ? 'bg-red-600 text-white shadow-red-600/30' 
                      : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
                  }`}
                >
                  {cat} ({cat === "All" ? channels.length : channels.filter(c => c.category === cat).length})
                </button>
              ))}
            </div>
          </section>

          {/* Filtered Channel List */}
          <section className="px-3 sm:px-4 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredChannels.length === 0 ? (
                <div className="col-span-full py-12 text-center text-neutral-500 text-xs">
                  Hakuna chaneli iliyopatikana kwenye utafutaji wako.
                </div>
              ) : (
                filteredChannels.map((channel) => (
                  <div 
                    key={channel.id}
                    onClick={() => { setActiveChannel(channel); setIsPlaying(true); }}
                    className="bg-neutral-900/80 border border-neutral-800/80 rounded-xl p-3 flex items-center justify-between hover:border-red-600/70 transition-all cursor-pointer group shadow-lg"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 bg-neutral-800/90 border border-neutral-700/50 rounded-xl flex items-center justify-center text-lg group-hover:scale-105 transition-transform overflow-hidden shadow-inner">
                        {channel.logo ? (
                          <img src={channel.logo} alt="" className="w-full h-full object-contain" onError={(e)=>{(e.target as HTMLElement).style.display='none';}} />
                        ) : "📺"}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-red-400 transition-colors">{channel.name}</h4>
                        <span className="inline-block mt-1 text-[9px] bg-neutral-800/90 text-neutral-300 px-2 py-0.5 rounded font-semibold border border-neutral-700/50">
                          {channel.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={(e) => toggleFavorite(channel.id, e)} className="text-base p-1.5 hover:scale-110 transition-transform">
                        {favorites.includes(channel.id) ? '❤️' : '🤍'}
                      </button>
                      <div className="w-8 h-8 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all text-xs font-bold shadow-md">
                        ▶
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      )}

      {activeTab === "movies" && (
        <div className="px-4 py-16 text-center">
          <div className="w-16 h-16 bg-red-600/20 border border-red-600/30 text-red-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-xl">🎬</div>
          <h2 className="text-base font-bold mb-1">Movies Vault</h2>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">Maktaba ya sinema za kipekee inakuja hivi karibuni kwenye TechStream Pro.</p>
        </div>
      )}

      {activeTab === "series" && (
        <div className="px-4 py-16 text-center">
          <div className="w-16 h-16 bg-red-600/20 border border-red-600/30 text-red-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-xl">🍿</div>
          <h2 className="text-base font-bold mb-1">Series & Dramas</h2>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">Tamthilia na mifululizo ya video inatayarishwa kwa ajili yako.</p>
        </div>
      )}

      {activeTab === "livetv" && (
        <div className="px-3 sm:px-4 py-4">
          <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-neutral-400">All Live TV Channels ({channels.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {channels.map(ch => (
              <div 
                key={ch.id} 
                onClick={() => { setActiveChannel(ch); setActiveTab("mwanzo"); setIsPlaying(true); }}
                className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-2xl text-center cursor-pointer hover:border-red-600 transition-all shadow-xl group"
              >
                <div className="w-12 h-12 mx-auto mb-2.5 bg-neutral-800 border border-neutral-700/50 rounded-xl flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                  {ch.logo ? <img src={ch.logo} className="w-full h-full object-contain" /> : "📺"}
                </div>
                <h4 className="font-bold text-xs truncate text-white group-hover:text-red-400">{ch.name}</h4>
                <p className="text-[10px] text-neutral-400 mt-1 truncate">{ch.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="px-4 py-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-red-700 to-red-500 text-white rounded-3xl flex items-center justify-center text-2xl mx-auto mb-3 font-black shadow-2xl shadow-red-600/40 border border-red-400/30">
            TB
          </div>
          <h2 className="text-lg font-black text-white">techboytz</h2>
          <p className="text-xs text-red-500 font-bold mt-0.5">TechStream IPTV Pro Client</p>
          <div className="mt-6 max-w-xs mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-left space-y-2 shadow-xl">
            <div className="flex justify-between text-xs"><span className="text-neutral-400">Jamii:</span><span className="font-bold">IPTV Streamer</span></div>
            <div className="flex justify-between text-xs"><span className="text-neutral-400">Favorites:</span><span className="font-bold text-red-500">{favorites.length} Channels</span></div>
            <div className="flex justify-between text-xs"><span className="text-neutral-400">Total Playlists:</span><span className="font-bold">{channels.length} Loaded</span></div>
          </div>
        </div>
      )}

      {/* Bottom Modern Floating Navigation Bar */}
      <nav className="fixed bottom-3 left-3 right-3 max-w-md mx-auto bg-neutral-900/90 backdrop-blur-2xl border border-neutral-800/90 px-4 py-2.5 flex justify-around items-center z-50 rounded-2xl shadow-2xl">
        <button
          onClick={() => setActiveTab("mwanzo")}
          className={`flex flex-col items-center space-y-1 transition-all ${
            activeTab === "mwanzo" ? "text-red-500 font-bold scale-105" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="text-[9px]">Mwanzo</span>
        </button>

        <button
          onClick={() => setActiveTab("movies")}
          className={`flex flex-col items-center space-y-1 transition-all ${
            activeTab === "movies" ? "text-red-500 font-bold scale-105" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>
          <span className="text-[9px]">Movies</span>
        </button>

        <button
          onClick={() => setActiveTab("series")}
          className={`flex flex-col items-center space-y-1 transition-all ${
            activeTab === "series" ? "text-red-500 font-bold scale-105" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>
          <span className="text-[9px]">Series</span>
        </button>

        <button
          onClick={() => setActiveTab("livetv")}
          className={`flex flex-col items-center space-y-1 transition-all ${
            activeTab === "livetv" ? "text-red-500 font-bold scale-105" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zM8 15h2v-2H8v2zm3 0h2v-2h-2v2zm3 0h2v-2h-2v2z"/></svg>
          <span className="text-[9px]">Live TV</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center space-y-1 transition-all ${
            activeTab === "profile" ? "text-red-500 font-bold scale-105" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          <span className="text-[9px]">Profile</span>
        </button>
      </nav>
    </div>
  );
}

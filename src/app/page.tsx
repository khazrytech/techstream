"use client";
import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import { Channel, CategoryGroup } from "@/lib/iptv-parser";

const cleanChannelName = (name: string) => {
  return name.replace(/\s*[\[\(].*?[\]\)]/g, '').trim();
};

// Kanuni ya kugawa chaneli kwenye makundi ya 10
const chunkArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch("/api/iptv");
        const data = await res.json();
        
        if (data.success && data.categories) {
          const allChans: Channel[] = [];
          const cats = ["All"];
          
          data.categories.forEach((group: CategoryGroup) => {
            cats.push(group.category);
            group.channels.forEach(ch => allChans.push(ch));
          });

          setCategories(cats);
          setChannels(allChans);
          
          if (allChans.length > 0) {
            setActiveChannel(allChans[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
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

  useEffect(() => {
    if (!activeChannel) return;
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
  }, [activeChannel]);

  const filteredChannels = channels.filter(c => {
    const matchesCategory = selectedCategory === "All" ? true : selectedCategory === "Favorites" ? favorites.includes(c.id) : c.group === selectedCategory;
    const cleanName = cleanChannelName(c.name).toLowerCase();
    const matchesSearch = cleanName.includes(searchQuery.toLowerCase()) || (c.group && c.group.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const heroChannels = channels.slice(0, 10);
  
  // Hapa tunagawa chaneli zilizochujwa kwenye bloku za 10-10
  const chunkedChannels = chunkArray(filteredChannels, 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-4 pb-20">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-neutral-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="w-6 h-6 bg-red-600 rounded-full animate-pulse"></div>
        </div>
        <p className="text-red-500 font-extrabold text-xs animate-pulse tracking-widest uppercase">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32 font-sans select-none antialiased overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3.5 bg-[#050505]/95 backdrop-blur-xl sticky top-0 z-40 border-b border-neutral-800/80 shadow-xl">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-gradient-to-tr from-red-700 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/40">
            <span className="text-white font-black text-lg">▶</span>
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight bg-gradient-to-r from-white via-neutral-200 to-red-500 bg-clip-text text-transparent">
              TechStream
            </h1>
            <p className="text-[9px] text-red-500 font-extrabold tracking-widest uppercase">PRO IPTV V2</p>
          </div>
        </div>
      </header>

      <main className="space-y-4 pt-3 w-full overflow-hidden">
        {activeChannel && (
          <section className="px-3 sm:px-4">
            <div className="w-full bg-black border border-neutral-800/80 rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="relative aspect-video flex items-center justify-center">
                <video 
                  ref={videoRef}
                  controls 
                  autoPlay 
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
                <div className="absolute top-3 left-3 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 z-10 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-[10px] font-bold text-white truncate max-w-[150px]">{cleanChannelName(activeChannel.name)}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="px-3 sm:px-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-400">🔍</span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tafuta chaneli yoyote..."
              className="w-full bg-neutral-900/90 border border-neutral-800 text-xs text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-red-600 transition-all shadow-inner"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white text-xs">
                Futa ✕
              </button>
            )}
          </div>
        </section>

        {!searchQuery && heroChannels.length > 0 && (
          <section className="px-3 sm:px-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-500 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>Live Sasa</span>
              </span>
            </div>

            <div className="flex space-x-3.5 overflow-x-auto pb-2 scrollbar-none snap-x">
              {heroChannels.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => setActiveChannel(ch)}
                  className={`min-w-[240px] max-w-[240px] snap-center rounded-2xl p-4 bg-gradient-to-br from-neutral-900 to-neutral-950 border transition-all cursor-pointer relative shadow-xl ${
                    activeChannel?.id === ch.id ? 'border-red-600 ring-1 ring-red-600/50' : 'border-neutral-800/80'
                  }`}
                >
                  <div className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded tracking-widest uppercase">LIVE</div>
                  <div className="w-12 h-12 bg-neutral-800/80 rounded-xl flex items-center justify-center text-2xl mb-3 overflow-hidden">
                    {ch.logo ? <img src={ch.logo} className="w-full h-full object-contain" /> : "📺"}
                  </div>
                  <h3 className="font-extrabold text-sm text-white truncate">{cleanChannelName(ch.name)}</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5 truncate">{ch.group}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="px-3 sm:px-4">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("Favorites")}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-md ${
                selectedCategory === "Favorites" ? 'bg-red-600 text-white' : 'bg-neutral-900 text-neutral-300 border border-neutral-800'
              }`}
            >
              ❤️ Favorites
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-md ${
                  selectedCategory === cat ? 'bg-red-600 text-white' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* BLOKU KUU YENYE PAGES ZA KUSLIDE ZENYE CHANELI 10 KILA MOJA */}
        <section className="pb-4 w-full">
          <div className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2">
            {chunkedChannels.length === 0 ? (
              <div className="min-w-full py-12 text-center text-neutral-500 text-xs px-4">
                Hakuna chaneli iliyopatikana.
              </div>
            ) : (
              chunkedChannels.map((chunk, idx) => (
                <div key={idx} className="min-w-full flex-shrink-0 snap-center grid grid-cols-2 gap-2.5 px-3 sm:px-4">
                  {chunk.map((channel) => (
                    <div 
                      key={channel.id}
                      onClick={() => setActiveChannel(channel)}
                      className="bg-neutral-900/80 border border-neutral-800/80 rounded-xl p-2 flex items-center justify-between hover:border-red-600/70 cursor-pointer shadow-lg relative group h-[52px]"
                    >
                      <div className="flex items-center space-x-2.5 overflow-hidden w-full pr-6">
                        <div className="w-9 h-9 bg-neutral-800/90 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                          {channel.logo ? <img src={channel.logo} className="w-full h-full object-contain" /> : <span className="text-xs">📺</span>}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-[11px] text-white group-hover:text-red-400 truncate w-[100px]">{cleanChannelName(channel.name)}</h4>
                          <span className="text-[9px] text-neutral-400 truncate block mt-0.5">{channel.group}</span>
                        </div>
                      </div>
                      <button onClick={(e) => toggleFavorite(channel.id, e)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] p-2 shrink-0 z-10">
                        {favorites.includes(channel.id) ? '❤️' : '🤍'}
                      </button>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
          {chunkedChannels.length > 1 && (
            <div className="flex justify-center mt-2">
              <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest animate-pulse">
                &larr; Telezesha Kuona Zaidi &rarr;
              </span>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import { Channel, CategoryGroup } from "@/lib/iptv-parser";

const cleanChannelName = (name: string) => {
  return name.replace(/\s*[\[\(].*?[\]\)]/g, '').trim();
};

const chunkArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export default function Home() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userNameInput, setUserNameInput] = useState("");
  const [userEmailInput, setUserEmailInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeChunk, setActiveChunk] = useState(0);
  
  const [activeTab, setActiveTab] = useState("Mwanzo");

  // Typewriter Animation States
  const FULL_TITLE = "TechStream";
  const FULL_SLOGAN = "STREAM ANYTHING, ANYTIME";
  const [titleText, setTitleText] = useState("TechStream");
  const [sloganText, setSloganText] = useState("");
  const [typingState, setTypingState] = useState('pause-title');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("techstream_user");
    if (savedUser) {
      setIsRegistered(true);
    }
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNameInput.trim()) return;
    const userData = {
      name: userNameInput,
      email: userEmailInput || "techboytz@user.techstream"
    };
    localStorage.setItem("techstream_user", JSON.stringify(userData));
    setIsRegistered(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("techstream_user");
    setIsRegistered(false);
  };

  // Typewriter Effect Logic
  useEffect(() => {
    if (!isRegistered) return;
    let timer: NodeJS.Timeout;
    const typeSpeed = 80;
    const eraseSpeed = 40;
    const pauseTime = 3000;

    if (typingState === 'type-title') {
        if (titleText.length < FULL_TITLE.length) {
            timer = setTimeout(() => setTitleText(FULL_TITLE.slice(0, titleText.length + 1)), typeSpeed);
        } else {
            timer = setTimeout(() => setTypingState('pause-title'), pauseTime);
        }
    } else if (typingState === 'pause-title') {
        timer = setTimeout(() => setTypingState('erase-title'), pauseTime);
    } else if (typingState === 'erase-title') {
        if (titleText.length > 0) {
            timer = setTimeout(() => setTitleText(FULL_TITLE.slice(0, titleText.length - 1)), eraseSpeed);
        } else {
            timer = setTimeout(() => setTypingState('type-slogan'), 500);
        }
    } else if (typingState === 'type-slogan') {
        if (sloganText.length < FULL_SLOGAN.length) {
            timer = setTimeout(() => setSloganText(FULL_SLOGAN.slice(0, sloganText.length + 1)), typeSpeed);
        } else {
            timer = setTimeout(() => setTypingState('pause-slogan'), pauseTime);
        }
    } else if (typingState === 'pause-slogan') {
        timer = setTimeout(() => setTypingState('erase-slogan'), pauseTime);
    } else if (typingState === 'erase-slogan') {
        if (sloganText.length > 0) {
            timer = setTimeout(() => setSloganText(FULL_SLOGAN.slice(0, sloganText.length - 1)), eraseSpeed);
        } else {
            timer = setTimeout(() => setTypingState('type-title'), 500);
        }
    }
    return () => clearTimeout(timer);
  }, [titleText, sloganText, typingState, isRegistered]);

  useEffect(() => {
    if (!isRegistered) return;
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
          if (allChans.length > 0) setActiveChannel(allChans[0]);
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
  }, [isRegistered]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(id)) updated = favorites.filter(fav => fav !== id);
    else updated = [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("techstream_favs", JSON.stringify(updated));
  };

  useEffect(() => {
    if (!activeChannel || activeTab !== "Mwanzo" || !isRegistered) return;
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
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
    }
    return () => { if (hls) hls.destroy(); };
  }, [activeChannel, activeTab, isRegistered]);

  const handleCategoryClick = (cat: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedCategory(cat);
    setActiveChunk(0);
    e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, clientWidth } = e.currentTarget;
    const activeIndex = Math.round(scrollLeft / clientWidth);
    setActiveChunk(activeIndex);
  };

  const filteredChannels = channels.filter(c => {
    const matchesCategory = selectedCategory === "All" ? true : selectedCategory === "Favorites" ? favorites.includes(c.id) : c.group === selectedCategory;
    const cleanName = cleanChannelName(c.name).toLowerCase();
    const matchesSearch = cleanName.includes(searchQuery.toLowerCase()) || (c.group && c.group.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const heroChannels = channels.slice(0, 10);
  const chunkedChannels = chunkArray(filteredChannels, 10);

  // KAMA HAJASAJILIWA, ONYESHA FOMU YA KUJISAJILI
  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm bg-neutral-900/80 border border-neutral-800 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-tr from-red-700 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/40">
              <span className="text-white font-black text-xl">▶</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white">TechStream</h1>
              <p className="text-[9px] text-red-500 font-black tracking-widest uppercase">STREAM ANYTHING, ANYTIME</p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">Jina Lako (Username)</label>
              <input 
                type="text" 
                required
                value={userNameInput} 
                onChange={(e) => setUserNameInput(e.target.value)}
                placeholder="Mf: Techboytz"
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white px-4 py-3 rounded-xl focus:outline-none focus:border-red-600 transition-all shadow-inner"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">Barua Pepe (Email - Si Lazima)</label>
              <input 
                type="email" 
                value={userEmailInput} 
                onChange={(e) => setUserEmailInput(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white px-4 py-3 rounded-xl focus:outline-none focus:border-red-600 transition-all shadow-inner"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition-all active:scale-95"
            >
              Jisajili Sasa
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-4 pb-20">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-neutral-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-red-500 font-extrabold text-xs animate-pulse tracking-widest uppercase">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans select-none antialiased">
      {/* HEADER W/ TYPEWRITER EFFECT */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#050505]/95 backdrop-blur-xl sticky top-0 z-40 border-b border-neutral-800/80 shadow-xl">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-gradient-to-tr from-red-700 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/40">
            <span className="text-white font-black text-lg">▶</span>
          </div>
          <div className="h-[32px] flex flex-col justify-center">
            {titleText && (
              <h1 className={`text-base font-black tracking-tight bg-gradient-to-r from-white via-neutral-200 to-red-500 bg-clip-text text-transparent leading-none ${typingState.includes('title') ? 'border-r-2 border-red-500 pr-1 animate-pulse' : ''}`}>
                {titleText}
              </h1>
            )}
            {sloganText && (
              <p className={`text-[9px] text-red-500 font-black tracking-widest uppercase mt-0.5 ${typingState.includes('slogan') ? 'border-r-2 border-red-500 pr-1 animate-pulse' : ''}`}>
                {sloganText}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* RENDER TAB CONTENT */}
      {activeTab === "Mwanzo" ? (
        <main className="space-y-4 pt-2 w-full pb-28">
          {/* STICKY PLAYER */}
          {activeChannel && (
            <section className="sticky top-[53px] z-30 px-3 sm:px-4 py-1 bg-[#050505]/90 backdrop-blur-md transition-all">
              <div className="w-full bg-black border border-neutral-800/90 rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="relative aspect-video flex items-center justify-center">
                  <video ref={videoRef} controls autoPlay playsInline className="w-full h-full object-contain bg-black" />
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 z-10 pointer-events-none">
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
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tafuta chaneli yoyote..."
                className="w-full bg-neutral-900/90 border border-neutral-800 text-xs text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-red-600 transition-all shadow-inner"
              />
            </div>
          </section>

          <section className="px-3 sm:px-4">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x">
              <button onClick={(e) => handleCategoryClick("Favorites", e)} className={`snap-center px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-md flex-shrink-0 ${selectedCategory === "Favorites" ? 'bg-red-600 text-white' : 'bg-neutral-900 text-neutral-300 border border-neutral-800'}`}>
                ❤️ Favorites
              </button>
              {categories.map((cat) => (
                <button key={cat} onClick={(e) => handleCategoryClick(cat, e)} className={`snap-center px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-md flex-shrink-0 ${selectedCategory === cat ? 'bg-red-600 text-white' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </section>

          <section className="pb-6 w-full">
            <div ref={scrollContainerRef} onScroll={handleScroll} className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 scroll-smooth">
              {chunkedChannels.length === 0 ? (
                <div className="min-w-full py-12 text-center text-neutral-500 text-xs px-4">Hakuna chaneli.</div>
              ) : (
                chunkedChannels.map((chunk, idx) => (
                  <div key={idx} className="min-w-full flex-shrink-0 snap-center grid grid-cols-2 gap-2.5 px-3 sm:px-4">
                    {chunk.map((channel) => {
                      const isPlaying = activeChannel?.id === channel.id;
                      return (
                        <div key={channel.id} onClick={() => setActiveChannel(channel)} className={`border rounded-xl p-2 flex items-center justify-between cursor-pointer shadow-lg relative group h-[52px] transition-all ${isPlaying ? 'bg-red-950/30 border-red-600/70 ring-1 ring-red-600/30' : 'bg-neutral-900/80 border-neutral-800/80'}`}>
                          <div className="flex items-center space-x-2.5 overflow-hidden w-full pr-6">
                            <div className="w-9 h-9 bg-neutral-800/90 rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                              {channel.logo ? <img src={channel.logo} className="w-full h-full object-contain" /> : <span className="text-xs">📺</span>}
                            </div>
                            <div className="overflow-hidden">
                              <h4 className={`font-bold text-[11px] truncate w-[100px] ${isPlaying ? 'text-red-400' : 'text-white'}`}>{cleanChannelName(channel.name)}</h4>
                              <span className="text-[9px] text-neutral-400 truncate block mt-0.5">{channel.group}</span>
                            </div>
                          </div>
                          <button onClick={(e) => toggleFavorite(channel.id, e)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] p-2 shrink-0 z-10">{favorites.includes(channel.id) ? '❤️' : '🤍'}</button>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      ) : activeTab === "Profile" ? (
        // PROFILE SECTION WITH SUPPORT EMAIL & DIRECT WHATSAPP
        <main className="w-full pb-28 pt-4 px-4 space-y-6">
          <div className="bg-gradient-to-br from-neutral-900 to-black p-5 rounded-2xl border border-neutral-800 shadow-xl flex items-center space-x-4">
             <div className="w-16 h-16 bg-gradient-to-tr from-red-700 to-red-500 rounded-full flex items-center justify-center text-3xl shadow-lg shadow-red-600/30 border-2 border-neutral-900">
                 👤
             </div>
             <div>
                 <h2 className="text-lg font-black text-white">Techboytz</h2>
                 <p className="text-xs text-neutral-400 mt-0.5">hackertrick1997@gmail.com</p>
                 <span className="inline-block mt-2 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">
                     👑 PRO MEMBER
                 </span>
             </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-2">
             <div className="p-3 border-b border-neutral-800/80 text-sm font-bold flex justify-between items-center text-white"><span>⚙️ Akaunti Yangu</span> <span className="text-neutral-500">›</span></div>
             <div className="p-3 border-b border-neutral-800/80 text-sm font-bold flex justify-between items-center text-white"><span>💳 Kifurushi (Subscription)</span> <span className="text-neutral-500">›</span></div>
             <div className="p-3 text-sm font-bold flex justify-between items-center text-white"><span>❤️ Chaneli Zilizopendwa</span> <span className="text-neutral-500">›</span></div>
          </div>

          <div>
             <h3 className="text-[11px] font-black text-neutral-500 uppercase tracking-widest mb-3 ml-1">Msaada / Support</h3>
             <div className="space-y-3">
                 <a href="mailto:hackertrick1997@gmail.com" className="flex items-center space-x-3 bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 hover:border-red-500/50 transition-all active:scale-95">
                     <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-xl">📧</div>
                     <div>
                         <h4 className="text-sm font-bold text-white">Tuma Barua Pepe (Email)</h4>
                         <p className="text-[11px] text-neutral-400">hackertrick1997@gmail.com</p>
                     </div>
                 </a>
                 <a href="https://wa.me/255747431855" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 hover:border-green-500/50 transition-all active:scale-95">
                     <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-xl">💬</div>
                     <div>
                         <h4 className="text-sm font-bold text-white">Chat Nasi WhatsApp</h4>
                         <p className="text-[11px] text-neutral-400">0747 431 855</p>
                     </div>
                 </a>
             </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600/10 text-red-500 border border-red-600/30 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest active:bg-red-600/20"
          >
             Ondoka (Log Out)
          </button>
        </main>
      ) : (
        <main className="flex items-center justify-center h-[60vh] text-neutral-500 text-sm font-bold">
           Inakuja Hivi Karibuni...
        </main>
      )}

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 w-full bg-[#050505]/95 backdrop-blur-xl border-t border-neutral-800/80 px-2 py-3 z-50 flex justify-around items-center safe-area-pb">
        {[
          { id: "Mwanzo", icon: "🏠" },
          { id: "Movies", icon: "🎬" },
          { id: "Series", icon: "📺" },
          { id: "Live TV", icon: "📡" },
          { id: "Profile", icon: "👤" }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center space-y-1 w-16 transition-all ${activeTab === tab.id ? 'text-red-500' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <span className={`text-xl ${activeTab === tab.id ? 'scale-110 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]' : 'grayscale opacity-70'}`}>
              {tab.icon}
            </span>
            <span className="text-[9px] font-black tracking-wider">{tab.id}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

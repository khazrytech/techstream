"use client";
import React, { useState, useEffect } from "react";
import { 
  Search, Heart, Play, Bell, User, Tv, ShieldCheck, Flame, Radio, X, Lock, Mail, ArrowRight, Globe, LogOut, Settings, Sparkles, CheckCircle2 
} from "lucide-react";

interface Channel {
  id: string;
  name: string;
  logo: string;
  category: string;
  url: string;
  group?: string;
}

interface CategoryGroup {
  name: string;
  channels: Channel[];
}

const cleanName = (name: string): string => {
  if (!name) return "TechStream Channel";
  return name
    .replace(/[\(\[\{].*?[\)\]\}]/g, "")
    .replace(/(360p|720p|1080p|4k|hd|sd|24\/7|not 24\/7)/gi, "")
    .trim();
};

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mwanzo");
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [appLanguage, setAppLanguage] = useState("English");

  const notifications = [
    { id: 1, title: "Welcome to TechStream Pro", desc: "Next-gen IPTV streaming platform is now live.", time: "Just now" },
    { id: 2, title: "Live TV Update", desc: "All sports and movie channels are fully optimized.", time: "1 hour ago" }
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem("techstream_user");
    if (savedUser) {
      setUser(savedUser);
    }

    const savedFavs = localStorage.getItem("techstream_favs");
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch(e){}
    }

    const savedLang = localStorage.getItem("techstream_lang");
    if (savedLang) {
      setAppLanguage(savedLang);
    }

    // Fetch M3U Playlist
    fetch("https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8")
      .then(res => res.text())
      .then(text => {
        const lines = text.split("\n");
        const parsed: Channel[] = [];
        let curr: Partial<Channel> = {};

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith("#EXTINF:")) {
            const logoMatch = line.match(/tvg-logo="([^"]*)"/);
            const groupMatch = line.match(/group-title="([^"]*)"/);
            const nameParts = line.split(",");
            const name = nameParts.length > 1 ? nameParts[nameParts.length - 1].trim() : "Channel";

            curr = {
              id: Math.random().toString(36).substring(2, 9),
              name,
              logo: logoMatch ? logoMatch[1] : "",
              category: groupMatch ? groupMatch[1] : "General",
              group: groupMatch ? groupMatch[1] : "General"
            };
          } else if (line && !line.startsWith("#")) {
            if (curr.name) {
              curr.url = line;
              parsed.push(curr as Channel);
              curr = {};
            }
          }
        }

        const catMap: { [key: string]: Channel[] } = {};
        parsed.forEach(ch => {
          const cat = ch.category || "General";
          if (!catMap[cat]) catMap[cat] = [];
          catMap[cat].push(ch);
        });

        const formattedCats: CategoryGroup[] = Object.keys(catMap).map(catName => ({
          name: catName,
          channels: catMap[catName]
        }));

        setCategories(formattedCats);
        if (parsed.length > 0) setSelectedChannel(parsed[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!email || !password) {
      setAuthError("Tafadhali jaza barua pepe na neno la siri.");
      return;
    }
    setAuthLoading(true);

    setTimeout(() => {
      localStorage.setItem("techstream_user", email);
      setUser(email);
      setAuthLoading(false);
    }, 600);
  };

  const handleLogout = () => {
    localStorage.removeItem("techstream_user");
    setUser(null);
  };

  const toggleFavorite = (chId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated = favorites.includes(chId) ? favorites.filter(id => id !== chId) : [...favorites, chId];
    setFavorites(updated);
    localStorage.setItem("techstream_favs", JSON.stringify(updated));
  };

  const changeLanguage = (lang: string) => {
    setAppLanguage(lang);
    localStorage.setItem("techstream_lang", lang);
  };

  // =================== LOGIN / SIGNUP VIEW (HAKUNA NAVIGATION BAR KABISA) ===================
  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center px-6 py-12 relative overflow-hidden font-sans selection:bg-red-600 selection:text-white">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-red-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-red-800/10 rounded-full blur-[150px] animate-pulse"></div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex w-16 h-16 bg-gradient-to-tr from-red-600 via-red-500 to-rose-600 rounded-3xl items-center justify-center shadow-2xl shadow-red-600/40 border border-red-400/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-zinc-200 to-red-300 bg-clip-text text-transparent">
                TechStream
              </h1>
              <p className="text-xs text-zinc-400 font-medium mt-1">
                {isLoginMode ? "Ingia ili kuendelea na vipindi vyako unavyopenda" : "Tengeneza akaunti yako mpya hapa"}
              </p>
            </div>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-6 shadow-2xl space-y-5 relative">
            <div className="grid grid-cols-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800/80">
              <button
                type="button"
                onClick={() => setIsLoginMode(true)}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${isLoginMode ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-zinc-400 hover:text-white'}`}
              >
                Ingia
              </button>
              <button
                type="button"
                onClick={() => setIsLoginMode(false)}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${!isLoginMode ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-zinc-400 hover:text-white'}`}
              >
                Tengeneza Akaunti
              </button>
            </div>

            {authError && (
              <div className="bg-red-950/60 border border-red-600/50 text-red-400 text-xs font-semibold p-3 rounded-2xl text-center">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Barua Pepe (Email)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jina@email.com"
                    className="w-full bg-zinc-950/90 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Neno la Siri (Password)</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950/90 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600 shadow-inner"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-xl shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center space-x-2 border border-red-400/30"
              >
                {authLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Ingia Sasa</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // =================== LOGGED IN APP VIEW ===================
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-20 h-20 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const heroChannel = selectedChannel || categories[0]?.channels[0];

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-36 space-y-6 font-sans selection:bg-red-600 selection:text-white">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/30 border border-red-400/30">
            <Tv className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <span className="font-black text-lg tracking-wider bg-gradient-to-r from-white via-zinc-200 to-red-300 bg-clip-text text-transparent">
              TECHSTREAM
            </span>
            <p className="text-[10px] text-zinc-400 font-semibold tracking-wider">Pro IPTV ({appLanguage})</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button 
            onClick={() => setShowNotifications(true)}
            className="w-10 h-10 rounded-2xl bg-zinc-900/85 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all relative shadow-md"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          </button>
          
          <button 
            onClick={handleLogout}
            title="Log Out"
            className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-400 hover:bg-red-600 hover:text-white transition-all shadow-md"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* TAB CONTENT: PROFILE OR HOME CHANNELS */}
      {activeTab === "profile" ? (
        <div className="space-y-6 pt-2 animate-fadeIn">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-red-600/40">
                {user.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-base font-black text-white truncate">{user}</h2>
                <p className="text-xs text-red-400 font-medium flex items-center space-x-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>VIP Member Active</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Favorites</span>
                <p className="text-lg font-black text-white mt-0.5">{favorites.length} Channels</p>
              </div>
              <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Language</span>
                <p className="text-lg font-black text-red-400 mt-0.5">{appLanguage}</p>
              </div>
            </div>
          </div>

          {/* LANGUAGE SELECTOR */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-red-400" />
              <span>Select App Language</span>
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              {["English", "Swahili", "French"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`py-3 text-xs font-bold rounded-2xl border transition-all ${appLanguage === lang ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* UTILITY BUTTONS */}
          <div className="space-y-2.5">
            <button 
              onClick={() => alert("TechStream Pro v2.5 - All features are fully optimized.")}
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs py-4 px-5 rounded-2xl flex items-center justify-between transition-all"
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-4 h-4 text-red-400" />
                <span>App Settings & Preferences</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-500" />
            </button>

            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="w-full bg-red-950/40 hover:bg-red-900/40 border border-red-900/50 text-red-400 font-bold text-xs py-4 px-5 rounded-2xl flex items-center justify-between transition-all"
            >
              <div className="flex items-center space-x-3">
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Clear Cache & Reset Data</span>
              </div>
              <ArrowRight className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any channel..."
              className="w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/90 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-red-500 transition-all placeholder:text-zinc-500 shadow-inner"
            />
          </div>

          {/* Active Video Stream Player */}
          {heroChannel && (
            <div className="sticky top-2 z-30 bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-3 shadow-2xl space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping flex-shrink-0"></span>
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

          {/* Categories & Channels Slider */}
          <div className="space-y-6 pt-1">
            {categories.map((cat) => {
              const filteredChannels = (cat.channels || []).slice(0, 10).filter(ch =>
                cleanName(ch.name || "").toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (filteredChannels.length === 0) return null;

              return (
                <div key={cat.name} className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-200 flex items-center space-x-2">
                      <Radio className="w-3.5 h-3.5 text-red-400" />
                      <span>{cat.name}</span>
                    </h3>
                    <span className="text-[10px] text-zinc-400 font-bold bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
                      {filteredChannels.length} Channels
                    </span>
                  </div>

                  <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-3 pt-1 px-0.5">
                    {filteredChannels.map((ch) => {
                      const cleaned = cleanName(ch.name);
                      const isSelected = selectedChannel?.id === ch.id;
                      const isFav = favorites.includes(ch.id);

                      return (
                        <div
                          key={ch.id}
                          onClick={() => setSelectedChannel(ch)}
                          className={`min-w-[160px] max-w-[160px] bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 backdrop-blur-xl border rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition-all active:scale-95 flex-shrink-0 shadow-xl ${
                            isSelected ? "border-red-500 bg-red-950/30 ring-1 ring-red-500/60" : "border-zinc-800/80 hover:border-zinc-700"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center p-1.5 border border-zinc-800/90 flex-shrink-0">
                              {ch.logo ? (
                                <img src={ch.logo} alt="" className="w-full h-full object-contain" />
                              ) : (
                                <Tv className="w-5 h-5 text-red-400" />
                              )}
                            </div>
                            <button onClick={(e) => toggleFavorite(ch.id, e)} className="text-zinc-500 hover:text-red-500 p-1">
                              <Heart className={`w-4 h-4 ${isFav ? "fill-red-600 text-red-600" : ""}`} />
                            </button>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-xs font-black text-white line-clamp-1 tracking-tight">{cleaned}</h4>
                            <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">HD Stream</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-red-400" />
                <h3 className="font-extrabold text-sm text-white">Notifications</h3>
              </div>
              <button onClick={() => setShowNotifications(false)} className="text-zinc-400 hover:text-white bg-zinc-800 p-1.5 rounded-full">
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

            <button onClick={() => setShowNotifications(false)} className="w-full bg-red-600 text-white text-xs font-bold py-3 rounded-2xl shadow-lg">
              Close
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR (SHOWN ONLY WHEN LOGGED IN) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 px-4 py-3 flex justify-around items-center z-40 shadow-2xl">
        <button
          onClick={() => setActiveTab("mwanzo")}
          className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === "mwanzo" ? "text-red-500 font-bold" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="text-[10px]">Mwanzo</span>
        </button>

        <button
          onClick={() => setActiveTab("movies")}
          className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === "movies" ? "text-red-500 font-bold" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>
          <span className="text-[10px]">Movies</span>
        </button>

        <button
          onClick={() => setActiveTab("series")}
          className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === "series" ? "text-red-500 font-bold" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>
          <span className="text-[10px]">Series</span>
        </button>

        <button
          onClick={() => setActiveTab("livetv")}
          className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === "livetv" ? "text-red-500 font-bold" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zM8 15h2v-2H8v2zm3 0h2v-2h-2v2zm3 0h2v-2h-2v2z"/></svg>
          <span className="text-[10px]">Live TV</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === "profile" ? "text-red-500 font-bold" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>

    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { Search, Heart, Tv, Bell, ShieldCheck, Radio, X, Mail, Lock, ArrowRight, LogOut, Settings, Sparkles, CheckCircle2 } from "lucide-react";

interface Channel {
  id: string;
  name: string;
  logo: string;
  category: string;
  url: string;
}

interface CategoryGroup {
  name: string;
  channels: Channel[];
}

const cleanName = (name: string): string => {
  if (!name) return "Live Channel";
  return name.replace(/[\(\[\{].*?[\)\]\}]/g, "").replace(/(360p|720p|1080p|4k|hd|sd)/gi, "").trim();
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

  useEffect(() => {
    const savedUser = localStorage.getItem("techstream_user");
    if (savedUser) setUser(savedUser);

    const savedFavs = localStorage.getItem("techstream_favs");
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch (e) {}
    }

    // Fetch Real M3U Streams Only - No Demo Fallback
    fetch("https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8")
      .then((res) => res.text())
      .then((text) => {
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
        parsed.forEach((ch) => {
          const cat = ch.category || "General";
          if (!catMap[cat]) catMap[cat] = [];
          catMap[cat].push(ch);
        });

        const formattedCats: CategoryGroup[] = Object.keys(catMap).map((catName) => ({
          name: catName,
          channels: catMap[catName],
        }));

        setCategories(formattedCats);
        if (parsed.length > 0) setSelectedChannel(parsed[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setCategories([]);
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
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem("techstream_user");
    setUser(null);
  };

  const toggleFavorite = (chId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated = favorites.includes(chId) ? favorites.filter((id) => id !== chId) : [...favorites, chId];
    setFavorites(updated);
    localStorage.setItem("techstream_favs", JSON.stringify(updated));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center px-6 py-12 relative overflow-hidden font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex w-16 h-16 bg-red-600 rounded-3xl items-center justify-center shadow-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-white to-red-300 bg-clip-text text-transparent">TechStream</h1>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-5">
            <div className="grid grid-cols-2 bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
              <button onClick={() => setIsLoginMode(true)} className={`py-2 text-xs font-bold rounded-xl ${isLoginMode ? "bg-red-600 text-white" : "text-zinc-400"}`}>Ingia</button>
              <button onClick={() => setIsLoginMode(false)} className={`py-2 text-xs font-bold rounded-xl ${!isLoginMode ? "bg-red-600 text-white" : "text-zinc-400"}`}>Tengeneza Akaunti</button>
            </div>

            {authError && <div className="bg-red-950/60 border border-red-600 text-red-400 text-xs p-3 rounded-2xl text-center">{authError}</div>}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Barua Pepe" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-red-500" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Neno la Siri" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-red-500" />
              </div>
              <button type="submit" disabled={authLoading} className="w-full bg-red-600 text-white font-bold text-xs py-4 rounded-2xl shadow-lg flex items-center justify-center space-x-2">
                {authLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <><span>Ingia Sasa</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-36 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center">
            <Tv className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-lg tracking-wider text-white">TECHSTREAM</span>
        </div>
        <button onClick={handleLogout} className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-400">
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tafuta chaneli..." className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-red-500" />
      </div>

      {selectedChannel && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-3 space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-white truncate">{cleanName(selectedChannel.name)}</h2>
            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[9px] px-2 py-0.5 rounded-full flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>LIVE</span>
            </span>
          </div>
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden">
            <video src={selectedChannel.url} controls autoPlay playsInline className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="text-center py-16 text-zinc-500 text-xs font-bold">
          Hakuna chaneli za Live TV zilizopatikana kwa sasa.
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => {
            const filtered = (cat.channels || []).filter((ch) => cleanName(ch.name).toLowerCase().includes(searchQuery.toLowerCase()));
            if (filtered.length === 0) return null;

            return (
              <div key={cat.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center space-x-2">
                    <Radio className="w-3.5 h-3.5 text-red-500" />
                    <span>{cat.name}</span>
                  </h3>
                </div>

                <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
                  {filtered.map((ch) => (
                    <div
                      key={ch.id}
                      onClick={() => setSelectedChannel(ch)}
                      className={`min-w-[150px] max-w-[150px] bg-zinc-900 border rounded-2xl p-3 cursor-pointer transition-all ${
                        selectedChannel?.id === ch.id ? "border-red-500 bg-red-950/20" : "border-zinc-800"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center mb-3">
                        {ch.logo ? <img src={ch.logo} alt="" className="w-full h-full object-contain" /> : <Tv className="w-4 h-4 text-red-400" />}
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{cleanName(ch.name)}</h4>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

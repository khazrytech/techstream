"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  Heart, 
  Tv, 
  Bell, 
  User, 
  ShieldCheck, 
  Flame, 
  Radio, 
  X,
  LogOut,
  Settings,
  Sparkles,
  Smartphone,
  Zap,
  CheckCircle2,
  Lock,
  ChevronRight,
  Database,
  Globe,
  Clock,
  Trash2,
  HelpCircle,
  Activity,
  CreditCard,
  Shield,
  MessageSquare
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Channel, CategoryGroup } from "@/lib/iptv-parser";

interface IPTVViewProps {
  pageType?: "home" | "movies" | "series" | "live-tv";
}

const cleanName = (name: string): string => {
  if (!name) return "TechStream Channel";
  return name
    .replace(/[\(\[\{].*?[\)\]\}]/g, "")
    .replace(/(360p|720p|1080p|4k|hd|sd|24\/7|not 24\/7)/gi, "")
    .trim();
};

export function IPTVView({ pageType = "home" }: IPTVViewProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Mfumo wa VIP / Subscription (Default: False / Akaunti ya Kawaida)
  const [isVip, setIsVip] = useState(false);

  // Kuchagua Lugha (Swahili / English)
  const [language, setLanguage] = useState<"sw" | "en">("sw");

  // Mipangilio ya App
  const [autoPlay, setAutoPlay] = useState(true);
  const [hdQuality, setHdQuality] = useState(false);
  const [dataSaver, setDataSaver] = useState(true);
  const [parentalControl, setParentalControl] = useState(false);
  const [cacheSize, setCacheSize] = useState("45.2 MB");

  const [notifications] = useState([
    { id: 1, title: "Karibu TechStream", desc: "Akaunti yako ipo tayari. Furahia vipindi vya bure au ujiunge na VIP.", time: "Punde", read: false },
    { id: 2, title: "Taarifa ya Mfumo", desc: "Tumeongeza chaneli mpya za michezo na habari.", time: "Saa 1", read: false }
  ]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
    });

    const savedFavs = localStorage.getItem("techstream_favs");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error(e);
      }
    }

    const savedLang = localStorage.getItem("techstream_lang") as "sw" | "en";
    if (savedLang) setLanguage(savedLang);

    fetch("/api/iptv")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleLanguageChange = (lang: "sw" | "en") => {
    setLanguage(lang);
    localStorage.setItem("techstream_lang", lang);
  };

  const clearAppCache = () => {
    setCacheSize("0.0 MB");
    alert(language === "sw" ? "Cache imefutwa kikamilifu!" : "Cache cleared successfully!");
  };

  const processedCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    return categories.map((cat) => {
      let filteredChannels = cat.channels || [];
      const catNameLower = (cat.name || "").toLowerCase();

      if (pageType === "movies") {
        filteredChannels = filteredChannels.filter(
          (c) =>
            (/movie|cinema|film|vod|action|hbo|box/i.test(
              (c.name || "") + " " + (c.group || "")
            ) || /movie|cinema|film/i.test(catNameLower))
        );
      } else if (pageType === "series") {
        filteredChannels = filteredChannels.filter(
          (c) =>
            (/series|serial|drama|season/i.test(
              (c.name || "") + " " + (c.group || "")
            ) || /series|serial/i.test(catNameLower))
        );
      } else if (pageType === "live-tv") {
        filteredChannels = filteredChannels.filter(
          (c) =>
            /live|news|sport|habari|michezo|tbc|bbc|cnn|supersport|tv/i.test(
              (c.name || "") + " " + (c.group || "")
            )
        );
      }

      return {
        ...cat,
        channels: filteredChannels.slice(0, 10),
      };
    }).filter((cat) => cat.channels && cat.channels.length > 0);
  }, [categories, pageType]);

  const flattenedChannels = useMemo(() => {
    return processedCategories.flatMap((cat) => cat.channels);
  }, [processedCategories]);

  useEffect(() => {
    if (flattenedChannels.length > 0 && !selectedChannel) {
      setSelectedChannel(flattenedChannels[0]);
    }
  }, [flattenedChannels, selectedChannel]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-600/40">
            <Flame className="w-6 h-6 text-red-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const heroChannel = selectedChannel || flattenedChannels[0];

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-40 space-y-6 selection:bg-red-600 selection:text-white font-sans">
      
      {/* 1. TOP BAR WITH PROFILE BUTTON */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/40 border border-red-400/30">
              <Tv className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full animate-pulse"></span>
          </div>
          <div>
            <span className="font-black text-lg tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              TECHSTREAM
            </span>
            <p className="text-[10px] text-zinc-500 font-semibold tracking-wider">
              {isVip ? "VIP SUBSCRIBED" : "STANDARD FREE PLAN"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button 
            onClick={() => setShowNotifications(true)}
            className="w-10 h-10 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-95 shadow-md relative"
          >
            <Bell className="w-4.5 h-4.5" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
            )}
          </button>
          
          <button 
            onClick={() => setShowProfile(true)}
            className="flex items-center space-x-2 bg-zinc-900/90 border border-zinc-800/90 pl-1.5 pr-3 py-1.5 rounded-2xl hover:border-red-600/50 transition-all active:scale-95 shadow-lg group"
          >
            <div className="w-7 h-7 bg-gradient-to-tr from-zinc-700 to-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md">
              {userEmail ? userEmail.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <span className="text-xs font-bold text-zinc-300 group-hover:text-white">Profile</span>
          </button>
        </div>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === "sw" ? "Tafuta chaneli au muvi..." : "Search channels or movies..."}
          className="w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/90 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all placeholder:text-zinc-500 shadow-inner"
        />
      </div>

      {/* 3. STICKY VIDEO PLAYER */}
      {heroChannel && (
        <div className="sticky top-2 z-30 bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-3 shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping shadow-lg shadow-red-600/60 flex-shrink-0"></span>
              <h2 className="text-xs font-black text-white truncate tracking-wide">
                {cleanName(heroChannel.name)}
              </h2>
            </div>
            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[9px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>LIVE SD/HD</span>
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

      {/* 4. CATEGORIES */}
      {processedCategories.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 text-zinc-500 text-xs font-bold space-y-2">
          <Tv className="w-8 h-8 mx-auto text-zinc-600" />
          <p>{language === "sw" ? "Hakuna maudhui yaliyopatikana." : "No content found."}</p>
        </div>
      ) : (
        <div className="space-y-6 pt-1">
          {processedCategories.map((cat) => {
            const filteredCatChannels = (cat.channels || []).filter((ch) =>
              cleanName(ch.name || "").toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredCatChannels.length === 0) return null;

            return (
              <div key={cat.name} className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-200 flex items-center space-x-2">
                    <Radio className="w-3.5 h-3.5 text-red-500" />
                    <span>{cat.name}</span>
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-bold bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800 shadow-sm">
                    {filteredCatChannels.length} / 10
                  </span>
                </div>

                <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-3 pt-1 px-0.5">
                  {filteredCatChannels.map((ch) => {
                    const cleanedName = cleanName(ch.name);
                    const isSelected = selectedChannel?.id === ch.id;
                    const isFav = favorites.includes(ch.id);

                    return (
                      <div
                        key={ch.id || Math.random()}
                        onClick={() => setSelectedChannel(ch)}
                        className={`min-w-[160px] max-w-[160px] bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 backdrop-blur-xl border rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition-all active:scale-95 flex-shrink-0 shadow-xl ${
                          isSelected
                            ? "border-red-600 bg-red-950/30 ring-1 ring-red-600/60 shadow-red-600/30"
                            : "border-zinc-800/80 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center p-1.5 border border-zinc-800/90 flex-shrink-0 shadow-inner">
                            {ch.logo ? (
                              <img src={ch.logo} alt={cleanedName} className="w-full h-full object-contain" />
                            ) : (
                              <Tv className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          <button
                            onClick={(e) => toggleFavorite(ch.id, e)}
                            className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                          >
                            <Heart
                              className={`w-4 h-4 ${isFav ? "fill-red-600 text-red-600" : ""}`}
                            />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-white line-clamp-1 tracking-tight">
                            {cleanedName}
                          </h4>
                          <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                            Free Stream
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. ADVANCED PROFILE & SETTINGS MODAL */}
      {showProfile && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800/90 rounded-t-[32px] sm:rounded-[32px] w-full max-w-md max-h-[88vh] overflow-y-auto no-scrollbar p-5 space-y-5 shadow-2xl relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 sticky top-0 bg-zinc-950/90 backdrop-blur-md z-10">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-red-500" />
                <h3 className="font-black text-xs text-white uppercase tracking-wider">
                  {language === "sw" ? "Akaunti na Mipangilio" : "Account & Settings"}
                </h3>
              </div>
              <button 
                onClick={() => setShowProfile(false)}
                className="text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 p-2 rounded-2xl transition-all active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile User Card */}
            <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 p-4 rounded-3xl space-y-3 shadow-xl">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 bg-gradient-to-tr from-zinc-800 to-zinc-700 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md border border-zinc-600 flex-shrink-0">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
                </div>

                <div className="space-y-0.5 overflow-hidden">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      isVip 
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                        : "bg-zinc-800 border-zinc-700 text-zinc-400"
                    }`}>
                      {isVip ? "VIP Active" : (language === "sw" ? "Akaunti ya Kawaida" : "Free Plan")}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-white truncate">{userEmail || "user@example.com"}</h4>
                  <p className="text-[10px] text-zinc-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{language === "sw" ? "Imethibitishwa" : "Verified User"}</span>
                  </p>
                </div>
              </div>

              {/* VIP Subscription CTA */}
              {!isVip ? (
                <div className="bg-gradient-to-r from-red-950/60 to-zinc-900 border border-red-800/50 p-3 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-white flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === "sw" ? "Jiunge na VIP Paket" : "Upgrade to VIP"}</span>
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      {language === "sw" ? "Tazama chaneli zote za 4K bila matangazo" : "Unlock all 4K channels without ads"}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsVip(true)}
                    className="bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-black text-[10px] uppercase px-3 py-2 rounded-xl shadow-lg transition-all active:scale-95 flex-shrink-0"
                  >
                    {language === "sw" ? "Anza VIP" : "Get VIP"}
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-950/40 border border-emerald-800/50 p-2.5 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-emerald-400">
                    {language === "sw" ? "Subscription yako ya VIP ipo Active!" : "Your VIP Subscription is Active!"}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-zinc-900/80 border border-zinc-800/80 p-2.5 rounded-2xl text-center space-y-0.5">
                <p className="text-[9px] text-zinc-500 font-bold uppercase">{language === "sw" ? "Favs" : "Favorites"}</p>
                <p className="text-xs font-black text-white">{favorites.length} TV</p>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800/80 p-2.5 rounded-2xl text-center space-y-0.5">
                <p className="text-[9px] text-zinc-500 font-bold uppercase">Cache</p>
                <p className="text-xs font-black text-amber-400">{cacheSize}</p>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800/80 p-2.5 rounded-2xl text-center space-y-0.5">
                <p className="text-[9px] text-zinc-500 font-bold uppercase">Server</p>
                <p className="text-xs font-black text-emerald-400">Fast HD</p>
              </div>
            </div>

            {/* SECTION 1: LANGUAGE SELECTOR */}
            <div className="space-y-2">
              <h5 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 px-1 flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-red-500" />
                <span>{language === "sw" ? "Lugha ya Mfumo (Language)" : "App Language"}</span>
              </h5>
              <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900/90 border border-zinc-800 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleLanguageChange("sw")}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                    language === "sw" ? "bg-red-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <span>🇹🇿 Kiswahili</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange("en")}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                    language === "en" ? "bg-red-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <span>🇬🇧 English</span>
                </button>
              </div>
            </div>

            {/* SECTION 2: STREAMING & PLAYBACK */}
            <div className="space-y-2">
              <h5 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 px-1">
                {language === "sw" ? "Mfumo wa Uchezaji" : "Playback & Data"}
              </h5>
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl divide-y divide-zinc-800/60">
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Auto-Play</p>
                      <p className="text-[10px] text-zinc-500">
                        {language === "sw" ? "Cheza mara moja ukichagua chaneli" : "Play automatically when selected"}
                      </p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={autoPlay} 
                    onChange={() => setAutoPlay(!autoPlay)}
                    className="accent-red-600 w-4 h-4 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Sparkles className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-xs font-bold text-white">HD / 4K Mode</p>
                      <p className="text-[10px] text-zinc-500">
                        {language === "sw" ? "Tumia ubora wa juu pekee" : "Force high definition streams"}
                      </p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={hdQuality} 
                    onChange={() => setHdQuality(!hdQuality)}
                    className="accent-red-600 w-4 h-4 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Database className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Data Saver</p>
                      <p className="text-[10px] text-zinc-500">
                        {language === "sw" ? "Okoa matumizi ya bando" : "Reduce internet data usage"}
                      </p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={dataSaver} 
                    onChange={() => setDataSaver(!dataSaver)}
                    className="accent-red-600 w-4 h-4 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: SECURITY & PARENTAL CONTROL */}
            <div className="space-y-2">
              <h5 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 px-1">
                {language === "sw" ? "Usalama na Faragha" : "Security & Privacy"}
              </h5>
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl divide-y divide-zinc-800/60">
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Parental Control (PIN)</p>
                      <p className="text-[10px] text-zinc-500">
                        {language === "sw" ? "Funga chaneli za watu wazima" : "Lock adult/restricted channels"}
                      </p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={parentalControl} 
                    onChange={() => setParentalControl(!parentalControl)}
                    className="accent-red-600 w-4 h-4 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: STORAGE & UTILITIES */}
            <div className="space-y-2">
              <h5 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 px-1">
                {language === "sw" ? "Zana na Hifadhi" : "Tools & Storage"}
              </h5>
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <div>
                    <p className="text-xs font-bold text-white">{language === "sw" ? "Futa Cache za App" : "Clear App Cache"}</p>
                    <p className="text-[10px] text-zinc-500">{cacheSize} {language === "sw" ? "zimetumika" : "used"}</p>
                  </div>
                </div>
                <button
                  onClick={clearAppCache}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-zinc-700 active:scale-95 transition-all"
                >
                  {language === "sw" ? "Futa Sasa" : "Clear Now"}
                </button>
              </div>
            </div>

            {/* SECTION 5: SUPPORT & HELP */}
            <div className="space-y-2">
              <h5 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 px-1">
                {language === "sw" ? "Msaada na Usaidizi" : "Support & Help"}
              </h5>
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl divide-y divide-zinc-800/60">
                <button 
                  onClick={() => alert(language === "sw" ? "Wasiliana na Msaada: support@techstream.com" : "Contact Support: support@techstream.com")}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-zinc-900/80 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <HelpCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">{language === "sw" ? "Ripoti Tatizo / Live Chat" : "Report Issue / Support"}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            </div>

            {/* Device & Engine Info */}
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-3 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-zinc-500" />
                <span>Engine: TechStream v2.4</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                Online
              </span>
            </div>

            {/* Modern Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-700 via-red-600 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-2xl shadow-xl shadow-red-600/25 transition-all active:scale-95 flex items-center justify-center space-x-2 border border-red-500/30"
            >
              <LogOut className="w-4 h-4" />
              <span>{language === "sw" ? "TOKA KWENYE AKAUNTI (LOGOUT)" : "LOG OUT ACCOUNT"}</span>
            </button>

          </div>
        </div>
      )}

      {/* 6. NOTIFICATIONS MODAL */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-red-500" />
                <h3 className="font-extrabold text-sm text-white">
                  {language === "sw" ? "Taarifa & Ujumbe" : "Notifications"}
                </h3>
              </div>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-zinc-400 hover:text-white bg-zinc-800 p-1.5 rounded-full"
              >
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

            <button 
              onClick={() => setShowNotifications(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-2xl transition-all shadow-lg shadow-red-600/30"
            >
              {language === "sw" ? "Funga" : "Close"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

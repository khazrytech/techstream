"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Search, Heart, Tv, Bell, User, ShieldCheck, Flame, Radio, X,
  LogOut, Settings, Sparkles, Smartphone, Zap, CheckCircle2, Lock,
  ChevronRight, Database, Globe, Trash2, HelpCircle, CreditCard,
  PhoneCall, Calendar, Maximize2, Volume2, VolumeX, Clock, Play,
  Film, Trophy, Newspaper, Sliders, Check
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Channel, CategoryGroup } from "@/lib/iptv-parser";

interface IPTVViewProps {
  pageType?: "home" | "movies" | "series" | "live-tv";
}

const dict = {
  sw: {
    freePlan: "Akaunti ya Kawaida",
    vipPlan: "VIP Subscribed",
    searchPlaceholder: "Tafuta chaneli, michezo, au muvi...",
    upgradeVip: "Jiunge na VIP Paket",
    upgradeSub: "Tazama chaneli zote za 4K bila matangazo wala kukwama",
    getVip: "Lipia VIP Sasa",
    vipActive: "VIP Package Ipo Active!",
    expires: "Inaisha tarehe",
    favs: "Pendwa",
    cache: "Hifadhi (Cache)",
    server: "Server Status",
    appLanguage: "Lugha ya App (Language)",
    playback: "Mfumo wa Uchezaji & Data",
    autoPlay: "Auto-Play Stream",
    autoPlayDesc: "Cheza mara moja ukichagua chaneli",
    hdMode: "Ubora wa 4K / HD",
    hdModeDesc: "Lazimisha muonekano wa hali ya juu",
    dataSaver: "Okoa Bando (Data Saver)",
    dataSaverDesc: "Punguza matumizi makubwa ya intaneti",
    security: "Usalama na Faragha",
    parental: "Parental Control (PIN)",
    parentalDesc: "Funga chaneli za watu wazima",
    tools: "Zana na Hifadhi",
    clearCache: "Futa Cache ya App",
    used: "zimetumika",
    clearNow: "Futa Sasa",
    support: "Msaada na Huduma kwa Wateja",
    report: "Ripoti Tatizo / Msaada wa Haraka",
    logout: "TOKA KWENYE AKAUNTI (LOGOUT)",
    notifications: "Taarifa na Ujumbe",
    close: "Funga",
    all: "Zote",
    sports: "Michezo",
    news: "Habari",
    movies: "Filamu",
    epgTitle: "RATIBA YA VIPINDI (EPG GUIDE)",
    nowPlaying: "Inayoonyeshwa Sasa",
    nextUp: "Inayofuata",
    payModalTitle: "Chagua Kifurushi cha VIP",
    payModalSub: "Pata chaneli zaidi ya 10,000 za Live TV na Vod Muvi",
    selectPlan: "1. Chagua Kifurushi",
    weekly: "Wiki 1 - TZS 2,000",
    monthly: "Mwezi 1 - TZS 5,000",
    yearly: "Mwaka 1 - TZS 45,000",
    selectPayment: "2. Njia ya Malipo",
    enterPhone: "Namba yako ya Simu ya Malipo",
    payButton: "Kamilisha Malipo",
    processing: "Inakamilisha Malipo...",
    quality: "Ubora",
  },
  en: {
    freePlan: "Standard Free Plan",
    vipPlan: "VIP Subscribed",
    searchPlaceholder: "Search channels, sports, or movies...",
    upgradeVip: "Upgrade to VIP Package",
    upgradeSub: "Unlock all 4K channels with zero ads and no buffering",
    getVip: "Subscribe VIP Now",
    vipActive: "VIP Package Active!",
    expires: "Expires on",
    favs: "Favorites",
    cache: "Cache Storage",
    server: "Server Status",
    appLanguage: "App Language",
    playback: "Playback & Data Settings",
    autoPlay: "Auto-Play Stream",
    autoPlayDesc: "Play automatically when channel is clicked",
    hdMode: "4K / HD Quality Mode",
    hdModeDesc: "Force high definition video playback",
    dataSaver: "Data Saver Mode",
    dataSaverDesc: "Reduce mobile data consumption",
    security: "Security & Privacy",
    parental: "Parental Control (PIN)",
    parentalDesc: "Lock adult or restricted channels",
    tools: "Tools & Storage",
    clearCache: "Clear App Cache",
    used: "used",
    clearNow: "Clear Now",
    support: "Support & Customer Service",
    report: "Report Issue / Live Chat",
    logout: "LOG OUT ACCOUNT",
    notifications: "Notifications",
    close: "Close",
    all: "All",
    sports: "Sports",
    news: "News",
    movies: "Movies",
    epgTitle: "PROGRAMME GUIDE (EPG)",
    nowPlaying: "Now Playing",
    nextUp: "Next Up",
    payModalTitle: "Select VIP Plan",
    payModalSub: "Get access to 10,000+ Live TV channels & VOD Movies",
    selectPlan: "1. Choose Package Plan",
    weekly: "1 Week - TZS 2,000",
    monthly: "1 Month - TZS 5,000",
    yearly: "1 Year - TZS 45,000",
    selectPayment: "2. Payment Method",
    enterPhone: "Payment Mobile Number",
    payButton: "Complete Payment",
    processing: "Processing Payment...",
    quality: "Quality",
  }
};

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [isVip, setIsVip] = useState(false);
  const [vipExpiryDate, setVipExpiryDate] = useState<string | null>(null);
  
  const [selectedPlan, setSelectedPlan] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [paymentProvider, setPaymentProvider] = useState<"mpesa" | "tigopesa" | "airtel" | "card">("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [language, setLanguage] = useState<"sw" | "en">("sw");
  const t = dict[language];

  const [autoPlay, setAutoPlay] = useState(true);
  const [hdQuality, setHdQuality] = useState(false);
  const [dataSaver, setDataSaver] = useState(true);
  const [parentalControl, setParentalControl] = useState(false);
  const [cacheSize, setCacheSize] = useState("48.6 MB");
  const [videoQuality, setVideoQuality] = useState<"Auto" | "1080p HD" | "4K Ultra">("Auto");
  const [isMuted, setIsMuted] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState<"all" | "sports" | "news" | "movies">("all");

  const [notifications] = useState([
    { id: 1, title: "Karibu TechStream", desc: "Akaunti yako ipo tayari. Tumia Standard Free Plan au ujiunge na VIP kwa uzoefu bora zaidi.", time: "Punde", read: false },
    { id: 2, title: "Taarifa ya Mfumo", desc: "Server ya Live TV imeboreshwa. Hakuna kukwama!", time: "Saa 1", read: false }
  ]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
    });

    const savedFavs = localStorage.getItem("techstream_favs");
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch (e) { console.error(e); }
    }

    const savedLang = localStorage.getItem("techstream_lang") as "sw" | "en";
    if (savedLang) setLanguage(savedLang);

    const savedVipStatus = localStorage.getItem("techstream_is_vip");
    if (savedVipStatus === "true") {
      setIsVip(true);
      setVipExpiryDate(localStorage.getItem("techstream_vip_expiry"));
    }

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

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber && paymentProvider !== "card") {
      alert(language === "sw" ? "Tafadhali weka namba ya simu ya malipo!" : "Please enter your payment mobile number!");
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsVip(true);
      
      const expiry = new Date();
      if (selectedPlan === "weekly") expiry.setDate(expiry.getDate() + 7);
      if (selectedPlan === "monthly") expiry.setMonth(expiry.getMonth() + 1);
      if (selectedPlan === "yearly") expiry.setFullYear(expiry.getFullYear() + 1);
      
      const expiryString = expiry.toLocaleDateString();
      setVipExpiryDate(expiryString);

      localStorage.setItem("techstream_is_vip", "true");
      localStorage.setItem("techstream_vip_expiry", expiryString);

      setShowPaymentModal(false);
      alert(language === "sw" ? `Hongera! Malipo yamekamilika. VIP Package yako ipo Active hadi ${expiryString}` : `Success! VIP Subscription Activated until ${expiryString}`);
    }, 2000);
  };

  const clearAppCache = () => {
    setCacheSize("0.0 MB");
    alert(language === "sw" ? "Cache imefutwa kikamilifu!" : "Cache cleared successfully!");
  };

  const processedCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    return categories.map((cat) => {
      let filteredChannels = cat.channels || [];

      if (activeTabFilter === "sports") {
        filteredChannels = filteredChannels.filter((c) => /sport|michezo|supersport|ball|arena/i.test((c.name || "") + " " + (c.group || "")));
      } else if (activeTabFilter === "news") {
        filteredChannels = filteredChannels.filter((c) => /news|habari|tbc|bbc|cnn|al jazeera/i.test((c.name || "") + " " + (c.group || "")));
      } else if (activeTabFilter === "movies") {
        filteredChannels = filteredChannels.filter((c) => /movie|cinema|film|vod|action|hbo/i.test((c.name || "") + " " + (c.group || "")));
      }

      if (pageType === "movies") {
        filteredChannels = filteredChannels.filter((c) => /movie|cinema|film|vod|action/i.test((c.name || "") + " " + (c.group || "")));
      } else if (pageType === "series") {
        filteredChannels = filteredChannels.filter((c) => /series|serial|drama|season/i.test((c.name || "") + " " + (c.group || "")));
      }

      return {
        ...cat,
        channels: filteredChannels.slice(0, 12),
      };
    }).filter((cat) => cat.channels && cat.channels.length > 0);
  }, [categories, pageType, activeTabFilter]);

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
    <div className="min-h-screen bg-black text-white p-4 pb-40 space-y-5 selection:bg-red-600 selection:text-white font-sans">
      
      {/* HEADER */}
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
            <div className="flex items-center space-x-1.5">
              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.2 rounded-full border ${
                isVip ? "bg-amber-500/10 border-amber-500/50 text-amber-400" : "bg-zinc-800 border-zinc-700 text-zinc-400"
              }`}>
                {isVip ? t.vipPlan : t.freePlan}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={() => handleLanguageChange(language === "sw" ? "en" : "sw")} className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-[10px] px-2.5 py-2 rounded-2xl flex items-center space-x-1 shadow-md">
            <Globe className="w-3.5 h-3.5 text-red-500" />
            <span>{language === "sw" ? "🇹🇿 SW" : "🇬🇧 EN"}</span>
          </button>

          <button onClick={() => setShowNotifications(true)} className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white shadow-md relative">
            <Bell className="w-4.5 h-4.5" />
            {notifications.some(n => !n.read) && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-600 rounded-full animate-ping"></span>}
          </button>
          
          <button onClick={() => setShowProfile(true)} className="flex items-center space-x-1.5 bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl shadow-lg">
            <div className="w-7 h-7 bg-gradient-to-tr from-zinc-700 to-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md">
              {userEmail ? userEmail.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
          </button>
        </div>
      </div>

      {!isVip && (
        <div className="bg-gradient-to-r from-red-950 via-zinc-900 to-zinc-950 border border-red-800/60 p-3.5 rounded-3xl shadow-2xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">{t.upgradeVip}</h3>
            </div>
            <p className="text-[10px] text-zinc-400 max-w-[220px] line-clamp-1">{t.upgradeSub}</p>
          </div>
          <button onClick={() => setShowPaymentModal(true)} className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-[11px] uppercase px-3.5 py-2.5 rounded-2xl shadow-lg flex-shrink-0 border border-red-400/30">
            {t.getVip}
          </button>
        </div>
      )}

      {/* SEARCH & FILTERS */}
      <div className="space-y-3">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-red-600 shadow-inner" />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
          <button onClick={() => setActiveTabFilter("all")} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 ${activeTabFilter === "all" ? "bg-red-600 text-white shadow-lg" : "bg-zinc-900 border border-zinc-800 text-zinc-400"}`}>
            <Sliders className="w-3.5 h-3.5" />
            <span>{t.all}</span>
          </button>
          <button onClick={() => setActiveTabFilter("sports")} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 ${activeTabFilter === "sports" ? "bg-red-600 text-white shadow-lg" : "bg-zinc-900 border border-zinc-800 text-zinc-400"}`}>
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.sports}</span>
          </button>
          <button onClick={() => setActiveTabFilter("news")} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 ${activeTabFilter === "news" ? "bg-red-600 text-white shadow-lg" : "bg-zinc-900 border border-zinc-800 text-zinc-400"}`}>
            <Newspaper className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.news}</span>
          </button>
          <button onClick={() => setActiveTabFilter("movies")} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 ${activeTabFilter === "movies" ? "bg-red-600 text-white shadow-lg" : "bg-zinc-900 border border-zinc-800 text-zinc-400"}`}>
            <Film className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.movies}</span>
          </button>
        </div>
      </div>

      {/* VIDEO PLAYER */}
      {heroChannel && (
        <div className="sticky top-2 z-30 bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-3 shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping flex-shrink-0"></span>
              <h2 className="text-xs font-black text-white truncate tracking-wide">{cleanName(heroChannel.name)}</h2>
            </div>
            <div className="flex items-center space-x-2">
              <select value={videoQuality} onChange={(e) => setVideoQuality(e.target.value as any)} className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-bold px-2 py-1 rounded-xl outline-none">
                <option value="Auto">Auto Quality</option>
                <option value="1080p HD">1080p HD</option>
                <option value="4K Ultra">4K Ultra HD</option>
              </select>
              <button onClick={() => setIsMuted(!isMuted)} className="bg-zinc-900 border border-zinc-800 text-zinc-300 p-1.5 rounded-xl">
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            </div>
          </div>

          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative border border-zinc-800/80 shadow-inner">
            <video src={heroChannel.url} controls autoPlay={autoPlay} muted={isMuted} playsInline className="w-full h-full object-contain" />
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-2.5 flex items-center justify-between text-[11px]">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-red-500" />
              <div>
                <span className="text-[9px] text-zinc-500 uppercase font-black block">{t.nowPlaying}</span>
                <span className="font-bold text-zinc-200">Taarifa ya Habari / Live Sports</span>
              </div>
            </div>
            <span className="bg-red-950 border border-red-800 text-red-400 font-black text-[9px] px-2 py-0.5 rounded-full">LIVE EPG</span>
          </div>
        </div>
      )}

      {/* CATEGORIES */}
      {processedCategories.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 text-zinc-500 text-xs font-bold space-y-2">
          <Tv className="w-8 h-8 mx-auto text-zinc-600" />
          <p>{language === "sw" ? "Hakuna chaneli iliyopatikana." : "No channels found."}</p>
        </div>
      ) : (
        <div className="space-y-6 pt-1">
          {processedCategories.map((cat) => {
            const filteredCatChannels = (cat.channels || []).filter((ch) => cleanName(ch.name || "").toLowerCase().includes(searchQuery.toLowerCase()));
            if (filteredCatChannels.length === 0) return null;

            return (
              <div key={cat.name} className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-200 flex items-center space-x-2">
                    <Radio className="w-3.5 h-3.5 text-red-500" />
                    <span>{cat.name}</span>
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-bold bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">{filteredCatChannels.length} TV</span>
                </div>

                <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-3 pt-1 px-0.5">
                  {filteredCatChannels.map((ch) => {
                    const cleanedName = cleanName(ch.name);
                    const isSelected = selectedChannel?.id === ch.id;
                    const isFav = favorites.includes(ch.id);

                    return (
                      <div key={ch.id || Math.random()} onClick={() => setSelectedChannel(ch)} className={`min-w-[160px] max-w-[160px] bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 border rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition-all active:scale-95 flex-shrink-0 shadow-xl ${isSelected ? "border-red-600 bg-red-950/30 ring-1 ring-red-600/60" : "border-zinc-800/80"}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center p-1.5 border border-zinc-800/90 flex-shrink-0">
                            {ch.logo ? <img src={ch.logo} alt={cleanedName} className="w-full h-full object-contain" /> : <Tv className="w-5 h-5 text-red-500" />}
                          </div>
                          <button onClick={(e) => toggleFavorite(ch.id, e)} className="text-zinc-500 hover:text-red-500 p-1">
                            <Heart className={`w-4 h-4 ${isFav ? "fill-red-600 text-red-600" : ""}`} />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-white line-clamp-1 tracking-tight">{cleanedName}</h4>
                          <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">{isVip ? "4K Stream" : "SD/HD Stream"}</span>
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

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-t-[32px] sm:rounded-[32px] w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar p-5 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 sticky top-0 bg-zinc-950 z-10">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-xs text-white uppercase tracking-wider">{t.payModalTitle}</h3>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl"><X className="w-4 h-4" /></button>
            </div>

            <p className="text-xs text-zinc-400">{t.payModalSub}</p>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400">{t.selectPlan}</label>
                <div className="grid grid-cols-1 gap-2">
                  <div onClick={() => setSelectedPlan("weekly")} className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${selectedPlan === "weekly" ? "border-amber-500 bg-amber-950/20" : "border-zinc-800 bg-zinc-900/60"}`}>
                    <div><p className="text-xs font-bold text-white">{t.weekly}</p><p className="text-[10px] text-zinc-500">Siku 7 za VIP</p></div>
                    {selectedPlan === "weekly" && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div onClick={() => setSelectedPlan("monthly")} className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${selectedPlan === "monthly" ? "border-amber-500 bg-amber-950/20" : "border-zinc-800 bg-zinc-900/60"}`}>
                    <div><p className="text-xs font-bold text-white">{t.monthly}</p><p className="text-[10px] text-amber-400 font-semibold">Inapendekezwa</p></div>
                    {selectedPlan === "monthly" && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div onClick={() => setSelectedPlan("yearly")} className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${selectedPlan === "yearly" ? "border-amber-500 bg-amber-950/20" : "border-zinc-800 bg-zinc-900/60"}`}>
                    <div><p className="text-xs font-bold text-white">{t.yearly}</p><p className="text-[10px] text-emerald-400">Okoa 30% Off</p></div>
                    {selectedPlan === "yearly" && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400">{t.selectPayment}</label>
                <div className="grid grid-cols-4 gap-2">
                  <button type="button" onClick={() => setPaymentProvider("mpesa")} className={`p-2 rounded-xl border text-[10px] font-bold ${paymentProvider === "mpesa" ? "border-red-600 bg-red-950/40 text-white" : "border-zinc-800 bg-zinc-900 text-zinc-400"}`}>M-Pesa</button>
                  <button type="button" onClick={() => setPaymentProvider("tigopesa")} className={`p-2 rounded-xl border text-[10px] font-bold ${paymentProvider === "tigopesa" ? "border-blue-600 bg-blue-950/40 text-white" : "border-zinc-800 bg-zinc-900 text-zinc-400"}`}>TigoPesa</button>
                  <button type="button" onClick={() => setPaymentProvider("airtel")} className={`p-2 rounded-xl border text-[10px] font-bold ${paymentProvider === "airtel" ? "border-rose-600 bg-rose-950/40 text-white" : "border-zinc-800 bg-zinc-900 text-zinc-400"}`}>Airtel</button>
                  <button type="button" onClick={() => setPaymentProvider("card")} className={`p-2 rounded-xl border text-[10px] font-bold ${paymentProvider === "card" ? "border-emerald-600 bg-emerald-950/40 text-white" : "border-zinc-800 bg-zinc-900 text-zinc-400"}`}>Card</button>
                </div>
              </div>

              {paymentProvider !== "card" && (
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold">{t.enterPhone}</label>
                  <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="0712 345 678" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-amber-500" />
                </div>
              )}

              <button type="submit" disabled={isProcessingPayment} className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-black font-black text-xs uppercase py-3.5 rounded-2xl shadow-xl flex items-center justify-center space-x-2">
                {isProcessingPayment ? <span>{t.processing}</span> : <><ShieldCheck className="w-4 h-4" /><span>{t.payButton}</span></>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {showProfile && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-t-[32px] sm:rounded-[32px] w-full max-w-md max-h-[88vh] overflow-y-auto no-scrollbar p-5 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 sticky top-0 bg-zinc-950 z-10">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-red-500" />
                <h3 className="font-black text-xs text-white uppercase tracking-wider">{language === "sw" ? "Akaunti na Mipangilio" : "Account & Settings"}</h3>
              </div>
              <button onClick={() => setShowProfile(false)} className="text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl"><X className="w-4 h-4" /></button>
            </div>

            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-4 rounded-3xl space-y-3 shadow-xl">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 bg-gradient-to-tr from-zinc-800 to-zinc-700 rounded-2xl flex items-center justify-center text-white font-black text-lg border border-zinc-600 flex-shrink-0">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${isVip ? "bg-amber-500/10 border-amber-500/40 text-amber-400" : "bg-zinc-800 border-zinc-700 text-zinc-400"}`}>{isVip ? t.vipPlan : t.freePlan}</span>
                  <h4 className="font-bold text-xs text-white truncate">{userEmail || "user@example.com"}</h4>
                  {isVip && <p className="text-[10px] text-amber-400 font-semibold flex items-center space-x-1"><Calendar className="w-3 h-3" /><span>{t.expires}: {vipExpiryDate || "30/10/2026"}</span></p>}
                </div>
              </div>

              {!isVip ? (
                <button onClick={() => { setShowProfile(false); setShowPaymentModal(true); }} className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-[11px] uppercase py-2.5 rounded-xl shadow-lg">{t.getVip}</button>
              ) : (
                <div className="bg-emerald-950/40 border border-emerald-800/50 p-2 rounded-xl text-center"><p className="text-[10px] font-bold text-emerald-400">{t.vipActive}</p></div>
              )}
            </div>

            <div className="space-y-2">
              <h5 className="text-[10px] font-black uppercase text-zinc-400 px-1">{t.appLanguage}</h5>
              <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-bold">
                <button type="button" onClick={() => handleLanguageChange("sw")} className={`py-2 rounded-xl ${language === "sw" ? "bg-red-600 text-white" : "text-zinc-500"}`}>🇹🇿 Kiswahili</button>
                <button type="button" onClick={() => handleLanguageChange("en")} className={`py-2 rounded-xl ${language === "en" ? "bg-red-600 text-white" : "text-zinc-500"}`}>🇬🇧 English</button>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-[10px] font-black uppercase text-zinc-400 px-1">{t.playback}</h5>
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl divide-y divide-zinc-800/60">
                <div className="p-3 flex items-center justify-between">
                  <div><p className="text-xs font-bold text-white">{t.autoPlay}</p><p className="text-[10px] text-zinc-500">{t.autoPlayDesc}</p></div>
                  <input type="checkbox" checked={autoPlay} onChange={() => setAutoPlay(!autoPlay)} className="accent-red-600 w-4 h-4 cursor-pointer" />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div><p className="text-xs font-bold text-white">{t.hdMode}</p><p className="text-[10px] text-zinc-500">{t.hdModeDesc}</p></div>
                  <input type="checkbox" checked={hdQuality} onChange={() => setHdQuality(!hdQuality)} className="accent-red-600 w-4 h-4 cursor-pointer" />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div><p className="text-xs font-bold text-white">{t.dataSaver}</p><p className="text-[10px] text-zinc-500">{t.dataSaverDesc}</p></div>
                  <input type="checkbox" checked={dataSaver} onChange={() => setDataSaver(!dataSaver)} className="accent-red-600 w-4 h-4 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-[10px] font-black uppercase text-zinc-400 px-1">{t.tools}</h5>
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-3 flex items-center justify-between">
                <div><p className="text-xs font-bold text-white">{t.clearCache}</p><p className="text-[10px] text-zinc-500">{cacheSize} {t.used}</p></div>
                <button onClick={clearAppCache} className="bg-zinc-800 text-zinc-200 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-zinc-700">{t.clearNow}</button>
              </div>
            </div>

            <button onClick={handleLogout} className="w-full bg-gradient-to-r from-red-700 via-red-600 to-rose-600 text-white font-black text-xs uppercase py-3.5 rounded-2xl shadow-xl flex items-center justify-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS MODAL */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-red-500" />
                <h3 className="font-extrabold text-sm text-white">{t.notifications}</h3>
              </div>
              <button onClick={() => setShowNotifications(false)} className="text-zinc-400 hover:text-white bg-zinc-800 p-1.5 rounded-full"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
              {notifications.map((n) => (
                <div key={n.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3 space-y-1">
                  <div className="flex items-center justify-between"><h4 className="text-xs font-bold text-white">{n.title}</h4><span className="text-[9px] text-zinc-500">{n.time}</span></div>
                  <p className="text-[11px] text-zinc-400">{n.desc}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setShowNotifications(false)} className="w-full bg-red-600 text-white text-xs font-bold py-3 rounded-2xl">{t.close}</button>
          </div>
        </div>
      )}

    </div>
  );
}

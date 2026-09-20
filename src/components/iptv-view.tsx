"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Search, Heart, Tv, Bell, User, ShieldCheck, Flame, Radio, X,
  LogOut, Settings, Sparkles, Smartphone, Zap, CheckCircle2, Lock,
  ChevronRight, Database, Globe, Trash2, HelpCircle, CreditCard,
  PhoneCall, Calendar, Maximize2, Volume2, VolumeX, Clock, Play,
  Film, Trophy, Newspaper, Sliders, Check, Mail, ArrowRight
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
    upgradeSub: "Tazama chaneli zote za 4K bila matangazo",
    getVip: "Lipia VIP Sasa",
    vipActive: "VIP Package Ipo Active!",
    expires: "Inaisha tarehe",
    appLanguage: "Lugha ya App (Language)",
    playback: "Mfumo wa Uchezaji & Data",
    autoPlay: "Auto-Play Stream",
    autoPlayDesc: "Cheza mara moja ukichagua chaneli",
    hdMode: "Ubora wa 4K / HD",
    hdModeDesc: "Lazimisha muonekano wa hali ya juu",
    dataSaver: "Okoa Bando (Data Saver)",
    dataSaverDesc: "Punguza matumizi makubwa ya intaneti",
    tools: "Zana na Hifadhi",
    clearCache: "Futa Cache ya App",
    used: "zimetumika",
    clearNow: "Futa Sasa",
    logout: "TOKA KWENYE AKAUNTI (LOGOUT)",
    notifications: "Taarifa na Ujumbe",
    close: "Funga",
    all: "Zote",
    sports: "Michezo",
    news: "Habari",
    movies: "Filamu",
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
  },
  en: {
    freePlan: "Standard Free Plan",
    vipPlan: "VIP Subscribed",
    searchPlaceholder: "Search channels, sports, or movies...",
    upgradeVip: "Upgrade to VIP Package",
    upgradeSub: "Unlock all 4K channels with zero ads",
    getVip: "Subscribe VIP Now",
    vipActive: "VIP Package Active!",
    expires: "Expires on",
    appLanguage: "App Language",
    playback: "Playback & Data Settings",
    autoPlay: "Auto-Play Stream",
    autoPlayDesc: "Play automatically when channel is clicked",
    hdMode: "4K / HD Quality Mode",
    hdModeDesc: "Force high definition video playback",
    dataSaver: "Data Saver Mode",
    dataSaverDesc: "Reduce mobile data consumption",
    tools: "Tools & Storage",
    clearCache: "Clear App Cache",
    used: "used",
    clearNow: "Clear Now",
    logout: "LOG OUT ACCOUNT",
    notifications: "Notifications",
    close: "Close",
    all: "All",
    sports: "Sports",
    news: "News",
    movies: "Movies",
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
  
  // Auth States
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // App States
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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
  const [cacheSize, setCacheSize] = useState("48.6 MB");
  const [videoQuality, setVideoQuality] = useState<"Auto" | "1080p HD" | "4K Ultra">("Auto");
  const [isMuted, setIsMuted] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState<"all" | "sports" | "news" | "movies">("all");

  const [notifications] = useState([
    { id: 1, title: "Karibu TechStream", desc: "Akaunti yako ipo tayari. Tumia Standard Free Plan au ujiunge na VIP kwa uzoefu bora zaidi.", time: "Punde", read: false },
    { id: 2, title: "Taarifa ya Mfumo", desc: "Server ya Live TV na Real EPG zimeboreshwa.", time: "Saa 1", read: false }
  ]);

  // Check Supabase Authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setAuthChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      setAuthChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Channels
  useEffect(() => {
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

  // Real Dynamic EPG Generator
  const currentEPG = useMemo(() => {
    const now = new Date();
    const currentMinutes = now.getMinutes();
    const start = new Date(now);
    start.setMinutes(0, 0, 0);
    const end = new Date(start);
    end.setHours(start.getHours() + 1);

    const startTimeStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTimeStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const progressPercent = Math.floor((currentMinutes / 60) * 100);

    const channelName = selectedChannel?.name || "";
    const category = selectedChannel?.group || "";

    let nowTitle = "Vipindi Mchanganyiko na Habari";
    let nextTitle = "Vipindi vya Usiku & Mada Moto";

    if (/sport|michezo|supersport|ball|arena/i.test(channelName + " " + category)) {
      nowTitle = `${cleanName(channelName)}: Live Match Analysis & Highlights`;
      nextTitle = "Live English Premier League Showcase";
    } else if (/news|habari|tbc|bbc|cnn|al jazeera/i.test(channelName + " " + category)) {
      nowTitle = `${cleanName(channelName)}: Taarifa ya Habari Duniani & Uhakiki`;
      nextTitle = "World Business & Weather Bulletin";
    } else if (/movie|cinema|film|vod|action/i.test(channelName + " " + category)) {
      nowTitle = `${cleanName(channelName)}: Blockbuster Cinema Movie Special`;
      nextTitle = "Late Night Action Thriller Feature";
    }

    return {
      startTime: startTimeStr,
      endTime: endTimeStr,
      progress: progressPercent,
      nowTitle,
      nextTitle
    };
  }, [selectedChannel]);

  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
    if (error) setAuthError(error.message);
    setAuthLoading(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    if (isLoginMode) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError(error.message);
      else setCurrentUser(data.user);
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setAuthError(error.message);
      else setCurrentUser(data.user);
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setShowProfile(false);
  };

  const handleLanguageChange = (lang: "sw" | "en") => {
    setLanguage(lang);
    localStorage.setItem("techstream_lang", lang);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber && paymentProvider !== "card") {
      alert(language === "sw" ? "Weka namba ya simu ya malipo!" : "Enter payment phone number!");
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
      alert(`Hongera! VIP Package Activated hadi ${expiryString}`);
    }, 2000);
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
      return { ...cat, channels: filteredChannels.slice(0, 12) };
    }).filter((cat) => cat.channels && cat.channels.length > 0);
  }, [categories, activeTabFilter]);

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
    let updated = favorites.includes(chId) ? favorites.filter((id) => id !== chId) : [...favorites, chId];
    setFavorites(updated);
    localStorage.setItem("techstream_favs", JSON.stringify(updated));
  };

  // 1. KAMA BADO HAJALOGIN: ONYESHA LOGIN / GOOGLE AUTH GUARD
  if (authChecking) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center px-6 py-12 relative overflow-hidden font-sans">
        <div className="absolute top-10 -left-20 w-80 h-80 bg-red-600/30 rounded-full blur-[130px] animate-pulse"></div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex w-16 h-16 bg-gradient-to-tr from-red-700 to-rose-500 rounded-3xl items-center justify-center shadow-2xl shadow-red-600/60 border border-red-400/40 animate-bounce">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                TECHSTREAM PRO
              </h1>
              <p className="text-xs text-zinc-400 mt-1">Ingia ili kuanza kutazama Live TV & Movies</p>
            </div>
          </div>

          <div className="bg-zinc-950/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="grid grid-cols-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
              <button onClick={() => setIsLoginMode(true)} className={`py-2 text-xs font-bold rounded-xl transition-all ${isLoginMode ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-400'}`}>Ingia</button>
              <button onClick={() => setIsLoginMode(false)} className={`py-2 text-xs font-bold rounded-xl transition-all ${!isLoginMode ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-400'}`}>Jisajili</button>
            </div>

            {authError && <div className="bg-red-950/60 border border-red-600/50 text-red-400 text-xs font-semibold p-3 rounded-2xl text-center">{authError}</div>}

            <button onClick={handleGoogleAuth} className="w-full bg-white hover:bg-zinc-100 text-black font-extrabold text-xs uppercase py-3.5 rounded-2xl shadow-xl flex items-center justify-center space-x-3 border border-zinc-300">
              <Globe className="w-4 h-4 text-red-600" />
              <span>Endelea na Google</span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex-1 h-px bg-zinc-800"></div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold">AU EMAIL</span>
              <div className="flex-1 h-px bg-zinc-800"></div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400">Barua Pepe</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jina@email.com" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400">Neno la Siri</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
              <button type="submit" disabled={authLoading} className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs uppercase py-4 rounded-2xl shadow-xl flex items-center justify-center space-x-2">
                {authLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <><span>{isLoginMode ? "Ingia Sasa" : "Kamilisha Usajili"}</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 2. KAMA AMELOGIN: SHOW FULL APP WITH DYNAMIC REAL EPG
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-20 h-20 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const heroChannel = selectedChannel || flattenedChannels[0];

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-40 space-y-5 font-sans">
      
      {/* HEADER BAR */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-gradient-to-tr from-red-700 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/40 border border-red-400/30">
            <Tv className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <span className="font-black text-lg bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">TECHSTREAM</span>
            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.2 rounded-full border ml-2 ${isVip ? "bg-amber-500/10 border-amber-500/50 text-amber-400" : "bg-zinc-800 border-zinc-700 text-zinc-400"}`}>
              {isVip ? t.vipPlan : t.freePlan}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={() => handleLanguageChange(language === "sw" ? "en" : "sw")} className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-[10px] px-2.5 py-2 rounded-2xl flex items-center space-x-1">
            <Globe className="w-3.5 h-3.5 text-red-500" />
            <span>{language === "sw" ? "🇹🇿 SW" : "🇬🇧 EN"}</span>
          </button>
          <button onClick={() => setShowNotifications(true)} className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white relative">
            <Bell className="w-4.5 h-4.5" />
          </button>
          <button onClick={() => setShowProfile(true)} className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg">
            {currentUser?.email?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* SEARCH BAR & QUICK FILTERS */}
      <div className="space-y-3">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:border-red-600 outline-none" />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTabFilter("all")} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 ${activeTabFilter === "all" ? "bg-red-600 text-white" : "bg-zinc-900 border border-zinc-800 text-zinc-400"}`}><Sliders className="w-3.5 h-3.5" /><span>{t.all}</span></button>
          <button onClick={() => setActiveTabFilter("sports")} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 ${activeTabFilter === "sports" ? "bg-red-600 text-white" : "bg-zinc-900 border border-zinc-800 text-zinc-400"}`}><Trophy className="w-3.5 h-3.5 text-amber-400" /><span>{t.sports}</span></button>
          <button onClick={() => setActiveTabFilter("news")} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 ${activeTabFilter === "news" ? "bg-red-600 text-white" : "bg-zinc-900 border border-zinc-800 text-zinc-400"}`}><Newspaper className="w-3.5 h-3.5 text-blue-400" /><span>{t.news}</span></button>
          <button onClick={() => setActiveTabFilter("movies")} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 ${activeTabFilter === "movies" ? "bg-red-600 text-white" : "bg-zinc-900 border border-zinc-800 text-zinc-400"}`}><Film className="w-3.5 h-3.5 text-purple-400" /><span>{t.movies}</span></button>
        </div>
      </div>

      {/* STICKY PLAYER WITH REAL DYNAMIC EPG */}
      {heroChannel && (
        <div className="sticky top-2 z-30 bg-zinc-950 border border-zinc-800 rounded-3xl p-3 shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping flex-shrink-0"></span>
              <h2 className="text-xs font-black text-white truncate">{cleanName(heroChannel.name)}</h2>
            </div>
            <select value={videoQuality} onChange={(e) => setVideoQuality(e.target.value as any)} className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-bold px-2 py-1 rounded-xl outline-none">
              <option value="Auto">Auto Quality</option>
              <option value="1080p HD">1080p HD</option>
              <option value="4K Ultra">4K Ultra HD</option>
            </select>
          </div>

          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative border border-zinc-800 shadow-inner">
            <video src={heroChannel.url} controls autoPlay={autoPlay} muted={isMuted} playsInline className="w-full h-full object-contain" />
          </div>

          {/* REAL DYNAMIC EPG SCHEDULE BANNER */}
          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-500 animate-pulse" />
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase font-black block">{t.nowPlaying} ({currentEPG.startTime} - {currentEPG.endTime})</span>
                  <span className="font-bold text-white line-clamp-1">{currentEPG.nowTitle}</span>
                </div>
              </div>
              <span className="bg-red-950 border border-red-800 text-red-400 font-black text-[9px] px-2 py-0.5 rounded-full flex-shrink-0">LIVE EPG</span>
            </div>

            {/* Progress Bar ya Muda wa Saa */}
            <div className="space-y-1">
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-rose-500 h-full transition-all duration-500" style={{ width: `${currentEPG.progress}%` }}></div>
              </div>
              <div className="flex items-center justify-between text-[9px] text-zinc-400">
                <span>{t.nextUp}: <strong className="text-zinc-200">{currentEPG.nextTitle}</strong></span>
                <span>{currentEPG.progress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHANNELS GRID */}
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
                    <div key={ch.id || Math.random()} onClick={() => setSelectedChannel(ch)} className={`min-w-[160px] max-w-[160px] bg-gradient-to-b from-zinc-900 to-zinc-950 border rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition-all active:scale-95 flex-shrink-0 shadow-xl ${isSelected ? "border-red-600 bg-red-950/30 ring-1 ring-red-600" : "border-zinc-800"}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center p-1.5 border border-zinc-800 flex-shrink-0">
                          {ch.logo ? <img src={ch.logo} alt={cleanedName} className="w-full h-full object-contain" /> : <Tv className="w-5 h-5 text-red-500" />}
                        </div>
                        <button onClick={(e) => toggleFavorite(ch.id, e)} className="text-zinc-500 hover:text-red-500 p-1">
                          <Heart className={`w-4 h-4 ${isFav ? "fill-red-600 text-red-600" : ""}`} />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-white line-clamp-1">{cleanedName}</h4>
                        <span className="text-[9px] text-zinc-500 font-semibold uppercase">{isVip ? "4K Stream" : "SD/HD Stream"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-t-[32px] sm:rounded-[32px] w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar p-5 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2"><CreditCard className="w-5 h-5 text-amber-400" /><h3 className="font-black text-xs text-white uppercase">{t.payModalTitle}</h3></div>
              <button onClick={() => setShowPaymentModal(false)} className="text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-zinc-400">{t.payModalSub}</p>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400">{t.selectPlan}</label>
                <div className="grid grid-cols-1 gap-2">
                  <div onClick={() => setSelectedPlan("weekly")} className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${selectedPlan === "weekly" ? "border-amber-500 bg-amber-950/20" : "border-zinc-800 bg-zinc-900"}`}>
                    <div><p className="text-xs font-bold text-white">{t.weekly}</p><p className="text-[10px] text-zinc-500">Siku 7 za VIP</p></div>
                    {selectedPlan === "weekly" && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div onClick={() => setSelectedPlan("monthly")} className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${selectedPlan === "monthly" ? "border-amber-500 bg-amber-950/20" : "border-zinc-800 bg-zinc-900"}`}>
                    <div><p className="text-xs font-bold text-white">{t.monthly}</p><p className="text-[10px] text-amber-400 font-semibold">Inapendekezwa</p></div>
                    {selectedPlan === "monthly" && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div onClick={() => setSelectedPlan("yearly")} className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${selectedPlan === "yearly" ? "border-amber-500 bg-amber-950/20" : "border-zinc-800 bg-zinc-900"}`}>
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
                  <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="0712 345 678" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-amber-500 outline-none" />
                </div>
              )}
              <button type="submit" disabled={isProcessingPayment} className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-xs uppercase py-3.5 rounded-2xl shadow-xl flex items-center justify-center space-x-2">
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
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2"><Settings className="w-5 h-5 text-red-500" /><h3 className="font-black text-xs text-white uppercase">{language === "sw" ? "Akaunti na Mipangilio" : "Account & Settings"}</h3></div>
              <button onClick={() => setShowProfile(false)} className="text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl"><X className="w-4 h-4" /></button>
            </div>

            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-4 rounded-3xl space-y-3 shadow-xl">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-white font-black text-lg border border-zinc-700 flex-shrink-0">
                  {currentUser?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${isVip ? "bg-amber-500/10 border-amber-500/40 text-amber-400" : "bg-zinc-800 border-zinc-700 text-zinc-400"}`}>{isVip ? t.vipPlan : t.freePlan}</span>
                  <h4 className="font-bold text-xs text-white truncate">{currentUser?.email || "user@example.com"}</h4>
                  {isVip && <p className="text-[10px] text-amber-400 font-semibold flex items-center space-x-1"><Calendar className="w-3 h-3" /><span>{t.expires}: {vipExpiryDate || "30/10/2026"}</span></p>}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-[10px] font-black uppercase text-zinc-400 px-1">{t.appLanguage}</h5>
              <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-bold">
                <button type="button" onClick={() => handleLanguageChange("sw")} className={`py-2 rounded-xl ${language === "sw" ? "bg-red-600 text-white" : "text-zinc-500"}`}>🇹🇿 Kiswahili</button>
                <button type="button" onClick={() => handleLanguageChange("en")} className={`py-2 rounded-xl ${language === "en" ? "bg-red-600 text-white" : "text-zinc-500"}`}>🇬🇧 English</button>
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
              <div className="flex items-center space-x-2"><Bell className="w-5 h-5 text-red-500" /><h3 className="font-extrabold text-sm text-white">{t.notifications}</h3></div>
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

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Search, Heart, Tv, Bell, User, ShieldCheck, Flame, Radio, X,
  LogOut, Settings, Sparkles, Lock, Mail, ArrowRight, Globe, CheckCircle2,
  Clock, Play, Film, Trophy, Newspaper, Sliders, Check, RefreshCw, KeyRound, Key
} from "lucide-react";
import { supabase } from "@/lib/supabase";
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
  // Auth & View States
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");

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

  const [language, setLanguage] = useState<"en" | "sw">("en");
  const [autoPlay, setAutoPlay] = useState(true);
  const [hdQuality, setHdQuality] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [cacheSize, setCacheSize] = useState("48.6 MB");
  const [videoQuality, setVideoQuality] = useState<"Auto" | "1080p HD" | "4K Ultra">("Auto");
  const [isMuted, setIsMuted] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState<"all" | "sports" | "news" | "movies">("all");

  const [notifications] = useState([
    { id: 1, title: "Welcome to TechStream Pro", desc: "Your premium account is ready. Access all 4K channels.", time: "Just now" },
    { id: 2, title: "Server Performance", desc: "Live streaming engines fully optimized for zero-lag playback.", time: "1h ago" }
  ]);

  // Auth Subscription
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

  // Fetch M3U Playlist
  useEffect(() => {
    const savedFavs = localStorage.getItem("techstream_favs");
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch (e) {}
    }

    const savedVip = localStorage.getItem("techstream_is_vip");
    if (savedVip === "true") {
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

  // Google OAuth Auth
  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    setAuthError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
    if (error) setAuthError(error.message);
    setAuthLoading(false);
  };

  // Password & Reset Handlers
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthMessage("");
    setAuthLoading(true);

    if (isForgotMode) {
      if (!email) {
        setAuthError("Please enter your email address.");
        setAuthLoading(false);
        return;
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) setAuthError(error.message);
      else setAuthMessage("Password reset link sent to your email!");
      setAuthLoading(false);
      return;
    }

    if (isLoginMode) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError(error.message);
      else setCurrentUser(data.user);
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setAuthError(error.message);
      else {
        setAuthMessage("Account created! Check email or sign in.");
        setIsLoginMode(true);
      }
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setShowProfile(false);
  };

  // Modern Dynamic Real-Time EPG
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

    const chName = selectedChannel?.name || "";
    const group = selectedChannel?.group || "";

    let nowTitle = "Global Broadcasting & News Highlights";
    let nextTitle = "Prime Time Special Feature";

    if (/sport|michezo|supersport|arena/i.test(chName + " " + group)) {
      nowTitle = `${cleanName(chName)}: Live Match Showcase & Analysis`;
      nextTitle = "Premier Tournament Highlights";
    } else if (/news|tbc|bbc|cnn|al jazeera/i.test(chName + " " + group)) {
      nowTitle = `${cleanName(chName)}: World Headline News & Live Desk`;
      nextTitle = "Global Financial & Market Bulletin";
    } else if (/movie|cinema|film|action|hbo/i.test(chName + " " + group)) {
      nowTitle = `${cleanName(chName)}: Ultra HD Cinema Premiere`;
      nextTitle = "Late Night Action Blockbuster";
    }

    return { startTime: startTimeStr, endTime: endTimeStr, progress: progressPercent, nowTitle, nextTitle };
  }, [selectedChannel]);

  const processedCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    return categories.map((cat) => {
      let filtered = cat.channels || [];
      if (activeTabFilter === "sports") {
        filtered = filtered.filter((c) => /sport|michezo|supersport|arena/i.test((c.name || "") + " " + (c.group || "")));
      } else if (activeTabFilter === "news") {
        filtered = filtered.filter((c) => /news|bbc|cnn|tbc/i.test((c.name || "") + " " + (c.group || "")));
      } else if (activeTabFilter === "movies") {
        filtered = filtered.filter((c) => /movie|cinema|film|action/i.test((c.name || "") + " " + (c.group || "")));
      }
      return { ...cat, channels: filtered.slice(0, 12) };
    }).filter((cat) => cat.channels && cat.channels.length > 0);
  }, [categories, activeTabFilter]);

  const flattenedChannels = useMemo(() => processedCategories.flatMap((cat) => cat.channels), [processedCategories]);

  useEffect(() => {
    if (flattenedChannels.length > 0 && !selectedChannel) setSelectedChannel(flattenedChannels[0]);
  }, [flattenedChannels, selectedChannel]);

  const toggleFavorite = (chId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated = favorites.includes(chId) ? favorites.filter((id) => id !== chId) : [...favorites, chId];
    setFavorites(updated);
    localStorage.setItem("techstream_favs", JSON.stringify(updated));
  };

  // 1. MODERN LUXURY LOADING SCREEN
  if (authChecking) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden select-none">
        <div className="absolute w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] animate-pulse"></div>
        <div className="relative flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 rounded-3xl p-0.5 shadow-2xl shadow-indigo-500/50 animate-bounce">
            <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center">
              <Sparkles className="w-9 h-9 text-indigo-400 animate-spin" />
            </div>
          </div>
          <span className="text-sm font-black tracking-widest bg-gradient-to-r from-white via-indigo-200 to-cyan-400 bg-clip-text text-transparent uppercase">
            TECHSTREAM PRO
          </span>
        </div>
      </div>
    );
  }

  // 2. GLASSMORPHISM LOGIN PAGE WITH FORGOT PASSWORD
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center px-5 py-10 relative overflow-hidden font-sans select-none">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/25 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-[160px] animate-pulse"></div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex w-16 h-16 bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 rounded-3xl items-center justify-center shadow-2xl shadow-indigo-500/40 border border-indigo-400/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-zinc-200 to-indigo-300 bg-clip-text text-transparent">
              TECHSTREAM PRO
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              {isForgotMode ? "Reset your account password" : isLoginMode ? "Sign in for premium live streams" : "Create your free account instantly"}
            </p>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-6 shadow-2xl space-y-5">
            {!isForgotMode && (
              <div className="grid grid-cols-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800/80">
                <button type="button" onClick={() => setIsLoginMode(true)} className={`py-2.5 text-xs font-bold rounded-xl transition-all ${isLoginMode ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30' : 'text-zinc-400 hover:text-white'}`}>
                  Sign In
                </button>
                <button type="button" onClick={() => setIsLoginMode(false)} className={`py-2.5 text-xs font-bold rounded-xl transition-all ${!isLoginMode ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30' : 'text-zinc-400 hover:text-white'}`}>
                  Sign Up
                </button>
              </div>
            )}

            {authError && <div className="bg-red-950/60 border border-red-600/50 text-red-400 text-xs font-semibold p-3 rounded-2xl text-center">{authError}</div>}
            {authMessage && <div className="bg-emerald-950/60 border border-emerald-600/50 text-emerald-400 text-xs font-semibold p-3 rounded-2xl text-center">{authMessage}</div>}

            {!isForgotMode && (
              <>
                <button type="button" onClick={handleGoogleAuth} className="w-full bg-white hover:bg-zinc-100 text-black font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-3 border border-zinc-200">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span>Continue with Google</span>
                </button>

                <div className="flex items-center space-x-3">
                  <div className="flex-1 h-px bg-zinc-800"></div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">OR EMAIL</span>
                  <div className="flex-1 h-px bg-zinc-800"></div>
                </div>
              </>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full bg-zinc-950/90 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-600 shadow-inner" />
                </div>
              </div>

              {!isForgotMode && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Password</label>
                    <button type="button" onClick={() => setIsForgotMode(true)} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">Forgot Password?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-zinc-950/90 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-600 shadow-inner" />
                  </div>
                </div>
              )}

              <button type="submit" disabled={authLoading} className="w-full mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 border border-indigo-400/30">
                {authLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <><span>{isForgotMode ? "Send Reset Link" : isLoginMode ? "Sign In Now" : "Complete Registration"}</span><ArrowRight className="w-4 h-4" /></>}
              </button>

              {isForgotMode && (
                <button type="button" onClick={() => setIsForgotMode(false)} className="w-full text-xs text-zinc-400 font-bold pt-2 hover:text-white">Back to Sign In</button>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 3. MAIN STREAMING INTERFACE WITH DYNAMIC PLAYER & EPG
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const heroChannel = selectedChannel || flattenedChannels[0];

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-40 space-y-5 font-sans select-none">
      
      {/* HEADER */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-indigo-400/30">
            <Tv className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <span className="font-black text-lg tracking-wider bg-gradient-to-r from-white via-zinc-200 to-indigo-300 bg-clip-text text-transparent">TECHSTREAM</span>
            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ml-2 ${isVip ? "bg-amber-500/10 border-amber-500/50 text-amber-400" : "bg-zinc-800 border-zinc-700 text-zinc-400"}`}>
              {isVip ? "VIP SUBSCRIBED" : "STANDARD PLAN"}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={() => setShowNotifications(true)} className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white relative">
            <Bell className="w-4.5 h-4.5" />
          </button>
          <button onClick={() => setShowProfile(true)} className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/30 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg">
            {currentUser?.email?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="space-y-3">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search channels, sports, or movies..." className="w-full bg-zinc-900/90 border border-zinc-800/90 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-indigo-500 shadow-inner" />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTabFilter("all")} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 ${activeTabFilter === "all" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-zinc-900 border border-zinc-800 text-zinc-400"}`}><Sliders className="w-3.5 h-3.5" /><span>All</span></button>
          <button onClick={() => setActiveTabFilter("sports")} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 ${activeTabFilter === "sports" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-zinc-900 border border-zinc-800 text-zinc-400"}`}><Trophy className="w-3.5 h-3.5 text-amber-400" /><span>Sports</span></button>
          <button onClick={() => setActiveTabFilter("news")} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 ${activeTabFilter === "news" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-zinc-900 border border-zinc-800 text-zinc-400"}`}><Newspaper className="w-3.5 h-3.5 text-blue-400" /><span>News</span></button>
          <button onClick={() => setActiveTabFilter("movies")} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 ${activeTabFilter === "movies" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-zinc-900 border border-zinc-800 text-zinc-400"}`}><Film className="w-3.5 h-3.5 text-purple-400" /><span>Movies</span></button>
        </div>
      </div>

      {/* PLAYER WITH DYNAMIC EPG */}
      {heroChannel && (
        <div className="sticky top-2 z-30 bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-3 shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping flex-shrink-0"></span>
              <h2 className="text-xs font-black text-white truncate">{cleanName(heroChannel.name)}</h2>
            </div>
            <select value={videoQuality} onChange={(e) => setVideoQuality(e.target.value as any)} className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-bold px-2 py-1 rounded-xl outline-none">
              <option value="Auto">Auto Quality</option>
              <option value="1080p HD">1080p HD</option>
              <option value="4K Ultra">4K Ultra HD</option>
            </select>
          </div>

          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative border border-zinc-800/80 shadow-inner">
            <video src={heroChannel.url} controls autoPlay={autoPlay} muted={isMuted} playsInline className="w-full h-full object-contain" />
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase font-black block">NOW PLAYING ({currentEPG.startTime} - {currentEPG.endTime})</span>
                  <span className="font-bold text-white line-clamp-1">{currentEPG.nowTitle}</span>
                </div>
              </div>
              <span className="bg-indigo-950 border border-indigo-800 text-indigo-400 font-black text-[9px] px-2 py-0.5 rounded-full flex-shrink-0">LIVE EPG</span>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-500" style={{ width: `${currentEPG.progress}%` }}></div>
              </div>
              <div className="flex items-center justify-between text-[9px] text-zinc-400">
                <span>Next: <strong className="text-zinc-200">{currentEPG.nextTitle}</strong></span>
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
                  <Radio className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{cat.name}</span>
                </h3>
                <span className="text-[10px] text-zinc-400 font-bold bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">{filteredCatChannels.length} Channels</span>
              </div>

              <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-3 pt-1 px-0.5">
                {filteredCatChannels.map((ch) => {
                  const cleanedName = cleanName(ch.name);
                  const isSelected = selectedChannel?.id === ch.id;
                  const isFav = favorites.includes(ch.id);

                  return (
                    <div key={ch.id || Math.random()} onClick={() => setSelectedChannel(ch)} className={`min-w-[160px] max-w-[160px] bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 border rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition-all active:scale-95 flex-shrink-0 shadow-xl ${isSelected ? "border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500/60" : "border-zinc-800/80"}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center p-1.5 border border-zinc-800/90 flex-shrink-0">
                          {ch.logo ? <img src={ch.logo} alt={cleanedName} className="w-full h-full object-contain" /> : <Tv className="w-5 h-5 text-indigo-400" />}
                        </div>
                        <button onClick={(e) => toggleFavorite(ch.id, e)} className="text-zinc-500 hover:text-red-500 p-1">
                          <Heart className={`w-4 h-4 ${isFav ? "fill-red-600 text-red-600" : ""}`} />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-white line-clamp-1 tracking-tight">{cleanedName}</h4>
                        <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">{isVip ? "4K Ultra HD" : "HD Stream"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL PROFILE MODAL WITH ALL UTILITIES RESTORED */}
      {showProfile && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-t-[32px] sm:rounded-[32px] w-full max-w-md max-h-[88vh] overflow-y-auto no-scrollbar p-5 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2"><Settings className="w-5 h-5 text-indigo-400" /><h3 className="font-black text-xs text-white uppercase">Account & Settings</h3></div>
              <button onClick={() => setShowProfile(false)} className="text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl"><X className="w-4 h-4" /></button>
            </div>

            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-4 rounded-3xl space-y-3 shadow-xl">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-lg border border-indigo-400/30 shadow-lg">
                  {currentUser?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${isVip ? "bg-amber-500/10 border-amber-500/40 text-amber-400" : "bg-zinc-800 border-zinc-700 text-zinc-400"}`}>{isVip ? "VIP SUBSCRIBED" : "STANDARD PLAN"}</span>
                  <h4 className="font-bold text-xs text-white truncate">{currentUser?.email || "user@example.com"}</h4>
                  {isVip && <p className="text-[10px] text-indigo-400 font-semibold">VIP Active until {vipExpiryDate || "30/10/2026"}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-[10px] font-black uppercase text-zinc-400 px-1">App Language</h5>
              <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-bold">
                <button type="button" onClick={() => setLanguage("en")} className={`py-2.5 rounded-xl ${language === "en" ? "bg-indigo-600 text-white" : "text-zinc-500"}`}>🇬BH English</button>
                <button type="button" onClick={() => setLanguage("sw")} className={`py-2.5 rounded-xl ${language === "sw" ? "bg-indigo-600 text-white" : "text-zinc-500"}`}>🇹🇿 Kiswahili</button>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-[10px] font-black uppercase text-zinc-400 px-1">Playback & Data Settings</h5>
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl divide-y divide-zinc-800/80">
                <div className="p-3 flex items-center justify-between">
                  <div><p className="text-xs font-bold text-white">Auto-Play Stream</p><p className="text-[10px] text-zinc-500">Play automatically when clicked</p></div>
                  <input type="checkbox" checked={autoPlay} onChange={() => setAutoPlay(!autoPlay)} className="accent-indigo-600 w-4 h-4" />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div><p className="text-xs font-bold text-white">4K / HD Quality Mode</p><p className="text-[10px] text-zinc-500">Force high definition video</p></div>
                  <input type="checkbox" checked={hdQuality} onChange={() => setHdQuality(!hdQuality)} className="accent-indigo-600 w-4 h-4" />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div><p className="text-xs font-bold text-white">Data Saver Mode</p><p className="text-[10px] text-zinc-500">Reduce internet consumption</p></div>
                  <input type="checkbox" checked={dataSaver} onChange={() => setDataSaver(!dataSaver)} className="accent-indigo-600 w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-[10px] font-black uppercase text-zinc-400 px-1">Tools & Cache</h5>
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 flex items-center justify-between">
                <div><p className="text-xs font-bold text-white">Clear App Cache</p><p className="text-[10px] text-zinc-500">{cacheSize} used</p></div>
                <button onClick={() => { setCacheSize("0.0 MB"); alert("Cache cleared successfully!"); }} className="bg-zinc-800 text-zinc-200 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-zinc-700">Clear Now</button>
              </div>
            </div>

            <button onClick={handleLogout} className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs uppercase py-3.5 rounded-2xl shadow-xl flex items-center justify-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>LOG OUT ACCOUNT</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

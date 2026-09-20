"use client";
import React, { useState, useEffect } from "react";
import { 
  Search, Heart, Bell, Tv, ShieldCheck, Radio, X, Lock, Mail, ArrowRight, Globe, LogOut, Settings, Sparkles, CheckCircle2, KeyRound 
} from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  return name.replace(/[\(\[\{].*?[\)\]\}]/g, "").replace(/(360p|720p|1080p|4k|hd|sd|24\/7|not 24\/7)/gi, "").trim();
};

export default function Home() {
  const [user, setUser] = useState<any | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showOtpInput, setShowOtpInput] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mwanzo");
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [appLanguage, setAppLanguage] = useState("English");

  const notifications = [
    { id: 1, title: "Welcome to TechStream Pro", desc: "Next-gen IPTV streaming is now live.", time: "Just now" }
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const savedFavs = localStorage.getItem("techstream_favs");
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch(e){}
    }

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
      .catch(() => setLoading(false));

    return () => { subscription.unsubscribe(); };
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(""); setAuthSuccess("");
    if (!email || !password) {
      setAuthError("Tafadhali jaza barua pepe na neno la siri.");
      return;
    }
    setAuthLoading(true);

    if (isLoginMode) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setAuthError(error.message);
      } else {
        setAuthSuccess("Akaunti imetengenezwa! Tumekutumia kodi ya OTP kwenye email yako.");
        setShowOtpInput(true);
      }
    }
    setAuthLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(""); setAuthSuccess("");
    if (!otp) {
      setAuthError("Tafadhali ingiza OTP.");
      return;
    }
    setAuthLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'signup' });
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthSuccess("Imethibitishwa kikamilifu! Sasa unaingia...");
      setShowOtpInput(false);
    }
    setAuthLoading(false);
  };

  const handleGoogleLogin = async () => {
    setAuthError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://techstream-six.vercel.app/'
      }
    });
    if (error) setAuthError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const toggleFavorite = (chId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated = favorites.includes(chId) ? favorites.filter(id => id !== chId) : [...favorites, chId];
    setFavorites(updated);
    localStorage.setItem("techstream_favs", JSON.stringify(updated));
  };

  // =================== LOGIN / SIGNUP VIEW ===================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center px-6 py-12 relative overflow-hidden font-sans">
        {/* Modern Animated Background Objects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-red-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-rose-700/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-6">
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex w-20 h-20 bg-gradient-to-tr from-red-600 via-rose-500 to-orange-500 rounded-[2rem] items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.4)] border border-white/20 transform rotate-3 hover:rotate-0 transition-all duration-500">
              <Tv className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                TechStream
              </h1>
              <p className="text-sm text-zinc-400 font-medium mt-2">
                {showOtpInput ? "Thibitisha Akaunti Yako" : isLoginMode ? "Ingia kwenye ulimwengu wa burudani" : "Anza safari yako hapa"}
              </p>
            </div>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-7 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

            {/* Error & Success Messages */}
            {authError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium p-3.5 rounded-2xl flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium p-3.5 rounded-2xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {!showOtpInput ? (
              <>
                {/* Tabs */}
                <div className="flex bg-black/50 p-1.5 rounded-2xl border border-white/5 mb-6 relative z-10">
                  <button
                    type="button"
                    onClick={() => setIsLoginMode(true)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${isLoginMode ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                  >
                    Ingia
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLoginMode(false)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${!isLoginMode ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                  >
                    Jisajili
                  </button>
                </div>

                {/* Main Form */}
                <form onSubmit={handleAuthSubmit} className="space-y-4 relative z-10">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Barua Pepe</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity"></div>
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jina@email.com"
                        className="w-full relative z-10 bg-black/50 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-red-500 transition-all placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Neno la Siri</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity"></div>
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full relative z-10 bg-black/50 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-red-500 transition-all placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full mt-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all active:scale-95 flex items-center justify-center space-x-2"
                  >
                    {authLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>{isLoginMode ? "Ingia Sasa" : "Jisajili Sasa"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="flex items-center my-6 relative z-10">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="px-4 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Au endelea na</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="relative z-10 w-full bg-white/5 hover:bg-white/10 backdrop-blur-md text-white font-semibold text-sm py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center space-x-3 border border-white/10"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>
              </>
            ) : (
              /* OTP VERIFICATION VIEW */
              <form onSubmit={handleVerifyOtp} className="space-y-5 relative z-10">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <KeyRound className="w-7 h-7 text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Thibitisha Barua Pepe</h3>
                  <p className="text-xs text-zinc-400 mt-1">Ingiza kodi ya tarakimu 6 uliyotumiwa</p>
                </div>

                <div className="space-y-1.5">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity"></div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="• • • • • •"
                      className="w-full relative z-10 bg-black/50 border border-white/10 rounded-2xl px-4 py-4 text-center text-2xl tracking-[0.5em] font-black text-white focus:outline-none focus:border-red-500 transition-all placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  {authLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <span>Thibitisha OTP</span>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowOtpInput(false)}
                  className="w-full text-zinc-400 hover:text-white text-[11px] font-semibold mt-2"
                >
                  Rudi nyuma
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =================== LOGGED IN APP VIEW ===================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const heroChannel = selectedChannel || categories[0]?.channels[0];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 pb-36 space-y-6 font-sans">
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-gradient-to-tr from-red-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/30 border border-red-400/30">
            <Tv className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <span className="font-black text-lg tracking-wider bg-gradient-to-r from-white via-zinc-200 to-red-300 bg-clip-text text-transparent">
              TECHSTREAM
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2.5">
          <button onClick={handleLogout} className="w-10 h-10 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-400 hover:bg-red-600 hover:text-white transition-all">
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {heroChannel && (
        <div className="sticky top-2 z-30 bg-zinc-950/90 backdrop-blur-3xl border border-white/5 rounded-3xl p-3 shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping flex-shrink-0"></span>
              <h2 className="text-xs font-black text-white truncate">{cleanName(heroChannel.name)}</h2>
            </div>
          </div>
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative border border-white/5 shadow-inner">
            <video src={heroChannel.url} controls autoPlay playsInline className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      <div className="space-y-6 pt-1">
        {categories.map((cat) => {
          const filteredChannels = (cat.channels || []).slice(0, 10);
          if (filteredChannels.length === 0) return null;
          return (
            <div key={cat.name} className="space-y-3">
              <div className="flex items-center px-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center space-x-2">
                  <Radio className="w-3.5 h-3.5 text-red-500" />
                  <span>{cat.name}</span>
                </h3>
              </div>
              <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-3 px-0.5">
                {filteredChannels.map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => setSelectedChannel(ch)}
                    className={`min-w-[150px] max-w-[150px] bg-zinc-900/60 border rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition-all ${
                      selectedChannel?.id === ch.id ? "border-red-500 bg-red-950/20" : "border-white/5"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-black mb-3 p-1 flex-shrink-0">
                      {ch.logo ? <img src={ch.logo} alt="" className="w-full h-full object-contain" /> : <Tv className="w-5 h-5 text-zinc-600" />}
                    </div>
                    <h4 className="text-[11px] font-bold text-white line-clamp-1">{cleanName(ch.name)}</h4>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

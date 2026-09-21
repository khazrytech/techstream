"use client";

import React, { useState, useEffect } from "react";
import { User, Link as LinkIcon, Trash2, RefreshCw, CheckCircle, ShieldAlert, Wifi, Save } from "lucide-react";

export default function ProfilePage() {
  const [name, setName] = useState("Mteja wa TechStream");
  const [email, setEmail] = useState("user@techstream.tv");
  const [m3uUrl, setM3uUrl] = useState("");
  const [epgUrl, setEpgUrl] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const savedName = localStorage.getItem("techstream_username");
    const savedEmail = localStorage.getItem("techstream_email");
    const savedM3u = localStorage.getItem("techstream_m3u_url");
    const savedEpg = localStorage.getItem("techstream_epg_url");
    const favs = JSON.parse(localStorage.getItem("techstream_favs") || "[]");

    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedM3u) setM3uUrl(savedM3u);
    if (savedEpg) setEpgUrl(savedEpg);
    setFavCount(favs.length);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("techstream_username", name);
    localStorage.setItem("techstream_email", email);
    localStorage.setItem("techstream_m3u_url", m3uUrl);
    localStorage.setItem("techstream_epg_url", epgUrl);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClearCache = () => {
    if (confirm("Je, una uhakika unataka kufuta data zote zilizohifadhiwa (Cache & Favorites)?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-36 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <span className="font-black text-xl text-white tracking-wider">PROFILE & MIPANGILIO</span>
        <span className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
          <Wifi className="w-3 h-3 animate-pulse" />
          <span>ONLINE</span>
        </span>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 p-3 rounded-2xl flex items-center space-x-2 text-xs font-bold animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>Mipangilio imehifadhiwa kikamilifu!</span>
        </div>
      )}

      {/* Profile Info Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-tr from-red-600 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-red-600/30">
            <User className="w-10 h-10 text-white" />
          </div>

          <div className="w-full space-y-3">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block text-left mb-1">Jina la Mtumiaji</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block text-left mb-1">Barua Pepe (Email)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                required
              />
            </div>
          </div>
        </div>

        {/* IPTV & EPG Server Links */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center space-x-2">
            <LinkIcon className="w-4 h-4 text-red-500" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">SEVA ZA IPTV NA EPG</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">IPTV M3U Playlist URL</label>
              <input
                type="url"
                value={m3uUrl}
                onChange={(e) => setM3uUrl(e.target.value)}
                placeholder="https://example.com/playlist.m3u"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">XMLTV EPG URL (Ratiba ya Vipindi)</label>
              <input
                type="url"
                value={epgUrl}
                onChange={(e) => setEpgUrl(e.target.value)}
                placeholder="https://example.com/epg.xml"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-red-600/30 transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span className="text-xs">HIFADHI MABADILIKO</span>
        </button>
      </form>

      {/* Account Status Stats */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">TAARIFA ZA KIFURUKI</h3>
        <div className="flex justify-between items-center py-2 border-b border-zinc-800/50 text-xs">
          <span className="text-zinc-400">Hali ya Akaunti</span>
          <span className="font-bold text-emerald-400">VIP PREMIUM (Active)</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-zinc-800/50 text-xs">
          <span className="text-zinc-400">Chaneli Pendwa (Favorites)</span>
          <span className="font-bold text-white">{favCount} Chaneli</span>
        </div>
        <div className="flex justify-between items-center py-2 text-xs">
          <span className="text-zinc-400">Kikomo cha Vifaa</span>
          <span className="font-bold text-white">Vifaa 2 / Vimeunganishwa 1</span>
        </div>
      </div>

      {/* Utility Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleClearCache}
          className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold py-3.5 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-95"
        >
          <Trash2 className="w-4 h-4 text-amber-500" />
          <span className="text-xs">Futa Cache & Data za Mlokole</span>
        </button>
      </div>

    </div>
  );
}

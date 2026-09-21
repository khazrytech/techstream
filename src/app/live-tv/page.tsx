"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import VideoPlayer from "@/components/player/VideoPlayer";
import EPGGuide from "@/components/epg/EPGGuide";
import { IPTVChannel, EPGProgram } from "@/types/techstream";
import { Radio, Play } from "lucide-react";

export default function LiveTvPage() {
  const [channels, setChannels] = useState<IPTVChannel[]>([]);
  const [activeChannel, setActiveChannel] = useState<IPTVChannel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/channels");
        const data = await res.json();
        if (data.success && data.channels.length > 0) {
          setChannels(data.channels);
          setActiveChannel(data.channels[0]);
        }
      } catch {
        // Error handling
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const dummyEPG: EPGProgram[] = [
    { id: "1", title: "TechStream Sports Live", startTime: "20:00", endTime: "22:00", isLive: true, description: "Mechi ya moja kwa moja" },
    { id: "2", title: "Habari za Saa Tisa", startTime: "22:00", endTime: "22:30", isLive: false, description: "Taarifa kuu za habari" },
    { id: "3", title: "Usiku wa Sinema", startTime: "22:30", endTime: "00:30", isLive: false, description: "Filamu kali za kiswahili" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <Header />

      <main className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-5 h-5 text-red-600 animate-pulse" />
          <h2 className="text-xl font-black text-white tracking-wide">LIVE TV STREAMING</h2>
        </div>

        {loading ? (
          <p className="text-center text-xs text-zinc-500 py-10">Inapakia Live TV...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PLAYER SECTION */}
            <div className="lg:col-span-2 space-y-4">
              {activeChannel ? (
                <div className="bg-zinc-950 p-2 sm:p-4 rounded-2xl border border-zinc-800">
                  <VideoPlayer
                    streamUrl={activeChannel.streamUrl}
                    channelName={activeChannel.name}
                    userPlan="STANDARD"
                  />
                  <div className="mt-3 px-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{activeChannel.name}</h3>
                      <p className="text-xs text-zinc-400">{activeChannel.category} • {activeChannel.quality}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 bg-zinc-900 rounded-2xl flex items-center justify-center text-xs text-zinc-500">
                  Chagua Chaneli Kuangalia
                </div>
              )}

              {/* EPG GUIDE */}
              {activeChannel && <EPGGuide channelName={activeChannel.name} programs={dummyEPG} />}
            </div>

            {/* CHANNEL GRID */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-zinc-400 uppercase tracking-wider">Orodha ya Chaneli</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[600px] overflow-y-auto no-scrollbar">
                {channels.map((ch) => {
                  const isActive = activeChannel?.id === ch.id;
                  return (
                    <div
                      key={ch.id}
                      onClick={() => setActiveChannel(ch)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        isActive
                          ? "bg-red-950/40 border-red-600 text-white"
                          : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center p-1 border border-zinc-800">
                          {ch.logoUrl ? (
                            <img src={ch.logoUrl} alt={ch.name} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <Radio className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold line-clamp-1">{ch.name}</p>
                          <p className="text-[10px] opacity-70">{ch.category}</p>
                        </div>
                      </div>
                      <Play className={`w-4 h-4 ${isActive ? "text-red-500 fill-red-500" : "opacity-40"}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

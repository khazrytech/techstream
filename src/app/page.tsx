"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryPills from "@/components/ui/CategoryPills";
import ChannelCarousel from "@/components/home/ChannelCarousel";
import BottomNav from "@/components/layout/BottomNav";
import SearchDrawer from "@/components/search/SearchDrawer";
import VideoPlayer from "@/components/player/VideoPlayer";
import ReportModal from "@/components/modals/ReportModal";
import { IPTVChannel } from "@/types/techstream";

const CATEGORIES = ["Zote", "Sports", "News", "Movies", "Entertainment", "Kids"];

export default function HomePage() {
  const [channels, setChannels] = useState<IPTVChannel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Zote");
  const [selectedChannel, setSelectedChannel] = useState<IPTVChannel | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [reportChannel, setReportChannel] = useState<IPTVChannel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChannels() {
      try {
        const res = await fetch("/api/channels");
        const data = await res.json();
        if (data.success) {
          setChannels(data.channels);
        }
      } catch {
        // Fallback or error handling
      } finally {
        setLoading(false);
      }
    }
    fetchChannels();
  }, []);

  const filteredChannels = selectedCategory === "Zote"
    ? channels
    : channels.filter((ch) => ch.category.toLowerCase() === selectedCategory.toLowerCase());

  const featuredChannel = channels[0];
  const sportsChannels = channels.filter((ch) => ch.category.toLowerCase() === "sports");
  const newsChannels = channels.filter((ch) => ch.category.toLowerCase() === "news");

  return (
    <div className="min-h-screen bg-black text-white pb-24 selection:bg-red-600">
      <Header onSearchClick={() => setIsSearchOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 pt-4">
        {/* PLAYER OVERLAY WHEN CHANNEL IS SELECTED */}
        {selectedChannel && (
          <div className="mb-6 bg-zinc-950 p-2 sm:p-4 rounded-2xl border border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                Inarusha Sasa: {selectedChannel.name}
              </span>
              <button
                onClick={() => setSelectedChannel(null)}
                className="text-xs text-zinc-400 hover:text-white font-semibold bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800"
              >
                Funga Player
              </button>
            </div>
            <VideoPlayer
              streamUrl={selectedChannel.streamUrl}
              channelName={selectedChannel.name}
              userPlan="STANDARD"
              onReportIssue={() => setReportChannel(selectedChannel)}
            />
          </div>
        )}

        {/* HERO BANNER */}
        {!selectedChannel && featuredChannel && (
          <HeroBanner channel={featuredChannel} onPlayClick={(ch) => setSelectedChannel(ch)} />
        )}

        {/* CATEGORY PILLS */}
        <CategoryPills
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {loading ? (
          <div className="py-12 text-center text-xs text-zinc-500">Inapakia chaneli za TechStream...</div>
        ) : (
          <>
            {selectedCategory === "Zote" ? (
              <>
                <ChannelCarousel
                  title="⚽ Michezo LIVE (Sports Hub)"
                  channels={sportsChannels}
                  onSelectChannel={(ch) => setSelectedChannel(ch)}
                />
                <ChannelCarousel
                  title="📰 Habari & Duniani"
                  channels={newsChannels}
                  onSelectChannel={(ch) => setSelectedChannel(ch)}
                />
                <ChannelCarousel
                  title="📺 Chaneli Zote"
                  channels={channels}
                  onSelectChannel={(ch) => setSelectedChannel(ch)}
                />
              </>
            ) : (
              <ChannelCarousel
                title={`Kipengele cha ${selectedCategory}`}
                channels={filteredChannels}
                onSelectChannel={(ch) => setSelectedChannel(ch)}
              />
            )}
          </>
        )}
      </main>

      <BottomNav />

      {/* SEARCH DRAWER */}
      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectChannel={(ch) => setSelectedChannel(ch)}
      />

      {/* REPORT MODAL */}
      {reportChannel && (
        <ReportModal
          isOpen={!!reportChannel}
          channelId={reportChannel.id}
          channelName={reportChannel.name}
          onClose={() => setReportChannel(null)}
        />
      )}
    </div>
  );
}

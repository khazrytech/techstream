"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { IPTVChannel, UserProfile } from "@/types/techstream";

interface TechStreamContextType {
  activeChannel: IPTVChannel | null;
  setActiveChannel: (channel: IPTVChannel | null) => void;
  favorites: string[];
  toggleFavorite: (channelId: string) => void;
  user: UserProfile;
}

const defaultUser: UserProfile = {
  id: "usr_1",
  name: "Mteja wa TechStream",
  email: "user@techstream.tv",
  subscriptionPlan: "STANDARD",
  expiresAt: "2026-12-31",
  maxStreamsAllowed: 2,
  activeStreamsCount: 1,
};

const TechStreamContext = createContext<TechStreamContextType | undefined>(undefined);

export function TechStreamProvider({ children }: { children: React.ReactNode }) {
  const [activeChannel, setActiveChannel] = useState<IPTVChannel | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavs = localStorage.getItem("techstream_favs");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch {
        // Parse error fallback
      }
    }
  }, []);

  const toggleFavorite = (channelId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId];
      localStorage.setItem("techstream_favs", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <TechStreamContext.Provider
      value={{
        activeChannel,
        setActiveChannel,
        favorites,
        toggleFavorite,
        user: defaultUser,
      }}
    >
      {children}
    </TechStreamContext.Provider>
  );
}

export function useTechStream() {
  const context = useContext(TechStreamContext);
  if (!context) {
    throw new Error("useTechStream lazima itumike ndani ya TechStreamProvider");
  }
  return context;
}

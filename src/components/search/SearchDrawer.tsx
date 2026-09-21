"use client";

import React, { useState } from "react";
import { Search, X, Film, Tv, Radio } from "lucide-react";
import { IPTVChannel } from "@/types/techstream";

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChannel: (channel: IPTVChannel) => void;
}

export default function SearchDrawer({ isOpen, onClose, onSelectChannel }: SearchDrawerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IPTVChannel[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/channels?q=${encodeURIComponent(text)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.channels);
      }
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 flex flex-col">
      {/* SEARCH INPUT HEADER */}
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Tafuta Chaneli, Tamthilia, au Michezo..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
            autoFocus
          />
        </div>
        <button
          onClick={onClose}
          className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* RESULTS LIST */}
      <div className="flex-1 overflow-y-auto pt-4 space-y-2">
        {loading && <p className="text-center text-xs text-zinc-500 py-4">Inatafuta...</p>}
        
        {!loading && query && results.length === 0 && (
          <p className="text-center text-xs text-zinc-500 py-4">Hakuna chaneli iliyopatikana kulingana na utafutaji wako.</p>
        )}

        {results.map((channel) => (
          <div
            key={channel.id}
            onClick={() => {
              onSelectChannel(channel);
              onClose();
            }}
            className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl hover:bg-zinc-800 cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center p-1 border border-zinc-800">
                {channel.logoUrl ? (
                  <img src={channel.logoUrl} alt={channel.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <Radio className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{channel.name}</p>
                <p className="text-[10px] text-zinc-500">{channel.category}</p>
              </div>
            </div>
            <span className="text-[10px] bg-zinc-800 text-zinc-300 font-mono font-bold px-2 py-0.5 rounded">
              {channel.quality}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

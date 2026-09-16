"use client";

import { useEffect, useState } from "react";

interface Channel {
  id: string;
  name: string;
  logo: string;
  url: string;
  group: string;
}

export function ChannelSlider({ channels }: { channels: Channel[] }) {
  const [index, setIndex] = useState(0);
  const featured = channels.slice(0, 8);

  useEffect(() => {
    if (featured.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % featured.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) return null;

  return (
    <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-gradient-to-r from-zinc-900 to-black p-4 mb-6 border border-zinc-800 flex items-center shadow-xl">
      <div className="flex-1 space-y-2 z-10">
        <span className="bg-red-600 text-white text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
          Inayoonyeshwa
        </span>
        <h2 className="text-xl font-extrabold text-white line-clamp-1">
          {featured[index]?.name}
        </h2>
        <p className="text-xs text-zinc-400">
          Kipengele: {featured[index]?.group || "General"}
        </p>
      </div>
      {featured[index]?.logo && (
        <img
          src={featured[index].logo}
          alt={featured[index].name}
          className="w-24 h-24 object-contain rounded-xl z-10 bg-black/40 p-2 border border-zinc-700"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-red-500" : "w-1.5 bg-zinc-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

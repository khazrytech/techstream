"use client";

import { useEffect, useState } from "react";
import { ChannelSlider } from "@/components/channel-slider";

export default function SeriesPage() {
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/iptv")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const all: any[] = [];
          data.categories.forEach((cat: any) => all.push(...cat.channels));
          const seriesFilter = all.filter((c) =>
            /series|serial|drama|show|season/i.test(c.name + " " + c.group)
          );
          setChannels(seriesFilter.length > 0 ? seriesFilter : all);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 pb-24 text-white">
      <h1 className="text-2xl font-bold mb-4">📺 Series</h1>
      {loading ? (
        <p className="text-zinc-500">Inapakia Series...</p>
      ) : (
        <>
          <ChannelSlider channels={channels} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {channels.map((ch) => (
              <div key={ch.id} className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <p className="font-semibold text-sm line-clamp-1">{ch.name}</p>
                <span className="text-xs text-zinc-500">{ch.group}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

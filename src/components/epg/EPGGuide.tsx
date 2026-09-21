"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Clock, Tv } from "lucide-react";

interface Program {
  start: string;
  stop: string;
  channelId: string;
  title: string;
  description: string;
}

interface EPGGuideProps {
  channelId?: string;
}

export default function EPGGuide({ channelId }: EPGGuideProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedEpgUrl = localStorage.getItem("techstream_epg_url") || "";
    if (!savedEpgUrl) {
      setLoading(false);
      return;
    }

    fetch(`/api/epg?url=${encodeURIComponent(savedEpgUrl)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.programs)) {
          if (channelId) {
            setPrograms(data.programs.filter((p) => p.channelId === channelId));
          } else {
            setPrograms(data.programs.slice(0, 15));
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [channelId]);

  if (loading) {
    return (
      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-3xl animate-pulse space-y-3">
        <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
        <div className="h-10 bg-zinc-800 rounded-2xl w-full"></div>
        <div className="h-10 bg-zinc-800 rounded-2xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-red-500" />
          <h3 className="text-xs font-black uppercase tracking-wider text-white">
            RATIBA YA VIPINDI (EPG)
          </h3>
        </div>
        <span className="text-[10px] bg-red-600/20 border border-red-600/40 text-red-500 font-bold px-2 py-0.5 rounded-full">
          LIVE XML
        </span>
      </div>

      {programs.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-zinc-800 rounded-2xl">
          <Tv className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-xs text-zinc-400 font-medium">Hakuna ratiba iliyopatikana kwa chaneli hii.</p>
          <p className="text-[10px] text-zinc-500 mt-1">Weka XMLTV EPG Link kwenye Profile ili kuvuta data.</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-64 overflow-y-auto no-scrollbar">
          {programs.map((prog, idx) => (
            <div key={idx} className="bg-zinc-950/80 border border-zinc-800/80 p-3 rounded-2xl space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-white truncate">{prog.title}</h4>
                <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
                  <Clock className="w-3 h-3 text-red-500" />
                  {prog.start.slice(8, 12)} - {prog.stop.slice(8, 12)}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-2">{prog.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

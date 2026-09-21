"use client";

import React, { useRef, useEffect } from "react";
import { IPTVChannel } from "@/types/techstream";
import { useStreamPlayer } from "@/hooks/useStreamPlayer";
import { Play, Pause, AlertTriangle, ShieldCheck, RefreshCw } from "lucide-react";

interface PlayerProps {
  channel: IPTVChannel;
}

export default function TechStreamPlayer({ channel: initialChannel }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    channel,
    currentStreamUrl,
    playerState,
    handleStreamError,
    togglePlay,
  } = useStreamPlayer(initialChannel);

  useEffect(() => {
    if (videoRef.current && currentStreamUrl) {
      videoRef.current.src = currentStreamUrl;
      videoRef.current.play().catch(() => {
        // Handle browser autoplay restriction
      });
    }
  }, [currentStreamUrl]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl group">
      {/* VIDEO ELEMENT */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onError={handleStreamError}
        playsInline
      />

      {/* OVERLAY BADGES (LIVE & BACKUP STATUS) */}
      <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
        <span className="bg-red-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span> LIVE
        </span>
        {channel && channel.activeStreamIndex > 0 && (
          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> BACKUP {channel.activeStreamIndex}
          </span>
        )}
      </div>

      {/* ERROR FALLBACK UI */}
      {playerState.hasError && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 text-center z-30">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-2" />
          <p className="text-sm font-semibold text-gray-200">{playerState.errorMessage}</p>
          <button
            onClick={handleStreamError}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xs font-bold flex items-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4" /> Jaribu Stream Nyingine
          </button>
        </div>
      )}

      {/* BOTTOM CONTROLS OVERLAY */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={togglePlay}
          className="text-white hover:text-purple-400 transition"
        >
          {playerState.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        <div className="text-right">
          <p className="text-xs font-bold text-white">{channel?.name}</p>
          <p className="text-[10px] text-gray-400">{channel?.category} • {channel?.quality}</p>
        </div>
      </div>
    </div>
  );
}

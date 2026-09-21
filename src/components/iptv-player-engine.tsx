"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, Pause, Volume2, VolumeX, Maximize, PictureInPicture2, 
  RefreshCw, ShieldAlert, Wifi, Activity, CheckCircle2, AlertTriangle, X, ChevronUp
} from "lucide-react";

interface StreamEngineProps {
  streamUrl: string;
  backupUrls?: string[];
  channelName: string;
  quality?: string;
  onCloseMiniPlayer?: () => void;
}

export function IPTVPlayerEngine({
  streamUrl,
  backupUrls = [],
  channelName,
  quality = "HD",
  onCloseMiniPlayer
}: StreamEngineProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeUrl, setActiveUrl] = useState(streamUrl);
  const [usingBackupIndex, setUsingBackupIndex] = useState<number | null>(null);
  
  // Diagnostics
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [streamHealth, setStreamHealth] = useState<"ONLINE" | "SLOW" | "OFFLINE">("ONLINE");
  const [latency, setLatency] = useState<number>(120);
  const [bufferPercent, setBufferPercent] = useState<number>(98);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);

  useEffect(() => {
    setActiveUrl(streamUrl);
    setUsingBackupIndex(null);
    setStreamHealth("ONLINE");
  }, [streamUrl]);

  // Handle Automatic Backup Switch on Stream Fail
  const handleStreamError = () => {
    console.warn("Primary stream failed. Attempting backup switch...");
    if (usingBackupIndex === null && backupUrls.length > 0) {
      setUsingBackupIndex(0);
      setActiveUrl(backupUrls[0]);
      setStreamHealth("SLOW");
    } else if (usingBackupIndex !== null && usingBackupIndex + 1 < backupUrls.length) {
      const nextIndex = usingBackupIndex + 1;
      setUsingBackupIndex(nextIndex);
      setActiveUrl(backupUrls[nextIndex]);
    } else {
      setStreamHealth("OFFLINE");
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.error("PiP error:", e);
    }
  };

  return (
    <div className={`transition-all duration-300 ${isMiniPlayer ? 'fixed bottom-20 right-4 z-50 w-72 bg-zinc-950 border border-indigo-500/50 rounded-2xl shadow-2xl overflow-hidden' : 'w-full space-y-3'}`}>
      
      {/* Player Header / Mini Player Bar */}
      <div className="flex items-center justify-between px-2 pt-1">
        <div className="flex items-center space-x-2 overflow-hidden">
          <span className={`w-2.5 h-2.5 rounded-full ${streamHealth === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : streamHealth === 'SLOW' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
          <h3 className="text-xs font-black text-white truncate">{channelName}</h3>
          {usingBackupIndex !== null && (
            <span className="text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-md">
              BACKUP #{usingBackupIndex + 1}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button onClick={() => setShowDiagnostics(!showDiagnostics)} className="p-1 text-zinc-400 hover:text-white">
            <Activity className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setIsMiniPlayer(!isMiniPlayer)} className="p-1 text-zinc-400 hover:text-white">
            <ChevronUp className={`w-4 h-4 transition-transform ${isMiniPlayer ? 'rotate-180' : ''}`} />
          </button>
          {isMiniPlayer && onCloseMiniPlayer && (
            <button onClick={onCloseMiniPlayer} className="p-1 text-red-400 hover:text-red-300">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl group">
        <video
          ref={videoRef}
          src={activeUrl}
          autoPlay
          playsInline
          onError={handleStreamError}
          className="w-full h-full object-contain"
        />

        {/* Video Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
          <div className="flex justify-end space-x-2">
            <span className="bg-zinc-900/80 border border-zinc-700 text-zinc-300 text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md">
              {quality}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button onClick={togglePlay} className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button onClick={toggleMute} className="p-2 bg-zinc-900/80 text-white rounded-xl border border-zinc-700">
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={togglePiP} className="p-2 bg-zinc-900/80 text-white rounded-xl border border-zinc-700">
                <PictureInPicture2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostics Panel (Optional) */}
      {showDiagnostics && !isMiniPlayer && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 text-xs space-y-2">
          <div className="flex items-center justify-between font-bold text-zinc-300">
            <span className="flex items-center space-x-1.5"><Wifi className="w-3.5 h-3.5 text-indigo-400" /><span>Diagnostics</span></span>
            <span className={streamHealth === 'ONLINE' ? 'text-emerald-400' : 'text-amber-400'}>{streamHealth}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px] text-zinc-400">
            <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">
              <span className="block text-zinc-500 font-bold">LATENCY</span>
              <span className="text-white font-black">{latency} ms</span>
            </div>
            <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">
              <span className="block text-zinc-500 font-bold">BUFFER</span>
              <span className="text-white font-black">{bufferPercent}%</span>
            </div>
            <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">
              <span className="block text-zinc-500 font-bold">BACKUPS</span>
              <span className="text-white font-black">{backupUrls.length} Available</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

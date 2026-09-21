"use client";

import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  autoPlay?: boolean;
}

export default function VideoPlayer({ url, poster, autoPlay = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      if (autoPlay) {
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
      }
      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      if (autoPlay) {
        video.play().catch(() => {});
      }
    }
  }, [url, autoPlay]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
      <video
        ref={videoRef}
        controls
        playsInline
        poster={poster}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

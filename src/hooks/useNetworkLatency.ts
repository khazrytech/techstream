import { useState, useEffect } from "react";

export function useNetworkLatency(checkIntervalMs: number = 10000) {
  const [latency, setLatency] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const checkPing = async () => {
      const start = performance.now();
      try {
        await fetch("/api/channels?category=ping", { method: "HEAD", cache: "no-store" });
        const duration = Math.round(performance.now() - start);
        setLatency(duration);
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };

    checkPing();
    const interval = setInterval(checkPing, checkIntervalMs);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [checkIntervalMs]);

  return { latency, isOnline };
}

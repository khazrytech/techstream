import { IPTVChannel, StreamStatus } from "@/types/techstream";

export async function checkStreamHealth(url: string): Promise<{ status: StreamStatus; latencyMs: number }> {
  const startTime = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);
    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime);

    if (response.ok) {
      const status: StreamStatus = latencyMs > 2500 ? "SLOW" : "ONLINE";
      return { status, latencyMs };
    } else {
      return { status: "OFFLINE", latencyMs: 0 };
    }
  } catch {
    return { status: "OFFLINE", latencyMs: 0 };
  }
}

export function getActiveStreamUrl(channel: IPTVChannel): string {
  if (channel.activeStreamIndex === 0) {
    return channel.primaryStreamUrl;
  }
  const backupIndex = channel.activeStreamIndex - 1;
  return channel.backupStreamUrls[backupIndex] || channel.primaryStreamUrl;
}

export function switchToNextBackupStream(channel: IPTVChannel): IPTVChannel {
  const totalStreams = 1 + channel.backupStreamUrls.length;
  const nextIndex = (channel.activeStreamIndex + 1) % totalStreams;
  return {
    ...channel,
    activeStreamIndex: nextIndex,
  };
}

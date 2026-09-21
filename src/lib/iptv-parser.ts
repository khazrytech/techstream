import { IPTVChannel } from "@/types/techstream";

export function parseM3UPlaylist(m3uContent: string): IPTVChannel[] {
  const lines = m3uContent.split("\n");
  const channels: IPTVChannel[] = [];
  let currentChannel: Partial<IPTVChannel> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("#EXTINF:")) {
      const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
      const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/);
      const groupMatch = line.match(/group-title="([^"]*)"/);
      const countryMatch = line.match(/tvg-country="([^"]*)"/);

      const nameParts = line.split(",");
      const channelName = nameParts[nameParts.length - 1]?.trim() || "Unknown Channel";

      currentChannel = {
        id: `chan_${Math.random().toString(36).substring(2, 9)}`,
        name: channelName,
        epgChannelId: tvgIdMatch ? tvgIdMatch[1] : undefined,
        logoUrl: tvgLogoMatch ? tvgLogoMatch[1] : "",
        category: groupMatch ? groupMatch[1] : "General",
        country: countryMatch ? countryMatch[1] : "International",
        quality: channelName.includes("4K") ? "4K" : channelName.includes("FHD") ? "FHD" : "HD",
        isLive: true,
        isFeatured: false,
        status: "ONLINE",
        backupStreamUrls: [],
        activeStreamIndex: 0,
      };
    } else if (line.startsWith("http://") || line.startsWith("https://")) {
      if (currentChannel.name) {
        if (!currentChannel.primaryStreamUrl) {
          currentChannel.primaryStreamUrl = line;
          channels.push(currentChannel as IPTVChannel);
        } else {
          const lastChan = channels[channels.length - 1];
          if (lastChan) {
            lastChan.backupStreamUrls.push(line);
          }
        }
        currentChannel = {};
      }
    }
  }
  return channels;
}

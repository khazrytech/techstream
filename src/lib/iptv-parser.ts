export interface Channel {
  id: string;
  name: string;
  logo: string;
  group: string;
  url: string;
}

export interface CategoryGroup {
  category: string;
  channels: Channel[];
}

export function parseM3U(m3uContent: string): CategoryGroup[] {
  const lines = m3uContent.split(/\r?\n/);
  const channels: Channel[] = [];
  let currentChannel: Partial<Channel> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("#EXTINF:")) {
      currentChannel = {};
      
      const logoMatch = line.match(/tvg-logo="([^"]*)"/);
      if (logoMatch) currentChannel.logo = logoMatch[1];

      const groupMatch = line.match(/group-title="([^"]*)"/);
      currentChannel.group = groupMatch ? groupMatch[1] : "General";

      const commaIndex = line.lastIndexOf(",");
      if (commaIndex !== -1) {
        currentChannel.name = line.substring(commaIndex + 1).trim();
      }
      currentChannel.id = Math.random().toString(36).substring(2, 9);
    } else if (line && !line.startsWith("#")) {
      if (currentChannel.name) {
        currentChannel.url = line;
        channels.push(currentChannel as Channel);
        currentChannel = {};
      }
    }
  }

  const groupMap: { [key: string]: Channel[] } = {};
  for (const ch of channels) {
    const cat = ch.group || "General";
    if (!groupMap[cat]) {
      groupMap[cat] = [];
    }
    groupMap[cat].push(ch);
  }

  return Object.keys(groupMap).map((category) => ({
    category,
    channels: groupMap[category],
  }));
}

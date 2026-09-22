import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const revalidate = 0;

// Kitendakazi cha kupanga chaneli kwenye makundi safi ya kisasa bila kuleta nchi za ovyo
function getSmartCategory(name: string, originalGroup: string): string {
  const lower = (name + " " + originalGroup).toLowerCase();
  
  if (/sport|michezo|football|soccer|espn|supersport|azam sports|bt sport|bein|ufc|wwe/i.test(lower)) {
    return "Michezo & Live Sports";
  }
  if (/movie|cinema|hbo|cinemax|vod|action|netflix|hollywood|series|drama/i.test(lower)) {
    return "Filamu & Series (VOD)";
  }
  if (/news|habari|bbc|cnn|al jazeera|tbc|sky news|fox news|dw|rt/i.test(lower)) {
    return "Habari & Dunia (News)";
  }
  if (/tanzania|wasafi|azam|east africa|ebony|swahili|tbc1|cloudstv|efm/i.test(lower)) {
    return "Tanzania & Local TV";
  }
  return "Burudani & General TV";
}

export async function GET() {
  try {
    let rawData = "";

    const sportsPath = path.join(process.cwd(), "public", "sports.m3u");
    const rootPlaylistPath = path.join(process.cwd(), "playlist.m3u");

    if (fs.existsSync(sportsPath)) {
      rawData = fs.readFileSync(sportsPath, "utf-8");
    } else if (fs.existsSync(rootPlaylistPath)) {
      rawData = fs.readFileSync(rootPlaylistPath, "utf-8");
    } else {
      const m3uUrl = process.env.IPTV_M3U_URL;
      if (m3uUrl) {
        const response = await fetch(m3uUrl, {
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        if (response.ok) {
          rawData = await response.text();
        }
      }
    }

    if (!rawData) {
      return NextResponse.json({ success: false, error: "No playlist source found." }, { status: 404 });
    }

    const lines = rawData.split("\n");
    const categoriesMap: { [key: string]: any[] } = {};
    let currentChannel: any = null;

    for (let rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith("#EXTINF:")) {
        const nameMatch = rawLine.match(/,(.+)$/);
        const name = nameMatch ? nameMatch[1].trim() : "Channel";

        const groupMatch = rawLine.match(/group-title="([^"]+)"/i);
        const originalGroup = groupMatch ? groupMatch[1].trim() : "General";

        const logoMatch = rawLine.match(/tvg-logo="([^"]+)"/i);
        const logo = logoMatch ? logoMatch[1].trim() : "";

        const idMatch = rawLine.match(/tvg-id="([^"]+)"/i);
        const id = idMatch ? idMatch[1].trim() : Math.random().toString(36).substring(7);

        // Tumia Smart Categorizer kusafisha makundi ya kijinga ya nchi
        const group = getSmartCategory(name, originalGroup);

        currentChannel = { id, name, group, logo, url: "" };
      } else if (line && !line.startsWith("#") && currentChannel) {
        currentChannel.url = line;
        
        if (!categoriesMap[currentChannel.group]) {
          categoriesMap[currentChannel.group] = [];
        }
        categoriesMap[currentChannel.group].push(currentChannel);
        currentChannel = null;
      }
    }

    const categories = Object.keys(categoriesMap).map((catName) => ({
      name: catName,
      channels: categoriesMap[catName],
    }));

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

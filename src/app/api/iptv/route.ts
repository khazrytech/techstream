import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const revalidate = 0;

export async function GET() {
  try {
    let rawData = "";

    // 1. Angalia kama faili la sports.m3u lipo kwenye public folder
    const sportsPath = path.join(process.cwd(), "public", "sports.m3u");
    const rootPlaylistPath = path.join(process.cwd(), "playlist.m3u");

    if (fs.existsSync(sportsPath)) {
      rawData = fs.readFileSync(sportsPath, "utf-8");
    } else if (fs.existsSync(rootPlaylistPath)) {
      rawData = fs.readFileSync(rootPlaylistPath, "utf-8");
    } else {
      // 2. Kama halipo, jaribu kuvuta kupitia IPTV_M3U_URL kama ipo
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
        const group = groupMatch ? groupMatch[1].trim() : "Live TV & Channels";

        const logoMatch = rawLine.match(/tvg-logo="([^"]+)"/i);
        const logo = logoMatch ? logoMatch[1].trim() : "";

        const idMatch = rawLine.match(/tvg-id="([^"]+)"/i);
        const id = idMatch ? idMatch[1].trim() : Math.random().toString(36).substring(7);

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

import { NextResponse } from "next/server";

export const revalidate = 1800; // Cache kwa dakika 30

export async function GET() {
  try {
    const iptvUrl = process.env.IPTV_M3U_URL || "";
    
    if (!iptvUrl) {
      return NextResponse.json({ 
        success: false, 
        error: "Hakuna M3U_URL iliyowekwa kwenye .env au Vercel Environment Variables." 
      }, { status: 400 });
    }

    const res = await fetch(iptvUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error("Ameshindwa kupakua faili la M3U kutoka kwenye Seva.");

    const text = await res.text();
    const lines = text.split("\n");

    const categoriesMap: { [key: string]: any[] } = {};
    let currentChannel: any = null;

    for (let rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith("#EXTINF:")) {
        const nameMatch = line.match(/,(.+)$/);
        const name = nameMatch ? nameMatch[1].trim() : "Channel";

        const groupMatch = line.match(/group-title="([^"]+)"/i);
        const group = groupMatch ? groupMatch[1].trim() : "Jumla (General)";

        const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
        const logo = logoMatch ? logoMatch[1].trim() : "";

        const idMatch = line.match(/tvg-id="([^"]+)"/i);
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

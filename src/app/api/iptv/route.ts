import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache kwa saa 1

export async function GET() {
  try {
    const iptvUrl = process.env.IPTV_M3U_URL || "https://iptv-org.github.io/iptv/index.m3u"; 
    const res = await fetch(iptvUrl, { next: { revalidate: 3600 } });
    
    if (!res.ok) throw new Error("Failed to fetch IPTV M3U playlist");

    const text = await res.text();
    const lines = text.split("\n");

    const categoriesMap: { [key: string]: any[] } = {};

    let currentChannel: any = null;

    for (let line of lines) {
      line = line.trim();
      if (line.startsWith("#EXTINF:")) {
        const nameMatch = line.match(/,(.+)$/);
        const name = nameMatch ? nameMatch[1].trim() : "Unknown Channel";

        const groupMatch = line.match(/group-title="([^"]+)"/i);
        const group = groupMatch ? groupMatch[1].trim() : "General";

        const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
        const logo = logoMatch ? logoMatch[1].trim() : "";

        const idMatch = line.match(/tvg-id="([^"]+)"/i);
        const id = idMatch ? idMatch[1].trim() : Math.random().toString(36).substring(7);

        currentChannel = {
          id,
          name,
          group,
          logo,
          url: "",
        };
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

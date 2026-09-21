import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const epgUrl = searchParams.get("url") || process.env.EPG_XML_URL;

  if (!epgUrl) {
    return NextResponse.json({ success: false, message: "Hakuna EPG Link iliyowekwa" }, { status: 400 });
  }

  try {
    const res = await fetch(epgUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Ameshindwa kuvuta data za EPG");

    const xmlText = await res.text();
    
    // Parse XML EPG Simple Extractor
    const programMatches = [...xmlText.matchAll(/<programme[\s\S]*?start="([^"]+)"[\s\S]*?stop="([^"]+)"[\s\S]*?channel="([^"]+)"[\s\S]*?<title[^>]*>([\s\S]*?)<\/title>[\s\S]*?(?:<desc[^>]*>([\s\S]*?)<\/desc>)?[\s\S]*?<\/programme>/g)];

    const programs = programMatches.map((m) => ({
      start: m[1],
      stop: m[2],
      channelId: m[3],
      title: m[4]?.trim() || "Kipindi Haikujulikana",
      description: m[5]?.trim() || "Hakuna maelezo ya ziada.",
    }));

    return NextResponse.json({ success: true, programs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

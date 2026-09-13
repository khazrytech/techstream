import { NextResponse } from "next/server";
import { parseM3U } from "@/lib/iptv-parser";

const IPTV_URLS = [
  "https://iptv-org.github.io/iptv/countries/tz.m3u",
  "https://iptv-org.github.io/iptv/languages/swa.m3u",
  "https://iptv-org.github.io/iptv/index.m3u"
];

export async function GET() {
  try {
    let m3uText = "";
    for (const url of IPTV_URLS) {
      const response = await fetch(url, {
        next: { revalidate: 3600 },
      });
      if (response.ok) {
        const text = await response.text();
        if (text.includes("#EXTINF")) {
          m3uText = text;
          break;
        }
      }
    }

    if (!m3uText) {
      return NextResponse.json({ success: false, error: "Imeshindikana kupata playlist" }, { status: 500 });
    }

    const categories = parseM3U(m3uText);
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

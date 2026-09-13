import { NextResponse } from "next/server";
import { parseM3U } from "@/lib/iptv-parser";

// Orodha ya playlists zinazobeba chaneli za kimataifa, michezo, filamu na za nyumbani
const IPTV_URLS = [
  "https://iptv-org.github.io/iptv/countries/tz.m3u",
  "https://iptv-org.github.io/iptv/languages/swa.m3u",
  "https://iptv-org.github.io/iptv/categories/sports.m3u",
  "https://iptv-org.github.io/iptv/categories/movies.m3u",
  "https://iptv-org.github.io/iptv/categories/entertainment.m3u",
  "https://iptv-org.github.io/iptv/categories/music.m3u",
  "https://iptv-org.github.io/iptv/categories/news.m3u",
  "https://iptv-org.github.io/iptv/categories/kids.m3u",
  "https://iptv-org.github.io/iptv/categories/documentary.m3u"
];

export async function GET() {
  try {
    // Tunavuta playlists zote kwa wakati mmoja ili kuokoa muda
    const fetchPromises = IPTV_URLS.map(url => 
      fetch(url, { next: { revalidate: 3600 } })
        .then(res => res.ok ? res.text() : "")
        .catch(() => "")
    );
    
    const results = await Promise.all(fetchPromises);
    
    // Tunaunganisha chaneli zote kwenye faili moja kubwa la M3U
    const combinedM3uText = results.join("\n");

    if (!combinedM3uText.includes("#EXTINF")) {
      return NextResponse.json({ success: false, error: "Hakuna chaneli iliyopatikana" }, { status: 500 });
    }

    const categories = parseM3U(combinedM3uText);
    
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

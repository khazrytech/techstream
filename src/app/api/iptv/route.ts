import { NextResponse } from "next/server";
import { parseM3U } from "@/lib/iptv-parser";

const IPTV_URL = "https://iptv-org.github.io/iptv/index.m3u";

export async function GET() {
  try {
    const response = await fetch(IPTV_URL, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: "Imeshindikana kupata playlist" }, { status: 500 });
    }

    const m3uText = await response.text();
    const categories = parseM3U(m3uText);

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

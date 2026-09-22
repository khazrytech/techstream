import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const revalidate = 1800;

export async function GET() {
  try {
    const m3uUrl = process.env.IPTV_M3U_URL;

    if (m3uUrl) {
      const response = await fetch(m3uUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch M3U playlist from URL. HTTP Status: ${response.status}` },
          { status: response.status }
        );
      }

      const m3uData = await response.text();

      return new NextResponse(m3uData, {
        status: 200,
        headers: {
          "Content-Type": "application/x-mpegurl",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "s-maxage=1800, stale-while-revalidate",
        },
      });
    }

    const filePath = path.join(process.cwd(), "playlist.m3u");
    if (fs.existsSync(filePath)) {
      const m3uData = fs.readFileSync(filePath, "utf-8");
      return new NextResponse(m3uData, {
        status: 200,
        headers: {
          "Content-Type": "application/x-mpegurl",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "s-maxage=1800, stale-while-revalidate",
        },
      });
    }

    return NextResponse.json(
      { error: "IPTV playlist source not configured. Set IPTV_M3U_URL in environment variables or provide playlist.m3u in root directory." },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error occurred while processing M3U playlist." },
      { status: 500 }
    );
  }
}

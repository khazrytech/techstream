import { NextResponse } from "next/server";
import { IPTVChannel } from "@/types/techstream";

const dummyChannels: IPTVChannel[] = [
  {
    id: "ch-1",
    name: "Supersport Football HD",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    logoUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100",
    category: "Sports",
    quality: "HD",
    isLive: true,
  },
  {
    id: "ch-2",
    name: "TBC 1 Tanzania",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    logoUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100",
    category: "News",
    quality: "SD",
    isLive: true,
  },
  {
    id: "ch-3",
    name: "Azam Sports 1",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    logoUrl: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=100",
    category: "Sports",
    quality: "FHD",
    isLive: true,
  },
  {
    id: "ch-4",
    name: "BBC World News",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    logoUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100",
    category: "News",
    quality: "HD",
    isLive: true,
  },
  {
    id: "ch-5",
    name: "Hollywood Action HD",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    logoUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100",
    category: "Movies",
    quality: "4K",
    isLive: false,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase();

  let filtered = dummyChannels;
  if (q) {
    filtered = dummyChannels.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    channels: filtered,
  });
}

import { NextResponse } from "next/server";

export async function GET() {
  const mockCategories = [
    {
      group: "Sports",
      channels: [
        {
          id: "iptv-1",
          name: "SuperSport Premier League",
          logo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100",
          url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
          group: "Sports",
        },
        {
          id: "iptv-2",
          name: "Azam Sports 2 HD",
          logo: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=100",
          url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
          group: "Sports",
        },
      ],
    },
    {
      group: "News",
      channels: [
        {
          id: "iptv-3",
          name: "TBC 1 Live",
          logo: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100",
          url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
          group: "News",
        },
        {
          id: "iptv-4",
          name: "Al Jazeera English",
          logo: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100",
          url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
          group: "News",
        },
      ],
    },
  ];

  return NextResponse.json({
    success: true,
    categories: mockCategories,
  });
}

import { NextResponse } from "next/server";
import { VODItem } from "@/types/techstream";

const sampleVOD: VODItem[] = [
  {
    id: "vod-1",
    title: "The Swahili Legend",
    type: "MOVIE",
    posterUrl: "https://via.placeholder.com/300x450",
    backdropUrl: "https://via.placeholder.com/1280x720",
    description: "Kisa cha kusisimua cha ushujaa na historia ya Pwani.",
    releaseYear: 2025,
    rating: "16+",
    genres: ["Action", "Drama"],
    streamUrl: "https://example.com/vod/movie1.mp4",
  },
  {
    id: "vod-2",
    title: "TechStream Chronicles",
    type: "SERIES",
    posterUrl: "https://via.placeholder.com/300x450",
    backdropUrl: "https://via.placeholder.com/1280x720",
    description: "Series ya kiteknolojia inayofuatilia maisha ya waandaaji wa mifumo.",
    releaseYear: 2026,
    rating: "PG-13",
    genres: ["Sci-Fi", "Thriller"],
    seasonsCount: 2,
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const search = searchParams.get("q");

  let result = [...sampleVOD];

  if (type) {
    result = result.filter(item => item.type.toLowerCase() === type.toLowerCase());
  }

  if (search) {
    const query = search.toLowerCase();
    result = result.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.genres.some(g => g.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({ success: true, items: result });
}

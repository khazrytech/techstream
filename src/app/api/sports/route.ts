import { NextResponse } from "next/server";
import { SportMatch } from "@/types/techstream";

const matches: SportMatch[] = [
  {
    id: "match-1",
    tournament: "NBC Premier League",
    homeTeam: { name: "Simba SC", logo: "/logos/simba.png", score: 2 },
    awayTeam: { name: "Yanga SC", logo: "/logos/yanga.png", score: 1 },
    matchStatus: "LIVE",
    startTime: new Date().toISOString(),
    associatedChannelId: "ch-2",
  },
  {
    id: "match-2",
    tournament: "UEFA Champions League",
    homeTeam: { name: "Arsenal", logo: "/logos/arsenal.png" },
    awayTeam: { name: "Real Madrid", logo: "/logos/realmadrid.png" },
    matchStatus: "UPCOMING",
    startTime: new Date(Date.now() + 86400000).toISOString(),
  }
];

export async function GET() {
  return NextResponse.json({ success: true, matches });
}

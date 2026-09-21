import { NextResponse } from "next/server";
import { EPGProgram } from "@/types/techstream";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get("channelId");

  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 3600000);
  const twoHoursLater = new Date(now.getTime() + 7200000);

  const mockEPG: EPGProgram[] = [
    {
      id: "epg-1",
      channelId: channelId || "ch-1",
      title: "Prime Time News & Updates",
      description: "Taarifa mpya ya habari kutoka kitaifa na kimataifa.",
      startTime: now.toISOString(),
      endTime: oneHourLater.toISOString(),
      category: "News",
      isCurrent: true,
    },
    {
      id: "epg-2",
      channelId: channelId || "ch-1",
      title: "Sports Highlight & Analysis",
      description: "Uchambuzi wa kina wa ligi kuu na michezo mbalimbali.",
      startTime: oneHourLater.toISOString(),
      endTime: twoHoursLater.toISOString(),
      category: "Sports",
      isCurrent: false,
    }
  ];

  return NextResponse.json({ success: true, epg: mockEPG });
}

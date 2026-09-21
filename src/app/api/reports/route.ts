import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { channelId, issueType, comment } = body;

    console.log("Stream Issue Reported:", {
      channelId,
      issueType,
      comment,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Taarifa ya tatizo imepokelewa na inafanyiwa kazi.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Hitilafu imetokea wakati wa kutuma taarifa." },
      { status: 500 }
    );
  }
}

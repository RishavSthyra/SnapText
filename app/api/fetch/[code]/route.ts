import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const redis = getRedis();

    const text = await redis.get(code);

    if (!text) {
      return NextResponse.json(
        { error: "Code expired or not found" },
        { status: 404 }
      );
    }

    await redis.del(code);

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Fetch API failed:", error);

    return NextResponse.json(
      { error: "Unable to fetch text right now" },
      { status: 500 }
    );
  }
}

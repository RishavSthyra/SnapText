import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { normalizeStoredSharePayload } from "@/lib/share";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    void request;
    const { code } = await params;
    const redis = getRedis();
    const rawShare = await redis.get<unknown>(code);

    if (!rawShare) {
      return NextResponse.json({ status: "expired" });
    }

    const share = normalizeStoredSharePayload(rawShare);

    if (!share) {
      return NextResponse.json(
        { error: "Stored share payload is invalid" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: share.expiresAt <= Date.now() ? "expired" : share.status,
      copiedAt: share.copiedAt,
    });

  } catch (error) {
    console.error("Status API failed:", error);

    return NextResponse.json(
      { error: "Unable to check share status right now" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import {
  RECEIVED_STATUS_TTL_SECONDS,
  normalizeStoredSharePayload,
} from "@/lib/share";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    void request;
    const { code } = await params;
    const redis = getRedis();
    const rawShare = await redis.get<unknown>(code);

    if (!rawShare) {
      return NextResponse.json(
        { error: "Code expired or not found" },
        { status: 404 }
      );
    }

    const share = normalizeStoredSharePayload(rawShare);

    if (!share) {
      return NextResponse.json(
        { error: "Stored share payload is invalid" },
        { status: 500 }
      );
    }

    if (share.expiresAt <= Date.now() || share.status === "expired") {
      return NextResponse.json(
        { error: "Code expired or not found" },
        { status: 410 }
      );
    }

    share.status = "received";
    share.copiedAt = Date.now();

    await redis.set(code, JSON.stringify(share), {
      ex: RECEIVED_STATUS_TTL_SECONDS,
    });

    return NextResponse.json({
      status: share.status,
      copiedAt: share.copiedAt,
    });
  } catch (error) {
    console.error("Receive API failed:", error);

    return NextResponse.json(
      { error: "Unable to mark share as received right now" },
      { status: 500 }
    );
  }
}

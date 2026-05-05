import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import {
  getShareStatusKey,
  RECEIVED_STATUS_TTL_SECONDS,
  type ShareStatusPayload,
} from "@/lib/share";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    void request;
    const { code } = await params;
    const redis = getRedis();
    const copiedAt = Date.now();
    const statusPayload: ShareStatusPayload = {
      status: "received",
      copiedAt,
    };

    await redis.set(getShareStatusKey(code), JSON.stringify(statusPayload), {
      ex: RECEIVED_STATUS_TTL_SECONDS,
    });
    await redis.del(code);

    return NextResponse.json(statusPayload);
  } catch (error) {
    console.error("Receive API failed:", error);

    return NextResponse.json(
      { error: "Unable to mark share as received right now" },
      { status: 500 }
    );
  }
}

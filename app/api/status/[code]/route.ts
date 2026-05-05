import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import {
  getShareStatusKey,
  type ShareStatusPayload,
} from "@/lib/share";

function normalizeStatusPayload(rawStatus: unknown): ShareStatusPayload | null {
  if (typeof rawStatus === "object" && rawStatus !== null) {
    const payload = rawStatus as Partial<ShareStatusPayload>;

    if (
      payload.status === "pending" ||
      payload.status === "received" ||
      payload.status === "expired"
    ) {
      return {
        status: payload.status,
        copiedAt:
          typeof payload.copiedAt === "number" ? payload.copiedAt : undefined,
      };
    }
  }

  if (typeof rawStatus !== "string") {
    return null;
  }

  try {
    const parsed = JSON.parse(rawStatus) as Partial<ShareStatusPayload>;

    if (
      parsed.status === "pending" ||
      parsed.status === "received" ||
      parsed.status === "expired"
    ) {
      return {
        status: parsed.status,
        copiedAt:
          typeof parsed.copiedAt === "number" ? parsed.copiedAt : undefined,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    void request;
    const { code } = await params;
    const redis = getRedis();
    const rawStatus = await redis.get<unknown>(getShareStatusKey(code));

    if (rawStatus) {
      const statusPayload = normalizeStatusPayload(rawStatus);

      if (statusPayload) {
        return NextResponse.json(statusPayload);
      }
    }

    const shareExists = await redis.exists(code);

    return NextResponse.json({
      status: shareExists ? "pending" : "expired",
    } satisfies ShareStatusPayload);
  } catch (error) {
    console.error("Status API failed:", error);

    return NextResponse.json(
      { error: "Unable to check share status right now" },
      { status: 500 }
    );
  }
}

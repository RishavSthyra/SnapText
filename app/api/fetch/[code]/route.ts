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
      return NextResponse.json({ error: "Code expired or not found" }, { status: 410 });
    }

    if (share.status === "received") {
      return NextResponse.json(
        { error: "This share has already been opened" },
        { status: 410 }
      );
    }

    return NextResponse.json(share);
  } catch (error) {
    console.error("Fetch API failed:", error);

    return NextResponse.json(
      { error: "Unable to fetch text right now" },
      { status: 500 }
    );
  }
}

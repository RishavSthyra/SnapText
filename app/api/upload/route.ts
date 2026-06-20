import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import {
  MAX_CODE_GENERATION_ATTEMPTS,
  SHARE_EXPIRY_SECONDS,
  SHARE_TEXT_MAX_CHARACTERS,
  type StoredSharePayload,
} from "@/lib/share";
import { generateCode } from "@/utils/generate-code";

export const runtime = "nodejs";

async function reserveUniqueCode(
  payload: StoredSharePayload,
  expiresInSeconds: number
) {
  const redis = getRedis();
  const serializedPayload = JSON.stringify(payload);

  for (let attempt = 0; attempt < MAX_CODE_GENERATION_ATTEMPTS; attempt++) {
    const code = generateCode();
    const result = await redis.set(code, serializedPayload, {
      ex: expiresInSeconds,
      nx: true,
    });

    if (result === "OK") {
      return code;
    }
  }

  throw new Error("Unable to reserve a unique share code");
}
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { text?: unknown };
   const text = typeof body.text === "string" ? body.text : "";

    if (!text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (text.length > SHARE_TEXT_MAX_CHARACTERS) {
      return NextResponse.json(
        { error: `Text must be ${SHARE_TEXT_MAX_CHARACTERS} characters or fewer` },
        { status: 413 }
      );
    }

    const createdAt = Date.now();
    const expiresAt = createdAt + SHARE_EXPIRY_SECONDS * 1000;

    const payload: StoredSharePayload = {
      text,
      createdAt,
      expiresAt,
      burnAfterReading: true,
      status: "pending",
    };

    const code = await reserveUniqueCode(payload, SHARE_EXPIRY_SECONDS);

    return NextResponse.json({
      code,
      expiresAt: payload.expiresAt,
      burnAfterReading: payload.burnAfterReading,
    });
  } catch (error) {
    console.error("Upload API failed:", error);

    if (
      error instanceof Error &&
      /WRONGPASS|unauthorized|auth token/i.test(error.message)
    ) {
      return NextResponse.json(
        {
          error:
            "Redis authentication failed. Check your Upstash URL and token in the environment variables.",
        },
        { status: 500 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "Unable to reserve a unique share code"
    ) {
      return NextResponse.json(
        { error: "All share codes are busy right now. Please try again." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Unable to save text right now" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import {
  DEFAULT_CODE_LANGUAGE,
  getShareStatusKey,
  isCodeLanguage,
  MAX_CODE_GENERATION_ATTEMPTS,
  SHARE_EXPIRY_SECONDS,
  type ShareStatusPayload,
  type ShareContentType,
  type StoredSharePayload,
} from "@/lib/share";
import { generateCode } from "@/utils/generate-code";

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

// interface RequestBodyType {
//     key: string,
//     text: string,
//     epiry: number,
// }


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = typeof body.text === "string" ? body.text : "";
    const contentType: ShareContentType =
      body.contentType === "code" ? "code" : "text";
    const language = isCodeLanguage(body.language)
      ? body.language
      : DEFAULT_CODE_LANGUAGE;

    if (!text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const createdAt = Date.now();
    const expiresAt = createdAt + SHARE_EXPIRY_SECONDS * 1000;
    const payload: StoredSharePayload = {
      text,
      contentType,
      language: contentType === "code" ? language : DEFAULT_CODE_LANGUAGE,
      createdAt,
      expiresAt,
      burnAfterReading: true,
    };
    const code = await reserveUniqueCode(payload, SHARE_EXPIRY_SECONDS);
    const redis = getRedis();
    const statusPayload: ShareStatusPayload = {
      status: "pending",
    };

    await redis.set(getShareStatusKey(code), JSON.stringify(statusPayload), {
      ex: SHARE_EXPIRY_SECONDS,
    });

    return NextResponse.json({
      code,
      contentType: payload.contentType,
      language: payload.language,
      expiresAt: payload.expiresAt,
      burnAfterReading: payload.burnAfterReading,
    });
  } catch (error) {
    console.error("Upload API failed:", error);

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

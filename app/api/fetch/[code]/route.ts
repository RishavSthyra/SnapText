import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import {
  DEFAULT_CODE_LANGUAGE,
  isCodeLanguage,
  type CodeLanguage,
  type ShareContentType,
  type StoredSharePayload,
} from "@/lib/share";

function normalizeSharePayload(rawShare: unknown): StoredSharePayload | null {
  const normalizeObject = (payload: Partial<StoredSharePayload>) => {
    if (typeof payload.text !== "string") {
      return null;
    }

    const contentType: ShareContentType =
      payload.contentType === "code" ? "code" : "text";
    const candidateLanguage = payload.language ?? "";
    const language: CodeLanguage = isCodeLanguage(candidateLanguage)
      ? candidateLanguage
      : DEFAULT_CODE_LANGUAGE;

    return {
      text: payload.text,
      contentType,
      language,
      createdAt:
        typeof payload.createdAt === "number" ? payload.createdAt : Date.now(),
      expiresAt:
        typeof payload.expiresAt === "number" ? payload.expiresAt : Date.now(),
      burnAfterReading: true as const,
    };
  };

  if (typeof rawShare === "object" && rawShare !== null) {
    return normalizeObject(rawShare as Partial<StoredSharePayload>);
  }

  if (typeof rawShare !== "string") {
    return null;
  }

  try {
    return normalizeObject(JSON.parse(rawShare) as Partial<StoredSharePayload>);
  } catch {
    return {
      text: rawShare,
      contentType: "text",
      language: DEFAULT_CODE_LANGUAGE,
      createdAt: Date.now(),
      expiresAt: Date.now(),
      burnAfterReading: true,
    };
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

    const rawShare = await redis.get<unknown>(code);

    if (!rawShare) {
      return NextResponse.json(
        { error: "Code expired or not found" },
        { status: 404 }
      );
    }

    const share = normalizeSharePayload(rawShare);

    if (!share) {
      return NextResponse.json(
        { error: "Stored share payload is invalid" },
        { status: 500 }
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

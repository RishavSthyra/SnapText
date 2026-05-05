import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { generateCode } from "@/utils/generate-code";

// interface RequestBodyType {
//     key: string,
//     text: string,
//     epiry: number,
// }


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const code = generateCode();
    const redis = getRedis();

    await redis.set(code, text, { ex: 300 });

    return NextResponse.json({ code });
  } catch (error) {
    console.error("Upload API failed:", error);

    return NextResponse.json(
      { error: "Unable to save text right now" },
      { status: 500 }
    );
  }
}

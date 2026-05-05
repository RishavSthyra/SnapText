import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(
    request: Request,
    
    { params }: {
        params: Promise<{ code: string }>
    }
) {
  try {
    const { code } = await params;

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
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
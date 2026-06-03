import { NextRequest, NextResponse } from "next/server";
import {
  OCR_MAX_FILE_SIZE_BYTES,
  preprocessImageForOcr,
  recognizeTextFromImage,
} from "@/lib/ocr";
import { postprocessOcrText } from "@/lib/ocr-ai";

export const runtime = "nodejs";
export const maxDuration = 60;
const OCR_AI_TIME_BUDGET_MS = 45_000;

export async function POST(request: NextRequest) {
  const requestStartedAt = Date.now();

  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "Cropped image is required" },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Please upload a valid image file" },
        { status: 400 }
      );
    }

    if (image.size > OCR_MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image must be 8MB or smaller" },
        { status: 413 }
      );
    }

    const rawBuffer = Buffer.from(await image.arrayBuffer());
    const processedBuffer = await preprocessImageForOcr(rawBuffer);
    const result = await recognizeTextFromImage(processedBuffer);

    if (!result.text) {
      return NextResponse.json(
        {
          error:
            "No readable text was found in the selected crop. Try a larger or clearer area.",
        },
        { status: 422 }
      );
    }

    const elapsedMs = Date.now() - requestStartedAt;
    const postprocessed =
      elapsedMs >= OCR_AI_TIME_BUDGET_MS
        ? {
            text: result.text,
            enhanced: false,
            skippedReason: "server-time-budget",
          }
        : await postprocessOcrText(result.text);

    return NextResponse.json({
      text: postprocessed.text,
      rawText: result.text,
      confidence: result.confidence,
      fileName: image.name || "cropped-image.png",
      aiEnhanced: postprocessed.enhanced,
      aiModel: postprocessed.model,
      aiUsage: postprocessed.usage,
      aiSkippedReason: postprocessed.skippedReason,
    });
  } catch (error) {
    console.error("OCR API failed:", error);

    return NextResponse.json(
      { error: "Unable to extract text right now" },
      { status: 500 }
    );
  }
}

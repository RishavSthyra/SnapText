import sharp from "sharp";
import path from "path";
import { PSM, createWorker } from "tesseract.js";

export { OCR_HISTORY_LIMIT, type OcrHistoryItem } from "@/lib/ocr-types";

export const OCR_MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const tesseractWorkerPath = path.join(
  process.cwd(),
  "node_modules",
  "tesseract.js",
  "src",
  "worker-script",
  "node",
  "index.js"
);

export async function preprocessImageForOcr(input: Buffer) {
  return sharp(input)
    .rotate()
    .grayscale()
    .normalize()
    .linear(1.22, -14)
    .sharpen({ sigma: 1.1, m1: 1.2, m2: 1.8 })
    .png()
    .toBuffer();
}

export async function recognizeTextFromImage(input: Buffer) {
  const worker = await createWorker("eng", 1, {
    cachePath: "/tmp/snaptext-tesseract",
    workerPath: tesseractWorkerPath,
  });

  try {
    await worker.setParameters({
      preserve_interword_spaces: "1",
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      user_defined_dpi: "300",
    });

    const result = await worker.recognize(input);

    return {
      text: result.data.text.trim(),
      confidence:
        typeof result.data.confidence === "number"
          ? Math.round(result.data.confidence)
          : null,
    };
  } finally {
    await worker.terminate();
  }
}

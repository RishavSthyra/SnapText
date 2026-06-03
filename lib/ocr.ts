import os from "os";
import sharp from "sharp";
import { PSM, createWorker } from "tesseract.js";

export { OCR_HISTORY_LIMIT, type OcrHistoryItem } from "@/lib/ocr-types";

export const OCR_MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const tesseractCachePath = os.tmpdir();
type OcrWorker = Awaited<ReturnType<typeof createWorker>>;

let sharedWorkerPromise: Promise<OcrWorker> | null = null;
let workerJobChain = Promise.resolve();

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

async function getSharedWorker() {
  if (!sharedWorkerPromise) {
    sharedWorkerPromise = createWorker("eng", 1, {
      cachePath: `${tesseractCachePath}/snaptext-tesseract`,
    }).catch((error) => {
      sharedWorkerPromise = null;
      throw error;
    });
  }

  return sharedWorkerPromise;
}

export async function recognizeTextFromImage(input: Buffer) {
  const runRecognition = async () => {
    const worker = await getSharedWorker();

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
    } catch (error) {
      sharedWorkerPromise = null;

      try {
        await worker.terminate();
      } catch {
        // Ignore cleanup errors after a failed recognition attempt.
      }

      throw error;
    }
  };

  const job = workerJobChain.then(runRecognition, runRecognition);
  workerJobChain = job.then(
    () => undefined,
    () => undefined
  );

  return job;
}

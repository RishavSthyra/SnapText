"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import toast from "react-hot-toast";
import { createWorker, PSM } from "tesseract.js";
import ImageDropzone from "@/components/ocr/ImageDropzone";
import OcrHistory from "@/components/ocr/OcrHistory";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { OCR_HISTORY_LIMIT, type OcrHistoryItem } from "@/lib/ocr-types";
import { getCroppedImageBlob } from "@/utils/crop-image";

const OCR_SESSION_HISTORY_KEY = "snaptext:ocr-history";
type BrowserOcrWorker = Awaited<ReturnType<typeof createWorker>>;
type OcrProgressMessage = {
  progress: number;
  status: string;
};

function formatOcrStatus(status: string) {
  switch (status) {
    case "loading tesseract core":
      return "Loading OCR engine";
    case "loading language traineddata":
      return "Loading language data";
    case "initializing api":
      return "Initializing OCR";
    case "recognizing text":
      return "Recognizing text";
    default:
      return "Preparing OCR";
  }
}

function isOcrHistoryItem(value: unknown): value is OcrHistoryItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as OcrHistoryItem).id === "string" &&
    typeof (value as OcrHistoryItem).text === "string" &&
    typeof (value as OcrHistoryItem).fileName === "string" &&
    typeof (value as OcrHistoryItem).createdAt === "number"
  );
}

function readSessionHistory() {
  try {
    const raw = window.sessionStorage.getItem(OCR_SESSION_HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed.filter(isOcrHistoryItem) : [];
  } catch {
    return [];
  }
}

function writeSessionHistory(history: OcrHistoryItem[]) {
  window.sessionStorage.setItem(
    OCR_SESSION_HISTORY_KEY,
    JSON.stringify(history.slice(0, OCR_HISTORY_LIMIT))
  );
}

export default function OcrWorkspace() {
  const [file, setFile] = useState<File | null>(null);
  const imageUrl = useObjectUrl(file);
  const isMountedRef = useRef(true);
  const workerRef = useRef<BrowserOcrWorker | null>(null);
  const workerPromiseRef = useRef<Promise<BrowserOcrWorker> | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [resultText, setResultText] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [aiEnhanced, setAiEnhanced] = useState(false);
  const [, setOcrStatus] = useState("Idle");
  const [ocrProgress, setOcrProgress] = useState<number | null>(null);
  const [history, setHistory] = useState<OcrHistoryItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    return readSessionHistory();
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      workerPromiseRef.current = null;

      if (workerRef.current) {
        void workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const getOcrWorker = useCallback(async () => {
    if (!workerPromiseRef.current) {
      workerPromiseRef.current = createWorker("eng", 1, {
        logger: (message: OcrProgressMessage) => {
          if (!isMountedRef.current) {
            return;
          }

          setOcrStatus(formatOcrStatus(message.status));
          setOcrProgress(
            Number.isFinite(message.progress)
              ? Math.round(message.progress * 100)
              : null
          );
        },
      })
        .then(async (worker) => {
          workerRef.current = worker;
          await worker.setParameters({
            preserve_interword_spaces: "1",
            tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
            user_defined_dpi: "300",
          });
          return worker;
        })
        .catch((error) => {
          workerPromiseRef.current = null;
          throw error;
        });
    }

    return workerPromiseRef.current;
  }, []);

  useEffect(() => {
    if (file) {
      void getOcrWorker();
    }
  }, [file, getOcrWorker]);

  const handleFile = (nextFile: File) => {
    setFile(nextFile);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setResultText("");
    setConfidence(null);
    setAiEnhanced(false);
  };

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const generateText = async () => {
    if (!imageUrl || !croppedAreaPixels || !file) {
      toast.error("Upload an image and select an area first");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Extracting text...");

    try {
      const croppedBlob = await getCroppedImageBlob(imageUrl, croppedAreaPixels);
      const worker = await getOcrWorker();
      setOcrStatus("Recognizing text");
      setOcrProgress(0);

      const {
        data: { text, confidence: rawConfidence },
      } = await worker.recognize(croppedBlob);

      const nextText = text.trim();

      if (!nextText) {
        throw new Error(
          "No readable text was found in the selected crop. Try a larger or clearer area."
        );
      }

      const nextConfidence =
        typeof rawConfidence === "number" ? Math.round(rawConfidence) : null;

      setResultText(nextText);
      setConfidence(nextConfidence);
      setAiEnhanced(false);
      setOcrStatus("OCR complete");
      setOcrProgress(100);

      const historyItem: OcrHistoryItem = {
        id: crypto.randomUUID(),
        text: nextText,
        fileName: file.name || "cropped-image.png",
        createdAt: Date.now(),
        confidence: nextConfidence,
      };

      setHistory((current) => {
        const nextHistory = [historyItem, ...current].slice(0, OCR_HISTORY_LIMIT);
        writeSessionHistory(nextHistory);
        return nextHistory;
      });

      toast.success("Text extracted", { id: loadingToast });
    } catch (error) {
      console.error(error);
      setOcrStatus("OCR failed");
      setOcrProgress(null);
      toast.error(
        error instanceof Error ? error.message : "Unable to extract text",
        { id: loadingToast }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyResult = async () => {
    if (!resultText.trim()) {
      toast.error("There is no extracted text to copy yet");
      return;
    }

    await navigator.clipboard.writeText(resultText);
    toast.success("Extracted text copied");
  };

  return (
    <div className="relative overflow-hidden bg-[#050816] px-3 pb-10 pt-28 text-white sm:px-6 sm:pt-32 md:pt-36">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(100,76,255,0.16),transparent_22%),radial-gradient(circle_at_50%_68%,rgba(112,84,255,0.1),transparent_20%)]" />
        <div className="absolute inset-0 opacity-55 [background-image:radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.07)_1px,transparent_0)] [background-size:30px_30px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-5 text-center sm:mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#7d93ff]">
            IMAGE TO TEXT
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Extract text from any crop
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/58 sm:text-lg">
            Upload, crop, and copy text inside the same visual system as the rest
            of SnapText.
          </p>
        </div>

        <div className="rounded-[2rem] border border-[#2f2758] bg-[linear-gradient(180deg,rgba(18,21,45,0.97)_0%,rgba(11,15,33,0.98)_100%)] p-3 shadow-[0_35px_80px_-45px_rgba(0,0,0,1)] sm:rounded-[2.2rem] sm:p-5 md:p-6">
          <ImageDropzone onFile={handleFile} disabled={isLoading} />

          {imageUrl && (
            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
              <section>
                <div className="relative h-[420px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0c1126] sm:h-[520px]">
                  <Cropper
                    image={imageUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={undefined}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                    cropShape="rect"
                    showGrid
                    objectFit="contain"
                    classes={{
                      cropAreaClassName:
                        "shadow-[0_0_0_9999px_rgba(15,23,42,0.48)]",
                    }}
                  />
                </div>

                <div className="mt-4 flex flex-col gap-3 rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center">
                  <label
                    htmlFor="zoom"
                    className="text-sm font-semibold text-white/76"
                  >
                    Zoom
                  </label>
                  <input
                    id="zoom"
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(event) => setZoom(Number(event.target.value))}
                    className="w-full accent-sky-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCrop({ x: 0, y: 0 });
                      setZoom(1);
                    }}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/78 transition hover:bg-white/[0.08]"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => void generateText()}
                    className="rounded-2xl bg-[linear-gradient(90deg,#734dff_0%,#5d8fff_100%)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? "Generating..." : "Generate text"}
                  </button>
                </div>
              </section>

              <aside className="rounded-[1.6rem] border border-white/10 bg-[rgba(10,14,31,0.9)] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7d93ff]">
                    Extracted Text
                  </h2>
                  {confidence !== null && (
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/72">
                      {confidence}% confidence
                    </span>
                  )}
                  {aiEnhanced && (
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/72">
                      AI refined
                    </span>
                  )}
                </div>

                <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/58">
                  {isLoading && ocrProgress !== null ? ` (${ocrProgress}%)` : ""}
                </div>

                <div className="min-h-72 rounded-2xl border border-white/10 bg-[#11152d] p-4 text-sm leading-7 whitespace-pre-wrap text-white/78">
                  {resultText || (
                    <span className="text-white/34">
                      Drag the crop handles over text, then generate.
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => void copyResult()}
                    className="rounded-2xl bg-[linear-gradient(90deg,#734dff_0%,#5d8fff_100%)] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    Copy text
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResultText("");
                      setConfidence(null);
                      setAiEnhanced(false);
                      toast.success("Result cleared");
                    }}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/78 transition hover:bg-white/[0.08]"
                  >
                    Clear
                  </button>
                </div>
              </aside>
            </div>
          )}

          <OcrHistory
            history={history}
            onSelect={(text) => {
              setResultText(text);
              setConfidence(null);
              setAiEnhanced(false);
              toast.success("History item opened");
            }}
          />
        </div>
      </div>
    </div>
  );
}

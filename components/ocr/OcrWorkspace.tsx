"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import toast from "react-hot-toast";
import ImageDropzone from "@/components/ocr/ImageDropzone";
import OcrHistory from "@/components/ocr/OcrHistory";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { OCR_HISTORY_LIMIT, type OcrHistoryItem } from "@/lib/ocr-types";
import { getCroppedImageBlob } from "@/utils/crop-image";

const OCR_SESSION_HISTORY_KEY = "snaptext:ocr-history";

interface OcrResponse {
  text?: string;
  rawText?: string;
  confidence?: number | null;
  fileName?: string;
  aiEnhanced?: boolean;
  aiModel?: string;
  aiSkippedReason?: string;
  error?: string;
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
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [resultText, setResultText] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [aiEnhanced, setAiEnhanced] = useState(false);
  const [history, setHistory] = useState<OcrHistoryItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    return readSessionHistory();
  });
  const [isLoading, setIsLoading] = useState(false);

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
      const formData = new FormData();

      formData.append(
        "image",
        croppedBlob,
        `${file.name.replace(/\.[^.]+$/, "") || "crop"}-crop.png`
      );

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as OcrResponse;

      if (!response.ok || !data.text) {
        throw new Error(data.error || "Unable to extract text");
      }

      setResultText(data.text);
      setConfidence(data.confidence ?? null);
      setAiEnhanced(data.aiEnhanced === true);

      const historyItem: OcrHistoryItem = {
        id: crypto.randomUUID(),
        text: data.text,
        fileName: data.fileName || file.name || "cropped-image.png",
        createdAt: Date.now(),
        confidence: data.confidence ?? null,
      };

      setHistory((current) => {
        const nextHistory = [historyItem, ...current].slice(0, OCR_HISTORY_LIMIT);
        writeSessionHistory(nextHistory);
        return nextHistory;
      });

      toast.success(
        data.aiEnhanced ? "Text extracted and refined" : "Text extracted",
        { id: loadingToast }
      );
    } catch (error) {
      console.error(error);
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
    <div className="bg-white px-3 pb-8 pt-24 text-slate-950 sm:px-6 sm:pt-28 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 text-center sm:mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">
            IMAGE TO TEXT
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
            Extract text from any crop
          </h1>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-[0_24px_80px_-60px_rgba(15,23,42,0.45)] sm:rounded-[2rem] sm:p-5 md:p-6">
          <ImageDropzone onFile={handleFile} disabled={isLoading} />

          {imageUrl && (
            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
              <section>
                <div className="relative h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-[520px]">
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

                <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
                  <label
                    htmlFor="zoom"
                    className="text-sm font-semibold text-slate-700"
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
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => void generateText()}
                    className="rounded-2xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? "Generating..." : "Generate text"}
                  </button>
                </div>
              </section>

              <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Extracted Text
                  </h2>
                  {confidence !== null && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                      {confidence}% confidence
                    </span>
                  )}
                  {aiEnhanced && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                      AI refined
                    </span>
                  )}
                </div>

                <div className="min-h-72 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 whitespace-pre-wrap text-slate-800">
                  {resultText || (
                    <span className="text-slate-400">
                      Drag the crop handles over text, then generate.
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => void copyResult()}
                    className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
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
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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

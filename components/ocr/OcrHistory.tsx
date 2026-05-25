"use client";

import toast from "react-hot-toast";
import type { OcrHistoryItem } from "@/lib/ocr-types";

function formatHistoryTime(timestamp: number) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export default function OcrHistory({
  history,
  onSelect,
}: {
  history: OcrHistoryItem[];
  onSelect: (text: string) => void;
}) {
  const copyHistoryItem = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("OCR text copied");
  };

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Image Text History
        </h2>
        <span className="text-xs font-medium text-slate-400">
          {history.length} saved
        </span>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
          Extracted text will appear here after your first scan.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {history.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {item.fileName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatHistoryTime(item.createdAt)}
                    {item.confidence !== null ? ` · ${item.confidence}%` : ""}
                  </p>
                </div>
              </div>

              <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {item.text}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => onSelect(item.text)}
                  className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => void copyHistoryItem(item.text)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Copy
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

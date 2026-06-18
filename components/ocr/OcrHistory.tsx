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
        <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7d93ff]">
          Image Text History
        </h2>
        <span className="text-xs font-medium text-white/42">
          {history.length} saved
        </span>
      </div>

      {history.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-[rgba(10,14,31,0.86)] px-4 py-6 text-center text-sm text-white/48">
          Extracted text will appear here after your first scan.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {history.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,21,45,0.96)_0%,rgba(11,15,33,0.98)_100%)] p-4 shadow-[0_24px_60px_-38px_rgba(0,0,0,0.95)]"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {item.fileName}
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    {formatHistoryTime(item.createdAt)}
                    {item.confidence !== null ? ` · ${item.confidence}%` : ""}
                  </p>
                </div>
              </div>

              <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-white/68">
                {item.text}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => onSelect(item.text)}
                  className="rounded-xl bg-[linear-gradient(90deg,#734dff_0%,#5d8fff_100%)] px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => void copyHistoryItem(item.text)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/78 transition hover:bg-white/[0.08]"
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

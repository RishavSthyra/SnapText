"use client";

import { useRef, useState, type DragEvent } from "react";
import toast from "react-hot-toast";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

export default function ImageDropzone({
  onFile,
  disabled = false,
}: {
  onFile: (file: File) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const acceptFile = (file: File | undefined) => {
    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Use a PNG, JPG, or WebP image");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error("Image must be 8MB or smaller");
      return;
    }

    onFile(file);
    toast.success("Image ready to crop");
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    acceptFile(event.dataTransfer.files[0]);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`rounded-2xl border border-dashed p-4 text-center transition ${
        isDragging
          ? "border-sky-400 bg-sky-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => acceptFile(event.target.files?.[0])}
      />

      <div className="mx-auto flex min-h-36 max-w-xl flex-col items-center justify-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white">
          <span className="text-xl font-semibold">+</span>
        </div>
        <div>
          <p className="text-base font-semibold text-slate-900">
            Drop an image here
          </p>
          <p className="mt-1 text-sm text-slate-500">
            PNG, JPG, or WebP up to 8MB
          </p>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Choose image
        </button>
      </div>
    </div>
  );
}

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
      className={`rounded-[2rem] border border-dashed p-4 text-center transition ${
        isDragging
          ? "border-[#7d93ff] bg-[rgba(19,24,52,0.92)]"
          : "border-white/10 bg-[rgba(10,14,31,0.9)]"
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
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(90deg,#734dff_0%,#5d8fff_100%)] text-white shadow-[0_18px_38px_-20px_rgba(93,143,255,0.9)]">
          <span className="text-xl font-semibold">+</span>
        </div>
        <div>
          <p className="text-base font-semibold text-white">
            Drop an image here
          </p>
          <p className="mt-1 text-sm text-white/50">
            PNG, JPG, or WebP up to 8MB
          </p>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="rounded-2xl bg-[linear-gradient(90deg,#734dff_0%,#5d8fff_100%)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Choose image
        </button>
      </div>
    </div>
  );
}

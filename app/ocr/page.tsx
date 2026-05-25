import type { Metadata } from "next";
import OcrWorkspace from "@/components/ocr/OcrWorkspace";

export const metadata: Metadata = {
  title: "OCR Tool - Extract Text from Images Online | SnapText",
  description:
    "Free OCR tool to extract text from images. Upload photos, screenshots, or scanned documents and get editable text instantly. No signup required.",
  alternates: { canonical: "https://send-anywhere-text.com/ocr"}, keywords:
    "OCR, optical character recognition, extract text from image, image to text, OCR tool, online OCR, free OCR",
};

export default function OcrPage() {
  return <OcrWorkspace />;
}

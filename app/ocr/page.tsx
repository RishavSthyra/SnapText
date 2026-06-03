import type { Metadata } from "next";
import OcrWorkspace from "@/components/ocr/OcrWorkspace";

export const metadata: Metadata = {
  title: "Free Image to Text OCR Tool | SnapText",
  description:
    "Use SnapText's free OCR tool to extract text from images, screenshots, and scanned documents. Get editable text instantly with no signup required.",
  alternates: { canonical: "https://send-anywhere-text.com/ocr" },
  keywords: [
    "free OCR tool",
    "image to text",
    "extract text from image",
    "OCR online",
    "screenshot to text",
    "photo to text",
    "document OCR",
    "optical character recognition",
  ],
  openGraph: {
    type: "website",
    url: "https://send-anywhere-text.com/ocr",
    siteName: "SnapText",
    title: "Free Image to Text OCR Tool | SnapText",
    description:
      "Extract editable text from images, screenshots, and scanned documents with SnapText's free OCR tool.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image to Text OCR Tool | SnapText",
    description:
      "Free OCR for images, screenshots, and scanned documents with instant text extraction.",
  },
};

export default function OcrPage() {
  return <OcrWorkspace />;
}

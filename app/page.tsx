import SendComponent from "@/components/SendComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SnapText - Image to Text & Send Text Instantly",
  description:
    "Free image to text converter and instant text sharing tool. Extract text from photos, screenshots, and documents with OCR. Send text with burn-after-reading codes. No signup required.",
  alternates: { canonical: "https://send-anywhere-text.com"}, keywords:
    "send anywhere text, image to text, send text, text sharing, OCR, extract text, screenshot to text, photo to text, burn after reading, temporary text, free OCR tool",
};

export default function Home() {
  return (
    <div>
      <SendComponent />
    </div>
  );
}
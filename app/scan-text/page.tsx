import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Scan Text - Extract Text from Scans | SnapText",
  description:
    "Scan text from documents, receipts, and papers. OCR-powered text scanning from any scanned image. Free and accurate.",
  alternates: { canonical: "https://send-anywhere-text.com/scan-text"}, keywords:
    "scan text, scan to text, text scanning, document scan text, scan text from image, OCR scanning",
};

const content = `
<p><strong>Scan text</strong> from any document or image. Our OCR scanner extracts text from scanned papers, receipts, and photos. Free, fast, accurate.</p>

<h2>How to Scan Text</h2>
<p>Scan text from images:</p>
<ol>
<li>Upload your scan or photo</li>
<li>Wait for OCR processing</li>
<li>Copy extracted text</li>
</ol>

<h2>Scan Text Use Cases</h2>
<h3>Document Scanning</h3>
<p>Scan text from contracts, letters, and papers. Convert scanned documents to editable text.</p>

<h3>Receipt Scanning</h3>
<p>Scan text from purchase receipts for expense tracking and record-keeping.</p>

<h3>Book Scanning</h3>
<p>Scan text from book pages and academic materials for research and study.</p>

<h2>Try Scan Text</h2>
<p>Scan text from any image. Upload, extract, copy. Try SnapText free.</p>
`;

const relatedLinks = [
  { href: "/image-to-text", text: "Image to Text" },
  { href: "/document-scanner", text: "Document Scanner" },
  { href: "/text-extractor", text: "Text Extractor" },
  { href: "/free-ocr-tool", text: "Free OCR Tool" },
  { href: "/pdf-to-text", text: "PDF to Text" },
];

export default function ScanTextPage() {
  return (
    <SeoPage
      title="Scan Text - Extract Text from Scans"
      description="Scan text from documents and images. Free OCR text scanning."
      keywords="scan text, scan to text, text scanning"
      h1="Scan Text - Extract Text from Scans"
      content={content}
      relatedLinks={relatedLinks}
    />
  );
}
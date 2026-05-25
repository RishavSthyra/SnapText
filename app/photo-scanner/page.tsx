import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Photo Scanner - Scan Photos to Text | SnapText",
  description:
    "Scan photos to extract text. Photo scanner for receipts, documents, and images. Free OCR-powered scanning.",
  alternates: { canonical: "https://send-anywhere-text.com/photo-scanner"}, keywords:
    "photo scanner, scan photos, scan photo to text, photo OCR, scan receipt photo, photo text scanner",
};

const content = `
<p><strong>Photo scanner</strong> that extracts text from any photo. Upload receipt photos, document photos, and any image to scan text. Free OCR-powered photo scanner.</p>

<h2>How Photo Scanner Works</h2>
<p>Scan photos for text:</p>
<ol>
<li>Upload your photo</li>
<li>Wait for OCR processing</li>
<li>Copy extracted text</li>
</ol>

<h2>Photo Scanner Use Cases</h2>
<h3>Receipt Scanning</h3>
<p>Scan photos of receipts to extract items, prices, and totals for expense tracking.</p>

<h3>Document Photos</h3>
<p>Scan photos of documents to extract text for digitization and editing.</p>

<h3>Business Card Scanning</h3>
<p>Scan business card photos to extract contact information automatically.</p>

<h3>Whiteboard Photos</h3>
<p>Scan whiteboard session photos to extract meeting notes and ideas.</p>

<h2>Photo Scanner Features</h2>
<ul>
<li><strong>High accuracy:</strong> 95%+ accuracy on clear photos</li>
<li><strong>Multi-format:</strong> JPG, PNG, HEIC, WebP supported</li>
<li><strong>Mobile ready:</strong> Works on phone and tablet</li>
<li><strong>Fast processing:</strong> Results in seconds</li>
</ul>

<h2>Photo Scanner Best Practices</h2>
<ul>
<li><strong>Good lighting:</strong> Even lighting produces better results</li>
<li><strong>High resolution:</strong> Higher quality photos scan better</li>
<li><strong>Steady capture:</strong> Blurry photos reduce accuracy</li>
<li><strong>Straight angle:</strong> Shoot straight on when possible</li>
</ul>

<h2>Try Photo Scanner</h2>
<p>Scan any photo to extract text. Upload your photo and get the text instantly. Try SnapText's photo scanner free.</p>
`;

const relatedLinks = [
  { href: "/photo-to-text", text: "Photo to Text" },
  { href: "/image-to-text", text: "Image to Text" },
  { href: "/document-scanner", text: "Document Scanner" },
  { href: "/text-extractor", text: "Text Extractor" },
  { href: "/scan-text", text: "Scan Text" },
];

export default function PhotoScannerPage() {
  return (
    <SeoPage
      title="Photo Scanner - Scan Photos to Text"
      description="Scan photos to extract text. Photo scanner for receipts, documents, and images."
      keywords="photo scanner, scan photos, scan photo to text"
      h1="Photo Scanner - Scan Photos to Text"
      content={content}
      relatedLinks={relatedLinks}
    />
  );
}
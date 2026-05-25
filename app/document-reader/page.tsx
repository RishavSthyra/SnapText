import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Document Reader - Read Text from Documents | SnapText",
  description:
    "Read text from document images. Document reader for scanned papers, PDFs, and files. Free OCR document reading.",
  keywords:
    "document reader, read document text, read text from document, document OCR, scan document text, scanned document reader",
};

const content = `
<p><strong>Document reader</strong> that extracts text from document images. Upload scanned documents, PDFs, and papers to read text content. Free OCR-powered document reader.</p>

<h2>How Document Reader Works</h2>
<p>Read text from documents:</p>
<ol>
<li>Upload your document image</li>
<li>Wait for OCR processing</li>
<li>Read and copy extracted text</li>
</ol>

<h2>Document Reader Use Cases</h2>
<h3>Scanned Documents</h3>
<p>Read text from scanned contracts, letters, and papers.</p>

<h3>PDF Documents</h3>
<p>Read text from image-based PDFs and scanned ebooks.</p>

<h3>Archive Materials</h3>
<p>Read text from historical documents and archive materials.</p>

<h3>Contracts</h3>
<p>Read text from photographed contracts and legal documents.</p>

<h2>Document Reader Features</h2>
<ul>
<li><strong>High accuracy:</strong> 95%+ accuracy on clear documents</li>
<li><strong>Format support:</strong> JPG, PNG, PDF, TIFF supported</li>
<li><strong>Multi-page:</strong> Process multiple pages</li>
<li><strong>Language support:</strong> 100+ languages recognized</li>
</ul>

<h2>Document Reader Best Practices</h2>
<ul>
<li><strong>High resolution:</strong> Higher quality scans read better</li>
<li><strong>Clear text:</strong> Sharp, readable text extracts best</li>
<li><strong>Good contrast:</strong> Dark on light works best</li>
<li><strong>Proper orientation:</strong> Upright documents read better</li>
</ul>

<h2>Try Document Reader</h2>
<p>Read text from any document. Upload and extract. Try SnapText's document reader free.</p>
`;

const relatedLinks = [
  { href: "/document-scanner", text: "Document Scanner" },
  { href: "/image-to-text", text: "Image to Text" },
  { href: "/pdf-to-text", text: "PDF to Text" },
  { href: "/text-extractor", text: "Text Extractor" },
  { href: "/free-ocr-tool", text: "Free OCR Tool" },
];

export default function DocumentReaderPage() {
  return (
    <SeoPage
      title="Document Reader - Read Text from Documents"
      description="Read text from document images. Free OCR document reader."
      keywords="document reader, read document text, document OCR"
      h1="Document Reader - Read Text from Documents"
      content={content}
      relatedLinks={relatedLinks}
    />
  );
}
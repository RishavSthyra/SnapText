import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Image Reader - Read Text from Images | SnapText",
  description:
    "Extract and read text from any image. Image reader tool for photos, screenshots, and documents. Free and accurate OCR.",
  alternates: { canonical: "https://send-anywhere-text.com/image-reader"}, keywords:
    "image reader, read image text, read text from image, image to text reader, photo reader, screenshot reader",
};

const content = `
<p><strong>Image reader</strong> that extracts text from any image. Upload a photo, screenshot, or document, and read the text content. Free OCR-powered image reader.</p>

<h2>What is an Image Reader?</h2>
<p>An image reader uses OCR technology to extract and read text from visual content. SnapText's image reader pulls text from photos, screenshots, and documents.</p>

<h2>How Image Reader Works</h2>
<p>Read text from images:</p>
<ol>
<li>Upload your image</li>
<li>Image reader processes it</li>
<li>Extract and display text</li>
<li>Copy or use the text</li>
</ol>

<h2>Image Reader Use Cases</h2>
<h3>Photo Text</h3>
<p>Read text from photos of signs, receipts, whiteboards, and documents.</p>

<h3>Screenshot Text</h3>
<p>Read text from screenshots that don't allow selection.</p>

<h3>Document Reading</h3>
<p>Read text from scanned documents and image PDFs.</p>

<h2>Try Image Reader</h2>
<p>Read text from any image. Upload, extract, copy. Try SnapText's image reader free.</p>
`;

const relatedLinks = [
  { href: "/image-to-text", text: "Image to Text" },
  { href: "/text-extractor", text: "Text Extractor" },
  { href: "/photo-to-text", text: "Photo to Text" },
  { href: "/screenshot-to-text", text: "Screenshot to Text" },
  { href: "/free-ocr-tool", text: "Free OCR Tool" },
];

export default function ImageReaderPage() {
  return (
    <SeoPage
      title="Image Reader - Read Text from Images"
      description="Extract and read text from any image. Free OCR image reader."
      keywords="image reader, read image text, photo reader"
      h1="Image Reader - Read Text from Images"
      content={content}
      relatedLinks={relatedLinks}
    />
  );
}
import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Text from Photo - Extract Text from Photos | SnapText",
  description:
    "Get text from photo images. Extract text from camera photos and image files. Free OCR tool for extracting text from photos.",
  keywords:
    "text from photo, text from photo image, extract text from photo, photo text extraction, photo OCR",
};

const content = `
<p>Get <strong>text from photo</strong> images instantly. Upload any photo—receipts, documents, signs—and extract the text content. Free OCR-powered extraction.</p>

<h2>How to Get Text from Photo</h2>
<p>Extract text from photos:</p>
<ol>
<li>Upload your photo</li>
<li>Wait for processing</li>
<li>Copy extracted text</li>
</ol>

<h2>Text from Photo Use Cases</h2>
<h3>Receipt Photos</h3>
<p>Get text from receipt photos for expense tracking and budgeting.</p>

<h3>Document Photos</h3>
<p>Extract text from photographed documents and papers.</p>

<h3>Sign Photos</h3>
<p>Read text from photos of signs, posters, and notices.</p>

<h3>Whiteboard Photos</h3>
<p>Get text from meeting whiteboard photos and session notes.</p>

<h2>Text from Photo Formats</h2>
<ul>
<li><strong>JPG/JPEG:</strong> Standard photo format</li>
<li><strong>PNG:</strong> High quality photos</li>
<li><strong>HEIC:</strong> iPhone photos</li>
<li><strong>WebP:</strong> Compressed photos</li>
</ul>

<h2>Try Text from Photo</h2>
<p>Get text from any photo. Upload and extract. Try SnapText free.</p>
`;

const relatedLinks = [
  { href: "/photo-to-text", text: "Photo to Text" },
  { href: "/image-to-text", text: "Image to Text" },
  { href: "/text-extractor", text: "Text Extractor" },
  { href: "/picture-to-text", text: "Picture to Text" },
  { href: "/convert-image-to-text", text: "Convert Image to Text" },
];

export default function TextFromPhotoPage() {
  return (
    <SeoPage
      title="Text from Photo - Extract Text from Photos"
      description="Get text from photo images. Extract text from any photo file."
      keywords="text from photo, photo text extraction, photo OCR"
      h1="Text from Photo - Extract Text from Photos"
      content={content}
      relatedLinks={relatedLinks}
    />
  );
}
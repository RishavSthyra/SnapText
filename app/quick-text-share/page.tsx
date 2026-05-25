import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Quick Text Share - Share Text in Seconds | SnapText",
  description:
    "Share text quickly with temporary links. No signup, no delay—just paste text and share. Perfect for quick sharing needs.",
  alternates: { canonical: "https://send-anywhere-text.com/quick-text-share"}, keywords:
    "quick text share, quick text, fast text share, share text fast, rapid text share, quick sharing",
};

const content = `
<p><strong>Quick text share</strong> in seconds. No signup, no delay—just paste your text and share a link. The fastest way to share text securely.</p>

<h2>How Quick Text Share Works</h2>
<p>Share text in under 10 seconds:</p>
<ol>
<li>Paste your text</li>
<li>Click share</li>
<li>Copy the link</li>
</ol>
<p>That's it. No registration, no verification, no waiting.</p>

<h2>Quick Text vs Slow Methods</h2>
<p>Other text sharing methods:</p>
<ul>
<li><strong>Email:</strong> Subject, recipient, body, send—30+ seconds</li>
<li><strong>Chat app:</strong> Open app, find contact, type message—20+ seconds</li>
<li><strong>Cloud doc:</strong> Create doc, share permissions, send link—60+ seconds</li>
</ul>
<p>Quick text share: paste, click, copy—5 seconds.</p>

<h2>Quick Text Use Cases</h2>
<h3>Passwords</h3>
<p>Share passwords quickly when needed. No fumbling with password managers—just paste and share.</p>

<h3>Codes</h3>
<p>Quick sharing of verification codes, 2FA tokens, and temporary passwords.</p>

<h3>Links</h3>
<p>Share URLs quickly when text-only channels are all that's available.</p>

<h3>Notes</h3>
<p>Quick notes to colleagues, family, or friends without starting a conversation.</p>

<h2>Quick Text for Speed</h2>
<ul>
<li><strong>No waiting:</strong> Instant link generation</li>
<li><strong>No forms:</strong> Just paste and go</li>
<li><strong>No verification:</strong> Immediate use</li>
<li><strong>No accounts:</strong> Start instantly</li>
</ul>

<h2>Try Quick Text Share</h2>
<p>Don't slow down. Paste your text, get a link, share it. Quick text sharing for when you need to move fast. Try SnapText free.</p>
`;

const relatedLinks = [
  { href: "/send-text", text: "Send Text" },
  { href: "/instant-text-share", text: "Instant Text Share" },
  { href: "/share-text", text: "Share Text" },
  { href: "/text-transfer", text: "Text Transfer" },
  { href: "/burn-after-reading", text: "Burn After Reading" },
];

export default function QuickTextSharePage() {
  return (
    <SeoPage
      title="Quick Text Share - Share Text in Seconds"
      description="Share text quickly with temporary links. No signup, just paste and share."
      keywords="quick text share, quick text, fast text share"
      h1="Quick Text Share - Share Text in Seconds"
      content={content}
      relatedLinks={relatedLinks}
    />
  );
}
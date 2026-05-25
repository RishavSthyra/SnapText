import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Text Transfer - Transfer Text Between Devices | SnapText",
  description:
    "Transfer text between devices instantly. Share clipboard content, code snippets, and notes via temporary links. Free and secure.",
  keywords:
    "text transfer, transfer text, send text, text sharing, clipboard transfer, share text, text between devices",
};

const content = `
<p><strong>Text transfer</strong> made simple. Send text between devices instantly via temporary links. No cables, no apps, no accounts—just paste and share.</p>

<h2>What is Text Transfer?</h2>
<p>Text transfer is moving text from one device to another. SnapText makes this effortless—you paste your text, get a link, recipient opens link on any device.</p>

<h2>How Text Transfer Works</h2>
<p>Transfer text between devices:</p>
<ol>
<li>Paste text on source device</li>
<li>Generate transfer link</li>
<li>Open link on target device</li>
<li>Copy received text</li>
</ol>

<h2>Text Transfer Use Cases</h2>
<h3>Device to Device</h3>
<p>Share text between your phone and computer, laptop and tablet, or any devices. No cables or sync required.</p>

<h3>Clipboard Sharing</h3>
<p>Copy text on one device, transfer to another. Perfect for copying between work and personal devices.</p>

<h3>Code Transfer</h3>
<p>Write code on your desktop, transfer to laptop. No email, no USB, no git commits—just a link.</p>

<h3>Quick Notes</h3>
<p>Send yourself notes between devices. Write on one device, open on another.</p>

<h2>Text Transfer vs Other Methods</h2>
<table>
<tr><th>Method</th><th>Text Transfer</th><th>Others</th></tr>
<tr><td>Setup</td><td>None—paste and share</td><td>Accounts/apps often required</td></tr>
<tr><td>Speed</td><td>Instant—seconds</td><td>Minutes with setup</td></tr>
<tr><td>Permanence</td><td>None—auto-deleted</td><td>Permanent usually</td></tr>
<tr><td>Privacy</td><td>Maximum—no logs</td><td>Varies</td></tr>
</table>

<h2>Text Transfer Features</h2>
<ul>
<li><strong>Any device:</strong> Works on phone, tablet, computer</li>
<li><strong>Any platform:</strong> iOS, Android, Windows, Mac, Linux</li>
<li><strong>No apps:</strong> Browser only</li>
<li><strong>No accounts:</strong> Instant use</li>
<li><strong>Formatting preserved:</strong> Works for code and text</li>
</ul>

<h2>Text Transfer for Developers</h2>
<ul>
<li>Share code between machines</li>
<li>Transfer error logs</li>
<li>Send config files</li>
<li>Move documentation</li>
</ul>

<h2>Text Transfer for Business</h2>
<ul>
<li>Share between work devices</li>
<li>Transfer meeting notes</li>
<li>Move draft documents</li>
<li>Share credentials securely</li>
</ul>

<h2>Text Transfer Security</h2>
<ul>
<li><strong>One-time access:</strong> Link works once</li>
<li><strong>Auto-deletion:</strong> Text deleted after transfer</li>
<li><strong>No logs:</strong> No tracking</li>
<li><strong>Encrypted:</strong> Protected in transit</li>
</ul>

<h2>Try Text Transfer</h2>
<p>Transfer text between devices instantly. No apps, no cables, no accounts—just paste, share, and transfer. Try SnapText for free text transfer.</p>
`;

const relatedLinks = [
  { href: "/send-text", text: "Send Text" },
  { href: "/clipboard-share", text: "Clipboard Share" },
  { href: "/instant-text-share", text: "Instant Text Share" },
  { href: "/share-text", text: "Share Text" },
  { href: "/quick-text-share", text: "Quick Text Share" },
];

export default function TextTransferPage() {
  return (
    <SeoPage
      title="Text Transfer - Transfer Text Between Devices"
      description="Transfer text between devices instantly. Share via temporary links, no apps needed."
      keywords="text transfer, transfer text, send text"
      h1="Text Transfer - Transfer Text Between Devices"
      content={content}
      relatedLinks={relatedLinks}
    />
  );
}
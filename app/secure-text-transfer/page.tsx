import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Secure Text Transfer - Transfer Text Securely | SnapText",
  description:
    "Transfer text securely via encrypted temporary links. Private text transfer for sensitive information. Free and instant.",
  alternates: { canonical: "https://send-anywhere-text.com/secure-text-transfer"}, keywords:
    "secure text transfer, secure text sharing, encrypted text transfer, private text, secure text message",
};

const content = `
<p><strong>Secure text transfer</strong> via encrypted temporary links. Share text securely with burn-after-reading protection. Free and instant.</p>

<h2>What is Secure Text Transfer?</h2>
<p>Secure text transfer is sending text content through encrypted channels with temporary, self-destructing links. Your text is protected in transit and deleted after viewing.</p>

<h2>How Secure Text Transfer Works</h2>
<p>Transfer text securely:</p>
<ol>
<li>Paste your sensitive text</li>
<li>Generate encrypted link</li>
<li>Share via secure channel</li>
<li>Recipient views once</li>
<li>Text permanently deleted</li>
</ol>

<h2>Secure Text Transfer Security Features</h2>
<ul>
<li><strong>End-to-end encryption:</strong> Protected in transit</li>
<li><strong>One-time links:</strong> Work only once</li>
<li><strong>Auto-deletion:</strong> Deleted after viewing</li>
<li><strong>No logs:</strong> No metadata stored</li>
<li><strong>No recovery:</strong> Cannot be restored</li>
</ul>

<h2>Secure Text Transfer Use Cases</h2>
<h3>Credential Sharing</h3>
<p>Transfer passwords, API keys, and credentials securely. Nothing persists after transfer.</p>

<h3>Sensitive Documents</h3>
<p>Transfer sensitive text content without permanent storage. Legal, financial, personal information handled safely.</p>

<h3>Private Communications</h3>
<p>Transfer private messages without leaving traces. Confidential exchanges without documentation.</p>

<h2>Secure vs Regular Text Transfer</h2>
<table>
<tr><th>Feature</th><th>Secure</th><th>Regular</th></tr>
<tr><td>Encryption</td><td>End-to-end</td><td>Usually none</td></tr>
<tr><td>Lifespan</td><td>Temporary</td><td>Permanent</td></tr>
<tr><td>Recovery</td><td>Never</td><td>Always</td></tr>
<tr><td>Privacy</td><td>Maximum</td><td>Minimal</td></tr>
</table>

<h2>Try Secure Text Transfer</h2>
<p>Transfer text with maximum security. Encrypted, temporary, self-destructing. Try SnapText free.</p>
`;

const relatedLinks = [
  { href: "/send-text", text: "Send Text" },
  { href: "/share-text", text: "Share Text" },
  { href: "/burn-after-reading", text: "Burn After Reading" },
  { href: "/text-transfer", text: "Text Transfer" },
  { href: "/no-log-messaging", text: "No Log Messaging" },
];

export default function SecureTextTransferPage() {
  return (
    <SeoPage
      title="Secure Text Transfer - Transfer Text Securely"
      description="Transfer text securely via encrypted temporary links. Private and instant."
      keywords="secure text transfer, secure text sharing, encrypted text"
      h1="Secure Text Transfer - Transfer Text Securely"
      content={content}
      relatedLinks={relatedLinks}
    />
  );
}
import SendComponent from "@/components/SendComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SnapText | Share Text with Secure Temporary Links",
  description:
    "Share text instantly with temporary private links and burn-after-reading access. Fast, no signup required, and built for quick secure sharing across devices.",
  alternates: { canonical: "https://send-anywhere-text.com" },
  keywords: [
    "text sharing",
    "temporary text sharing",
    "send text online",
    "share text online",
    "private text sharing",
    "burn after reading text",
    "ephemeral messages",
    "cross device text sharing",
  ],
  openGraph: {
    type: "website",
    url: "https://send-anywhere-text.com",
    siteName: "SnapText",
    title: "SnapText | Share Text with Secure Temporary Links",
    description:
      "Share text instantly with secure short-lived links and burn-after-reading access.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapText | Share Text with Secure Temporary Links",
    description:
      "Fast temporary text sharing with private links and burn-after-reading access.",
  },
};

export default function Home() {
  return (
    <div>
      <SendComponent />
    </div>
  );
}

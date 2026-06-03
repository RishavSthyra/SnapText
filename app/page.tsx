import SendComponent from "@/components/SendComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SnapText | Share Text and Code with Temporary Private Links",
  description:
    "Share text and code instantly with temporary private links and burn-after-reading codes. Fast, no signup required, and built for quick secure sharing across devices.",
  alternates: { canonical: "https://send-anywhere-text.com" },
  keywords: [
    "text sharing",
    "temporary text sharing",
    "send text online",
    "share text online",
    "private text sharing",
    "burn after reading text",
    "share code snippets",
    "temporary code sharing",
    "ephemeral messages",
    "cross device text sharing",
  ],
  openGraph: {
    type: "website",
    url: "https://send-anywhere-text.com",
    siteName: "SnapText",
    title: "SnapText | Share Text and Code with Temporary Private Links",
    description:
      "Share text and code instantly with secure short-lived links and burn-after-reading codes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapText | Share Text and Code with Temporary Private Links",
    description:
      "Fast temporary text and code sharing with private links and burn-after-reading access.",
  },
};

export default function Home() {
  return (
    <div>
      <SendComponent />
    </div>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://send-anywhere-text.com"),
  title: "SnapText | Temporary Text Sharing & Burn-After-Reading Codes",
  description:
    "SnapText is a fast temporary text sharing tool for sending text and code with short-lived private links and burn-after-reading access codes.",
  keywords: [
    "SnapText",
    "text sharing",
    "temporary text sharing",
    "send text online",
    "share text online",
    "private text sharing",
    "burn after reading text",
    "share code snippets",
    "temporary code sharing",
    "ephemeral messages",
  ],
  applicationName: "SnapText",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "SnapText",
    title: "SnapText | Temporary Text Sharing & Burn-After-Reading Codes",
    description:
      "Share text and code instantly with short-lived private links and burn-after-reading access codes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapText | Temporary Text Sharing & Burn-After-Reading Codes",
    description:
      "Fast private text and code sharing with short-lived links and burn-after-reading access.",
  },
  other: {
    "google-adsense-account": "ca-pub-1035427747875439",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-950">
        <SiteHeader />
        <main className="relative z-0 flex-1 bg-transparent">{children}</main>
        <SiteFooter />
        <ToastProvider />
      </body>
    </html>
  );
}

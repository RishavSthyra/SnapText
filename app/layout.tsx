import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Sora } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://send-anywhere-text.com"),
  title: "SnapText | Temporary Text Sharing & Burn-After-Reading Codes",
  description:
    "SnapText is a fast temporary text sharing tool for sending text with short-lived private links and burn-after-reading access codes.",
  keywords: [
    "SnapText",
    "text sharing",
    "temporary text sharing",
    "send text online",
    "share text online",
    "private text sharing",
    "burn after reading text",
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
      "Share text instantly with short-lived private links and burn-after-reading access codes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapText | Temporary Text Sharing & Burn-After-Reading Codes",
    description:
      "Fast private text sharing with short-lived links and burn-after-reading access.",
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
      className={`${manrope.variable} ${sora.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#050816] text-white">
        <SiteHeader />
        <main className="relative z-0 flex-1 bg-[#050816]">{children}</main>
        <SiteFooter />
        <ToastProvider />
      </body>
    </html>
  );
}

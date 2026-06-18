import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 px-4 pb-8 pt-12 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 rounded-full border border-white/8 bg-[rgba(12,16,35,0.26)] px-6 py-5 text-sm text-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>&copy; 2025 SNAPTEXT. All rights reserved.</p>

        <div className="flex flex-wrap items-center gap-8">
          <Link href="/about" className="transition hover:text-white">
            About
          </Link>
          <Link
            href="/privacy-policy"
            className="transition hover:text-white"
          >
            Privacy Policy
          </Link>
          <Link href="/contact" className="transition hover:text-white">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

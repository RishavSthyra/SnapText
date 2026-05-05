import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto px-4 pb-6 pt-8 sm:px-6 sm:pb-8">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/72 px-5 py-6 text-sm text-slate-500 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>SNAPTEXT helps you share text and code with cleaner short-lived access.</p>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/about" className="transition hover:text-slate-900">
            About
          </Link>
          <Link href="/privacy-policy" className="transition hover:text-slate-900">
            Privacy Policy
          </Link>
          <Link href="/contact" className="transition hover:text-slate-900">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

"use client";

import BrandMark from "@/components/BrandMark";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/ocr", label: "Image to Text" },
  { href: "/about", label: "About" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 px-4 pt-6 sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 rounded-full border border-white/8 bg-[rgba(12,16,35,0.42)] px-5 py-3 shadow-[0_20px_48px_-32px_rgba(0,0,0,0.92)] backdrop-blur-xl">
          <BrandMark className="shrink-0" />

          <nav className="hidden items-center gap-11 lg:flex">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-2 text-[15px] font-medium transition ${
                    isActive ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-1/2 top-full mt-3 h-[2px] w-7 -translate-x-1/2 rounded-full bg-[#6f6cff] transition ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <div className="relative inline-flex">
              <Link
                href="/#share-workspace"
                className="relative z-10 inline-flex h-14 items-center rounded-full bg-[linear-gradient(90deg,#7c4dff_0%,#5b8cff_100%)] px-8 text-[15px] font-semibold text-white transition hover:brightness-110"
              >
                Get Started
              </Link>
              <div className="pointer-events-none absolute inset-x-6 bottom-[-10px] h-8 rounded-full bg-[linear-gradient(90deg,rgba(124,77,255,0.6),rgba(91,140,255,0.55))] blur-xl" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 5.25h12M3 9h12M3 12.75h12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[rgba(4,6,19,0.97)] px-5 py-6 lg:hidden">
          <div className="mx-auto flex h-full max-w-lg flex-col">
            <div className="flex items-center justify-between">
              <BrandMark onClick={() => setIsOpen(false)} />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M4.5 4.5 13.5 13.5M13.5 4.5l-9 9"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <nav className="mt-12 flex flex-1 flex-col gap-3">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-[1.45rem] border px-5 py-4 text-base font-medium transition ${
                      isActive
                        ? "border-violet-400/40 bg-white/8 text-white"
                        : "border-white/10 bg-white/[0.03] text-white/72 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/#share-workspace"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-14 items-center justify-center rounded-full bg-[linear-gradient(90deg,#7c4dff_0%,#5b8cff_100%)] px-8 text-[15px] font-semibold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

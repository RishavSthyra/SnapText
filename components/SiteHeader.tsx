"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

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
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

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
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const cards = cardRefs.current.filter(
      (card): card is HTMLElement => card !== null
    );

    if (!overlay || !panel) {
      return;
    }

    const context = gsap.context(() => {
      if (isOpen) {
        gsap.set(overlay, { pointerEvents: "auto" });

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        timeline
          .fromTo(
            overlay,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.22 }
          )
          .fromTo(
            panel,
            { x: 96, autoAlpha: 0, rotate: 1.6, scale: 0.985 },
            { x: 0, autoAlpha: 1, rotate: 0, scale: 1, duration: 0.56 },
            0
          )
          .fromTo(
            cards,
            { y: 34, autoAlpha: 0, scale: 0.965 },
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              duration: 0.5,
              stagger: 0.08,
            },
            0.14
          );

        return;
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
      });

      timeline
        .to(cards, {
          y: 18,
          autoAlpha: 0,
          duration: 0.16,
          stagger: { each: 0.03, from: "end" },
        })
        .to(
          panel,
          { x: 84, autoAlpha: 0, rotate: 1.2, scale: 0.985, duration: 0.28 },
          0.03
        )
        .to(
          overlay,
          {
            autoAlpha: 0,
            duration: 0.18,
            onComplete: () => {
              gsap.set(overlay, { pointerEvents: "none" });
            },
          },
          0.08
        );
    }, overlay);

    return () => {
      context.revert();
    };
  }, [isOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-4 z-40 px-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 rounded-full border border-slate-200 bg-white/82 px-4 py-3 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.24)] backdrop-blur-2xl sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-950"
          >
            SNAPTEXT
          </Link>

          <nav className="hidden items-center justify-end gap-1.5 lg:flex">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-950 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/[0.8] text-slate-900 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.4)] transition hover:border-slate-300 hover:bg-white lg:hidden"
          >
            <span className="sr-only">Open menu</span>
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

      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-50 opacity-0 lg:hidden"
      >
        <div
          className="absolute inset-0 bg-[rgba(15,23,42,0.32)] backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        />

        <div
          id="mobile-menu"
          ref={panelRef}
          className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#f9fbff_0%,#eff5ff_48%,#edf2ff_100%)]"
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-12rem] right-[-8rem] h-[26rem] w-[26rem] rounded-full bg-sky-300/30 blur-3xl" />
            <div className="absolute bottom-[-12rem] left-[-8rem] h-[24rem] w-[24rem] rounded-full bg-indigo-200/35 blur-3xl" />
          </div>

          <div className="relative flex h-full flex-col px-5 pb-8 pt-20 sm:px-8 sm:pt-24">
            <div
              ref={(node) => {
                cardRefs.current[0] = node;
              }}
              className="flex items-center justify-between gap-4 border-b border-slate-200/80 pb-6"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700/80">
                  Navigation
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Explore SnapText
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-900 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)] transition hover:bg-white"
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

            <nav className="flex-1 overflow-y-auto py-6">
              {navItems.map((item, index) => {
                const isActive =
                  item.href === "/"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    ref={(node) => {
                      cardRefs.current[index + 1] = node;
                    }}
                    className="group flex items-center justify-between gap-4 border-b border-slate-200/80 py-5 transition"
                  >
                    <span
                      className={`block text-3xl font-semibold tracking-tight transition sm:text-4xl ${
                        isActive
                          ? "text-sky-700"
                          : "text-slate-950 group-hover:text-sky-700"
                      }`}
                    >
                      {item.label}
                    </span>

                    <span
                      className={`text-sm font-medium transition ${
                        isActive
                          ? "text-sky-700"
                          : "text-slate-400 group-hover:translate-x-1 group-hover:text-slate-700"
                      }`}
                    >
                      0{index + 1}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div
              ref={(node) => {
                cardRefs.current[navItems.length + 1] = node;
              }}
              className="border-t border-slate-200/80 pt-5"
            >
              <p className="max-w-xl text-sm leading-6 text-slate-500">
                Temporary sharing, cleaner pages, and faster handoff across every
                screen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

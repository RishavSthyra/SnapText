import type { ReactNode } from "react";

export default function InfoPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,21,45,0.97)_0%,rgba(11,15,33,0.98)_100%)] p-6 text-white shadow-[0_35px_80px_-45px_rgba(0,0,0,1)] backdrop-blur-xl sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#7d93ff]">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-white/62 sm:text-base">
          {intro}
        </p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-white/62 sm:text-base">
          {children}
        </div>
      </div>
    </div>
  );
}

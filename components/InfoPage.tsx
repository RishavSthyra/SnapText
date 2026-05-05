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
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-700">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          {intro}
        </p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-600 sm:text-base">
          {children}
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  meta,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative w-full overflow-hidden rounded-b-[3.5rem] bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.16),transparent_24%),radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.12),transparent_22%),linear-gradient(135deg,#1e1b4b_0%,#4338ca_42%,#2563eb_100%)] px-4 pb-20 pt-32 text-white shadow-[0_40px_110px_-60px_rgba(37,99,235,0.85)] sm:px-6 sm:pb-24 sm:pt-36 lg:rounded-b-[5.5rem] lg:px-10 lg:pb-30 lg:pt-40">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.1))]" />

      <div className="relative mx-auto max-w-5xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/75">
          {eyebrow}
        </p>
        <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
          {subtitle}
        </p>
        {meta && (
          <p className="mt-6 text-sm font-medium text-white/60">
            {meta}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

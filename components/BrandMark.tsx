import Link from "next/link";

export default function BrandMark({
  href = "/",
  className = "",
  labelClassName = "",
  onClick,
}: {
  href?: string;
  className?: string;
  labelClassName?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(123,92,255,0.22),rgba(58,123,255,0.08))] shadow-[0_14px_32px_-18px_rgba(117,92,255,0.95)]">
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="snaptext-logo" x1="2" y1="2" x2="20" y2="20">
              <stop stopColor="#A78BFA" />
              <stop offset="1" stopColor="#4F7CFF" />
            </linearGradient>
          </defs>
          <path
            d="M15.7 3.4c-1.1-1.1-2.9-1.1-4 0L8.9 6.2c-.7.7-.7 1.9 0 2.6l.1.1c.7.7 1.9.7 2.6 0l1.6-1.6a2.08 2.08 0 0 1 2.9 0l1.1 1.1c.8.8.8 2.2 0 3l-4 4a2.08 2.08 0 0 1-2.9 0l-1.1-1.1a1.85 1.85 0 0 0-2.6 0l-.1.1c-.7.7-.7 1.9 0 2.6l2.1 2.1c1.1 1.1 2.9 1.1 4 0l6.1-6.1c1.6-1.6 1.6-4.3 0-5.9L15.7 3.4Z"
            fill="url(#snaptext-logo)"
          />
          <path
            d="M6.7 6.5a2.08 2.08 0 0 1 2.9 0l1.1 1.1c.7.7 1.9.7 2.6 0l.1-.1c.7-.7.7-1.9 0-2.6L11.3 2.8c-1.1-1.1-2.9-1.1-4 0L2.4 7.7c-1.6 1.6-1.6 4.3 0 5.9l3 3a1.85 1.85 0 0 0 2.6 0l.1-.1c.7-.7.7-1.9 0-2.6l-2-2a2.08 2.08 0 0 1 0-2.9l.6-.6Z"
            fill="url(#snaptext-logo)"
            opacity="0.9"
          />
        </svg>
      </span>

      <span
        className={`text-sm font-semibold uppercase tracking-[0.36em] text-white ${labelClassName}`}
      >
        SnapText
      </span>
    </Link>
  );
}

import Link from "next/link";

interface SeoContentProps {
  title: string;
  description: string;
  keywords: string;
  h1: string;
  content: string;
  relatedLinks?: { href: string; text: string }[];
}

export default function SeoContent({
  description,
  h1,
  content,
  relatedLinks = [],
}: SeoContentProps) {
  return (
    <div className="relative overflow-hidden px-4 py-10 text-white sm:px-6 sm:py-14">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(100,76,255,0.16),transparent_20%),radial-gradient(circle_at_50%_72%,rgba(112,84,255,0.08),transparent_18%)]" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,21,45,0.97)_0%,rgba(11,15,33,0.98)_100%)] px-5 py-7 shadow-[0_35px_80px_-45px_rgba(0,0,0,1)] sm:px-8 sm:py-9">
          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#7d93ff]">
              SNAPTEXT GUIDE
            </p>
            <h1 className="mb-3 mt-3 text-3xl font-bold text-white sm:text-4xl">
              {h1}
            </h1>
            <p className="text-white/62">{description}</p>
          </header>

          <div
            className="max-w-none space-y-4 text-[15px] leading-8 text-white/68 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-white [&_h3]:mt-7 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white/88 [&_li]:text-white/68 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:text-white/68 [&_strong]:font-semibold [&_strong]:text-white [&_table]:mt-6 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-2xl [&_table]:border [&_table]:border-white/10 [&_td]:border [&_td]:border-white/10 [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-white/10 [&_th]:bg-white/[0.04] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-white [&_tr]:align-top [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {relatedLinks.length > 0 && (
            <nav className="mt-12 border-t border-white/10 pt-8">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Related Tools
              </h2>
              <ul className="space-y-2">
                {relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#8aa5ff] underline transition hover:text-white"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </article>

        <div className="mt-16 rounded-[1.8rem] border border-white/10 bg-[rgba(10,14,31,0.86)] p-6 shadow-[0_24px_60px_-38px_rgba(0,0,0,0.95)]">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Try SnapText Now
          </h2>
          <p className="mb-4 text-white/62">
            Experience the fastest way to share text and convert images to text.
            No signup required.
          </p>
          <Link
            href="/"
            className="inline-block rounded-2xl bg-[linear-gradient(90deg,#734dff_0%,#5d8fff_100%)] px-6 py-3 font-medium text-white transition hover:brightness-110"
          >
            Start Using SnapText
          </Link>
        </div>
      </div>
    </div>
  );
}

interface SeoContentProps {
  title: string;
  description: string;
  keywords: string;
  h1: string;
  content: string;
  relatedLinks?: { href: string; text: string }[];
}

export default function SeoContent({
  title,
  description,
  h1,
  content,
  relatedLinks = [],
}: SeoContentProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{h1}</h1>
          <p className="text-slate-600">{description}</p>
        </header>

        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {relatedLinks.length > 0 && (
          <nav className="mt-12 pt-8 border-t border-slate-200">
            <h2 className="text-lg font-semibold mb-4">Related Tools</h2>
            <ul className="space-y-2">
              {relatedLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>

      <div className="mt-16 p-6 bg-slate-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Try SnapText Now</h2>
        <p className="text-slate-600 mb-4">
          Experience the fastest way to share text and convert images to text.
          No signup required.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Start Using SnapText
        </a>
      </div>
    </div>
  );
}

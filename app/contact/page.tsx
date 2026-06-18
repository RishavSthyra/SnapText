import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Contact SNAPTEXT | Support, Partnerships, and Product Inquiries",
  description:
    "Contact the SNAPTEXT team for platform support, product feedback, business conversations, technical issues, and trust or safety questions.",
  alternates: { canonical: "https://send-anywhere-text.com/contact"}, keywords: [
    "contact SNAPTEXT",
    "SnapText support",
    "temporary sharing support",
    "code sharing platform contact",
    "SnapText feedback",
    "business inquiries SnapText",
  ],
  openGraph: {
    title: "Contact SNAPTEXT",
    description:
      "Reach the SNAPTEXT team for support, privacy questions, partnerships, and product conversations.",
  },
};

const channels = [
  {
    title: "Customer support",
    detail: "support@snaptext.app",
    description:
      "Use this channel for bugs, delivery problems, product questions, and day-to-day help with SnapText.",
  },
  {
    title: "Business and partnerships",
    detail: "hello@snaptext.app",
    description:
      "Reach out for integrations, partnerships, product strategy conversations, and future commercial use cases.",
  },
  {
    title: "Security and trust",
    detail: "security@snaptext.app",
    description:
      "Use this inbox for abuse concerns, responsible disclosure, trust issues, and security-related reports.",
  },
];

const faq = [
  {
    question: "What helps support respond faster?",
    answer:
      "Share what you were trying to do, when it happened, what went wrong, and any visible error or screenshot that can speed up diagnosis.",
  },
  {
    question: "Can businesses contact SnapText about future plans?",
    answer:
      "Yes. We welcome conversations about branded use cases, product direction, team workflows, partnerships, and commercial opportunities.",
  },
  {
    question: "Where should privacy or safety concerns go?",
    answer:
      "For privacy-related questions you can review the Privacy Policy first, then contact the team directly if you need clarification or support.",
  },
];

export default function ContactPage() {
  return (
    <div className="pb-16 sm:pb-20">
      <PageHero
        eyebrow="CONTACT SNAPTEXT"
        title="Talk to the team behind temporary text and code sharing."
        subtitle="Use this page for support, product feedback, roadmap questions, partnership ideas, privacy concerns, and trust or safety conversations related to SnapText."
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="mailto:support@snaptext.app"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Email support
          </a>
          <Link
            href="/privacy-policy"
            className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Privacy policy
          </Link>
        </div>
      </PageHero>

      <div className="mx-auto mt-14 w-full max-w-[1320px] px-4 sm:mt-16 sm:px-6 lg:mt-20 lg:px-8">
        <section className="py-4">
          <div className="grid gap-10 rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,21,45,0.97)_0%,rgba(11,15,33,0.98)_100%)] px-6 py-8 text-white shadow-[0_35px_80px_-45px_rgba(0,0,0,1)] md:grid-cols-3 lg:px-8">
            {channels.map((channel) => (
              <div key={channel.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d93ff]">
                  {channel.title}
                </p>
                <p className="mt-3 text-xl font-semibold text-white">
                  {channel.detail}
                </p>
                <p className="mt-3 text-sm leading-8 text-white/64 sm:text-base">
                  {channel.description}
                </p>
              </div>
              ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2.4rem] border border-white/10 bg-[rgba(10,14,31,0.9)] px-6 py-8 text-white shadow-[0_35px_80px_-45px_rgba(0,0,0,1)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7d93ff]">
            FAQ
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Common questions about support, privacy, and communication.
          </h2>
          <div className="mt-8 divide-y divide-white/10">
            {faq.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-white">
                  <span>{item.question}</span>
                  <span className="text-2xl font-light text-white/42 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-8 text-white/64 sm:text-base">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

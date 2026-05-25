import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About SNAPTEXT | Temporary Text and Code Sharing Platform",
  description:
    "Learn about SNAPTEXT, a temporary text and code sharing platform built for faster delivery, short-lived access, and cleaner digital handoff workflows.",
  alternates: { canonical: "https://send-anywhere-text.com/about"}, keywords: [
    "about SNAPTEXT",
    "temporary sharing platform",
    "text sharing tool",
    "code snippet sharing",
    "developer sharing platform",
    "burn after reading app",
  ],
  openGraph: {
    title: "About SNAPTEXT",
    description:
      "Learn how SNAPTEXT helps people share text and code with speed, clarity, and temporary access.",
  },
};

const principles = [
  {
    title: "Fast by design",
    description:
      "SnapText is built for moments when people need to move information quickly without turning a short exchange into a large workflow.",
  },
  {
    title: "Temporary by default",
    description:
      "The product is shaped around short-lived content access so shared information feels more intentional and less permanent.",
  },
  {
    title: "Readable for real work",
    description:
      "Whether the content is a note, command, snippet, or setup block, readability and copy speed remain central to the product experience.",
  },
];

const useCases = [
  "Moving commands and snippets between desktop and mobile devices.",
  "Sharing one-time setup instructions during calls or support sessions.",
  "Passing structured text, config blocks, or code without opening heavy file tools.",
  "Delivering short-lived operational notes that should not sit around forever.",
];

export default function AboutPage() {
  return (
    <div className="pb-16 sm:pb-20">
      <PageHero
        eyebrow="ABOUT SNAPTEXT"
        title="A cleaner way to share text and code for a short time."
        subtitle="SNAPTEXT is built for fast, readable, temporary sharing. It gives people a simple path to send notes, snippets, commands, and lightweight code blocks without the friction of heavier platforms."
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Open SnapText
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Contact us
          </Link>
        </div>
      </PageHero>

      <div className="mx-auto mt-12 w-full max-w-[1320px] px-4 sm:mt-14 sm:px-6 lg:mt-16 lg:px-8">
        <section className="rounded-[2.25rem] bg-white px-6 py-8 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.28)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_320px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                WHO WE ARE
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                SNAPTEXT is designed for practical, everyday digital handoff.
              </h2>
              <p className="mt-5 text-sm leading-8 text-slate-600 sm:text-base">
                Not every piece of information needs a document, a permanent chat
                thread, or a file upload flow. In many real workflows, people just
                need a quick way to move a short message, a command, a code block,
                or a small structured note from one place to another.
              </p>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                SNAPTEXT exists to make that moment better. It is focused on
                speed, temporary access, copy clarity, and a low-friction product
                experience for developers, operators, freelancers, teams, and
                people working across multiple devices.
              </p>
            </div>

            <div className="border-l-0 border-slate-100 pt-0 lg:border-l lg:pl-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                COMMON USE CASES
              </p>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                {useCases.map((useCase) => (
                  <li key={useCase} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
              PRODUCT PRINCIPLES
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Less clutter, faster sharing, clearer delivery.
            </h2>
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {principles.map((principle) => (
              <div key={principle.title} className="px-2">
                <h3 className="text-xl font-semibold text-slate-950">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-8 text-slate-600 sm:text-base">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2.25rem] bg-slate-950 px-6 py-8 text-white shadow-[0_30px_90px_-55px_rgba(15,23,42,0.45)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                OUR MISSION
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Make temporary digital sharing feel polished, useful, and easy to trust.
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-8 text-slate-300 sm:text-base">
              <p>
                We believe temporary content sharing deserves a better interface
                than most tools currently provide. People should be able to send
                something small and important without adding unnecessary noise.
              </p>
              <p>
                SNAPTEXT is being built around that exact idea: practical sharing,
                cleaner product design, stronger lifecycle control, and a growing
                balance between convenience, readability, and platform safety.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

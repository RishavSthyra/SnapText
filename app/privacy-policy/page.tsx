import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy | SNAPTEXT Data Handling, Security, and Retention",
  description:
    "Read the SNAPTEXT privacy policy covering temporary content handling, data retention, security expectations, platform moderation, and user privacy rights.",
  keywords: [
    "SNAPTEXT privacy policy",
    "temporary sharing privacy",
    "text sharing data policy",
    "code snippet privacy policy",
    "data retention policy",
    "temporary content privacy",
  ],
  openGraph: {
    title: "SNAPTEXT Privacy Policy",
    description:
      "Understand how SNAPTEXT handles temporary content, platform data, retention, moderation, and privacy expectations.",
  },
};

const policySections = [
  { id: "introduction", label: "Introduction" },
  { id: "information-we-handle", label: "Information we handle" },
  { id: "how-we-use-information", label: "How we use information" },
  { id: "retention-and-deletion", label: "Retention and deletion" },
  { id: "security", label: "Security" },
  { id: "acceptable-use", label: "Acceptable use" },
  { id: "your-rights", label: "Your rights" },
  { id: "policy-updates", label: "Policy updates" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="pb-16 sm:pb-20">
      <PageHero
        eyebrow="PRIVACY POLICY"
        title="How SNAPTEXT handles your temporary sharing data."
        subtitle="This privacy policy explains how SnapText may process short-lived content, delivery metadata, platform signals, security-related records, and limited operational information while running the service."
        meta="Last updated: May 5, 2026"
      />

      <div className="mx-auto mt-14 w-full max-w-[1320px] px-4 sm:mt-16 sm:px-6 lg:mt-20 lg:px-8">
        <section className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
              On this page
            </p>
            <nav className="mt-4 space-y-2 border-l border-slate-200 pl-4">
              {policySections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-14">
            <section id="introduction" className="scroll-mt-28">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Introduction
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                SNAPTEXT is built around temporary content exchange. The platform
                is designed to help users share text, notes, commands, and code
                snippets through short-lived access patterns instead of permanent
                publishing. Because temporary sharing still involves the handling
                of information, privacy expectations remain important.
              </p>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                This policy explains what kinds of information may be processed,
                why that processing may happen, how temporary retention fits into
                the product model, and how security, moderation, and operational
                platform integrity connect to the SnapText service.
              </p>
            </section>

            <section id="information-we-handle" className="scroll-mt-28 border-t border-slate-200 pt-10">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Information we handle
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                Depending on the specific product flow, SnapText may handle content
                you intentionally submit for sharing, including plain text,
                formatted code snippets, selected language preferences, temporary
                code identifiers, expiry timestamps, and short-lived delivery
                state information.
              </p>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                The service may also process limited operational information such
                as API request events, timestamps, system errors, anti-abuse
                signals, delivery markers, and technical records needed to run,
                debug, secure, improve, or enforce acceptable use within the
                platform.
              </p>
            </section>

            <section id="how-we-use-information" className="scroll-mt-28 border-t border-slate-200 pt-10">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                How we use information
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                Information may be used to create temporary share codes, deliver
                content to the intended receiver, track delivery state, improve
                product reliability, reduce abuse, and support a clean temporary
                sharing experience for individuals, teams, and future commercial
                platform users.
              </p>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                SnapText may also use limited data for service analytics, incident
                response, platform stability, product improvement, feature
                planning, and future security mechanisms such as rate limiting,
                suspicious activity checks, moderation tools, and link or content
                safety controls.
              </p>
            </section>

            <section id="retention-and-deletion" className="scroll-mt-28 border-t border-slate-200 pt-10">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Retention and deletion
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                SNAPTEXT is designed around short-lived content retention. Shared
                content is not intended to remain available indefinitely. Expiry
                windows, temporary code validity, and burn-style lifecycle controls
                are part of the current and future product model.
              </p>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                Even when user-submitted content expires quickly, limited
                operational records, abuse signals, debugging logs, or
                security-related system information may remain for a reasonable
                period where necessary for service maintenance, legal compliance,
                fraud prevention, incident investigation, or platform protection.
              </p>
            </section>

            <section id="security" className="scroll-mt-28 border-t border-slate-200 pt-10">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Security
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                We take temporary sharing security seriously, but no online service
                should be described as fully non-hackable or risk free. Users
                should avoid sending highly sensitive personal, financial, or
                regulated information unless the security model clearly supports
                that level of use.
              </p>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                Security improvements may include stronger rate limiting, safer
                code generation, suspicious activity detection, moderation
                controls, anti-bruteforce protections, access control refinements,
                audit-friendly internal logging, and additional delivery safeguards
                as the platform evolves.
              </p>
            </section>

            <section id="acceptable-use" className="scroll-mt-28 border-t border-slate-200 pt-10">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Acceptable use
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                SNAPTEXT is not intended to support illegal activity, harmful
                content distribution, malware sharing, scams, harassment,
                exploitation material, or other abusive use. Moderation systems,
                risk detection, trust controls, and platform restrictions may be
                added or expanded to reduce harm and maintain service integrity.
              </p>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                Where necessary, SnapText may investigate misuse, apply technical
                controls, block abusive behavior, or respond to legal obligations
                involving the operation and safety of the service.
              </p>
            </section>

            <section id="your-rights" className="scroll-mt-28 border-t border-slate-200 pt-10">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Your rights
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                Depending on your location and applicable law, you may have rights
                relating to access, correction, deletion, or questions about how
                information is used. Because SnapText centers on temporary flows,
                some user content may already disappear automatically as part of
                standard platform operation.
              </p>
            </section>

            <section id="policy-updates" className="scroll-mt-28 border-t border-slate-200 pt-10">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Policy updates
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                This privacy policy may be updated over time to reflect product
                changes, operational improvements, legal requirements, or stronger
                security and moderation practices. When meaningful revisions are
                made, the effective update date on this page should be refreshed.
              </p>
            </section>

            <section id="contact" className="scroll-mt-28 border-t border-slate-200 pt-10">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Contact
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                If you have a question about this privacy policy, a concern about
                how SnapText handles temporary content, or a privacy-related issue,
                please visit our{" "}
                <Link
                  href="/contact"
                  className="font-medium text-sky-700 hover:text-sky-800"
                >
                  Contact page
                </Link>
                .
              </p>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}

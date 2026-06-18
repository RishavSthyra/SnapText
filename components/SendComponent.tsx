"use client";

import {
  ArrowRight,
  Clock3,
  Download,
  FileText,
  Link2,
  PenLine,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  useEffect,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import {
  SHARE_EXPIRY_SECONDS,
  SHARE_TEXT_MAX_CHARACTERS,
  type ShareDeliveryStatus,
  type StoredSharePayload,
} from "@/lib/share";

type Mode = "send" | "receive";
type CopyTarget = "access-code" | "received-content" | null;

interface SentShareState {
  code: string;
  expiresAt: number;
  burnAfterReading: boolean;
}

const featureCards = [
  {
    title: "Private & Secure",
    description: "Your data is encrypted and never stored permanently.",
    icon: (
      <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
    ),
  },
  {
    title: "Fast & Simple",
    description: "Share text in seconds, not minutes.",
    icon: (
      <Zap className="h-5 w-5" strokeWidth={1.8} />
    ),
  },
  {
    title: "Short & Shareable",
    description: "Get a clean, short link easy to share anywhere.",
    icon: (
      <Link2 className="h-5 w-5" strokeWidth={1.8} />
    ),
  },
];

function formatCountdown(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function SidebarCard({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex min-h-[122px] w-full flex-col items-center justify-center gap-2.5 px-2 py-3 text-center transition ${
        active ? "text-white" : "text-white/62 hover:text-white"
      }`}
    >
      <span
        className={`relative flex h-12 w-12 items-center justify-center rounded-[18px] border shadow-[rgba(0,0,0,0.4)_0px_2px_4px,rgba(0,0,0,0.3)_0px_7px_13px_-3px,rgba(0,0,0,0.2)_0px_-3px_0px_inset] transition ${
          active
            ? "border-[#8a7dff]/55 bg-[linear-gradient(180deg,rgba(126,111,255,0.3),rgba(69,74,141,0.44))] text-[#88a6ff]"
            : "border-white/10 bg-white/[0.05] text-white/52 group-hover:text-[#88a6ff]"
        }`}
      >
        {icon}
      </span>
      <span className="relative text-[17px] font-medium">{label}</span>
      {active && (
        <span className="pointer-events-none absolute bottom-1 h-8 w-16 rounded-full bg-[#715cff]/28 blur-2xl" />
      )}
    </button>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-[#131834] text-[#7d93ff]">
        {icon}
      </span>
      <span>
        <span className="block text-xl font-semibold leading-none text-white">
          {value}
        </span>
        <span className="mt-1 block text-xs text-white/48">{label}</span>
      </span>
    </div>
  );
}

function InlineStat({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-white/8 bg-[#131834] text-[#7d93ff] shadow-[rgba(0,0,0,0.32)_0px_2px_4px,rgba(0,0,0,0.24)_0px_7px_12px_-3px,rgba(0,0,0,0.2)_0px_-3px_0px_inset]">
        {icon}
      </span>
      <span>
        <span className="block text-[15px] font-semibold leading-none text-white">
          {value}
        </span>
        <span className="mt-1 block text-xs text-white/48">{label}</span>
      </span>
    </div>
  );
}

function GlowButton({
  children,
  onClick,
  disabled,
  variant = "primary",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}) {
  const primary = variant === "primary";

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`relative z-10 inline-flex h-[50px] items-center justify-center rounded-[16px] px-6 text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
          primary
            ? "bg-[linear-gradient(90deg,#734dff_0%,#5d8fff_100%)] text-white hover:brightness-110"
            : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
        }`}
      >
        {children}
      </button>
      {primary && (
        <div className="pointer-events-none absolute inset-x-6 bottom-[-10px] h-8 rounded-full bg-[linear-gradient(90deg,rgba(115,77,255,0.65),rgba(93,143,255,0.55))] blur-xl" />
      )}
    </div>
  );
}

export default function SnapText() {
  const [mode, setMode] = useState<Mode>("send");
  const [draft, setDraft] = useState("");
  const [shareCode, setShareCode] = useState("");
  const [sentShare, setSentShare] = useState<SentShareState | null>(null);
  const [sentDeliveryStatus, setSentDeliveryStatus] =
    useState<ShareDeliveryStatus>("pending");
  const [inputCode, setInputCode] = useState("");
  const [receivedCode, setReceivedCode] = useState("");
  const [receivedShare, setReceivedShare] = useState<StoredSharePayload | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedTarget, setCopiedTarget] = useState<CopyTarget>(null);
  const [countdownNow, setCountdownNow] = useState(() => Date.now());

  useEffect(() => {
    if (!sentShare) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCountdownNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [sentShare]);

  useEffect(() => {
    if (!sentShare) {
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/status/${sentShare.code}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          return;
        }

        const data = (await res.json()) as { status: ShareDeliveryStatus };
        setSentDeliveryStatus(data.status);
      } catch (statusError) {
        console.error(statusError);
      }
    };

    void checkStatus();
    const intervalId = window.setInterval(() => void checkStatus(), 2000);
    return () => window.clearInterval(intervalId);
  }, [sentShare]);

  useEffect(() => {
    if (sentDeliveryStatus !== "received" && sentDeliveryStatus !== "expired") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShareCode("");
      setSentShare(null);
      setSentDeliveryStatus("pending");
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [sentDeliveryStatus]);

  const secondsLeft = sentShare
    ? Math.max(0, Math.ceil((sentShare.expiresAt - countdownNow) / 1000))
    : SHARE_EXPIRY_SECONDS;

  const handleSend = async () => {
    if (!draft.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setReceivedShare(null);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: draft,
        }),
      });

      const data = (await res.json()) as {
        code?: string;
        expiresAt?: number;
        burnAfterReading?: boolean;
        error?: string;
      };

      if (!res.ok || !data.code || typeof data.expiresAt !== "number") {
        throw new Error(data.error || "Unable to create share code");
      }

      setCountdownNow(Date.now());
      setShareCode(data.code);
      setSentDeliveryStatus("pending");
      setSentShare({
        code: data.code,
        expiresAt: data.expiresAt,
        burnAfterReading: data.burnAfterReading ?? true,
      });
      setDraft("");
      toast.success("Share code created");
    } catch (sendError) {
      console.error(sendError);
      const message =
        sendError instanceof Error
          ? sendError.message
          : "Unable to create share code";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async () => {
    if (!inputCode.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/fetch/${inputCode.trim()}`);
      const data = (await res.json()) as StoredSharePayload & { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Unable to fetch share");
      }

      setReceivedCode(inputCode.trim());
      setReceivedShare(data);
      setInputCode("");
      toast.success("Share opened");
    } catch (fetchError) {
      console.error(fetchError);
      setReceivedCode("");
      setReceivedShare(null);
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to fetch share";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (value: string, target: Exclude<CopyTarget, null>) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(
        target === "access-code" ? "Access code copied" : "Text copied"
      );

      if (target === "received-content" && receivedCode) {
        const res = await fetch(`/api/receive/${receivedCode}`, {
          method: "POST",
        });

        if (!res.ok) {
          throw new Error("Unable to mark share as received");
        }

        setReceivedCode("");
        setReceivedShare(null);
      }

      setCopiedTarget(target);
      window.setTimeout(() => setCopiedTarget(null), 1500);
    } catch (copyError) {
      console.error(copyError);
      setError("Unable to finish copy right now.");
      toast.error("Unable to copy right now");
    }
  };

  const resetShareState = () => {
    setShareCode("");
    setSentShare(null);
    setSentDeliveryStatus("pending");
    setError("");
    setCopiedTarget(null);
  };

  const handleComposerKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (loading) {
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  const handleReceiveInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && !loading) {
      event.preventDefault();
      void handleFetch();
    }
  };

  const countdownLabel =
    sentDeliveryStatus === "received"
      ? "Opened"
      : sentDeliveryStatus === "expired"
        ? "Expired"
        : formatCountdown(secondsLeft);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050816] px-4 pb-6 pt-36 text-white sm:px-6 sm:pt-40">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(100,76,255,0.16),transparent_22%),radial-gradient(circle_at_50%_72%,rgba(112,84,255,0.1),transparent_20%)]" />
        <div className="absolute inset-0 opacity-55 [background-image:radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.07)_1px,transparent_0)] [background-size:30px_30px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-[12px] border border-white/8 bg-white/[0.03] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.42em] text-[#7d93ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            SNAPTEXT
          </span>
          <h1 className="font-display mt-8 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Share{" "}
            <span className="bg-[linear-gradient(90deg,#8e73ff_10%,#5a87ff_95%)] bg-clip-text text-transparent">
              Text
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-xl text-white/60">
            Instantly share text with a short, secure link.
          </p>
        </div>

        <div className="relative mx-auto mt-16 max-w-[1045px]">
          <div className="pointer-events-none absolute inset-x-14 top-1/2 h-[320px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(108,86,255,0.24),rgba(108,86,255,0.08)_42%,transparent_74%)] blur-3xl" />
          <div className="pointer-events-none absolute inset-x-28 top-[-42px] h-20 rounded-full bg-[radial-gradient(circle,rgba(118,92,255,0.4),transparent_72%)] blur-2xl" />
          <div className="pointer-events-none absolute inset-x-24 bottom-[-52px] h-24 rounded-full bg-[radial-gradient(circle,rgba(92,124,255,0.32),transparent_74%)] blur-3xl" />

          <div
            id="share-workspace"
            className="relative overflow-hidden rounded-[34px] border border-[#2f2758] bg-[linear-gradient(180deg,rgba(18,21,45,0.97)_0%,rgba(11,15,33,0.98)_100%)] shadow-[0_35px_80px_-45px_rgba(0,0,0,1)]"
          >
            <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#7c61ff] to-transparent opacity-85" />
            <div className="pointer-events-none absolute inset-x-16 bottom-0 h-px bg-gradient-to-r from-transparent via-[#6a86ff] to-transparent opacity-75" />

            <div className="grid lg:grid-cols-[120px_minmax(0,1fr)]">
              <aside className="border-b border-white/6 p-5 lg:border-b-0 lg:border-r lg:border-white/6">
                <SidebarCard
                  active={mode === "send"}
                  label="Send"
                  onClick={() => {
                    setMode("send");
                    setError("");
                  }}
                  icon={<PenLine className="h-5 w-5" strokeWidth={1.8} />}
                />
                <div className="h-1.5" />
                <SidebarCard
                  active={mode === "receive"}
                  label="Receive"
                  onClick={() => {
                    setMode("receive");
                    setError("");
                  }}
                  icon={<Download className="h-5 w-5" strokeWidth={1.8} />}
                />
              </aside>

              <div className="relative p-6 sm:p-8 lg:px-8 lg:py-7">
                {error && (
                  <div className="mb-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                    {error}
                  </div>
                )}

                {mode === "send" && !sentShare && (
                  <>
                    <div className="flex items-center justify-between text-[15px] font-medium text-white/76">
                      <span className="text-white/72">Paste your text here...</span>
                      <span className="text-white/68">
                        {draft.length.toLocaleString()} /{" "}
                        {SHARE_TEXT_MAX_CHARACTERS.toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-7 overflow-hidden rounded-[24px] border border-white/8 bg-[#171b35] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <textarea
                        value={draft}
                        onChange={(event) =>
                          setDraft(
                            event.target.value.slice(
                              0,
                              SHARE_TEXT_MAX_CHARACTERS
                            )
                          )
                        }
                        onKeyDown={handleComposerKeyDown}
                        placeholder="Paste your text here..."
                        spellCheck
                        maxLength={SHARE_TEXT_MAX_CHARACTERS}
                        className="h-[205px] w-full resize-none bg-transparent px-5 py-5 text-[17px] leading-8 text-white outline-none placeholder:text-white/30 sm:h-[230px]"
                      />
                    </div>

                    <div className="mt-7 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      <div className="flex flex-wrap items-center gap-4 text-white/60">
                        <InlineStat
                          icon={<FileText className="h-4 w-4" strokeWidth={1.8} />}
                          value={draft.length.toString()}
                          label="characters"
                        />
                        <span className="hidden h-10 w-px bg-white/10 sm:block" />
                        <InlineStat
                          icon={<Clock3 className="h-4 w-4" strokeWidth={1.8} />}
                          value="5"
                          label="min read"
                        />
                      </div>

                      <GlowButton
                        onClick={handleSend}
                        disabled={loading || !draft.trim()}
                      >
                        <span className="inline-flex items-center gap-3 text-lg">
                          <span>{loading ? "Creating..." : "Create Link"}</span>
                          <ArrowRight className="h-[19px] w-[19px]" strokeWidth={2} />
                        </span>
                      </GlowButton>
                    </div>
                  </>
                )}

                {mode === "send" && sentShare && (
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[15px] font-medium text-white/76">
                          Access code ready
                        </span>
                        <span className="text-[15px] text-white/68">
                          {countdownLabel}
                        </span>
                      </div>

                      <div className="mt-7 rounded-[24px] border border-white/8 bg-[#171b35] px-5 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                        <p className="text-sm text-white/48">
                          Send this code to the other device.
                        </p>
                        <div className="mt-5 break-all font-mono text-5xl tracking-[0.3em] text-white">
                          {shareCode}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/62">
                          Text share
                        </span>
                        <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/62">
                          {sentShare.burnAfterReading
                            ? "Burn after read"
                            : "Reusable"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-3">
                        <StatCard
                          icon={<Clock3 className="h-4 w-4" strokeWidth={1.8} />}
                          value={formatCountdown(secondsLeft)}
                          label="remaining"
                        />
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <GlowButton
                          variant="secondary"
                          onClick={() => handleCopy(shareCode, "access-code")}
                        >
                          {copiedTarget === "access-code"
                            ? "Copied"
                            : "Copy code"}
                        </GlowButton>
                        <GlowButton onClick={resetShareState}>New Share</GlowButton>
                      </div>
                    </div>
                  </div>
                )}

                {mode === "receive" && (
                  <>
                    <div className="flex items-center justify-between text-[15px] font-medium text-white/76">
                      <span className="text-white/72">Enter your access code</span>
                      <span className="text-white/68">6 digits</span>
                    </div>

                    <div className="mt-7 flex flex-col gap-5 xl:flex-row xl:items-start">
                      <input
                        value={inputCode}
                        onChange={(event) =>
                          setInputCode(
                            event.target.value.replace(/\D/g, "").slice(0, 6)
                          )
                        }
                        onKeyDown={handleReceiveInputKeyDown}
                        placeholder="000000"
                        inputMode="numeric"
                        className="h-[58px] w-full rounded-[18px] border border-white/8 bg-[#171b35] px-5 text-center font-mono text-2xl tracking-[0.32em] text-white outline-none transition placeholder:text-white/26 focus:border-[#705cff]"
                      />

                      <GlowButton
                        onClick={handleFetch}
                        disabled={loading || inputCode.trim().length !== 6}
                      >
                        <span className="inline-flex items-center gap-3">
                          <span>{loading ? "Opening..." : "Open Link"}</span>
                        </span>
                      </GlowButton>
                    </div>

                    {!receivedShare && (
                      <div className="mt-7 rounded-[24px] border border-dashed border-white/10 bg-[#171b35]/55 px-5 py-10 text-center text-white/48">
                        Enter the six-digit code to reveal the text.
                      </div>
                    )}

                    {receivedShare && (
                      <div className="mt-7">
                        <div className="rounded-[24px] border border-white/8 bg-[#171b35] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                          <div className="mb-4 flex flex-wrap gap-2">
                            <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/62">
                              One-time reveal
                            </span>
                            <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/62">
                              Copy to burn
                            </span>
                          </div>

                          <div className="rounded-[20px] border border-white/8 bg-[#11152d] p-4 text-[16px] leading-8 whitespace-pre-wrap text-white/78">
                            {receivedShare.text}
                          </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                          <GlowButton
                            variant="secondary"
                            onClick={() =>
                              handleCopy(
                                receivedShare.text,
                                "received-content"
                              )
                            }
                          >
                            {copiedTarget === "received-content"
                              ? "Copied"
                              : "Copy & Burn"}
                          </GlowButton>
                          <GlowButton
                            onClick={() => {
                              setReceivedCode("");
                              setReceivedShare(null);
                              setError("");
                            }}
                          >
                            Close
                          </GlowButton>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-[1045px]">
          <div className="pointer-events-none absolute left-1/2 top-0 h-28 w-52 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(113,92,255,0.24),transparent_72%)] blur-3xl" />
          <div className="grid gap-10 md:grid-cols-3">
            {featureCards.map((feature, index) => (
              <div
                key={feature.title}
                className={`px-5 text-center md:px-8 ${
                  index < featureCards.length - 1
                    ? "md:border-r md:border-white/8"
                    : ""
                }`}
              >
                <span className="mx-auto flex h-[58px] w-[58px] items-center justify-center rounded-[20px] border border-white/8 bg-[linear-gradient(180deg,rgba(109,95,255,0.16),rgba(39,43,90,0.14))] text-[#7d93ff] shadow-[0_18px_40px_-26px_rgba(113,92,255,0.9)]">
                  {feature.icon}
                </span>
                <h3 className="mt-6 text-[30px] font-semibold tracking-tight text-white sm:text-[32px] md:text-[20px]">
                  {feature.title}
                </h3>
                <p className="mx-auto mt-4 max-w-[240px] text-base leading-8 text-white/52 md:text-[15px] md:leading-7">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

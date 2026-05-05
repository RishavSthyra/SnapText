"use client";

import { useEffect, useState } from "react";
import {
  CODE_LANGUAGE_OPTIONS,
  DEFAULT_CODE_LANGUAGE,
  SHARE_EXPIRY_SECONDS,
  type CodeLanguage,
  type ShareContentType,
  type StoredSharePayload,
} from "@/lib/share";

type Mode = "send" | "receive";
type CopyTarget = "share-code" | "received-content" | null;

interface SentShareState {
  code: string;
  contentType: ShareContentType;
  language: CodeLanguage;
  expiresAt: number;
  burnAfterReading: boolean;
}

interface HighlightToken {
  text: string;
  className: string;
}

function getLanguageLabel(language: CodeLanguage) {
  return (
    CODE_LANGUAGE_OPTIONS.find((option) => option.value === language)?.label ??
    "Plain text"
  );
}

function formatCountdown(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function getHighlightRegex(language: CodeLanguage) {
  switch (language) {
    case "javascript":
    case "typescript":
      return /(\/\/.*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|`(?:\\.|[^`])*`|\b(?:const|let|var|function|return|if|else|for|while|switch|case|break|continue|class|new|try|catch|finally|throw|import|from|export|default|async|await|interface|type|extends|implements|public|private|protected|enum|typeof|instanceof|in|of)\b|\b(?:true|false|null|undefined)\b|\b\d+(?:\.\d+)?\b)/gm;
    case "python":
      return /(#.*|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\b(?:def|return|if|elif|else|for|while|class|import|from|as|try|except|finally|raise|with|lambda|pass|break|continue|async|await|True|False|None|in|is|and|or|not)\b|\b\d+(?:\.\d+)?\b)/gm;
    case "bash":
      return /(#.*|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\$\w+|\b(?:if|then|else|fi|for|do|done|case|esac|function|echo|export|sudo|cd|grep|cat|ls|pwd|exit)\b|\b\d+(?:\.\d+)?\b)/gm;
    case "json":
      return /("(?:\\.|[^"])*"(?=\s*:)|"(?:\\.|[^"])*"|\b(?:true|false|null)\b|\b\d+(?:\.\d+)?\b|[{}[\],:])/gm;
    case "html":
      return /(<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>|"(?:\\.|[^"])*"|'(?:\\.|[^'])*')/gm;
    case "css":
      return /(\/\*[\s\S]*?\*\/|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|#[0-9a-fA-F]{3,8}|\.[A-Za-z_-][\w-]*|@[A-Za-z-]+|\b(?:color|background|display|grid|flex|padding|margin|border|font|width|height|position|absolute|relative|fixed|transform|transition|gap|justify-content|align-items)\b|\b\d+(?:px|rem|em|%|vh|vw)?\b)/gm;
    case "sql":
      return /(--.*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\b(?:SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|ORDER|BY|GROUP|LIMIT|CREATE|TABLE|ALTER|DROP|AND|OR|NOT|NULL|AS|ON|DISTINCT)\b|\b\d+(?:\.\d+)?\b)/g;
    default:
      return null;
  }
}

function getTokenClass(
  token: string,
  language: CodeLanguage,
  source: string,
  index: number
) {
  if (
    token.startsWith("//") ||
    token.startsWith("/*") ||
    (token.startsWith("#") && language !== "css") ||
    token.startsWith("--") ||
    token.startsWith("<!--")
  ) {
    return "text-slate-400";
  }

  if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
    if (language === "json") {
      const trailingSource = source.slice(index + token.length);
      return /^\s*:/.test(trailingSource) ? "text-sky-700" : "text-emerald-600";
    }

    return "text-emerald-600";
  }

  if (token.startsWith("$")) {
    return "text-orange-600";
  }

  if (token.startsWith("<")) {
    return "text-sky-700";
  }

  if (token.startsWith(".")) {
    return "text-cyan-700";
  }

  if (token.startsWith("@")) {
    return "text-fuchsia-600";
  }

  if (token.startsWith("#") && language === "css") {
    return "text-rose-500";
  }

  if (/^[{}[\],:]+$/.test(token)) {
    return "text-slate-500";
  }

  if (/^\d/.test(token)) {
    return "text-amber-600";
  }

  if (
    /^(true|false|null|undefined|True|False|None|SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|ORDER|BY|GROUP|LIMIT|CREATE|TABLE|ALTER|DROP|AND|OR|NOT|NULL|AS|ON|DISTINCT)$/.test(
      token
    )
  ) {
    return "text-violet-600";
  }

  return "text-rose-600";
}

function tokenizeCode(source: string, language: CodeLanguage): HighlightToken[] {
  const regex = getHighlightRegex(language);

  if (!regex) {
    return [{ text: source, className: "text-slate-700" }];
  }

  const tokens: HighlightToken[] = [];
  let cursor = 0;

  for (const match of source.matchAll(regex)) {
    const token = match[0];
    const index = match.index ?? 0;

    if (index > cursor) {
      tokens.push({
        text: source.slice(cursor, index),
        className: "text-slate-700",
      });
    }

    tokens.push({
      text: token,
      className: getTokenClass(token, language, source, index),
    });

    cursor = index + token.length;
  }

  if (cursor < source.length) {
    tokens.push({
      text: source.slice(cursor),
      className: "text-slate-700",
    });
  }

  return tokens;
}

function CodePreview({
  code,
  language,
}: {
  code: string;
  language: CodeLanguage;
}) {
  const tokens = tokenizeCode(code, language);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {getLanguageLabel(language)}
        </span>
      </div>

      <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-6">
        {tokens.map((token, index) => (
          <span key={`${index}-${token.text.slice(0, 12)}`} className={token.className}>
            {token.text}
          </span>
        ))}
      </pre>
    </div>
  );
}

function LanguageSelect({
  language,
  onChange,
}: {
  language: CodeLanguage;
  onChange: (value: CodeLanguage) => void;
}) {
  return (
    <div className="relative w-full sm:w-auto">
      <select
        value={language}
        onChange={(event) => onChange(event.target.value as CodeLanguage)}
        className="w-full min-w-0 appearance-none rounded-full border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 sm:min-w-[170px]"
      >
        {CODE_LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3.25 5.5 7 9.25l3.75-3.75"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default function SnapText() {
  const [mode, setMode] = useState<Mode>("send");
  const [composerMode, setComposerMode] = useState<ShareContentType>("text");
  const [draft, setDraft] = useState("");
  const [language, setLanguage] =
    useState<CodeLanguage>(DEFAULT_CODE_LANGUAGE);
  const [shareCode, setShareCode] = useState("");
  const [sentShare, setSentShare] = useState<SentShareState | null>(null);
  const [inputCode, setInputCode] = useState("");
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

    return () => {
      window.clearInterval(intervalId);
    };
  }, [sentShare]);

  const secondsLeft = sentShare
    ? Math.max(0, Math.ceil((sentShare.expiresAt - countdownNow) / 1000))
    : SHARE_EXPIRY_SECONDS;

  const isCodeShare = composerMode === "code";
  const editorPlaceholder = isCodeShare
    ? "Paste code..."
    : "Paste text...";

  const handleCopy = async (value: string, target: Exclude<CopyTarget, null>) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      window.setTimeout(() => setCopiedTarget(null), 1500);
    } catch (copyError) {
      console.error(copyError);
      setError("Clipboard access failed.");
    }
  };

  const handleSend = async () => {
    if (!draft.trim()) return;

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
          contentType: composerMode,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to create share code");
      }

      setCountdownNow(Date.now());
      setShareCode(data.code);
      setSentShare({
        code: data.code,
        contentType: data.contentType,
        language: data.language,
        expiresAt: data.expiresAt,
        burnAfterReading: data.burnAfterReading,
      });
      setDraft("");
    } catch (sendError) {
      console.error(sendError);
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Unable to create share code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async () => {
    if (!inputCode.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/fetch/${inputCode.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to fetch share");
      }

      setReceivedShare(data);
      setInputCode("");
    } catch (fetchError) {
      console.error(fetchError);
      setReceivedShare(null);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to fetch share"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetShareState = () => {
    setShareCode("");
    setSentShare(null);
    setError("");
  };

  return (
    <div className="px-3 py-6 sm:px-6 sm:py-8 md:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 text-center sm:mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-sky-700">
            SNAPTEXT
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
            Share text and code
          </h1>
        </div>

        <div className="rounded-[1.75rem] border border-white/80 bg-white/80 p-3 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:rounded-[2rem] sm:p-5 md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex rounded-full border border-slate-200 bg-slate-100/80 p-1">
              <button
                onClick={() => {
                  setMode("send");
                  setError("");
                }}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  mode === "send"
                    ? "bg-slate-950 text-white shadow"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                Send
              </button>
              <button
                onClick={() => {
                  setMode("receive");
                  setError("");
                }}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  mode === "receive"
                    ? "bg-slate-950 text-white shadow"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                Receive
              </button>
            </div>

            {sentShare && mode === "send" && (
              <div className="rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-800">
                {formatCountdown(secondsLeft)}
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
              {error}
            </div>
          )}

          {mode === "send" && !sentShare && (
            <div className="mt-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
                  <button
                    onClick={() => setComposerMode("text")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      composerMode === "text"
                        ? "bg-slate-950 text-white"
                        : "text-slate-600 hover:text-slate-950"
                    }`}
                  >
                    Text
                  </button>
                  <button
                    onClick={() => {
                      setComposerMode("code");
                      if (language === DEFAULT_CODE_LANGUAGE) {
                        setLanguage("typescript");
                      }
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      composerMode === "code"
                        ? "bg-slate-950 text-white"
                        : "text-slate-600 hover:text-slate-950"
                    }`}
                  >
                    Code
                  </button>
                </div>

                {isCodeShare && (
                  <LanguageSelect language={language} onChange={setLanguage} />
                )}
              </div>

              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
                {isCodeShare && (
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {getLanguageLabel(language)}
                    </span>
                  </div>
                )}

                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={editorPlaceholder}
                  spellCheck={!isCodeShare}
                  className={`w-full resize-none bg-white px-4 py-4 outline-none placeholder:text-slate-400 ${
                    isCodeShare
                      ? "h-64 font-mono text-sm leading-6 text-slate-800 sm:h-72"
                      : "h-52 text-sm leading-7 text-slate-800 sm:h-56 sm:text-base"
                  }`}
                />
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
                  <span>{draft.length} chars</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>5 min</span>
                </div>

                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading
                    ? "Creating..."
                    : isCodeShare
                      ? "Share code"
                      : "Share text"}
                </button>
              </div>
            </div>
          )}

          {mode === "send" && sentShare && (
            <div className="mt-5 rounded-[1.5rem] border border-sky-100 bg-sky-50/80 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                    Share Code
                  </p>
                  <div className="mt-2 break-all font-mono text-3xl tracking-[0.2em] text-slate-950 sm:text-4xl sm:tracking-[0.28em] md:text-5xl">
                    {shareCode}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    {sentShare.contentType === "code" ? "Code" : "Text"}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    {getLanguageLabel(sentShare.language)}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    {formatCountdown(secondsLeft)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => handleCopy(shareCode, "share-code")}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  {copiedTarget === "share-code" ? "Copied" : "Copy code"}
                </button>
                <button
                  onClick={resetShareState}
                  className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 sm:w-auto"
                >
                  New share
                </button>
              </div>
            </div>
          )}

          {mode === "receive" && (
            <div className="mt-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={inputCode}
                  onChange={(event) =>
                    setInputCode(
                      event.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  placeholder="Enter code"
                  inputMode="numeric"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center font-mono text-lg tracking-[0.24em] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />

                <button
                  onClick={handleFetch}
                  disabled={loading}
                  className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading ? "Opening..." : "Open"}
                </button>
              </div>

              {receivedShare && (
                <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                        {receivedShare.contentType === "code" ? "Code" : "Text"}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                        {getLanguageLabel(receivedShare.language)}
                      </span>
                    </div>

                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      Opened once
                    </span>
                  </div>

                  {receivedShare.contentType === "code" ? (
                    <CodePreview
                      code={receivedShare.text}
                      language={receivedShare.language}
                    />
                  ) : (
                    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 text-sm leading-7 whitespace-pre-wrap text-slate-700">
                      {receivedShare.text}
                    </div>
                  )}

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() =>
                        handleCopy(receivedShare.text, "received-content")
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                    >
                      {copiedTarget === "received-content"
                        ? "Copied"
                        : "Copy"}
                    </button>
                    <button
                      onClick={() => {
                        setReceivedShare(null);
                        setError("");
                      }}
                      className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 sm:w-auto"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

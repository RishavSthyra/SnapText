"use client";

import { useState } from "react";

export default function SnapText() {
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [receivedText, setReceivedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("send"); // send | receive
  const [copied, setCopied] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setCode(data.code);
      setText("");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleFetch = async () => {
    if (!inputCode.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/fetch/${inputCode}`);
      const data = await res.json();

      if (data.text) {
        setReceivedText(data.text);
      } else {
        setReceivedText("Invalid or expired code");
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(145,187,255,0.45),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(214,190,255,0.28),transparent_40%)]" />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
            Snap Text
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Share text in one tap
          </h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Quick transfer with short code, inspired by clean assistant UIs.
          </p>
        </div>

        <div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white/70 p-1 shadow-sm backdrop-blur">
          <button
            onClick={() => setMode("send")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              mode === "send"
                ? "bg-slate-900 text-white shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Send
          </button>
          <button
            onClick={() => setMode("receive")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              mode === "receive"
                ? "bg-slate-900 text-white shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Receive
          </button>
        </div>

        <div className="w-full rounded-3xl border border-slate-200/90 bg-white/80 p-6 shadow-[0_24px_70px_-40px_rgba(30,41,59,0.55)] backdrop-blur-xl sm:p-7">
          {mode === "send" && (
            <>
              {!code && (
                <>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste text or code..."
                    className="h-44 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleSend}
                      disabled={loading}
                      className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading ? "Sending..." : "Send"}
                    </button>
                  </div>
                </>
              )}

              {code && (
                <div className="text-center">
                  <p className="mb-3 text-sm font-medium text-slate-500">Your Code</p>

                  <div className="rounded-2xl border border-sky-100 bg-sky-50 py-4 text-4xl font-mono tracking-[0.28em] text-sky-900">
                    {code}
                  </div>

                  <button
                    onClick={handleCopy}
                    className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>

                  <button
                    onClick={() => setCode("")}
                    className="mt-3 block w-full text-sm font-medium text-slate-500 transition hover:text-slate-900"
                  >
                    Send another
                  </button>
                </div>
              )}
            </>
          )}

          {mode === "receive" && (
            <>
              <input
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter code..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center tracking-[0.2em] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleFetch}
                  disabled={loading}
                  className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Fetching..." : "Get Text"}
                </button>
              </div>

              {receivedText && (
                <div className="mt-6 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  {receivedText}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

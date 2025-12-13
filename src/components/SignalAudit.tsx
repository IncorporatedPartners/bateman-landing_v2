// src/components/SignalAudit.tsx
import React, { useState } from "react";

type RoastStatus = "TERMINAL" | "DISTRESSED" | "RETAIL" | "PENDING";

interface RoastPayload {
  score?: number;
  status?: string;
  roast?: string;
  analysisLog?: string[];
  _source?: string;
  error?: string;
}

const LOADING_STATES = [
  "INITIALIZING_HANDSHAKE...",
  "PARSING_PEDIGREE...",
  "DETECTING_RETAIL_SIGNALS...",
  "CROSS_REFERENCING_MEMBERSHIPS...",
  "JUDGING_FONT_CHOICE...",
  "CALCULATING_STATUS_ANXIETY..."
];

const normalizeStatus = (raw: string): RoastStatus => {
  const s = (raw || "").trim().toUpperCase();
  if (s === "TERMINAL" || s === "DISTRESSED" || s === "RETAIL") return s;
  return "PENDING";
};

const statusLabelClass = (status: RoastStatus): string => {
  switch (status) {
    case "TERMINAL":
      return "border-[#BE123C] bg-[#BE123C] text-black";
    case "DISTRESSED":
      return "border-amber-500 bg-amber-500 text-black";
    case "RETAIL":
      return "border-emerald-500 bg-emerald-500 text-black";
    default:
      return "border-neutral-600 bg-neutral-800 text-neutral-200";
  }
};

const SignalAudit: React.FC = () => {
  const [resumeText, setResumeText] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [status, setStatus] = useState<RoastStatus>("PENDING");
  const [caption, setCaption] = useState(
    "Bateman reads the text only. No uploads. Nothing is stored."
  );
  const [logLines, setLogLines] = useState<string[]>([]);
  const [displayedRoast, setDisplayedRoast] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    const text = resumeText.trim();
    if (!text) {
      setCaption("No input detected. Paste the whole thing, not just the header.");
      return;
    }

    // Reset state for a fresh run
    setIsRunning(true);
    setScore(null);
    setStatus("PENDING");
    setDisplayedRoast("");
    setCaption("Diagnostic in progress. Do not refresh.");
    setLogLines([`> ${LOADING_STATES[0]}`]);

    // Rolling synthetic log
    let step = 0;
    const intervalId = window.setInterval(() => {
      step += 1;
      if (step < LOADING_STATES.length) {
        setLogLines((prev) => [...prev, `> ${LOADING_STATES[step]}`]);
      } else {
        window.clearInterval(intervalId);
      }
    }, 600);

    try {
      const res = await fetch("/.netlify/functions/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text })
      });

      let payload: RoastPayload;
      try {
        payload = (await res.json()) as RoastPayload;
      } catch {
        window.clearInterval(intervalId);
        setScore(null);
        setStatus("TERMINAL");
        setDisplayedRoast(
          "The diagnostic endpoint returned something unreadable. Your resume confused the model before it confused recruiting."
        );
        setCaption("Non-JSON response from diagnostic engine.");
        setIsRunning(false);
        return;
      }

      if (!res.ok || payload?.error) {
        window.clearInterval(intervalId);
        setScore(null);
        setStatus("TERMINAL");
        setDisplayedRoast(
          "The diagnostic endpoint returned an error. Your resume broke the scanner before the market did."
        );
        setCaption("Try again in a few minutes.");
        setIsRunning(false);
        return;
      }

      const numericScore = Number(payload.score);
      const safeScore =
        Number.isFinite(numericScore) && numericScore > 0
          ? Math.min(10, Math.max(1, Math.round(numericScore)))
          : 9;

      const rawStatus = normalizeStatus(payload.status || "");
      const roastText: string =
        payload.roast ||
        "You have all the characteristics of a high-value candidate: experience, degrees, skills, but not a single clear, identifiable emotion except... desperation.";

      setScore(safeScore);
      setStatus(rawStatus);

      if (safeScore >= 9) {
        setCaption("TERMINAL // Resume requires a full rebuild before elite outreach.");
      } else if (safeScore >= 7) {
        setCaption(
          "DISTRESSED // Severe signal leakage. Recruiters will not see what you think they see."
        );
      } else {
        setCaption("RETAIL // Passable, but indistinguishable from the noise floor.");
      }

      // Merge backend analysis log into the terminal feed
      window.clearInterval(intervalId);
      setLogLines((prev) => {
        const merged = [...prev];

        if (Array.isArray(payload.analysisLog) && payload.analysisLog.length > 0) {
          merged.push("> ENGINE_LOG:");
          for (const line of payload.analysisLog) {
            merged.push(`> ${line}`);
          }
        }

        // Intentionally omit any engine/source identification line.
        merged.push("> ANALYSIS_COMPLETE. RENDERING_JUDGMENT...");
        return merged;
      });

      // Typewriter: stream roast char-by-char
      setDisplayedRoast("");
      let i = 0;
      const typingInterval = window.setInterval(() => {
        i += 1;
        setDisplayedRoast(roastText.slice(0, i));
        if (i >= roastText.length) {
          window.clearInterval(typingInterval);
          setIsRunning(false);
        }
      }, 18);
    } catch (err) {
      console.error("SignalAudit network/logic error:", err);
      window.clearInterval(intervalId);
      setScore(null);
      setStatus("TERMINAL");
      setDisplayedRoast(
        "Network failure. Either your connection died or the market did. Refresh and try again."
      );
      setCaption("Connection failed.");
      setIsRunning(false);
    }
  };

  return (
    <section
      id="signal-audit"
      className="border-b border-black bg-[#fdfbf7] px-4 py-14 md:px-8 md:py-16"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center font-display text-lg uppercase tracking-[0.26em] md:text-xl">
          The Signal Audit
        </div>

        <div className="relative overflow-hidden bg-black px-6 py-6 text-neutral-100 shadow-[0_24px_60px_rgba(0,0,0,0.75)]">
          {/* Ghost scan overlay */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
            <div className="h-16 w-full animate-scan bg-gradient-to-b from-transparent via-[#00ff41]/40 to-transparent" />
          </div>

          {/* Header */}
          <div className="relative z-10 mb-4 flex items-center justify-between font-terminal text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            <span>Input // Resume Signal Trace</span>
            <span>Bateman Diagnostics // Client-Side Only</span>
          </div>

          {/* Two-column layout */}
          <div className="relative z-10 grid gap-6 md:grid-cols-[0.9fr_1.6fr]">
            {/* Score column */}
            <div className="space-y-3 border border-neutral-800 bg-[#050505] px-4 py-4">
              <div className="font-terminal text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                Current Rating
              </div>
              <div className="font-terminal text-3xl tracking-[0.26em] text-[#BE123C] md:text-4xl">
                {score != null ? `${score}/10` : "0/10"}
              </div>

              <div className="mt-3">
                <div className="mb-1 font-terminal text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                  Status
                </div>
                <span
                  className={`inline-block border px-3 py-1 font-terminal text-[10px] uppercase tracking-[0.26em] ${statusLabelClass(
                    status
                  )}`}
                >
                  {status === "PENDING" ? "PENDING" : status}
                </span>
              </div>

              {/* Rolling log */}
              <div className="mt-4 min-h-[72px] space-y-1 border-t border-neutral-800 pt-3 font-terminal text-[10px] leading-relaxed text-neutral-400">
                {logLines.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </div>

            {/* Input column */}
            <div>
              <div className="mb-2 font-terminal text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                &gt; PASTE_RAW_RESUME_DATA_
              </div>
              <div className="relative">
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="// Paste your CV text here. Don't include your photo. We don't care what you look like."
                  className="min-h-[180px] w-full border border-neutral-800 bg-[#050505] px-3 py-3 font-terminal text-[11px] leading-relaxed text-[#d1fae5] outline-none placeholder:text-neutral-600 focus:border-[#00ff41]"
                  spellCheck={false}
                />
                {/* Idle cursor on empty input */}
                {resumeText.trim().length === 0 && (
                  <span className="pointer-events-none absolute bottom-3 left-3 inline-block h-4 w-2 bg-[#00ff41] animate-blink" />
                )}
              </div>
              <div className="mt-2 font-terminal text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                {caption}
              </div>
            </div>
          </div>

          {/* Roast output */}
          <div className="relative z-10 mt-6 border-t border-neutral-800 pt-4">
            <div className="mb-2 font-terminal text-[10px] uppercase tracking-[0.18em] text-neutral-400">
              Diagnostic Output
            </div>
            <div className="min-h-[120px] whitespace-pre-line font-terminal text-[11px] leading-relaxed text-neutral-200">
              {displayedRoast}
              {/* Output cursor that tracks the end of the stream */}
              {displayedRoast && (
                <span className="inline-block h-4 w-2 translate-y-[2px] bg-[#00ff41] align-baseline animate-blink" />
              )}
            </div>

            <button
              type="button"
              onClick={handleRun}
              disabled={isRunning}
              className="mt-5 w-full border border-[#00ff41] bg-[#00ff41] px-4 py-3 font-terminal text-[11px] font-black uppercase tracking-[0.26em] text-black transition-none hover:bg-black hover:text-[#00ff41] disabled:cursor-default disabled:opacity-50"
            >
              {isRunning ? "SCANNING..." : "RUN DIAGNOSTIC"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignalAudit;

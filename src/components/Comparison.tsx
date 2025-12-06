// src/components/Comparison.tsx
import React from "react";

const Comparison: React.FC = () => {
  return (
    <section className="border-b border-black bg-[#fdfbf7] px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 border-t border-black pt-6 text-center font-display text-2xl uppercase tracking-[0.16em] md:text-3xl">
          Retail thinking vs. institutional grade
        </h2>

        <div className="relative grid gap-6 md:grid-cols-2">
          {/* Retail card */}
          <div className="flex min-h-[320px] flex-col justify-between border border-black bg-[#fdfbf7] px-8 py-10">
            <div>
              <h3 className="mb-5 font-display text-2xl uppercase">
                The Retail User
              </h3>
              <ul className="space-y-3 text-[15px] leading-relaxed">
                <li>Uses ChatGPT to write “passionate” paragraphs.</li>
                <li>Applies through “Easy Apply” with 2,000 other hopefuls.</li>
                <li>Thinks adjectives equal competence.</li>
                <li>Spams résumés like confetti.</li>
              </ul>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-black pt-4 font-terminal text-[11px] uppercase tracking-[0.22em]">
              <span>Status:</span>
              <span className="text-[#ef4444]">Desperate.</span>
            </div>
          </div>

          {/* Bateman card */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 translate-y-4 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
            <div className="relative flex min-h-[320px] flex-col justify-between border border-white/10 bg-black px-8 py-10 text-neutral-200">
              <div>
                <h3 className="mb-5 font-display text-2xl uppercase">
                  The Bateman User
                </h3>
                <ul className="space-y-3 text-[15px] leading-relaxed">
                  <li>Sees elite roles before they’re public.</li>
                  <li>
                    Submits résumés that read like deal memos, not diary
                    entries.
                  </li>
                  <li>Applies client-side using human-signature keystrokes.</li>
                  <li>
                    Rises instantly above the generic, the loud, and the
                    untrained.
                  </li>
                </ul>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4 font-terminal text-[11px] uppercase tracking-[0.22em]">
                <span>Status:</span>
                <span className="text-[#22c55e]">Predatory.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;

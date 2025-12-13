// src/components/Explanation.tsx
import React from "react";

const steps = [
  {
    num: "01",
    title: "Uncovers high-value roles before they’re visible to the public.",
    body: "We don’t scrape job boards. We hit the source — directly — hours before LinkedIn even wakes up."
  },
  {
    num: "02",
    title: "Rebuilds your résumé into a hostile instrument.",
    body: "We delete the emotional clutter and replace it with quantifiable dominance: deal sizes, velocity, impact, results. The language of people who make decisions."
  },
  {
    num: "03",
    title: "Executes your application client-side with human keystrokes.",
    body: "No servers. No spam. Just silent, flawless precision — indistinguishable from a very competent human operating at inhuman speed."
  }
];

const Explanation: React.FC = () => {
  return (
    <section className="border-b border-black bg-[#fdfbf7] px-6 py-16 md:px-8 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[260px_minmax(0,1fr)]">
        <h2 className="font-display text-2xl uppercase tracking-[0.12em] leading-snug md:text-3xl">
          What Bateman
          <br />
          actually does
        </h2>

        <div className="flex flex-col gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="step grid grid-cols-[32px_minmax(0,1fr)] gap-4"
            >
              <div className="border-t border-black pt-2 font-terminal text-[11px] uppercase tracking-[0.22em]">
                {step.num}
              </div>
              <div>
                <h3 className="mb-2 font-display text-xl leading-snug">
                  {step.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-neutral-900">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Explanation;

// src/components/ProtocolSection.tsx
import React from "react";

const cols = [
  {
    title: "The Intelligence Feed",
    body:
      "We ignore the scraps on job boards. We monitor the direct career portals of elite institutions and detect openings the moment they appear. This is Time Arbitrage — and you have it.",
  },
  {
    title: "The Signal Layer",
    body:
      "We recalibrate your résumé using metrics that matter. No adjectives. No begging. Just quantifiable results written in a tone that forces a VP to look twice at 2:00 AM.",
  },
  {
    title: "The Hybrid Engine",
    body:
      "Client-side execution. Human keystrokes. Bot-level discipline. Your application slips through ATS filters like a tailored suit through a revolving door.",
  },
];

const ProtocolSection: React.FC = () => {
  return (
    <section id="protocol" className="border-b border-black bg-black">
      {/* Header */}
      <div className="border-b border-black bg-[#fdfbf7] px-4 py-10 md:px-8 md:py-14">
        <h2 className="text-center font-display text-2xl uppercase tracking-[0.16em] md:text-3xl">
          The Protocol
        </h2>
      </div>

      {/* Columns */}
      <div className="mx-auto grid max-w-6xl border-x border-black md:grid-cols-3">
        {cols.map((col, i) => (
          <div
            key={col.title}
            className={`protocol-card bg-[#fdfbf7] px-6 py-10 md:px-8 md:py-12 ${
              i !== cols.length - 1
                ? "border-b border-black/20 md:border-b-0 md:border-r"
                : "border-b md:border-b-0"
            }`}
          >
            <h3 className="mb-3 font-display text-lg uppercase tracking-[0.16em]">
              {col.title}
            </h3>
            <p className="text-[15px] leading-relaxed text-neutral-900">
              {col.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProtocolSection;

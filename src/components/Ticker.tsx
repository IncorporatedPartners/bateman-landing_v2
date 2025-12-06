// src/components/Ticker.tsx
import React from "react";

const items = [
  "GOLDMAN: OPENING POSTED (3m ago)",
  "CITADEL: NEW ROLE DETECTED (7m ago)",
  "MCKINSEY: APPLICATION WINDOW OPENED (12m ago)",
  "THE MARKET IS RIGGED. ADAPT OR DIE.",
];

const Ticker: React.FC = () => {
  return (
    <div className="fixed inset-x-0 top-0 z-40 flex h-10 items-center overflow-hidden border-b border-[#00ff41] bg-black text-[#00ff41]">
      <div className="ticker-track flex whitespace-nowrap">
        {Array.from({ length: 3 }).map((_, loopIdx) => (
          <div className="flex" key={loopIdx}>
            {items.map((item, i) => (
              <div
                key={`${loopIdx}-${i}`}
                className="flex items-center font-terminal text-[11px] uppercase tracking-[0.18em]"
              >
                <span>{item}</span>
                <span className="mx-6 opacity-50">///</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticker;

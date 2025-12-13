// src/components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-black bg-[#fdfbf7] px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="font-terminal text-[11px] uppercase tracking-[0.22em]">
          Bateman ┬⌐ 2025. GET A GODDAMN JOB.
        </div>
        <div className="font-terminal text-[10px] uppercase tracking-[0.22em] text-neutral-600">
          Status Recovery Protocol: Initialized.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

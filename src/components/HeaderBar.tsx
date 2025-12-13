// src/components/HeaderBar.tsx
import React from "react";

const HeaderBar: React.FC = () => {
  return (
    <header className="relative z-30 mt-10 w-full border-b border-black bg-[#fdfbf7]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        {/* Brand */}
        <div className="flex items-center">
          <img
            src="https://i.ibb.co/Zzp09MB0/bateman-logo.png"
            alt="Bateman logo"
            className="h-14 md:h-16 w-auto object-contain"
          />
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-8 md:gap-10">
          <a
            href="#protocol"
            className="nav-link relative font-terminal text-[11px] md:text-[12px] uppercase tracking-[0.22em] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
          >
            PROTOCOL
          </a>
          <a
            href="#faq"
            className="nav-link relative font-terminal text-[11px] md:text-[12px] uppercase tracking-[0.22em] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
          >
            FAQ
          </a>
          <a
            href="#acquire"
            className="nav-link border border-black px-4 py-2 font-terminal text-[11px] md:text-[12px] uppercase tracking-[0.22em] transition-colors hover:bg-black hover:text-[#fdfbf7]"
          >
            ACQUIRE
          </a>
        </nav>
      </div>
    </header>
  );
};

export default HeaderBar;
  
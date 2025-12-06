// src/components/Hero.tsx
import React, { useState } from "react";
import MarketCanvas from "../canvas";

const Hero: React.FC = () => {
  const [status, setStatus] = useState<string>("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = (data.get("email") || "").toString().trim();
    if (!email) return;

    setStatus("Submitting…");

    try {
      const res = await fetch("https://formspree.io/f/xeobvwev", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (res.ok) {
        form.reset();
        setStatus("You’re on the list. We’ll be in touch.");
      } else {
        setStatus("Something broke. Try again in a moment.");
      }
    } catch {
      setStatus("Network error. Check your connection.");
    }
  };

  return (
    <section
      id="acquire"
      className="border-b border-black bg-[#fdfbf7] pt-16 md:pt-20"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2">
        {/* Left side */}
        <div className="flex items-center border-b border-black px-6 py-14 md:border-b-0 md:border-r md:px-8 md:py-20">
          <div className="max-w-xl">
            {/* live feed indicator */}
            <div className="mb-6 flex items-center gap-2 font-terminal text-[10px] uppercase tracking-[0.26em] text-[#16a34a]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00ff41]/50"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00ff41]"></span>
              </span>
              <span>Live feed</span>
            </div>

            <h1 className="mb-6 font-display text-5xl font-semibold uppercase leading-none tracking-[-0.04em] md:text-6xl lg:text-7xl">
              <span className="block">The market</span>
              <span className="block">is rigged.</span>
            </h1>

            <p className="mb-6 max-w-md text-[15px] leading-relaxed text-neutral-800">
              <span className="font-semibold">
                Most people beg for interviews. You don’t.
              </span>{" "}
              Bateman detects elite roles early, sharpens your résumé, and
              submits the application that ends the competition.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mb-3 flex flex-col gap-2"
            >
              <label
                htmlFor="waitlist-email"
                className="font-terminal text-[10px] uppercase tracking-[0.26em]"
              >
                Drop your best email. We’ll invite you when Bateman is live.
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="waitlist-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="EMAIL ADDRESS"
                  className="flex-1 border border-black bg-transparent px-3 py-3 font-terminal text-[11px] uppercase tracking-[0.2em] outline-none focus:ring-0"
                />
                <button
                  type="submit"
                  className="whitespace-nowrap border border-black bg-black px-6 py-3 font-terminal text-[11px] uppercase tracking-[0.22em] text-[#fdfbf7] transition-colors hover:bg-transparent hover:text-black"
                >
                  [ REQUEST EARLY ACCESS ]
                </button>
              </div>
            </form>

            <div className="min-h-[1.2rem] font-terminal text-[10px] uppercase tracking-[0.18em]">
              {status && <span>{status}</span>}
            </div>

            <div className="mt-6 font-terminal text-[10px] uppercase tracking-[0.22em] text-neutral-800">
              Client-side. Undetectable. Merciless.
            </div>
          </div>
        </div>

        {/* Right side chart */}
        <div className="h-[420px] border-l border-black md:h-auto md:border-l-0">
          <MarketCanvas />
        </div>
      </div>
    </section>
  );
};

export default Hero;

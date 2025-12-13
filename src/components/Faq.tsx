// src/components/Faq.tsx
import React, { useState } from "react";

interface Item {
  q: string;
  a: React.ReactNode;
  category: "PHILOSOPHY" | "MECHANICS" | "FINANCE";
}

const items: Item[] = [
  {
    category: "PHILOSOPHY",
    q: '"I have ChatGPT Plus. Why should I pay you $49?"',
    a: (
      <>
        Because ChatGPT writes like a desperate intern. It uses words like
        “tapestry,” “passionate,” and “collaborative.” It signals to recruiters
        that you are average.
        <br />
        <br />
        Bateman is fine-tuned on Tier-1 Deal Memos and Buy-Side Analyst Reports.
        We don’t give you “better words.” We give you Signal.
      </>
    )
  },
  {
    category: "PHILOSOPHY",
    q: '"Is this like LazyApply or those other \'Auto-Appliers\'?"',
    a: (
      <>
        If you want to spam 5,000 applications and get your email blacklisted by
        Workday, go use them. That is a Retail strategy.
        <br />
        <br />
        Bateman is a sniper, not a machine gun.
      </>
    )
  },
  {
    category: "PHILOSOPHY",
    q: '"Your "Roast" tool was incredibly harsh. Is that necessary?"',
    a: (
      <>
        The market is harsher. We just said the quiet part out loud. If you
        can’t handle a digital critique of your formatting, you certainly can’t
        handle the Investment Committee at Blackstone.
      </>
    )
  },
  {
    category: "MECHANICS",
    q: '"Will I get banned from LinkedIn or Workday for using this?"',
    a: (
      <>
        No.
        <br />
        <br />
        Retail bots run on servers that hammer LinkedIn. Bateman runs client-side,
        using human-signature keystrokes and respecting rate limits.
      </>
    )
  },
  {
    category: "MECHANICS",
    q: '"What jobs does this find?"',
    a: (
      <>
        We ignore Easy Apply. Our Intelligence Feed scrapes the direct career
        portals of the elite quad: high finance, big tech, and strategy consulting
        — before the roles hit public boards.
      </>
    )
  },
  {
    category: "MECHANICS",
    q: '"Does it write cover letters?"',
    a: (
      <>
        Yes, but not the kind you’re used to.
        <br />
        <br />
        We don’t write “Dear Hiring Manager, I love your company.” We write
        internal-memo-style letters that get read.
      </>
    )
  },
  {
    category: "FINANCE",
    q: '"Do you guarantee I get a job?"',
    a: (
      <>
        No. We are not your mother.
        <br />
        <br />
        We guarantee a structural advantage over the 500 other applicants using
        generic tools.
      </>
    )
  },
  {
    category: "FINANCE",
    q: '"$49/month seems expensive for a tool."',
    a: (
      <>
        It is the price of two cocktails in Manhattan.
        <br />
        <br />
        If you hesitate over $49 to secure a $250k+ career, you have already
        answered why you are currently unemployed.
      </>
    )
  }
];

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const grouped = {
    PHILOSOPHY: items.filter((i) => i.category === "PHILOSOPHY"),
    MECHANICS: items.filter((i) => i.category === "MECHANICS"),
    FINANCE: items.filter((i) => i.category === "FINANCE")
  };

  const renderGroup = (title: string, categoryKey: keyof typeof grouped) => (
    <div className="mt-12">
      <div className="mb-4 border-b border-black pb-2 font-terminal text-[11px] uppercase tracking-[0.26em] text-neutral-700">
        {title}
      </div>

      {grouped[categoryKey].map((item) => {
        const absIndex = items.findIndex(
          (x) => x.category === categoryKey && x.q === item.q
        );
        const active = openIndex === absIndex;

        return (
          <div key={item.q} className="border-b border-neutral-200 last:border-black">
            <button
              type="button"
              onClick={() => setOpenIndex(active ? null : absIndex)}
              className="flex w-full items-center justify-between py-5 text-left"
            >
              <span className="pr-6 font-display text-lg uppercase tracking-[0.12em] leading-snug text-neutral-900 md:text-xl">
                {item.q}
              </span>
              <span className="font-terminal text-[14px] uppercase tracking-[0.16em] text-neutral-900">
                {active ? "−" : "+"}
              </span>
            </button>

            {active && (
              <div className="pb-6 text-[15px] leading-[1.75] text-neutral-800 md:text-[16px]">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <section
      id="faq"
      className="border-t border-black bg-[#fdfbf7] px-4 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl uppercase tracking-[0.16em] md:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-3 font-terminal text-[12px] italic tracking-[0.22em] text-neutral-600">
            (Or: “Questions You Are Afraid To Ask”)
          </div>
        </div>

        {renderGroup("THE PHILOSOPHY", "PHILOSOPHY")}
        {renderGroup("THE MECHANICS", "MECHANICS")}
        {renderGroup("THE FINANCE", "FINANCE")}
      </div>
    </section>
  );
};

export default Faq;

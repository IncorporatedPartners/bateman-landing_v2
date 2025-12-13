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
        "tapestry," "passionate," and "collaborative." It signals to recruiters
        that you are average.
        <br />
        <br />
        Bateman is fine-tuned on Tier-1 Deal Memos and Buy-Side Analyst Reports.
        We don't give you "better words." We give you Signal. We strip the "HR Fluff"
        and inject quantitative impact metrics that bypass the boredom filter of a VP
        reading resumes at 2:00 AM.
        <br />
        <br />
        Furthermore: ChatGPT doesn't know about the job that was posted 12 minutes ago.
        We do.
      </>
    )
  },
  {
    category: "PHILOSOPHY",
    q: '"Is this like LazyApply or those other \'Auto-Appliers\'?"',
    a: (
      <>
        If you want to spam 5,000 applications and get your email blacklisted by
        Workday, go use them. That is a "Retail" strategy.
        <br />
        <br />
        Bateman is a Sniper, not a machine gun. We don't apply to "everything." We
        identify the specific roles where you have a statistical advantage, and we craft
        the perfect application for that specific role. We value your reputation, even if
        you don't.
      </>
    )
  },
  {
    category: "PHILOSOPHY",
    q: '"Your "Roast" tool was incredibly harsh. Is that necessary?"',
    a: (
      <>
        The market is harsher. We just said the quiet part out loud. If you
        can't handle a digital critique of your formatting, you certainly can't
        handle the Investment Committee at Blackstone. Fix the resume, stop crying,
        and get to work.
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
        "Retail" bots (the ones that get you banned) run on servers that ping LinkedIn
        1,000 times a minute. It looks suspicious.
        <br />
        <br />
        Bateman runs Client-Side (in your browser). To the Applicant Tracking System, you
        simply look like a very diligent, very fast human being. We mimic human keystrokes.
        We respect rate limits. We fly under the radar.
      </>
    )
  },
  {
    category: "MECHANICS",
    q: '"What jobs does this find?"',
    a: (
      <>
        We ignore "Easy Apply" (LinkedIn/Indeed). That is where the 99% fight for scraps.
        <br />
        <br />
        Our Intelligence Feed scrapes the direct career portals of the "Elite Quad":
        <br />
        <br />
        High Finance (Goldman, JPM, KKR, Citadel)
        <br />
        Big Tech (Meta, Google, Amazon)
        <br />
        Strategy Consulting (MBB)
        <br />
        <br />
        We find the role before it gets aggregated to the public job boards. We sell Time
        Arbitrage.
      </>
    )
  },
  {
    category: "MECHANICS",
    q: '"Does it write cover letters?"',
    a: (
      <>
        Yes, but not the kind you're used to.
        <br />
        <br />
        We don't write "Dear Hiring Manager, I love your company."
        <br />
        <br />
        We write: "Re: Associate Role. 4 years M&A experience. $1.2B in executed deal
        flow. Modeled complex LBOs under tight deadlines. Attached is the breakdown."
        <br />
        <br />
        We write letters that get read.
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
        We guarantee we will give you a structural advantage over the 500 other applicants
        using generic tools. We guarantee we will save you 40 hours of data entry per month.
        We guarantee you will look more competent than you actually are. The interview is up
        to you.
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
        If you are hesitating over $49 to secure a $250k+ career, you have already answered
        why you are currently unemployed: You do not understand ROI.
        <br />
        <br />
        This is not a subscription. It is an investment in status recovery.
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
    <div className="faq-group">
      <div className="faq-category-label">
        {title}
      </div>

      {grouped[categoryKey].map((item) => {
        const absIndex = items.findIndex(
          (x) => x.category === categoryKey && x.q === item.q
        );
        const active = openIndex === absIndex;

        return (
          <div key={item.q} className="faq-item">
            <button
              type="button"
              onClick={() => setOpenIndex(active ? null : absIndex)}
              className="faq-question-btn"
            >
              <span className="faq-question-text">
                {item.q}
              </span>
              <span className="faq-question-icon">
                {active ? "−" : "+"}
              </span>
            </button>

            {active && (
              <div className="faq-answer">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <section id="faq" className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">
            Frequently Asked Questions
          </h2>
          <div className="faq-subtitle">
            (Or: "Questions You Are Afraid To Ask")
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

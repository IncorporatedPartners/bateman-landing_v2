// src/components/Explanation.tsx
import React from "react";

const steps = [
  {
    num: "01",
    title: "Uncovers high-value roles before they're visible to the public.",
    body:
      "We don't scrape job boards. We hit the source directly hours before LinkedIn even wakes up."
  },
  {
    num: "02",
    title: "Rebuilds your resume into a hostile instrument.",
    body:
      "We delete the emotional clutter and replace it with quantifiable dominance: deal sizes, velocity, impact, results. The language of people who make decisions."
  },
  {
    num: "03",
    title: "Executes your application client-side with human keystrokes.",
    body:
      "No servers. No spam. Just silent, flawless precision indistinguishable from a very competent human operating at inhuman speed."
  }
];

const Explanation: React.FC = () => {
  return (
    <section className="explanation-section">
      <div className="explanation-container">
        <h2 className="explanation-title">
          What Bateman
          <br />
          actually does
        </h2>

        <div className="explanation-steps">
          {steps.map((step) => (
            <div key={step.num} className="step">
              <div className="step-num">{step.num}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-body">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Explanation;

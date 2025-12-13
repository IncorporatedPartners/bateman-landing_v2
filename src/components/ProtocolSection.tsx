// src/components/ProtocolSection.tsx
import React from "react";

const cols = [
  {
    title: "The Intelligence Feed",
    body:
      "We ignore the scraps on job boards. We monitor the direct career portals of elite institutions and detect openings the moment they appear. This is Time Arbitrage — and you have it."
  },
  {
    title: "The Signal Layer",
    body:
      "We recalibrate your résumé using metrics that matter. No adjectives. No begging. Just quantifiable results written in a tone that forces a VP to look twice at 2:00 AM."
  },
  {
    title: "The Hybrid Engine",
    body:
      "Client-side execution. Human keystrokes. Bot-level discipline. Your application slips through ATS filters like a tailored suit through a revolving door."
  }
];

const ProtocolSection: React.FC = () => {
  return (
    <section id="protocol" className="protocol-section">
      <div className="protocol-header-container">
        <h2 className="protocol-main-title">The Protocol</h2>
      </div>

      <div className="protocol-grid-container">
        <div className="protocol-grid">
          {cols.map((col, i) => (
            <div key={col.title} className="protocol-card">
              <h3 className="protocol-card-title">{col.title}</h3>
              <p className="protocol-card-body">{col.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProtocolSection;

// src/App.tsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Explanation from "./components/Explanation";
import ProtocolSection from "./components/ProtocolSection";
import SignalAudit from "./components/SignalAudit";
import Faq from "./components/Faq";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    if (!root) return;

    // Track custom teardown callbacks that GSAP won't handle for us.
    const cleanups: Array<() => void> = [];

    // Everything inside this context is scoped to rootRef.
    const ctx = gsap.context(() => {
      // -----------------------------
      // NAV SMOOTH SCROLL (scoped)
      // -----------------------------
      const anchors = Array.from(
        root.querySelectorAll<HTMLAnchorElement>("a.nav-link")
      );

      const onNavClick = (e: Event) => {
        const a = e.currentTarget as HTMLAnchorElement;
        e.preventDefault();
        const targetSelector = a.getAttribute("href");
        if (!targetSelector) return;
        const target = root.querySelector<HTMLElement>(targetSelector);
        if (!target) return;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      };

      anchors.forEach((a) => a.addEventListener("click", onNavClick));

      // -----------------------------
      // TICKER (scoped)
      // -----------------------------
      const tickerTween = gsap.to(".ticker", {
        xPercent: -25,
        ease: "none",
        duration: 20,
        repeat: -1
      });

      const tickerWrapEl = root.querySelector<HTMLElement>(".ticker-wrap");
      const onTickerEnter = () => tickerTween.pause();
      const onTickerLeave = () => tickerTween.resume();

      if (tickerWrapEl) {
        tickerWrapEl.addEventListener("mouseenter", onTickerEnter);
        tickerWrapEl.addEventListener("mouseleave", onTickerLeave);
      }

      // -----------------------------
      // HERO ENTRANCE (scoped)
      // -----------------------------
      const tlHero = gsap.timeline({ defaults: { ease: "power3.out" } });

      tlHero
        .from(".hero-line", {
          y: 100,
          stagger: 0.15,
          duration: 1.2,
          delay: 0.2
        })
        .from(
          ".hero-live",
          {
            y: 40,
            duration: 0.7
          },
          "-=0.6"
        )
        .from(
          ".hero-subhead",
          {
            y: 40,
            duration: 0.8
          },
          "-=0.4"
        )
        .from(
          [".btn-main", ".hero-micro"],
          {
            y: 30,
            duration: 0.6,
            stagger: 0.1
          },
          "-=0.2"
        );

      // -----------------------------
      // CTA HOVER MICRO-MOTION (scoped)
      // -----------------------------
      const btn = root.querySelector<HTMLButtonElement>(".btn-main");
      const onBtnMove = (e: MouseEvent) => {
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = e.clientX - centerX;
        const y = e.clientY - centerY;

        gsap.to(btn, {
          x: x * 0.25,
          y: y * 0.25,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const onBtnLeave = () => {
        if (!btn) return;
        gsap.to(btn, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)"
        });
      };

      if (btn) {
        btn.addEventListener("mousemove", onBtnMove);
        btn.addEventListener("mouseleave", onBtnLeave);
      }

      // -----------------------------
      // SCROLL REVEALS (scoped)
      // IMPORTANT: these rely on class hooks existing in your components.
      // If you want reveals on Explanation/Protocol/Faq, ensure those components
      // include these classNames on the relevant elements.
      // -----------------------------
      gsap.utils.toArray<HTMLElement>(".step").forEach((step) => {
        gsap.from(step, {
          scrollTrigger: {
            trigger: step,
            start: "top 90%"
          },
          y: 40,
          duration: 0.6,
          ease: "power3.out"
        });
      });

      gsap.utils.toArray<HTMLElement>(".card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%"
          },
          y: 40,
          duration: 0.6,
          ease: "power3.out",
          delay: i * 0.05
        });
      });

      gsap.utils.toArray<HTMLElement>(".protocol-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%"
          },
          y: 30,
          duration: 0.6,
          ease: "power3.out",
          delay: i * 0.05
        });
      });

      // -----------------------------
      // CANDLESTICK CANVAS (scoped to hero)
      // -----------------------------
      const canvas = root.querySelector<HTMLCanvasElement>("#marketCanvas");
      const ctx2 = canvas?.getContext("2d");
      if (canvas && ctx2) {
        let width = 0;
        let height = 0;

        const resize = () => {
          const parent = canvas.parentElement;
          if (!parent) return;
          width = canvas.width = parent.offsetWidth;
          height = canvas.height = parent.offsetHeight;
        };

        window.addEventListener("resize", resize);
        resize();

        class Candle {
          x = 0;
          y = 0;
          colWidth = 0;
          speed = 0;
          isGreen = false;
          bodyHeight = 0;
          wickHeight = 0;

          constructor(initial = false) {
            this.reset(initial);
          }

          reset(initial = false) {
            const marginX = width * 0.08;
            this.colWidth = Math.random() < 0.3 ? 2 : Math.random() * 6 + 4;
            this.x = marginX + Math.random() * (width - marginX * 2);
            this.y = initial ? Math.random() * height : -200 - Math.random() * 200;
            this.speed = Math.random() * 4 + 2;
            this.isGreen = Math.random() > 0.45;
            this.bodyHeight = Math.random() * 80 + 10;
            this.wickHeight = this.bodyHeight + Math.random() * 60;
          }

          update() {
            this.y += this.speed;
            if (this.y > height + 100) this.reset();
          }

          draw() {
            const color = this.isGreen ? "#047857" : "#BE123C";
            ctx2.fillStyle = color;
            ctx2.strokeStyle = color;

            ctx2.beginPath();
            ctx2.lineWidth = 1;
            ctx2.moveTo(this.x + this.colWidth / 2, this.y);
            ctx2.lineTo(this.x + this.colWidth / 2, this.y + this.wickHeight);
            ctx2.stroke();

            const bodyY = this.y + (this.wickHeight - this.bodyHeight) / 2;
            ctx2.fillRect(this.x, bodyY, this.colWidth, this.bodyHeight);
          }
        }

        const candles: Candle[] = [];
        const count = window.innerWidth < 768 ? 30 : 70;
        for (let i = 0; i < count; i++) candles.push(new Candle(true));

        let raf = 0;
        const animate = () => {
          ctx2.clearRect(0, 0, width, height);
          candles.forEach((c) => {
            c.update();
            c.draw();
          });
          raf = window.requestAnimationFrame(animate);
        };
        animate();

        // Cleanup raf + resize
        const cleanup = () => {
          window.cancelAnimationFrame(raf);
          window.removeEventListener("resize", resize);
        };
        cleanups.push(cleanup);
      }
    }, root);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="text-[19px] leading-[1.7] text-neutral-900"
    >
      <div className="noise-overlay" />

      {/* Ticker (unchanged) */}
      <div className="ticker-wrap">
        <div className="ticker">
          <div className="ticker-item">
            GOLDMAN: OPENING POSTED (3m ago){" "}
            <span className="ticker-separator">///</span>
            CITADEL: NEW ROLE DETECTED (7m ago){" "}
            <span className="ticker-separator">///</span>
            MCKINSEY: APPLICATION WINDOW OPENED (12m ago){" "}
            <span className="ticker-separator">///</span>
            THE MARKET IS RIGGED. ADAPT OR DIE.{" "}
            <span className="ticker-separator">///</span>
          </div>
          <div className="ticker-item">
            GOLDMAN: OPENING POSTED (3m ago){" "}
            <span className="ticker-separator">///</span>
            CITADEL: NEW ROLE DETECTED (7m ago){" "}
            <span className="ticker-separator">///</span>
            MCKINSEY: APPLICATION WINDOW OPENED (12m ago){" "}
            <span className="ticker-separator">///</span>
            THE MARKET IS RIGGED. ADAPT OR DIE.{" "}
            <span className="ticker-separator">///</span>
          </div>
          <div className="ticker-item">
            GOLDMAN: OPENING POSTED (3m ago){" "}
            <span className="ticker-separator">///</span>
            CITADEL: NEW ROLE DETECTED (7m ago){" "}
            <span className="ticker-separator">///</span>
            MCKINSEY: APPLICATION WINDOW OPENED (12m ago){" "}
            <span className="ticker-separator">///</span>
            THE MARKET IS RIGGED. ADAPT OR DIE.{" "}
            <span className="ticker-separator">///</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="site-header">
        <div className="header-left">
          <img src="/bateman_logo.png" alt="Bateman" className="bateman-logo" />
        </div>

        <nav className="header-nav">
          <a href="#protocol" className="nav-link">
            PROTOCOL
          </a>
          <a href="#faq" className="nav-link">
            FAQ
          </a>
          <a href="#acquire" className="nav-link">
            ACQUIRE
          </a>
        </nav>
      </header>

      {/* HERO (kept inline to avoid redesign) */}
      <section className="hero" id="acquire">
        <div className="hero-content">
          <div className="hero-inner">
            <h1 className="headline" id="hero-headline">
              <span className="hero-line">THE MARKET</span>
              <span className="hero-line">IS RIGGED.</span>
            </h1>

            <div className="hero-live">
              <span className="live-dot-wrap">
                <span className="live-ring" />
                <span className="live-dot" />
              </span>
              <span className="hero-live-label">LIVE FEED</span>
            </div>

            <p className="hero-subhead">
              <strong>Most people beg for interviews. You don&apos;t.</strong>
              Bateman detects elite roles early, sharpens your résumé, and submits
              the application that ends the competition.
            </p>

            <div className="cta-container">
              <form
                className="waitlist-form"
                id="waitlist-form"
                action="https://formspree.io/f/xeobvwev"
                method="POST"
              >
                <label htmlFor="waitlist-email" className="waitlist-label mono">
                  Drop your best email. We&apos;ll invite you when Bateman is live.
                </label>
                <div className="waitlist-row">
                  <input
                    type="email"
                    id="waitlist-email"
                    name="email"
                    required
                    className="waitlist-input"
                    placeholder="EMAIL ADDRESS"
                    autoComplete="email"
                  />
                  <button type="submit" className="btn-main">
                    [ REQUEST EARLY ACCESS ]
                  </button>
                </div>
                <p className="waitlist-status mono" id="waitlist-status" />
              </form>
            </div>

            <div className="hero-micro">CLIENT-SIDE. UNDETECTABLE. MERCILESS.</div>
          </div>
        </div>

        <div className="hero-visual">
          <canvas id="marketCanvas" />
        </div>
      </section>

      {/* Explanation now comes from component */}
      <Explanation />

      {/* Comparison stays inline for now (no redesign) */}
      <section className="comparison">
        <h2 className="section-header serif-head">
          RETAIL THINKING VS. INSTITUTIONAL GRADE
        </h2>
        <div className="comparison-grid">
          <div className="card loser">
            <div className="card-inner">
              <div>
                <h3 className="card-title serif-head">THE RETAIL USER</h3>
                <ul className="card-list">
                  <li>Uses ChatGPT to write “passionate” paragraphs</li>
                  <li>Applies through “Easy Apply” with 2,000 other hopefuls</li>
                  <li>Thinks adjectives equal competence</li>
                  <li>Spams résumés like confetti</li>
                </ul>
              </div>
              <div className="card-status">
                <span>Status:</span>
                <span className="red">Desperate.</span>
              </div>
            </div>
          </div>

          <div className="card winner">
            <div className="card-inner">
              <div>
                <h3 className="card-title serif-head">THE BATEMAN USER</h3>
                <ul className="card-list">
                  <li>Sees elite roles before they&apos;re public</li>
                  <li>
                    Submits résumés that read like deal memos, not diary entries
                  </li>
                  <li>Applies client-side using human-signature keystrokes</li>
                  <li>Rises instantly above the generic, the loud, and the untrained</li>
                </ul>
              </div>
              <div className="card-status">
                <span>Status:</span>
                <span className="green">Predatory.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol now comes from component */}
      <ProtocolSection />

      {/* Signal Audit already componentized */}
      <SignalAudit />

      {/* FAQ now comes from component (your typography changes will now show) */}
      <Faq />

      {/* Footer now comes from component (tagline change will now show) */}
      <Footer />
    </div>
  );
};

export default App;

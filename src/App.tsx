// src/App.tsx
import React, { useEffect } from "react";
import SignalAudit from "./components/SignalAudit";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const App: React.FC = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // NAV SMOOTH SCROLL
    document
      .querySelectorAll<HTMLAnchorElement>("a.nav-link")
      .forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          e.preventDefault();
          const targetSelector = anchor.getAttribute("href");
          if (!targetSelector) return;
          const target = document.querySelector<HTMLElement>(targetSelector);
          if (!target) return;
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });

    // TICKER
    const tickerTween = gsap.to(".ticker", {
      xPercent: -25,
      ease: "none",
      duration: 20,
      repeat: -1
    });

    const tickerWrapEl = document.querySelector<HTMLElement>(".ticker-wrap");
    if (tickerWrapEl) {
      tickerWrapEl.addEventListener("mouseenter", () => tickerTween.pause());
      tickerWrapEl.addEventListener("mouseleave", () => tickerTween.resume());
    }

    // HERO ENTRANCE
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

    // CTA HOVER MICRO-MOTION
    const btn = document.querySelector<HTMLButtonElement>(".btn-main");
    if (btn) {
      btn.addEventListener("mousemove", (e) => {
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
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)"
        });
      });
    }

    // SCROLL REVEALS
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

    gsap.utils.toArray<HTMLElement>(".faq-category").forEach((cat) => {
      gsap.from(cat, {
        scrollTrigger: { trigger: cat, start: "top 95%" },
        y: 20,
        duration: 0.5,
        ease: "power2.out"
      });
    });

    gsap.utils.toArray<HTMLElement>(".accordion-item").forEach((item) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: "top 95%" },
        y: 20,
        duration: 0.45,
        ease: "power2.out"
      });
    });

    // FAQ ACCORDIONS
    const items = document.querySelectorAll<HTMLDivElement>(".accordion-item");
    items.forEach((item) => {
      const header = item.querySelector<HTMLButtonElement>(".accordion-header");
      const content =
        item.querySelector<HTMLDivElement>(".accordion-content");

      if (!header || !content) return;

      header.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        items.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            otherItem.classList.remove("active");
            const otherHeader =
              otherItem.querySelector<HTMLButtonElement>(".accordion-header");
            const otherContent =
              otherItem.querySelector<HTMLDivElement>(".accordion-content");
            if (!otherHeader || !otherContent) return;

            otherHeader.setAttribute("aria-expanded", "false");
            gsap.to(otherContent, {
              height: 0,
              opacity: 0,
              duration: 0.3,
              ease: "power2.inOut"
            });
          }
        });

        if (!isActive) {
          item.classList.add("active");
          header.setAttribute("aria-expanded", "true");
          gsap.to(content, {
            height: "auto",
            opacity: 1,
            duration: 0.3,
            ease: "power2.inOut"
          });
        } else {
          item.classList.remove("active");
          header.setAttribute("aria-expanded", "false");
          gsap.to(content, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut"
          });
        }
      });
    });

    // WAITLIST FORM
    const waitlistForm = document.getElementById(
      "waitlist-form"
    ) as HTMLFormElement | null;
    const waitlistStatus = document.getElementById(
      "waitlist-status"
    ) as HTMLParagraphElement | null;
    const ctaButton = document.querySelector<HTMLButtonElement>(".btn-main");

    if (waitlistForm && waitlistStatus) {
      waitlistForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        waitlistStatus.textContent = "Submitting...";
        waitlistStatus.classList.remove("success", "error");
        if (ctaButton) ctaButton.classList.add("disabled");

        const formData = new FormData(waitlistForm);

        try {
          const response = await fetch(waitlistForm.action, {
            method: "POST",
            body: formData,
            headers: { Accept: "application/json" }
          });

          if (response.ok) {
            waitlistForm.reset();
            waitlistStatus.textContent =
              "You’re on the list. We’ll be in touch.";
            waitlistStatus.classList.add("success");
          } else {
            waitlistStatus.textContent =
              "Something broke. Try again in a moment.";
            waitlistStatus.classList.add("error");
            if (ctaButton) ctaButton.classList.remove("disabled");
          }
        } catch {
          waitlistStatus.textContent =
            "Network error. Check your connection.";
          waitlistStatus.classList.add("error");
          if (ctaButton) ctaButton.classList.remove("disabled");
        }
      });
    }

    // CANDLESTICK CANVAS
    const canvas = document.getElementById(
      "marketCanvas"
    ) as HTMLCanvasElement | null;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
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
          this.y = initial
            ? Math.random() * height
            : -200 - Math.random() * 200;
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
          ctx.fillStyle = color;
          ctx.strokeStyle = color;

          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.moveTo(this.x + this.colWidth / 2, this.y);
          ctx.lineTo(this.x + this.colWidth / 2, this.y + this.wickHeight);
          ctx.stroke();

          const bodyY = this.y + (this.wickHeight - this.bodyHeight) / 2;
          ctx.fillRect(this.x, bodyY, this.colWidth, this.bodyHeight);
        }
      }

      const candles: Candle[] = [];
      const count = window.innerWidth < 768 ? 30 : 70;
      for (let i = 0; i < count; i++) candles.push(new Candle(true));

      const animate = () => {
        ctx.clearRect(0, 0, width, height);
        candles.forEach((c) => {
          c.update();
          c.draw();
        });
        requestAnimationFrame(animate);
      };
      animate();
    }

    // SIGNAL AUDIT – RESUME ROAST TERMINAL
    (function () {
      const resumeInputEl = document.getElementById(
        "signal-resume-input"
      ) as HTMLTextAreaElement | null;
      const runBtn = document.getElementById(
        "signal-run-btn"
      ) as HTMLButtonElement | null;
      const scoreEl = document.getElementById(
        "signal-score-value"
      ) as HTMLDivElement | null;
      const metaCaptionEl = document.getElementById(
        "signal-meta-caption"
      ) as HTMLDivElement | null;
      const roastEl = document.getElementById(
        "signal-roast-output"
      ) as HTMLDivElement | null;
      const statusStampEl = document.getElementById(
        "signal-status-stamp"
      ) as HTMLDivElement | null;

      if (
        !resumeInputEl ||
        !runBtn ||
        !scoreEl ||
        !metaCaptionEl ||
        !roastEl ||
        !statusStampEl
      ) {
        return;
      }

      const resetStatusClasses = () => {
        statusStampEl.classList.remove(
          "status-stamp--terminal",
          "status-stamp--distressed",
          "status-stamp--retail",
          "status-stamp--idle"
        );
      };

      const setStatus = (status: string) => {
        const normalized = (status || "DISTRESSED").toUpperCase();
        resetStatusClasses();
        statusStampEl.textContent = normalized;

        if (normalized === "TERMINAL") {
          statusStampEl.classList.add("status-stamp--terminal");
        } else if (normalized === "DISTRESSED" || normalized === "REJECTED") {
          statusStampEl.classList.add("status-stamp--distressed");
        } else {
          statusStampEl.classList.add("status-stamp--retail");
        }
      };

      async function runDiagnostic() {
        const text = (resumeInputEl.value || "").trim();
        if (!text) {
          metaCaptionEl.textContent =
            "Paste your entire resume first. Bateman cannot roast a blank signal.";
          resumeInputEl.focus();
          return;
        }

        runBtn.disabled = true;
        runBtn.textContent = "SCANNING …";
        roastEl.textContent =
          "Running internal diagnostic. Partners are reviewing your signal.";
        metaCaptionEl.textContent =
          "Diagnostic in progress. Do not refresh.";
        setStatus("PENDING");

        try {
          const res = await fetch("/.netlify/functions/roast", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resumeText: text })
          });

          let payload: any;
          try {
            payload = await res.json();
          } catch {
            throw new Error("Non-JSON response from diagnostic endpoint.");
          }

          if (!res.ok || payload.error) {
            scoreEl.textContent = "—/10";
            roastEl.textContent =
              "The diagnostic endpoint returned an error. Try again in a few minutes.";
            metaCaptionEl.textContent =
              "If this keeps happening, the market is probably collapsing.";
            setStatus("DISTRESSED");
            return;
          }

          const scoreRaw =
            payload.score ?? payload.urgencyScore ?? payload.rating;
          const score = Number(scoreRaw);
          const displayScore = Number.isFinite(score)
            ? score.toFixed(1)
            : "9.0";
          const status = (payload.status || "DISTRESSED").toUpperCase();
          const roastText: string =
            payload.roast ||
            payload.roastText ||
            payload.message ||
            "Bateman has reviewed your profile and found it… unremarkable. You look competent on paper, but so does everyone else. Right now, you are furniture.";

          scoreEl.textContent = `${displayScore}/10`;
          setStatus(status);
          roastEl.textContent = roastText;

          if (status === "TERMINAL") {
            metaCaptionEl.textContent =
              "TERMINAL // Resume requires a full rebuild before elite outreach.";
          } else if (status === "DISTRESSED" || status === "REJECTED") {
            metaCaptionEl.textContent =
              "DISTRESSED // Severe signal leakage. Recruiters will not see what you think they see.";
          } else {
            metaCaptionEl.textContent =
              "RETAIL // Passable, but still indistinguishable from the noise floor.";
          }
        } catch {
          scoreEl.textContent = "—/10";
          roastEl.textContent =
            "Network failure. Either your internet died or the market did. Refresh and try again.";
          metaCaptionEl.textContent =
            "If this persists, blame the Fed, not Bateman.";
          setStatus("DISTRESSED");
        } finally {
          runBtn.disabled = false;
          runBtn.textContent = "RUN ROAST DIAGNOSTIC";
        }
      }

      runBtn.addEventListener("click", () => {
        void runDiagnostic();
      });
    })();
  }, []);

  return (
    <>
      <div className="noise-overlay" />

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

      <header className="site-header">
        <div className="header-left">
          <img
            src="https://i.ibb.co/Zzp09MB0/bateman-logo.png"
            alt="Bateman logo"
            className="bateman-logo"
          />
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
              Bateman detects elite roles early, sharpens your résumé, and
              submits the application that ends the competition.
            </p>

            <div className="cta-container">
              <form
                className="waitlist-form"
                id="waitlist-form"
                action="https://formspree.io/f/xeobvwev"
                method="POST"
              >
                <label
                  htmlFor="waitlist-email"
                  className="waitlist-label mono"
                >
                  Drop your best email. We&apos;ll invite you when Bateman is
                  live.
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

            <div className="hero-micro">
              CLIENT-SIDE. UNDETECTABLE. MERCILESS.
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <canvas id="marketCanvas" />
        </div>
      </section>

      {/* WHAT BATEMAN ACTUALLY DOES */}
      <section className="explanation">
        <div className="explanation-grid">
          <h2 className="explanation-title serif-head">
            WHAT BATEMAN
            <br />
            ACTUALLY DOES
          </h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-num">01</div>
              <div className="step-content">
                <h3>
                  Uncovers high-value roles before they&apos;re visible to the
                  public.
                </h3>
                <p>
                  We don&apos;t scrape job boards. We hit the source — directly
                  — hours before LinkedIn even wakes up.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <div className="step-content">
                <h3>Rebuilds your résumé into a precision instrument.</h3>
                <p>
                  We delete the emotional clutter and replace it with
                  quantifiable dominance: deal sizes, velocity, impact, results.
                  The language of people who make decisions.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <div className="step-content">
                <h3>
                  Executes your application client-side with human keystrokes.
                </h3>
                <p>
                  No servers. No spam. Just silent, flawless precision —
                  indistinguishable from a very competent human operating at
                  inhuman speed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
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
                  <li>
                    Applies through “Easy Apply” with 2,000 other hopefuls
                  </li>
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
                    Submits résumés that read like deal memos, not diary
                    entries
                  </li>
                  <li>
                    Applies client-side using human-signature keystrokes
                  </li>
                  <li>
                    Rises instantly above the generic, the loud, and the
                    untrained
                  </li>
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

      {/* PROTOCOL */}
      <section className="protocol" id="protocol">
        <div className="protocol-header-wrap">
          <h2 className="protocol-header serif-head">THE PROTOCOL</h2>
        </div>
        <div className="protocol-grid">
          <div className="protocol-card">
            <h3 className="protocol-title serif-head">THE INTELLIGENCE FEED</h3>
            <p className="protocol-body">
              We ignore the scraps on job boards. We monitor the direct career
              portals of elite institutions and detect openings the moment they
              appear. This is Time Arbitrage — and you have it.
            </p>
          </div>
          <div className="protocol-card">
            <h3 className="protocol-title serif-head">THE SIGNAL LAYER</h3>
            <p className="protocol-body">
              We recalibrate your résumé using metrics that matter. No
              adjectives. No begging. Just quantifiable results written in a
              tone that forces a VP to look twice at 2:00 AM.
            </p>
          </div>
          <div className="protocol-card">
            <h3 className="protocol-title serif-head">THE HYBRID ENGINE</h3>
            <p className="protocol-body">
              Client-side execution. Human keystrokes. Bot-level discipline.
              Your application slips through ATS filters like a tailored suit
              through a revolving door.
            </p>
          </div>
        </div>
      </section>

      <SignalAudit />

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="faq-intro">
          <h2
            className="section-header serif-head"
            style={{ border: "none", padding: 0, marginBottom: 0 }}
          >
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <div className="faq-sub">
            (Or: &quot;Questions You Are Afraid To Ask&quot;)
          </div>
        </div>

        <div className="faq-category">THE PHILOSOPHY</div>

        <div className="accordion-item">
          <button className="accordion-header" aria-expanded="false">
            <span className="q-text">
              &quot;I have ChatGPT Plus. Why should I pay you $49?&quot;
            </span>
            <span className="q-icon" />
          </button>
          <div className="accordion-content">
            <div className="accordion-inner">
              Because ChatGPT writes like a desperate intern. It uses words like
              &quot;tapestry,&quot; &quot;passionate,&quot; and
              &quot;collaborative.&quot; It signals to recruiters that you are
              average.
              <br />
              <br />
              Bateman is fine-tuned on Tier-1 Deal Memos and Buy-Side Analyst
              Reports. We don&apos;t give you &quot;better words.&quot; We give
              you Signal. We strip the &quot;HR Fluff&quot; and inject
              quantitative impact metrics that bypass the boredom filter of a VP
              reading resumes at 2:00 AM.
              <br />
              <br />
              Furthermore: ChatGPT doesn&apos;t know about the job that was
              posted 12 minutes ago. We do.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <button className="accordion-header" aria-expanded="false">
            <span className="q-text">
              &quot;Is this like LazyApply or those other &apos;Auto-Appliers&apos;?&quot;
            </span>
            <span className="q-icon" />
          </button>
          <div className="accordion-content">
            <div className="accordion-inner">
              If you want to spam 5,000 applications and get your email
              blacklisted by Workday, go use them. That is a &quot;Retail&quot;
              strategy.
              <br />
              <br />
              Bateman is a Sniper, not a machine gun. We don&apos;t apply to
              &quot;everything.&quot; We identify the specific roles where you
              have a statistical advantage, and we craft the perfect application
              for that specific role. We value your reputation, even if you
              don&apos;t.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <button className="accordion-header" aria-expanded="false">
            <span className="q-text">
              &quot;Your &apos;Roast&apos; tool was incredibly harsh. Is that
              necessary?&quot;
            </span>
            <span className="q-icon" />
          </button>
          <div className="accordion-content">
            <div className="accordion-inner">
              The market is harsher. We just said the quiet part out loud. If
              you can&apos;t handle a digital critique of your formatting, you
              certainly can&apos;t handle the Investment Committee at
              Blackstone. Fix the resume, stop crying, and get to work.
            </div>
          </div>
        </div>

        <div className="faq-category">THE MECHANICS</div>

        <div className="accordion-item">
          <button className="accordion-header" aria-expanded="false">
            <span className="q-text">
              &quot;Will I get banned from LinkedIn or Workday for using
              this?&quot;
            </span>
            <span className="q-icon" />
          </button>
          <div className="accordion-content">
            <div className="accordion-inner">
              No.
              <br />
              <br />
              &quot;Retail&quot; bots (the ones that get you banned) run on
              servers that ping LinkedIn 1,000 times a minute. It looks
              suspicious.
              <br />
              <br />
              Bateman runs Client-Side (in your browser). To the Applicant
              Tracking System, you simply look like a very diligent, very fast
              human being. We mimic human keystrokes. We respect rate limits. We
              fly under the radar.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <button className="accordion-header" aria-expanded="false">
            <span className="q-text">&quot;What jobs does this find?&quot;</span>
            <span className="q-icon" />
          </button>
          <div className="accordion-content">
            <div className="accordion-inner">
              We ignore &quot;Easy Apply&quot; (LinkedIn/Indeed). That is where
              the 99% fight for scraps.
              <br />
              <br />
              Our Intelligence Feed scrapes the direct career portals of the
              &quot;Elite Quad&quot;:
              <br />
              <br />
              High Finance (Goldman, JPM, KKR, Citadel)
              <br />
              Big Tech (Meta, Google, Amazon)
              <br />
              Strategy Consulting (MBB)
              <br />
              <br />
              We find the role before it gets aggregated to the public job
              boards. We sell Time Arbitrage.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <button className="accordion-header" aria-expanded="false">
            <span className="q-text">
              &quot;Does it write Cover Letters?&quot;
            </span>
            <span className="q-icon" />
          </button>
          <div className="accordion-content">
            <div className="accordion-inner">
              Yes, but not the kind you&apos;re used to.
              <br />
              <br />
              We don&apos;t write &quot;Dear Hiring Manager, I love your
              company.&quot;
              <br />
              <br />
              We write: &quot;Re: Associate Role. 4 years M&amp;A experience.
              $1.2B in executed deal flow. Modeled complex LBOs under tight
              deadlines. Attached is the breakdown.&quot;
              <br />
              <br />
              We write letters that get read.
            </div>
          </div>
        </div>

        <div className="faq-category">THE FINANCE</div>

        <div className="accordion-item">
          <button className="accordion-header" aria-expanded="false">
            <span className="q-text">
              &quot;Do you guarantee I get a job?&quot;
            </span>
            <span className="q-icon" />
          </button>
          <div className="accordion-content">
            <div className="accordion-inner">
              No. We are not your mother.
              <br />
              <br />
              We guarantee we will give you a structural advantage over the 500
              other applicants using generic tools. We guarantee we will save
              you 40 hours of data entry per month. We guarantee you will look
              more competent than you actually are. The interview is up to you.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <button className="accordion-header" aria-expanded="false">
            <span className="q-text">
              &quot;$49/month seems expensive for a tool.&quot;
            </span>
            <span className="q-icon" />
          </button>
          <div className="accordion-content">
            <div className="accordion-inner">
              It is the price of two cocktails in Manhattan.
              <br />
              <br />
              If you are hesitating over $49 to secure a $250k+ career, you have
              already answered why you are currently unemployed: You do not
              understand ROI.
              <br />
              <br />
              This is not a subscription. It is an investment in status
              recovery.
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div>
          <div className="footer-main">
            BATEMAN © 2025. GET A GODDAMN JOB.
          </div>
          <div style={{ marginTop: "0.5rem", opacity: 0.7 }}>
            Status Recovery Protocol Initialized.
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;

[1mdiff --git a/src/App.tsx b/src/App.tsx[m
[1mindex d756cb5..75ec8ca 100644[m
[1m--- a/src/App.tsx[m
[1m+++ b/src/App.tsx[m
[36m@@ -1,24 +1,29 @@[m
 // src/App.tsx[m
 import React, { useEffect } from "react";[m
[31m-import SignalAudit from "./components/SignalAudit";[m
 import gsap from "gsap";[m
 import { ScrollTrigger } from "gsap/ScrollTrigger";[m
 [m
[32m+[m[32mimport HeaderBar from "./components/HeaderBar";[m
[32m+[m[32mimport Explanation from "./components/Explanation"[m
[32m+[m[32mimport ProtocolSection from "./components/ProtocolSection";[m
[32m+[m[32mimport SignalAudit from "./components/SignalAudit";[m
[32m+[m[32mimport Faq from "./components/Faq";[m
[32m+[m[32mimport Footer from "./components/Footer";[m
[32m+[m
 const App: React.FC = () => {[m
   useEffect(() => {[m
     gsap.registerPlugin(ScrollTrigger);[m
 [m
     // NAV SMOOTH SCROLL[m
     document[m
[31m-      .querySelectorAll<HTMLAnchorElement>("a.nav-link")[m
[32m+[m[32m      .querySelectorAll<HTMLAnchorElement>("a[href^='#']")[m
       .forEach((anchor) => {[m
         anchor.addEventListener("click", (e) => {[m
           e.preventDefault();[m
[31m-          const targetSelector = anchor.getAttribute("href");[m
[31m-          if (!targetSelector) return;[m
[31m-          const target = document.querySelector<HTMLElement>(targetSelector);[m
[31m-          if (!target) return;[m
[31m-          target.scrollIntoView({ behavior: "smooth", block: "start" });[m
[32m+[m[32m          const target = document.querySelector([m
[32m+[m[32m            anchor.getAttribute("href") || ""[m
[32m+[m[32m          );[m
[32m+[m[32m          target?.scrollIntoView({ behavior: "smooth", block: "start" });[m
         });[m
       });[m
 [m
[36m@@ -37,937 +42,145 @@[m [mconst App: React.FC = () => {[m
     }[m
 [m
     // HERO ENTRANCE[m
[31m-    const tlHero = gsap.timeline({ defaults: { ease: "power3.out" } });[m
[31m-[m
[31m-    tlHero[m
[31m-      .from(".hero-line", {[m
[31m-        y: 100,[m
[31m-        stagger: 0.15,[m
[31m-        duration: 1.2,[m
[31m-        delay: 0.2[m
[31m-      })[m
[31m-      .from([m
[31m-        ".hero-live",[m
[31m-        {[m
[31m-          y: 40,[m
[31m-          duration: 0.7[m
[31m-        },[m
[31m-        "-=0.6"[m
[31m-      )[m
[31m-      .from([m
[31m-        ".hero-subhead",[m
[31m-        {[m
[31m-          y: 40,[m
[31m-          duration: 0.8[m
[31m-        },[m
[31m-        "-=0.4"[m
[31m-      )[m
[31m-      .from([m
[31m-        [".btn-main", ".hero-micro"],[m
[31m-        {[m
[31m-          y: 30,[m
[31m-          duration: 0.6,[m
[31m-          stagger: 0.1[m
[31m-        },[m
[31m-        "-=0.2"[m
[31m-      );[m
[31m-[m
[31m-    // CTA HOVER MICRO-MOTION[m
[31m-    const btn = document.querySelector<HTMLButtonElement>(".btn-main");[m
[31m-    if (btn) {[m
[31m-      btn.addEventListener("mousemove", (e) => {[m
[31m-        const rect = btn.getBoundingClientRect();[m
[31m-        const centerX = rect.left + rect.width / 2;[m
[31m-        const centerY = rect.top + rect.height / 2;[m
[31m-        const x = e.clientX - centerX;[m
[31m-        const y = e.clientY - centerY;[m
[31m-[m
[31m-        gsap.to(btn, {[m
[31m-          x: x * 0.25,[m
[31m-          y: y * 0.25,[m
[31m-          scale: 1.02,[m
[31m-          duration: 0.3,[m
[31m-          ease: "power2.out"[m
[31m-        });[m
[31m-      });[m
[31m-[m
[31m-      btn.addEventListener("mouseleave", () => {[m
[31m-        gsap.to(btn, {[m
[31m-          x: 0,[m
[31m-          y: 0,[m
[31m-          scale: 1,[m
[31m-          duration: 0.5,[m
[31m-          ease: "elastic.out(1, 0.5)"[m
[31m-        });[m
[31m-      });[m
[31m-    }[m
[31m-[m
[31m-    // SCROLL REVEALS[m
[31m-    gsap.utils.toArray<HTMLElement>(".step").forEach((step) => {[m
[31m-      gsap.from(step, {[m
[31m-        scrollTrigger: {[m
[31m-          trigger: step,[m
[31m-          start: "top 90%"[m
[31m-        },[m
[31m-        y: 40,[m
[32m+[m[32m    gsap[m
[32m+[m[32m      .timeline({ defaults: { ease: "power3.out" } })[m
[32m+[m[32m      .from(".hero-line", { y: 100, stagger: 0.15, duration: 1.2, delay: 0.2 })[m
[32m+[m[32m      .from(".hero-live", { y: 40, duration: 0.7 }, "-=0.6")[m
[32m+[m[32m      .from(".hero-subhead", { y: 40, duration: 0.8 }, "-=0.4")[m
[32m+[m[32m      .from([".btn-main", ".hero-micro"], {[m
[32m+[m[32m        y: 30,[m
         duration: 0.6,[m
[31m-        ease: "power3.out"[m
[31m-      });[m
[31m-    });[m
[32m+[m[32m        stagger: 0.1[m
[32m+[m[32m      }, "-=0.2");[m
 [m
[31m-    gsap.utils.toArray<HTMLElement>(".card").forEach((card, i) => {[m
[31m-      gsap.from(card, {[m
[31m-        scrollTrigger: {[m
[31m-          trigger: card,[m
[31m-          start: "top 85%"[m
[31m-        },[m
[32m+[m[32m    // SCROLL REVEALS[m
[32m+[m[32m    gsap.utils.toArray<HTMLElement>(".step").forEach((el) =>[m
[32m+[m[32m      gsap.from(el, {[m
[32m+[m[32m        scrollTrigger: { trigger: el, start: "top 90%" },[m
         y: 40,[m
[31m-        duration: 0.6,[m
[31m-        ease: "power3.out",[m
[31m-        delay: i * 0.05[m
[31m-      });[m
[31m-    });[m
[32m+[m[32m        duration: 0.6[m
[32m+[m[32m      })[m
[32m+[m[32m    );[m
 [m
[31m-    gsap.utils.toArray<HTMLElement>(".protocol-card").forEach((card, i) => {[m
[31m-      gsap.from(card, {[m
[31m-        scrollTrigger: {[m
[31m-          trigger: card,[m
[31m-          start: "top 90%"[m
[31m-        },[m
[32m+[m[32m    gsap.utils.toArray<HTMLElement>(".protocol-card").forEach((el, i) =>[m
[32m+[m[32m      gsap.from(el, {[m
[32m+[m[32m        scrollTrigger: { trigger: el, start: "top 90%" },[m
         y: 30,[m
         duration: 0.6,[m
[31m-        ease: "power3.out",[m
         delay: i * 0.05[m
[31m-      });[m
[31m-    });[m
[31m-[m
[31m-    gsap.utils.toArray<HTMLElement>(".faq-category").forEach((cat) => {[m
[31m-      gsap.from(cat, {[m
[31m-        scrollTrigger: { trigger: cat, start: "top 95%" },[m
[31m-        y: 20,[m
[31m-        duration: 0.5,[m
[31m-        ease: "power2.out"[m
[31m-      });[m
[31m-    });[m
[31m-[m
[31m-    gsap.utils.toArray<HTMLElement>(".accordion-item").forEach((item) => {[m
[31m-      gsap.from(item, {[m
[31m-        scrollTrigger: { trigger: item, start: "top 95%" },[m
[31m-        y: 20,[m
[31m-        duration: 0.45,[m
[31m-        ease: "power2.out"[m
[31m-      });[m
[31m-    });[m
[31m-[m
[31m-    // FAQ ACCORDIONS[m
[31m-    const items = document.querySelectorAll<HTMLDivElement>(".accordion-item");[m
[31m-    items.forEach((item) => {[m
[31m-      const header = item.querySelector<HTMLButtonElement>(".accordion-header");[m
[31m-      const content =[m
[31m-        item.querySelector<HTMLDivElement>(".accordion-content");[m
[31m-[m
[31m-      if (!header || !content) return;[m
[31m-[m
[31m-      header.addEventListener("click", () => {[m
[31m-        const isActive = item.classList.contains("active");[m
[31m-[m
[31m-        items.forEach((otherItem) => {[m
[31m-          if (otherItem !== item && otherItem.classList.contains("active")) {[m
[31m-            otherItem.classList.remove("active");[m
[31m-            const otherHeader =[m
[31m-              otherItem.querySelector<HTMLButtonElement>(".accordion-header");[m
[31m-            const otherContent =[m
[31m-              otherItem.querySelector<HTMLDivElement>(".accordion-content");[m
[31m-            if (!otherHeader || !otherContent) return;[m
[31m-[m
[31m-            otherHeader.setAttribute("aria-expanded", "false");[m
[31m-            gsap.to(otherContent, {[m
[31m-              height: 0,[m
[31m-              opacity: 0,[m
[31m-              duration: 0.3,[m
[31m-              ease: "power2.inOut"[m
[31m-            });[m
[31m-          }[m
[31m-        });[m
[31m-[m
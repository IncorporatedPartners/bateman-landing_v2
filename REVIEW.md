# Code Review Notes

## Findings

1. **Event listeners and GSAP instances are never cleaned up**
   - `App.tsx` attaches multiple DOM listeners (nav smooth scroll, ticker hover, CTA hover, accordion toggles) and creates GSAP animations inside a `useEffect` with no cleanup. In React Strict Mode or during hot reloads, the component can mount twice, leaving duplicate listeners and running tweens after unmount. Consider returning a cleanup function that removes listeners and kills timelines/ScrollTriggers (or use `gsap.context`).【F:src/App.tsx†L12-L200】

2. **Signal audit intervals can leak when the component unmounts mid-run**
   - `handleRun` starts rolling log and typewriter intervals but never ties them to component lifecycle; if the user navigates away, the timers keep running. Extract the intervals into refs and clear them on unmount to avoid background updates to an unmounted component.【F:src/components/SignalAudit.tsx†L69-L168】

3. **Roast score/status messaging is inconsistent**
   - The audit caption is derived from the numeric score while the displayed status comes from the API. Defaults clamp missing/invalid scores to `9`, which triggers the harsh "TERMINAL" caption even if the backend returned a softer status. Align caption/status with server intent or fall back to the API status instead of an arbitrary high score.【F:src/components/SignalAudit.tsx†L114-L136】


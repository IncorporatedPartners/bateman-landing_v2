[1mdiff --git a/src/components/SignalAudit.tsx b/src/components/SignalAudit.tsx[m
[1mindex 00cc2d8..b798878 100644[m
[1m--- a/src/components/SignalAudit.tsx[m
[1m+++ b/src/components/SignalAudit.tsx[m
[36m@@ -92,7 +92,7 @@[m [mconst SignalAudit: React.FC = () => {[m
         setScore(null);[m
         setStatus("TERMINAL");[m
         setDisplayedRoast([m
[31m-          "The diagnostic endpoint returned something unreadable. Your résumé confused the model before it confused recruiting."[m
[32m+[m[32m          "The diagnostic endpoint returned something unreadable. Your r├⌐sum├⌐ confused the model before it confused recruiting."[m
         );[m
         setCaption("Non-JSON response from diagnostic engine.");[m
         setIsRunning(false);[m
[36m@@ -104,7 +104,7 @@[m [mconst SignalAudit: React.FC = () => {[m
         setScore(null);[m
         setStatus("TERMINAL");[m
         setDisplayedRoast([m
[31m-          "The diagnostic endpoint returned an error. Your résumé broke the scanner before the market did."[m
[32m+[m[32m          "The diagnostic endpoint returned an error. Your r├⌐sum├⌐ broke the scanner before the market did."[m
         );[m
         setCaption("Try again in a few minutes.");[m
         setIsRunning(false);[m
[36m@@ -120,7 +120,7 @@[m [mconst SignalAudit: React.FC = () => {[m
       const rawStatus = normalizeStatus(payload.status || "");[m
       const roastText: string =[m
         payload.roast ||[m
[31m-        "You have all the characteristics of a high-value candidate—experience, degrees, skills—but not a single clear, identifiable emotion except... desperation.";[m
[32m+[m[32m        "You have all the characteristics of a high-value candidateΓÇöexperience, degrees, skillsΓÇöbut not a single clear, identifiable emotion except... desperation.";[m
 [m
       setScore(safeScore);[m
       setStatus(rawStatus);[m
[36m@@ -147,10 +147,7 @@[m [mconst SignalAudit: React.FC = () => {[m
           }[m
         }[m
 [m
[31m-        if (payload._source) {[m
[31m-          merged.push(`> ENGINE_SOURCE: ${String(payload._source).toUpperCase()}`);[m
[31m-        }[m
[31m-[m
[32m+[m[32m        // Intentionally omit any engine/source identification line.[m
         merged.push("> ANALYSIS_COMPLETE. RENDERING_JUDGMENT...");[m
         return merged;[m
       });[m
[36m@@ -198,7 +195,7 @@[m [mconst SignalAudit: React.FC = () => {[m
           {/* Header */}[m
           <div className="relative z-10 mb-4 flex items-center justify-between font-terminal text-[10px] uppercase tracking-[0.18em] text-neutral-400">[m
             <span>Input // Resume Signal Trace</span>[m
[31m-            <span>Bateman Diagnostics • Client-Side Only</span>[m
[32m+[m[32m            <span>Bateman Diagnostics ΓÇó Client-Side Only</span>[m
           </div>[m
 [m
           {/* Two-column layout */}[m
[36m@@ -242,7 +239,7 @@[m [mconst SignalAudit: React.FC = () => {[m
                 <textarea[m
                   value={resumeText}[m
                   onChange={(e) => setResumeText(e.target.value)}[m
[31m-                  placeholder="// Paste your CV text here. Don’t include your photo. We don’t care what you look like."[m
[32m+[m[32m                  placeholder="// Paste your CV text here. DonΓÇÖt include your photo. We donΓÇÖt care what you look like."[m
                   className="min-h-[180px] w-full border border-neutral-800 bg-[#050505] px-3 py-3 font-terminal text-[11px] leading-relaxed text-[#d1fae5] outline-none placeholder:text-neutral-600 focus:border-[#00ff41]"[m
                   spellCheck={false}[m
                 />[m
[36m@@ -260,7 +257,7 @@[m [mconst SignalAudit: React.FC = () => {[m
           {/* Roast output */}[m
           <div className="relative z-10 mt-6 border-t border-neutral-800 pt-4">[m
             <div className="mb-2 font-terminal text-[10px] uppercase tracking-[0.18em] text-neutral-400">[m
[31m-              Hostile Output[m
[32m+[m[32m              Diagnostic Output[m
             </div>[m
             <div className="min-h-[120px] whitespace-pre-line font-terminal text-[11px] leading-relaxed text-neutral-200">[m
               {displayedRoast}[m
[36m@@ -276,7 +273,7 @@[m [mconst SignalAudit: React.FC = () => {[m
               disabled={isRunning}[m
               className="mt-5 w-full border border-[#00ff41] bg-[#00ff41] px-4 py-3 font-terminal text-[11px] font-black uppercase tracking-[0.26em] text-black transition-none hover:bg-black hover:text-[#00ff41] disabled:cursor-default disabled:opacity-50"[m
             >[m
[31m-              {isRunning ? "SCANNING…" : "RUN DIAGNOSTIC"}[m
[32m+[m[32m              {isRunning ? "SCANNINGΓÇª" : "RUN DIAGNOSTIC"}[m
             </button>[m
           </div>[m
         </div>[m

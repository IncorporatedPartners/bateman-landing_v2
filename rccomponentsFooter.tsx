[1mdiff --git a/src/components/ProtocolSection.tsx b/src/components/ProtocolSection.tsx[m
[1mindex 3d9e818..7059788 100644[m
[1m--- a/src/components/ProtocolSection.tsx[m
[1m+++ b/src/components/ProtocolSection.tsx[m
[36m@@ -1,4 +1,5 @@[m
 // src/components/ProtocolSection.tsx[m
[32m+[m
 import React from "react";[m
 [m
 const cols = [[m
[36m@@ -27,14 +28,10 @@[m [mconst ProtocolSection: React.FC = () => {[m
 [m
       <div className="mx-auto grid max-w-6xl border-x border-black md:grid-cols-3">[m
         {cols.map((col, i) => ([m
[31m-          <div[m
[31m-            key={col.title}[m
[31m-            className={`bg-[#fdfbf7] px-6 py-10 md:px-8 md:py-12 ${[m
[31m-              i !== cols.length - 1[m
[31m-                ? "border-b border-black/20 md:border-b-0 md:border-r"[m
[31m-                : "border-b md:border-b-0"[m
[31m-            }`}[m
[31m-          >[m
[32m+[m[32m         <div[m
[32m+[m[32m  key={col.title}[m
[32m+[m[32m  className={`protocol-card bg-[#fdfbf7] px-6 py-10 md:px-8 md:py-12 ...`}[m
[32m+[m[32m>[m
             <h3 className="mb-3 font-display text-lg uppercase tracking-[0.16em]">[m
               {col.title}[m
             </h3>[m

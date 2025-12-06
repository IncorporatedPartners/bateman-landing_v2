// netlify/functions/roast.js
// Gemini 3 Roast Engine — Bateman (verified pipeline)

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

exports.handler = async function (event) {
  // --- CORS + method guards ---
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  if (!GEMINI_API_KEY) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: "Missing GEMINI_API_KEY" })
    };
  }

  // --- Parse body ---
  let resumeText = "";
  try {
    const body = JSON.parse(event.body || "{}");
    resumeText = (body.resumeText || "").toString();
  } catch (e) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: "Invalid JSON body" })
    };
  }

  if (!resumeText.trim()) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: "resumeText is required" })
    };
  }

  // No clipping for now
  const effectiveResume = resumeText;

  try {
    // --- Prompt design ---
    const systemPrompt =
      "You are Patrick Bateman in Mergers & Acquisitions at Pierce & Pierce.\n" +
      "You evaluate resumes the way bankers evaluate distressed assets.\n" +
      "Clinical. Detached. Status-obsessed.\n\n" +
      "Output STRICT JSON only:\n" +
      "{\n" +
      '  \"score\": number,      // integer 1-10 (10 = weakest signal)\n' +
      '  \"status\": string,     // TERMINAL | DISTRESSED | RETAIL\n' +
      '  \"roast\": string       // 2-4 sentences, cold, memo-tone\n' +
      "}\n";

    const userPrompt =
      "Candidate Resume:\n-----------------\n" + effectiveResume;

    // --- Gemini 3 REST call ---
    const apiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent";

    const geminiRes = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "user", parts: [{ text: userPrompt }] }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 600,
          thinkingLevel: "low" // prevent MAX_TOKENS from thought loops
        }
      })
    });

    // --- HTTP-level failure (not model-level) ---
    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini 3 HTTP error:", geminiRes.status, errText);
      return success(buildFallbackRoast(effectiveResume));
    }

    const geminiJson = await geminiRes.json();

    // --- Log usage ---
    try {
      console.log(
        "Gemini 3 usageMetadata:",
        JSON.stringify(geminiJson.usageMetadata || {})
      );
    } catch {}

    // --- Extract model text ---
    let rawText = "";
    try {
      const c = geminiJson.candidates?.[0]?.content?.parts?.[0];
      if (c && typeof c.text === "string") rawText = c.text;
    } catch {}

    // If empty, fallback
    if (!rawText.trim()) {
      console.error("Empty Gemini 3 response:", JSON.stringify(geminiJson));
      return success(buildFallbackRoast(effectiveResume));
    }

    rawText = rawText.trim();

    // If wrapped in prose, carve out JSON
    if (!rawText.startsWith("{")) {
      const first = rawText.indexOf("{");
      const last = rawText.lastIndexOf("}");
      if (first !== -1 && last !== -1 && last > first) {
        rawText = rawText.slice(first, last + 1);
      }
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      console.error("Invalid JSON from Gemini 3:", rawText);
      return success(buildFallbackRoast(effectiveResume));
    }

    // --- Validate & normalize ---
    let score = parsed.score;
    if (typeof score !== "number" || !isFinite(score)) score = 9;
    score = Math.max(1, Math.min(10, Math.round(score)));

    let status = (parsed.status || "").toUpperCase().trim();
    const allowed = ["TERMINAL", "DISTRESSED", "RETAIL"];
    if (!allowed.includes(status)) {
      status = score >= 9 ? "TERMINAL" : score >= 6 ? "DISTRESSED" : "RETAIL";
    }

    let roast = parsed.roast;
    if (!roast || typeof roast !== "string") {
      roast =
        "Your resume reads like a mall-kiosk imitation of competence. Dorsia is not returning your call.";
    }

    return success({ score, status, roast });
  } catch (err) {
    console.error("Roast internal error:", err);
    return success(buildFallbackRoast(effectiveResume));
  }
};

// --- Helpers ---

function success(json) {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(json)
  };
}

function buildFallbackRoast(resumeText) {
  const lower = (resumeText || "").toLowerCase();
  const eliteSignals = [
    "goldman",
    "morgan stanley",
    "jp morgan",
    "j.p. morgan",
    "blackstone",
    "kkr",
    "mckinsey",
    "bain",
    "bcg"
  ];
  const hasElite = eliteSignals.some((s) => lower.includes(s));

  const score = hasElite ? 6 : 9;
  const status = hasElite ? "DISTRESSED" : "TERMINAL";

  const roast = hasElite
    ? "You touched real firms, but the way you describe it reads like HR copy. A partner would skim this and assume you were furniture in the conference room."
    : "Nothing here signals someone the Street would fight to hire. This reads like a mall-franchise business plan: familiar, safe, and entirely forgettable.";

  return { score, status, roast };
}

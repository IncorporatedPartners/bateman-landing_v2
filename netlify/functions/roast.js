// netlify/functions/roast.js
// Gemini 3 Roast Engine — Bateman (REST, structured JSON)

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

  const effectiveResume = resumeText;

  try {
    const prompt =
      "You are Patrick Bateman in Mergers & Acquisitions at Pierce & Pierce.\n" +
      "You evaluate resumes the way bankers evaluate distressed assets.\n" +
      "Clinical. Detached. Status-obsessed.\n\n" +
      "Given the resume below, output STRICT JSON only in this shape:\n" +
      "{\n" +
      '  \"score\": number,      // integer 1-10 (10 = weakest signal)\n' +
      '  \"status\": string,     // TERMINAL | DISTRESSED | RETAIL\n' +
      '  \"roast\": string       // long-form inner monologue, Bateman voice\n' +
      "}\n\n" +
      "Resume:\n-----------------\n" +
      effectiveResume +
      "\n\nReturn ONLY the JSON object, no explanation.";

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
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 1.0,
          maxOutputTokens: 1024,
          // Correct placement per Gemini 3 REST guide:
          thinkingConfig: {
            thinkingLevel: "low"
          },
          // Force JSON output:
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: "object",
            properties: {
              score: { type: "number" },
              status: {
                type: "string",
                enum: ["TERMINAL", "DISTRESSED", "RETAIL"]
              },
              roast: { type: "string" }
            },
            required: ["score", "status", "roast"],
            additionalProperties: false
          }
        }
      })
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini 3 HTTP error:", geminiRes.status, errText);
      return success(buildFallbackRoast(effectiveResume), "fallback_http");
    }

    const geminiJson = await geminiRes.json();

    // For structured outputs, response.text is already JSON string; but via REST we
    // get the object directly under candidates[0].content.parts[0].text
    let rawText = "";
    try {
      const part =
        geminiJson.candidates?.[0]?.content?.parts?.find(
          (p) => typeof p.text === "string"
        );
      if (part) rawText = part.text;
    } catch (e) {
      console.error("Error extracting text from Gemini 3:", e);
    }

    if (!rawText || !rawText.trim()) {
      console.error("Empty Gemini 3 response:", JSON.stringify(geminiJson));
      return success(buildFallbackRoast(effectiveResume), "fallback_empty");
    }

    rawText = rawText.trim();

    // If model wraps JSON with prose, try to slice it out
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
      return success(buildFallbackRoast(effectiveResume), "fallback_parse");
    }

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

    return success({ score, status, roast }, "gemini");
  } catch (err) {
    console.error("Roast internal error:", err);
    return success(buildFallbackRoast(effectiveResume), "fallback_error");
  }
};

// --- Helpers ---

function success(json, source) {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ...json, _source: source || "unknown" })
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

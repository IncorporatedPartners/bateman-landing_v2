// netlify/functions/roast.ts
import type { Handler } from "@netlify/functions";

type RoastStatus = "TERMINAL" | "DISTRESSED" | "RETAIL";

// Use the Pro-tier Gemini model
const GEMINI_MODEL = "gemini-1.5-pro-latest";

// Very safe defaults if Gemini fails or returns garbage
const DEFAULT_ROAST =
  "Nothing here signals someone the Street would fight to hire. This reads like a mall-franchise business plan: familiar, safe, and entirely forgettable.";
const DEFAULT_SCORE = 9;
const DEFAULT_STATUS: RoastStatus = "TERMINAL";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { resumeText } = JSON.parse(event.body || "{}");

    if (!resumeText || typeof resumeText !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing resumeText" }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing GEMINI_API_KEY" }),
      };
    }

    const prompt = `
You are BATEMAN_ROAST_ENGINE, an elite-finance resume roast tool.

Given a candidate's raw resume text, you output ONLY a single JSON object with the following shape:

{
  "score": number,          // integer 1–10, where 10 = most terminal / disastrous
  "status": "TERMINAL" | "DISTRESSED" | "RETAIL",
  "roast": string           // 120–220 words, hostile, American Psycho-coded, darkly funny
}

Rules:
- "TERMINAL" = score >= 8
- "DISTRESSED" = score 6–7
- "RETAIL" = score <= 5
- Do NOT use emojis.
- Do NOT mention that you are an AI.
- Tone: cold, surgical, Patrick Bateman inner monologue.
- Output MUST be valid JSON. No markdown, no comments, no surrounding prose.

Resume text to evaluate:
"""
${resumeText}
"""
`;

    let roast = DEFAULT_ROAST;
    let score: number = DEFAULT_SCORE;
    let status: RoastStatus = DEFAULT_STATUS;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini HTTP ${response.status}`);
      }

      const data = await response.json();
      const rawText: string | undefined =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (rawText && typeof rawText === "string") {
        let parsed: any;

        try {
          parsed = JSON.parse(rawText);
        } catch {
          // Model ignored JSON instruction: treat full text as roast
          parsed = { roast: rawText };
        }

        if (typeof parsed.roast === "string" && parsed.roast.trim().length > 0) {
          roast = parsed.roast.trim();
        }

        const numericScore = Number(parsed.score);
        if (Number.isFinite(numericScore)) {
          const clamped = Math.min(10, Math.max(1, Math.round(numericScore)));
          score = clamped;
        }

        const rawStatus = String(parsed.status || "").toUpperCase();
        if (
          rawStatus === "TERMINAL" ||
          rawStatus === "DISTRESSED" ||
          rawStatus === "RETAIL"
        ) {
          status = rawStatus as RoastStatus;
        } else {
          if (score >= 8) status = "TERMINAL";
          else if (score >= 6) status = "DISTRESSED";
          else status = "RETAIL";
        }
      }
    } catch (geminiError) {
      console.error("Gemini error in roast function:", geminiError);
      // fall back to defaults
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        score,
        status,
        roast,
      }),
    };
  } catch (err) {
    console.error("Unhandled error in roast function:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        detail: String(err),
      }),
    };
  }
};

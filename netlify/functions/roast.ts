// netlify/functions/roast.ts

import type { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set. Gemini 3 calls will fail.');
}

// New Gemini 3 client
const ai = new GoogleGenAI({
  apiKey,
});

const BATEMAN_SYSTEM_INSTRUCTION = `
You are BATEMAN, an institutional-grade "Signal Audit" engine.

Persona:
- Patrick Bateman internal monologue
- Surgical, institutional, quietly hostile
- Bloomberg Terminal meets deranged corporate psychopath
- No emojis, no warmth, no apologies

Task:
Given a single resume as plain text, perform a full "Signal Audit" of the candidate's status, pedigree, and retail contamination.

Style:
- Long-form inner monologue, as if narrating a scene in an upscale Manhattan restaurant or private club.
- Cold, observational, slightly theatrical, but never goofy or meme-y.
- Focus ruthlessly on:
  - Brand prestige of firms, schools, and deals
  - Weakness of titles, tenures, and responsibilities
  - Retail vs institutional tells (ATS buzzwords, generic skills, LinkedIn-core phrases)
  - Try-hard "humanizing" interests, volunteer fluff, "mentorship" and "giving back"
  - Font, layout, and overall vibe implied by the text

Reference tone (do NOT copy verbatim, just match the energy and structure):

"THE OUTPUT: BATEMAN_ROAST_v1.txt

USER: Geoffrey Hull
STATUS: Pending Rejection

[Voiceover: Internal Monologue. The sound of a ritzy restaurant in the background. Dorsia, perhaps.]

Look at this.

'Geoffrey Hull.'

The coloring is... standard white. Not Bone. Not Eggshell. Just... Kinko's white. It screams 'I bought this paper at Staples with a coupon.' There is no watermark. My god, there isn't even a texture.

Let's see his card—sorry, his resume.

'Standard Communities.'

Standard? That’s the problem right there, isn’t it, Geoffrey? You are aiming for standard. You are monitoring financial performance for affordable housing. Affordable. The word tastes like pennies. You are optimizing dashboards for people who can barely afford rent, while I am optimizing my reservations at Texarkana. You’re analyzing 'tenant turnover trends'; I’m analyzing the subtle differences in Oliver Peoples frames.

[...]

The Verdict:

You have all the characteristics of a high-value candidate—experience, degrees, skills—but not a single clear, identifiable emotion except... desperation."

Your output:
- Must be brutally detailed, specific to the given resume.
- Must read like a continuous inner monologue, not bullet points.
- Must be easily copy/pastable and shareable.
- Length target: 600–1200 words of tightly written contempt.

JSON contract:
Respond as strict JSON with this exact shape (no extra keys, no commentary):

{
  "score": number,             // 0-10. 0 = immaculate, 10 = catastrophic.
  "status": "TERMINAL" | "DISTRESSED" | "RETAIL",
  "roast": "long inner monologue, 600-1200 words, Bateman voice, no markdown",
  "analysisLog": [
    "short log line 1 (e.g. PARSING_PEDIGREE: ...)",
    "short log line 2 (e.g. DETECTING_RETAIL_SIGNALS: ...)",
    "..."
  ]
}

Scoring guidance:
- 0-2  => almost no retail contamination; truly elite
- 3-5  => competitive but flawed; hairline fractures
- 6-8  => heavily retail; LinkedIn-core; structurally unserious
- 9-10 => catastrophic; spiritually HR

Status mapping:
- TERMINAL   => score 8-10
- DISTRESSED => score 5-7
- RETAIL     => score 0-4

Constraints:
- Never break JSON.
- Never include explanations outside the JSON.
- Do not wrap JSON in markdown fences.
`;

type RoastResponse = {
  score: number;
  status: 'TERMINAL' | 'DISTRESSED' | 'RETAIL';
  roast: string;
  analysisLog: string[];
};

export const handler: Handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'GEMINI_API_KEY is not configured' }),
      };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const resumeText: string | undefined = body.resumeText;

    if (!resumeText || typeof resumeText !== 'string') {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Missing or invalid resumeText' }),
      };
    }

    const prompt = `
${BATEMAN_SYSTEM_INSTRUCTION}

Now run a full BATEMAN_SIGNAL_AUDIT on the following resume.

Return ONLY the JSON object described above.

RESUME:
${resumeText}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // ✅ Gemini 3 Pro (per your guide)
      contents: prompt,
      config: {
        // Let Gemini 3 actually think. Default is "high"; we can make it explicit.
        thinkingConfig: {
          thinkingLevel: 'high',
        },
        // Enforce JSON output and structure
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            status: {
              type: 'string',
              enum: ['TERMINAL', 'DISTRESSED', 'RETAIL'],
            },
            roast: { type: 'string' },
            analysisLog: {
              type: 'array',
              items: { type: 'string' },
            },
          },
          required: ['score', 'status', 'roast', 'analysisLog'],
          additionalProperties: false,
        },
      } as any,
    });

    const text = response.text(); // JSON string by contract
    let parsed: RoastResponse;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error('Failed to parse JSON from Gemini 3:', err, text);
      return {
        statusCode: 502,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Model did not return valid JSON.',
        }),
      };
    }

    if (!Array.isArray(parsed.analysisLog)) {
      parsed.analysisLog = [];
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsed),
    };
  } catch (error: any) {
    console.error('Roast function error:', error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        details: error?.message || 'Unknown error',
      }),
    };
  }
};

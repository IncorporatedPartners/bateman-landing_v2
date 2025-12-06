import { Handler } from "@netlify/functions";

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

    // MOCK ROAST RESPONSE — replace with real AI later
    const roast = `
    You have all the characteristics of a high-value candidate—
    experience, degrees, skills—but not a single clear, identifiable emotion
    except... desperation.

    This resume doesn't need a rewrite, Geoffrey.
    It needs a reservation at Dorsia to prove it exists.
    But you can't get one.
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        score: 9.2,
        status: "TERMINAL",
        roast,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", detail: String(err) }),
    };
  }
};

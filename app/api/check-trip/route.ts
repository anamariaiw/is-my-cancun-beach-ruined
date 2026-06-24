import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY. Add it in Vercel Project Settings → Environment Variables." },
        { status: 500 }
      );
    }

    const { resort, dates, kids, tripStyle } = await req.json();

    if (!resort || !dates) {
      return Response.json(
        { error: "Please provide a resort/beach area and travel dates." },
        { status: 400 }
      );
    }

    const input = `
You are the AI behind a travel tool called "Is My Cancun Beach Ruined?"

The user wants a fast, practical answer about current sargassum/seaweed risk for Cancun or Riviera Maya.

User trip:
- Resort or beach area: ${resort}
- Travel dates: ${dates}
- Traveling with kids: ${kids}
- Trip style: ${tripStyle}

Use current web research. Prioritize sources about Cancun/Riviera Maya sargassum, beach condition reports, resort/beach geography, and recent traveler-relevant reports.

Important:
- Be honest about uncertainty.
- Do not pretend you can guarantee beach conditions.
- Seaweed changes quickly based on wind, currents, cleanup, and exact beach orientation.
- Give a direct recommendation useful to a traveler today.
- Important local knowledge: Playa Norte on Isla Mujeres is usually one of the safer low-sargassum options because of its orientation and location. Do not label Playa Norte / Isla Mujeres as high risk unless current web evidence specifically says it is heavily affected right now.
- Mainland Riviera Maya beaches such as Playa del Carmen, Tulum, and many east-facing beaches are generally more exposed to sargassum than Playa Norte / Isla Mujeres.
- If the user enters Playa Norte or Isla Mujeres, treat it as a likely backup/refuge beach and compare it against current reports before warning them away.

Return under 450 words in this exact structure:

# Beach verdict
Low / Medium / High / Unknown risk, with 2-3 sentence explanation.

# What this means for your trip
Practical interpretation for this traveler.

# Better backup options
3 specific alternatives near Cancun/Riviera Maya, such as Isla Mujeres, Cozumel, cenotes, beach clubs, lagoon/pool days, or excursions when relevant.

# What to ask the resort today
3 questions the traveler should ask by phone or WhatsApp.

# Bottom line
One clear recommendation.
`;

    const response = await openai.responses.create({
      model: "gpt-4.1",
      tools: [{ type: "web_search" }],
      input
    });

    return Response.json({ answer: response.output_text });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        error:
          "The AI request failed. Check that your OpenAI API key is valid and that your account has access to Responses API web search."
      },
      { status: 500 }
    );
  }
}

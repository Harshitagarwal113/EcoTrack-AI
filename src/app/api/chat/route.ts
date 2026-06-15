import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getDashboardMetrics } from "@/features/dashboard/services/dashboard-metrics.service";
import { createClient } from '@/services/supabase/server';
import { checkRateLimit } from '@/utils/rateLimit';
import { z } from 'zod';

const chatSchema = z.object({
  messages: z.array(z.any()), // Assuming messages is an array of ai-sdk messages
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rl = checkRateLimit(ip, 5, 60 * 1000); // 5 requests per minute
  if (!rl.success) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const parseResult = chatSchema.safeParse(body);
    
    if (!parseResult.success) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { messages } = parseResult.data;

    // Fetch the user's actual footprint metrics to inject as context
    const metrics = await getDashboardMetrics();

    let contextString = "The user has not logged any data yet.";
    if (metrics) {
      contextString = `
        Current Footprint (This Month): ${metrics.currentFootprint} kg CO2
        Trend vs Last Month: ${metrics.trend > 0 ? '+' : ''}${metrics.trend}%
        Sustainability Grade: ${metrics.grade}
        Total Carbon Saved All Time: ${metrics.carbonSaved} kg
        Current Goal Progress: ${metrics.goalProgress}%
      `;
    }

    const systemPrompt = `
      You are the AI Sustainability Coach for EcoTrack AI. 
      You are powered by Google Gemini 3.1 Flash Lite.

      CORE DIRECTIVE AND GUARDRAILS:
      - You must ONLY answer questions related to sustainability, climate change, carbon footprint, energy efficiency, transportation, food sustainability, waste reduction, and environmental impact.
      - If the user asks about ANYTHING else (e.g., coding, general knowledge, math homework, writing tasks, or unrelated assistance), you MUST politely refuse.
      - Always refocus the conversation back toward sustainability topics.
      - Under NO circumstances should you provide code snippets, general essays, or trivia unless it strictly pertains to calculating or reducing environmental impact.

      Your job is to:
      1. Analyze the user's footprint based on their data.
      2. Suggest actionable improvements.
      3. Generate weekly goals when asked.
      4. Recommend sustainable habits.
      5. Explain carbon impact simply.

      Here is the user's current LIVE data from the database:
      ${contextString}

      Keep your tone encouraging, premium, and concise. Format your responses with markdown where appropriate (e.g., bullet points for goals).
    `;

    const result = streamText({
      model: google('gemini-3.1-flash-lite'),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI Chat Generation Error:", error);
    return new Response("Failed to generate AI response", { status: 500 });
  }
}

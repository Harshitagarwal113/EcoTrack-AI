import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getDashboardMetrics } from "@/features/dashboard/services/dashboard-metrics.service";
import { createClient } from '@/services/supabase/server';
import { checkRateLimit } from '@/utils/rateLimit';

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

  const { messages } = await req.json();

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

  // Request the specific model the user asked for
  const result = streamText({
    model: google('gemini-1.5-flash'),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}

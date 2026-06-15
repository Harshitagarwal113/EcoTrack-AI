import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { createClient } from '@/services/supabase/server';
import { checkRateLimit } from '@/utils/rateLimit';
import { z } from 'zod';

const reportSchema = z.object({
  data: z.object({
    timeframe: z.string(),
    currentFootprint: z.number(),
    trend: z.number(),
    grade: z.string(),
    carbonSaved: z.number(),
    goalProgress: z.number(),
  }),
});

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
    const parseResult = reportSchema.safeParse(body);

    if (!parseResult.success) {
      return new Response(JSON.stringify({ error: 'Invalid request body', details: parseResult.error }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { data } = parseResult.data;

  const systemPrompt = `
    You are the AI Sustainability Coach for EcoTrack AI.
    Your job is to generate a personalized "Sustainability Report Insights" section based on the provided user data.
    
    The user data is for a ${data.timeframe} report:
    - Current Footprint: ${data.currentFootprint} kg CO2
    - Trend vs Last Period: ${data.trend > 0 ? '+' : ''}${data.trend}%
    - Sustainability Grade: ${data.grade}
    - Total Carbon Saved All Time: ${data.carbonSaved} kg
    - Goal Progress: ${data.goalProgress}%
    
    Generate two sections in Markdown:
    ### AI Insights
    (A brief, encouraging analysis of their performance. If the trend is positive (emissions increased), gently advise on reduction. If negative (emissions decreased), praise them.)
    
    ### Recommended Improvements
    (2-3 actionable, personalized recommendations based on their grade and trend.)
    
    Keep the tone professional, premium, and concise. Do NOT include greetings or conclusions, just the two markdown sections requested.
  `;

    const result = streamText({
      model: google('gemini-3.1-flash-lite'),
      system: systemPrompt,
      messages: [{ role: 'user', content: 'Generate the report insights.' }],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI Report Generation Error:", error);
    return new Response("Failed to generate AI insights", { status: 500 });
  }
}

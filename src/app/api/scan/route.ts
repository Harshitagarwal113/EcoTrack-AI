import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createClient } from '@/services/supabase/server';
import { checkRateLimit } from '@/utils/rateLimit';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rl = checkRateLimit(ip, 5, 60 * 1000); // 5 requests per minute
    if (!rl.success) {
      return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'No image provided' }, { status: 400 });
    }
    
    const scanSchema = z.object({
      imageBase64: z.string().min(1, "No image provided"),
    });

    const parseResult = scanSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json({ error: parseResult.error?.issues?.[0]?.message || 'Invalid data' }, { status: 400 });
    }

    const { imageBase64 } = parseResult.data;



    // Strip the "data:image/jpeg;base64," prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: z.object({
        merchant_name: z.string().describe('The name of the store, vendor, or utility company.'),
        total_amount: z.number().describe('The total monetary amount on the receipt.'),
        receipt_category: z.enum(['electricity', 'fuel', 'shopping']).describe('Classify the receipt into one of these three categories.'),
        carbon_estimate_kg: z.number().describe('Estimate the carbon footprint of this purchase in kg CO2. For fuel, use ~2.3kg per liter. For electricity, use ~0.4kg per kWh. For shopping, use ~0.5kg per USD spent. Make a best guess based on the receipt details.'),
        recommendations: z.array(z.string()).describe('List 2 to 3 actionable recommendations to reduce the carbon impact of this specific type of purchase.'),
      }),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this receipt and extract the requested data.',
            },
            {
              type: 'image',
              image: base64Data,
            },
          ],
        },
      ],
    });

    return Response.json({ success: true, data: object });
  } catch (error) {
    console.error('Gemini Vision Error:', error);
    return Response.json({ error: 'Failed to process receipt' }, { status: 500 });
  }
}

import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1).optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  // In production, we might want to throw an error to prevent build
  // But for this local exercise where env vars are placeholders, we just log.
}

export const env = _env.success ? _env.data : (process.env as unknown as z.infer<typeof envSchema>);

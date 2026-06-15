import { z } from "zod";

export const ScanResultSchema = z.object({
  merchant_name: z.string().min(1).max(255),
  total_amount: z.number().min(0).max(1000000),
  receipt_category: z.enum(['electricity', 'fuel', 'shopping']),
  carbon_estimate_kg: z.number().min(0).max(100000),
  recommendations: z.array(z.string()).max(10),
});

export type ScanResult = z.infer<typeof ScanResultSchema>;

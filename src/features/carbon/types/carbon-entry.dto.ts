import { z } from "zod";

export const CalculatorInputSchema = z.object({
  transportation: z.object({
    car: z.number().min(0).max(10000),
    bus: z.number().min(0).max(10000),
    train: z.number().min(0).max(10000),
    metro: z.number().min(0).max(10000),
    bike: z.number().min(0).max(10000),
    walking: z.number().min(0).max(10000),
  }),
  energy: z.object({
    electricity: z.number().min(0).max(100000),
    acUsage: z.number().min(0).max(744), // Max hours in a month
  }),
  food: z.enum(["Vegetarian", "Mixed Diet", "Non-Vegetarian"]),
  shopping: z.object({
    electronics: z.number().min(0).max(100000),
    clothing: z.number().min(0).max(100000),
    generalPurchases: z.number().min(0).max(100000),
  }),
});

export type CalculatorInput = z.infer<typeof CalculatorInputSchema>;

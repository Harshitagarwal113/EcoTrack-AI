import { createClient } from "@/services/supabase/server";

export type EmissionFactors = {
  car: number;
  bus: number;
  train: number;
  metro: number;
  bike: number;
  walking: number;
  electricity: number;
  acUsage: number;
  vegetarian: number;
  mixedDiet: number;
  nonVegetarian: number;
  electronics: number;
  clothing: number;
  generalPurchases: number;
};

// Realistic defaults based on EPA/GHG standard protocols
// Used as fallback if DB is unreachable
const DEFAULT_FACTORS: EmissionFactors = {
  car: 0.192,
  bus: 0.089,
  train: 0.041,
  metro: 0.028,
  bike: 0.0,
  walking: 0.0,
  electricity: 0.4,
  acUsage: 1.2,
  vegetarian: 3.8,
  mixedDiet: 5.6,
  nonVegetarian: 7.2,
  electronics: 0.35,
  clothing: 0.25,
  generalPurchases: 0.15,
};

/**
 * Fetches current emission factors from the database, falling back to defaults if unavailable.
 * @returns {Promise<EmissionFactors>} A map of emission categories to their kg CO2 equivalent factors.
 */
export async function getEmissionFactors(): Promise<EmissionFactors> {
  try {
    const supabase = await createClient();
    const { data: activities, error } = await supabase.from("activities").select("name, carbon_factor");

    if (error || !activities || activities.length === 0) {
      console.error("Failed to fetch emission factors from DB, using defaults.", error);
      return DEFAULT_FACTORS;
    }

    const factors = { ...DEFAULT_FACTORS };
    
    // Map DB names to our factor keys
    const nameMap: Record<string, keyof EmissionFactors> = {
      "Car": "car",
      "Bus": "bus",
      "Train": "train",
      "Metro": "metro",
      "Bike": "bike",
      "Walking": "walking",
      "Electricity": "electricity",
      "AC Usage": "acUsage",
      "Vegetarian": "vegetarian",
      "Mixed Diet": "mixedDiet",
      "Non-Vegetarian": "nonVegetarian",
      "Electronics": "electronics",
      "Clothing": "clothing",
      "General Purchases": "generalPurchases"
    };

    activities.forEach(a => {
      const key = nameMap[a.name];
      if (key) {
        factors[key] = Number(a.carbon_factor);
      }
    });

    return factors;
  } catch (e) {
    console.error("Error in getEmissionFactors, using defaults.", e);
    return DEFAULT_FACTORS;
  }
}

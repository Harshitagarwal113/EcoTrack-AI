"use server";

import { createClient } from "@/services/supabase/server";
import { getEmissionFactors } from "@/services/carbon/emissionService";
import { CalculatorInputSchema, type CalculatorInput } from "@/types";
import { updateActiveDaysStreak, evaluateBadges } from "@/features/dashboard/services/gamification.service";

export async function fetchEmissionFactors() {
  return await getEmissionFactors();
}

export async function saveCarbonFootprint(rawInput: CalculatorInput) {
  const parseResult = CalculatorInputSchema.safeParse(rawInput);
  if (!parseResult.success) {
    return { success: false, error: "Invalid input data" };
  }
  const input = parseResult.data;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // 1. Fetch all lookup activities
    const { data: activities, error: actError } = await supabase
      .from("activities")
      .select("*");

    if (actError || !activities) {
      return { success: false, error: "Failed to load activities reference data" };
    }

    const getActivity = (name: string) => activities.find(a => a.name === name);

    // 2. Prepare entries
    const entriesToInsert: Array<{
      user_id: string;
      activity_id: string;
      amount: number;
      carbon_calculated: number;
    }> = [];
    let totalCarbonCalculated = 0;

    const addEntry = (name: string, amount: number) => {
      const activity = getActivity(name);
      if (activity && amount > 0) {
        const carbon = amount * activity.carbon_factor;
        totalCarbonCalculated += carbon;
        entriesToInsert.push({
          user_id: user.id,
          activity_id: activity.id,
          amount: amount,
          carbon_calculated: carbon,
        });
      }
    };

    // Transportation
    addEntry("Car", input.transportation.car);
    addEntry("Bus", input.transportation.bus);
    addEntry("Train", input.transportation.train);
    addEntry("Metro", input.transportation.metro);
    addEntry("Bike", input.transportation.bike);
    addEntry("Walking", input.transportation.walking);

    // Energy
    addEntry("Electricity", input.energy.electricity);
    addEntry("AC Usage", input.energy.acUsage);

    // Food (amount = 1 day)
    addEntry(input.food, 1);

    // Shopping
    addEntry("Electronics", input.shopping.electronics);
    addEntry("Clothing", input.shopping.clothing);
    addEntry("General Purchases", input.shopping.generalPurchases);

    // 3. Insert into carbon_entries
    if (entriesToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("carbon_entries")
        .insert(entriesToInsert);

      if (insertError) {
        console.error("Insert Error:", insertError);
        return { success: false, error: "Failed to save entries." };
      }
      
      await updateActiveDaysStreak();
      await evaluateBadges();
    }

    // 4. Update User Profile total
    const { data: profile } = await supabase
      .from("profiles")
      .select("total_carbon_saved")
      .eq("id", user.id)
      .single();

    if (profile) {
      // Simplistic calculation: If total is under 15kg/day, they "saved" carbon against a 15kg average.
      // This is arbitrary logic for demonstration
      const baseline = 15;
      let newSaved = profile.total_carbon_saved;
      
      if (totalCarbonCalculated < baseline) {
        newSaved += (baseline - totalCarbonCalculated);
      }

      // Determine Grade
      let grade = "C";
      if (totalCarbonCalculated < 5) grade = "A";
      else if (totalCarbonCalculated < 10) grade = "B";

      await supabase
        .from("profiles")
        .update({
          total_carbon_saved: newSaved,
          sustainability_grade: grade
        })
        .eq("id", user.id);
    }

    return { success: true, totalCalculated: totalCarbonCalculated };
  } catch (err) {
    console.error("Server Action Error:", err);
    return { success: false, error: "Internal server error" };
  }
}

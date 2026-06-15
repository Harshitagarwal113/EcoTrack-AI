"use server";

import { createClient } from "@/services/supabase/server";
import { revalidatePath } from "next/cache";

export async function seedDemoData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = user.id;

  try {
    // 1. Wipe existing data for this user
    const { error: d1 } = await supabase.from("carbon_entries").delete().eq("user_id", userId);
    if (d1) return { success: false, error: "Wipe entries: " + d1.message };
    
    const { error: d2 } = await supabase.from("goals").delete().eq("user_id", userId);
    if (d2) return { success: false, error: "Wipe goals: " + d2.message };
    
    const { error: d3 } = await supabase.from("receipts").delete().eq("user_id", userId);
    if (d3) return { success: false, error: "Wipe receipts: " + d3.message };
    
    const { error: d4 } = await supabase.from("streaks").delete().eq("user_id", userId);
    if (d4) return { success: false, error: "Wipe streaks: " + d4.message };
    
    const { error: d5 } = await supabase.from("user_badges").delete().eq("user_id", userId);
    if (d5) return { success: false, error: "Wipe badges: " + d5.message };

    // 2. Fetch activities map
    const { data: activities } = await supabase.from("activities").select("*");
    if (!activities || activities.length === 0) {
      return { success: false, error: "No activities found in DB" };
    }

    // Helper to get random activity
    const getAct = (cat: string) => activities.find((a: { category: string }) => a.category === cat);
    const driveAct = getAct('transportation') || activities[0];
    const elecAct = getAct('energy') || activities[0];
    const foodAct = getAct('food') || activities[0];
    const shopAct = getAct('shopping') || activities[0];

    // 3. Generate 180 days of entries (approx 6 months)
    const entries = [];
    const now = new Date();
    
    for (let i = 180; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Simulate weekly driving (more on weekdays)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      // Driving (10-30km on weekdays, 5-15km on weekends)
      const driveAmt = isWeekend ? Math.floor(Math.random() * 10) + 5 : Math.floor(Math.random() * 20) + 10;
      entries.push({
        user_id: userId,
        activity_id: driveAct.id,
        amount: driveAmt,
        carbon_calculated: driveAmt * driveAct.carbon_factor,
        date: dateStr,
      });

      // Daily Food (Vegetarian ~2, Mixed ~3.5)
      entries.push({
        user_id: userId,
        activity_id: foodAct.id,
        amount: 1, // 1 day of food
        carbon_calculated: 3.5 + (Math.random() * 1.5 - 0.75), // Random variation
        date: dateStr,
      });

      // Electricity (Weekly lump sum or daily)
      if (date.getDay() === 0) {
        // Log weekly electricity ~ 150 kWh
        entries.push({
          user_id: userId,
          activity_id: elecAct.id,
          amount: 150,
          carbon_calculated: 150 * elecAct.carbon_factor,
          date: dateStr,
        });
      }

      // Shopping (Randomly on weekends)
      if (isWeekend && Math.random() > 0.5) {
        const spent = Math.floor(Math.random() * 200) + 50;
        entries.push({
          user_id: userId,
          activity_id: shopAct.id,
          amount: spent,
          carbon_calculated: spent * shopAct.carbon_factor,
          date: dateStr,
        });
      }
    }

    // Insert entries in batches of 100
    for (let i = 0; i < entries.length; i += 100) {
      const { error: insertError } = await supabase.from("carbon_entries").insert(entries.slice(i, i + 100));
      if (insertError) return { success: false, error: "Carbon entries: " + insertError.message };
    }

    // 4. Seed Goals
    const goals = [
      {
        user_id: userId,
        title: "Reduce Driving by 20%",
        target_reduction: 50,
        current_progress: 35,
        deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active"
      },
      {
        user_id: userId,
        title: "Go Meatless for a Month",
        target_reduction: 100,
        current_progress: 100,
        deadline: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed"
      },
      {
        user_id: userId,
        title: "Halve Electricity Usage",
        target_reduction: 200,
        current_progress: 180,
        deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active"
      }
    ];
    const { error: goalsError } = await supabase.from("goals").insert(goals);
    if (goalsError) return { success: false, error: "Goals: " + goalsError.message };

    // 5. Seed Receipts
    const receipts = [
      {
        user_id: userId,
        image_url: "seeded-mock-image",
        merchant_name: "Whole Foods Market",
        total_amount: 145.20,
        carbon_estimate: 22.5,
        status: "completed"
      },
      {
        user_id: userId,
        image_url: "seeded-mock-image",
        merchant_name: "Shell Gas Station",
        total_amount: 45.00,
        carbon_estimate: 42.0,
        status: "completed"
      }
    ];
    const { error: receiptsError } = await supabase.from("receipts").insert(receipts);
    if (receiptsError) return { success: false, error: "Receipts: " + receiptsError.message };

    // 6. Seed Streaks
    const { error: streaksError } = await supabase.from("streaks").insert([
      {
        user_id: userId,
        streak_type: "active_days",
        current_streak: 14,
        longest_streak: 28,
        last_updated: now.toISOString().split('T')[0]
      }
    ]);
    if (streaksError) return { success: false, error: "Streaks: " + streaksError.message };

    // 7. Seed Badges
    const badges = [
      { user_id: userId, badge_id: "starter" },
      { user_id: userId, badge_id: "eco_warrior" },
      { user_id: userId, badge_id: "carbon_saver" }
    ];
    const { error: badgesError } = await supabase.from("user_badges").insert(badges);
    if (badgesError) return { success: false, error: "Badges: " + badgesError.message };

    // Update profile totals
    await supabase.from("profiles").update({
      total_carbon_saved: 450,
      sustainability_grade: "B+",
      points: 1250,
      badges: ["starter", "eco_warrior", "carbon_saver"]
    }).eq("id", userId);

    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Seeding error:", error);
    return { success: false, error: "Failed to seed data" };
  }
}

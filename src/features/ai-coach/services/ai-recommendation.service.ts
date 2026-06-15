"use server";

import { createClient } from "@/services/supabase/server";
import { generateText, generateObject } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { updateCompletedGoalsStreak, updateCarbonReductionStreak } from "@/features/dashboard/services/gamification.service";
import { getDashboardMetrics } from "@/features/dashboard/services/dashboard-metrics.service";

export async function evaluateAndGenerateReminders() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };

  try {
    // 1. Check missed targets
    const now = new Date().toISOString();
    const { data: expiredGoals } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .lt("deadline", now);

    if (expiredGoals && expiredGoals.length > 0) {
      for (const goal of expiredGoals) {
        if (goal.current_progress < goal.target_reduction) {
          // Missed target
          await supabase.from("notifications").insert({
            user_id: user.id,
            title: "Missed Target",
            message: `You missed your goal: "${goal.title}". You achieved ${goal.current_progress}kg out of ${goal.target_reduction}kg. Keep trying!`,
            type: "missed_target"
          });
          await supabase.from("goals").update({ status: "failed" }).eq("id", goal.id);
          await updateCompletedGoalsStreak(false);
        } else {
          await supabase.from("goals").update({ status: "completed" }).eq("id", goal.id);
          await updateCompletedGoalsStreak(true);
        }
      }
    }

    // 2. Check for Weekly Update (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: recentUpdates } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", user.id)
      .eq("type", "goal_update")
      .gte("created_at", sevenDaysAgo.toISOString())
      .limit(1);

    if (!recentUpdates || recentUpdates.length === 0) {
      const metrics = await getDashboardMetrics();
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Weekly Goal Update",
        message: `This week you've reached ${metrics?.goalProgress || 0}% of your total active goals. Your footprint trend is ${metrics?.trend && metrics.trend > 0 ? '+' : ''}${metrics?.trend || 0}%.`,
        type: "goal_update"
      });
      if (metrics) await updateCarbonReductionStreak(metrics.trend);
    }

    // 3. Check for new AI Recommendations (last 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data: recentAI } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", user.id)
      .eq("type", "ai_insight")
      .gte("created_at", threeDaysAgo.toISOString())
      .limit(1);

    if (!recentAI || recentAI.length === 0) {
      const metrics = await getDashboardMetrics();
      if (metrics) {
        const prompt = `Based on the user's carbon footprint (Trend: ${metrics.trend}%, Grade: ${metrics.grade}), generate a single, short (max 2 sentences) actionable recommendation for them to reduce their emissions. Don't use markdown or headers, just plain text.`;
        
        try {
          const { text } = await generateText({
            model: google("gemini-3.1-flash-lite"),
            prompt: prompt,
          });
          
          if (text) {
            await supabase.from("notifications").insert({
              user_id: user.id,
              title: "New AI Recommendation",
              message: text.trim(),
              type: "ai_insight"
            });
          }
        } catch (aiError) {
          console.error("AI generation failed", aiError);
        }
      }
    }

    // 4. Generate Weekly Goals (last 7 days)
    const { data: recentGoalsNotif } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", user.id)
      .eq("type", "weekly_goals_generated")
      .gte("created_at", sevenDaysAgo.toISOString())
      .limit(1);

    if (!recentGoalsNotif || recentGoalsNotif.length === 0) {
      // Need to generate new weekly goals
      // Let's get the user's category breakdown over the last 7 days to pass to the AI
      const { data: recentEntries } = await supabase
        .from("carbon_entries")
        .select("carbon_calculated, activities(category)")
        .eq("user_id", user.id)
        .gte("date", sevenDaysAgo.toISOString());
        
      const categoryMap = new Map<string, number>();
      recentEntries?.forEach((e: { carbon_calculated: number | string | null; activities: unknown }) => {
        const act = e.activities as unknown as { category: string } | null;
        const cat = act?.category || 'Other';
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + Number(e.carbon_calculated));
      });
      const breakdownStr = Array.from(categoryMap.entries()).map(([k, v]) => `${k}: ${Math.round(v)}kg`).join(', ');

      const { data: previousGoals } = await supabase
        .from("goals")
        .select("title, status")
        .eq("user_id", user.id)
        .neq("status", "active")
        .limit(5);
        
      const prevGoalsStr = previousGoals?.map((g: { title: string; status: string }) => `"${g.title}" (${g.status})`).join(', ') || 'None';

      const prompt = `The user is trying to reduce their carbon footprint.
In the last 7 days, their emissions breakdown was: ${breakdownStr || 'No data yet'}.
Their recent past goals were: ${prevGoalsStr}.
Generate 2 actionable, personalized, and realistic weekly goals to help them reduce emissions further.
Focus on the highest emitting categories if data is available.`;

      try {
        const { object } = await generateObject({
          model: google("gemini-3.1-flash-lite"),
          schema: z.object({
            goals: z.array(z.object({
              title: z.string().describe("Short, actionable title (e.g. 'Reduce driving by 20km')"),
              target_reduction: z.number().describe("Estimated kg of CO2 to save (e.g. 5)"),
              duration_days: z.number().describe("Duration of the goal in days (always 7)")
            }))
          }),
          prompt: prompt,
        });

        if (object.goals && object.goals.length > 0) {
          const newGoals = object.goals.map(g => {
            const deadline = new Date();
            deadline.setDate(deadline.getDate() + g.duration_days);
            return {
              user_id: user.id,
              title: g.title,
              target_reduction: g.target_reduction,
              current_progress: 0,
              status: 'active',
              deadline: deadline.toISOString()
            };
          });
          
          await supabase.from("goals").insert(newGoals);
          
          await supabase.from("notifications").insert({
            user_id: user.id,
            title: "New AI Goals",
            message: "Your AI Coach has curated new weekly goals based on your footprint trends. Check them out!",
            type: "weekly_goals_generated"
          });
        }
      } catch (goalError) {
        console.error("AI goal generation failed", goalError);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Failed evaluating reminders", error);
    return { success: false };
  }
}

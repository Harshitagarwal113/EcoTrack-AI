"use server";

import { createClient } from "@/services/supabase/server";
import { cache } from "react";

export const getDashboardMetrics = cache(async function getDashboardMetrics() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  try {
    // 1. Get Profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("sustainability_grade, total_carbon_saved")
      .eq("id", user.id)
      .single();

    // 2. Get Current Month Entries
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: currentMonthEntries } = await supabase
      .from("carbon_entries")
      .select("carbon_calculated")
      .eq("user_id", user.id)
      .gte("date", startOfMonth.toISOString());

    const currentTotal = currentMonthEntries?.reduce((sum: number, e: { carbon_calculated: number | string | null }) => sum + Number(e.carbon_calculated), 0) || 0;

    // 3. Get Previous Month Entries for Trend
    const startOfPrevMonth = new Date(startOfMonth);
    startOfPrevMonth.setMonth(startOfPrevMonth.getMonth() - 1);
    const endOfPrevMonth = new Date(startOfMonth);
    endOfPrevMonth.setDate(0);
    endOfPrevMonth.setHours(23, 59, 59, 999);

    const { data: prevMonthEntries } = await supabase
      .from("carbon_entries")
      .select("carbon_calculated")
      .eq("user_id", user.id)
      .gte("date", startOfPrevMonth.toISOString())
      .lte("date", endOfPrevMonth.toISOString());

    const prevTotal = prevMonthEntries?.reduce((sum: number, e: { carbon_calculated: number | string | null }) => sum + Number(e.carbon_calculated), 0) || 0;
    
    let trend = 0;
    if (prevTotal > 0) {
      trend = ((currentTotal - prevTotal) / prevTotal) * 100;
    }

    // 4. Get active goals
    const { data: goals } = await supabase
      .from("goals")
      .select("target_reduction, current_progress")
      .eq("user_id", user.id)
      .eq("status", "active");

    let goalProgress = 0;
    if (goals && goals.length > 0) {
      const totalTarget = goals.reduce((sum: number, g: { target_reduction: number | string | null }) => sum + Number(g.target_reduction), 0);
      const currentTarget = goals.reduce((sum: number, g: { current_progress: number | string | null }) => sum + Number(g.current_progress), 0);
      if (totalTarget > 0) {
        goalProgress = Math.min(100, Math.round((currentTarget / totalTarget) * 100));
      }
    }

    return {
      currentFootprint: Math.round(currentTotal),
      trend: Math.round(trend),
      grade: profile?.sustainability_grade || "Pending",
      carbonSaved: Math.round(profile?.total_carbon_saved || 0),
      goalProgress
    };

  } catch (e) {
    console.error("Failed to fetch dashboard metrics", e);
    return null;
  }
});

export const getFootprintChartData = cache(async function getFootprintChartData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  try {
    // Get last 7 days of entries
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { data: entries } = await supabase
      .from("carbon_entries")
      .select("date, carbon_calculated")
      .eq("user_id", user.id)
      .gte("date", sevenDaysAgo.toISOString())
      .order("date", { ascending: true });

    if (!entries) return [];

    // Aggregate by date
    const aggregated: Record<string, number> = {};
    
    // Initialize last 7 days with 0
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      aggregated[dateStr] = 0;
    }

    entries.forEach((e: { date: string; carbon_calculated: number | string | null }) => {
      const dateStr = e.date;
      if (aggregated[dateStr] !== undefined) {
        aggregated[dateStr] += Number(e.carbon_calculated);
      }
    });

    // Format for Recharts
    const chartData = Object.keys(aggregated).sort().map(dateStr => {
      // To prevent timezone shifting, split the string
      const [year, month, day] = dateStr.split('-');
      const localDate = new Date(Number(year), Number(month) - 1, Number(day));
      const dayName = localDate.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        name: dayName,
        value: Math.round(aggregated[dateStr] * 10) / 10
      };
    });

    return chartData;

  } catch (e) {
    console.error("Failed to fetch chart data", e);
    return [];
  }
});

"use server";

import { createClient } from "@/services/supabase/server";

export async function getReportData(timeframe: 'weekly' | 'monthly') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("sustainability_grade, total_carbon_saved")
      .eq("id", user.id)
      .single();

    const now = new Date();
    const startDate = new Date();
    const prevStartDate = new Date();
    const prevEndDate = new Date();

    if (timeframe === 'weekly') {
      startDate.setDate(now.getDate() - 7);
      prevStartDate.setDate(now.getDate() - 14);
      prevEndDate.setDate(now.getDate() - 7);
    } else {
      startDate.setMonth(now.getMonth() - 1);
      prevStartDate.setMonth(now.getMonth() - 2);
      prevEndDate.setMonth(now.getMonth() - 1);
    }
    
    startDate.setHours(0, 0, 0, 0);
    prevStartDate.setHours(0, 0, 0, 0);
    prevEndDate.setHours(23, 59, 59, 999);

    const { data: currentEntries } = await supabase
      .from("carbon_entries")
      .select("carbon_calculated, date, activities(name, category)")
      .eq("user_id", user.id)
      .gte("date", startDate.toISOString());

    const currentTotal = currentEntries?.reduce((sum: number, e: any) => sum + Number(e.carbon_calculated), 0) || 0;

    const chartDataMap = new Map<string, number>();
    
    currentEntries?.forEach((entry: any) => {
      const d = new Date(entry.date || new Date());
      let key = '';
      if (timeframe === 'weekly') {
        key = d.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      const existing = chartDataMap.get(key) || 0;
      chartDataMap.set(key, existing + Number(entry.carbon_calculated));
    });

    const chartData = Array.from(chartDataMap.entries()).map(([date, emissions]) => ({
      date,
      emissions: Math.round(emissions)
    }));

    if (chartData.length === 0) {
      if (timeframe === 'weekly') {
        chartData.push({ date: 'Mon', emissions: 0 }, { date: 'Tue', emissions: 0 }, { date: 'Wed', emissions: 0 });
      } else {
        chartData.push({ date: 'Week 1', emissions: 0 }, { date: 'Week 2', emissions: 0 });
      }
    }

    const { data: prevEntries } = await supabase
      .from("carbon_entries")
      .select("carbon_calculated")
      .eq("user_id", user.id)
      .gte("date", prevStartDate.toISOString())
      .lte("date", prevEndDate.toISOString());

    const prevTotal = prevEntries?.reduce((sum: number, e: any) => sum + Number(e.carbon_calculated), 0) || 0;
    
    let trend = 0;
    if (prevTotal > 0) {
      trend = ((currentTotal - prevTotal) / prevTotal) * 100;
    }

    const { data: goals } = await supabase
      .from("goals")
      .select("title, target_reduction, current_progress, status")
      .eq("user_id", user.id)
      .eq("status", "active");

    let goalProgress = 0;
    if (goals && goals.length > 0) {
      const totalTarget = goals.reduce((sum: number, g: any) => sum + Number(g.target_reduction), 0);
      const currentTarget = goals.reduce((sum: number, g: any) => sum + Number(g.current_progress), 0);
      if (totalTarget > 0) {
        goalProgress = Math.min(100, Math.round((currentTarget / totalTarget) * 100));
      }
    }

    return {
      timeframe,
      currentFootprint: Math.round(currentTotal),
      trend: Math.round(trend),
      grade: profile?.sustainability_grade || "Pending",
      carbonSaved: Math.round(profile?.total_carbon_saved || 0),
      goalProgress,
      goals: goals || [],
      chartData
    };
  } catch (e) {
    console.error("Failed to fetch report data", e);
    return null;
  }
}

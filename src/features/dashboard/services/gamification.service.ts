"use server";

import { createClient } from "@/services/supabase/server";

export async function getStreaks() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const types = ['completed_goals', 'carbon_reductions'];
  
  const { data } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", user.id);

  if (!data || data.length === 0) {
    const toInsert = types.map(t => ({
      user_id: user.id,
      streak_type: t,
      current_streak: 0,
      longest_streak: 0,
      last_updated: new Date().toISOString()
    }));
    await supabase.from("streaks").insert(toInsert);
    return toInsert;
  }
  
  const existingTypes = data.map((d: any) => d.streak_type);
  const missing = types.filter(t => !existingTypes.includes(t));
  if (missing.length > 0) {
    const toInsert = missing.map(t => ({
      user_id: user.id,
      streak_type: t,
      current_streak: 0,
      longest_streak: 0,
      last_updated: new Date().toISOString()
    }));
    await supabase.from("streaks").insert(toInsert);
    return [...data, ...toInsert];
  }

  return data;
}


export async function updateCompletedGoalsStreak(success: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", user.id)
    .eq("streak_type", "completed_goals")
    .single();

  if (data) {
    if (success) {
      const newCurrent = data.current_streak + 1;
      await supabase.from("streaks").update({
        current_streak: newCurrent,
        longest_streak: Math.max(newCurrent, data.longest_streak),
        last_updated: new Date().toISOString()
      }).eq("id", data.id);
    } else {
      await supabase.from("streaks").update({
        current_streak: 0,
        last_updated: new Date().toISOString()
      }).eq("id", data.id);
    }
  }
}

export async function updateCarbonReductionStreak(trend: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", user.id)
    .eq("streak_type", "carbon_reductions")
    .single();

  if (data) {
    const lastUpdate = new Date(data.last_updated);
    const today = new Date();
    const diffTime = today.getTime() - lastUpdate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays >= 7) {
      if (trend < 0) {
        const newCurrent = data.current_streak + 1;
        await supabase.from("streaks").update({
          current_streak: newCurrent,
          longest_streak: Math.max(newCurrent, data.longest_streak),
          last_updated: today.toISOString()
        }).eq("id", data.id);
      } else {
        await supabase.from("streaks").update({
          current_streak: 0,
          last_updated: today.toISOString()
        }).eq("id", data.id);
      }
    }
  }
}

export async function getBadges() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("user_badges")
    .select("*")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: true });

  return data || [];
}

export async function evaluateBadges() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existingBadges } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", user.id);
    
  const earnedBadgeIds = new Set(existingBadges?.map((b: any) => b.badge_id) || []);

  const newlyEarned: string[] = [];
  const checkAndAward = async (id: string, condition: boolean) => {
    if (condition && !earnedBadgeIds.has(id)) {
      newlyEarned.push(id);
      await supabase.from("user_badges").insert({ user_id: user.id, badge_id: id });
      
      const badgeNames: Record<string, string> = {
        'carbon_reducer': 'Carbon Reducer',
        'green_commuter': 'Green Commuter',
        'energy_saver': 'Energy Saver',
        'sustainable_shopper': 'Sustainable Shopper',
        'sustainability_champion': 'Sustainability Champion'
      };
      
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Achievement Unlocked!",
        message: `You earned the ${badgeNames[id]} badge!`,
        type: "badge_earned"
      });
    }
  };

  const { data: profile } = await supabase.from("profiles").select("sustainability_grade, total_carbon_saved").eq("user_id", user.id).single();
  const { data: allEntries } = await supabase.from("carbon_entries").select("activities(name, category)").eq("user_id", user.id);
  
  const ptCount = allEntries?.filter((e: any) => {
    const act = e.activities as unknown as { name: string; category: string } | null;
    return act && ['Bus', 'Train', 'Metro', 'Bicycle', 'Walking'].includes(act.name);
  }).length || 0;
  const energyCount = allEntries?.filter((e: any) => {
    const act = e.activities as unknown as { name: string; category: string } | null;
    return act && act.category === 'Energy';
  }).length || 0;
  const shopCount = allEntries?.filter((e: any) => {
    const act = e.activities as unknown as { name: string; category: string } | null;
    return act && act.category === 'Shopping';
  }).length || 0;

  await checkAndAward('carbon_reducer', (profile?.total_carbon_saved || 0) >= 50);
  await checkAndAward('green_commuter', ptCount >= 5);
  await checkAndAward('energy_saver', energyCount >= 5);
  await checkAndAward('sustainable_shopper', shopCount >= 5);
  await checkAndAward('sustainability_champion', profile?.sustainability_grade === 'A');
}

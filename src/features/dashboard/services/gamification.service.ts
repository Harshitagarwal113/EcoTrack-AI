"use server";

import { createClient } from "@/services/supabase/server";

export async function getStreaks() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const types = ['active_days', 'completed_goals', 'carbon_reductions'];
  
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
  
  const existingTypes = data.map(d => d.streak_type);
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

export async function updateActiveDaysStreak() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", user.id)
    .eq("streak_type", "active_days")
    .single();

  const today = new Date();
  today.setHours(0,0,0,0);
  
  if (data) {
    const lastUpdate = new Date(data.last_updated);
    lastUpdate.setHours(0,0,0,0);
    
    const diffTime = today.getTime() - lastUpdate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      const newCurrent = data.current_streak + 1;
      await supabase.from("streaks").update({
        current_streak: newCurrent,
        longest_streak: Math.max(newCurrent, data.longest_streak),
        last_updated: new Date().toISOString()
      }).eq("id", data.id);
    } else if (diffDays > 1) {
      await supabase.from("streaks").update({
        current_streak: 1,
        last_updated: new Date().toISOString()
      }).eq("id", data.id);
    }
  }
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
    
  const earnedBadgeIds = new Set(existingBadges?.map(b => b.badge_id) || []);

  const newlyEarned: string[] = [];
  const checkAndAward = async (id: string, condition: boolean) => {
    if (condition && !earnedBadgeIds.has(id)) {
      newlyEarned.push(id);
      await supabase.from("user_badges").insert({ user_id: user.id, badge_id: id });
      
      const badgeNames: Record<string, string> = {
        'green_starter': 'Green Starter',
        'eco_warrior': 'Eco Warrior',
        'carbon_saver': 'Carbon Saver',
        'sustainability_champion': 'Sustainability Champion',
        'energy_master': 'Energy Master',
        'public_transport_hero': 'Public Transport Hero'
      };
      
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Achievement Unlocked!",
        message: `You earned the ${badgeNames[id]} badge!`,
        type: "badge_earned"
      });
    }
  };

  const { count: entriesCount } = await supabase.from("carbon_entries").select("*", { count: 'exact', head: true }).eq("user_id", user.id);
  const { data: profile } = await supabase.from("profiles").select("sustainability_grade, total_carbon_saved").eq("user_id", user.id).single();
  const { data: activeStreak } = await supabase.from("streaks").select("longest_streak").eq("user_id", user.id).eq("streak_type", "active_days").single();
  
  await checkAndAward('green_starter', (entriesCount || 0) > 0);
  await checkAndAward('eco_warrior', (activeStreak?.longest_streak || 0) >= 7);
  await checkAndAward('carbon_saver', (profile?.total_carbon_saved || 0) >= 50);
  await checkAndAward('sustainability_champion', profile?.sustainability_grade === 'A');
  
  const { data: allEntries } = await supabase.from("carbon_entries").select("activities(name, category)").eq("user_id", user.id);
  const energyCount = allEntries?.filter(e => (e.activities as any)?.category === 'Energy').length || 0;
  const ptCount = allEntries?.filter(e => ['Bus', 'Train', 'Metro'].includes((e.activities as any)?.name)).length || 0;

  await checkAndAward('energy_master', energyCount >= 5);
  await checkAndAward('public_transport_hero', ptCount >= 5);
}

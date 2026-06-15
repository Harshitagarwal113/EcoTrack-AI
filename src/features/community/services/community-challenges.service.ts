"use server";

import { createClient } from "@/services/supabase/server";

export async function getGlobalChallenges() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    console.error("Error fetching challenges", error);
    return [];
  }
  return data;
}

export async function getUserChallenges() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_challenges')
    .select('challenge_id, progress, challenges(*)')
    .eq('user_id', user.id);

  if (error) {
    console.error("Error fetching user challenges", error);
    return [];
  }
  return data;
}

export async function joinChallenge(challengeId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // 1. Insert into user_challenges
  const { error } = await supabase
    .from('user_challenges')
    .insert({
      user_id: user.id,
      challenge_id: challengeId,
    });

  if (error) {
    // If they already joined, it might fail unique constraint, which is fine to ignore or return error
    if (error.code === '23505') {
      return { success: false, error: 'Already joined this challenge' };
    }
    console.error("Error joining challenge", error);
    return { success: false, error: error.message };
  }

  // 2. Increment participants_count in challenges table (optional, but good)
  // Need to use an RPC or just let it be. For now, fetch and update.
  const { data: challenge } = await supabase
    .from('challenges')
    .select('participants_count')
    .eq('id', challengeId)
    .single();
    
  if (challenge) {
    await supabase
      .from('challenges')
      .update({ participants_count: (challenge.participants_count || 0) + 1 })
      .eq('id', challengeId);
  }

  return { success: true };
}

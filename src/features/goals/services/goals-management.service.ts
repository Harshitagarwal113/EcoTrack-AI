"use server";

import { createClient } from "@/services/supabase/server";
import { z } from "zod";

export async function getProfileStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('points, badges, total_carbon_saved')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error("Error fetching profile stats", error);
    return null;
  }
  return data;
}

export async function getGoals() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching goals", error);
    return [];
  }
  return data;
}

export async function createGoal(title: string, target_reduction: number, durationDays: number) {
  const parseResult = z.object({
    title: z.string().min(3).max(100),
    target_reduction: z.number().min(1).max(10000),
    durationDays: z.number().min(1).max(365),
  }).safeParse({ title, target_reduction, durationDays });

  if (!parseResult.success) {
    return { success: false, error: "Invalid goal parameters" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + durationDays);

  const { error } = await supabase
    .from('goals')
    .insert({
      user_id: user.id,
      title,
      target_reduction,
      deadline: deadline.toISOString().split('T')[0],
      status: 'active',
    });

  if (error) {
    console.error("Error creating goal", error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

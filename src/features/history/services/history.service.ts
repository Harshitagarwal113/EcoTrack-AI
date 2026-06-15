"use server";

import { createClient } from "@/services/supabase/server";

export async function getHistory(limit = 50) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Fetch carbon entries with their associated activity data
  const { data, error } = await supabase
    .from("carbon_entries")
    .select(`
      id,
      carbon_saved,
      created_at,
      activities (
        name,
        category
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching history:", error);
    return [];
  }

  return data;
}

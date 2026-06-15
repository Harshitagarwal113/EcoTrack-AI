import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: entries, error: err2 } = await supabase.from('carbon_entries').select('id, user_id, date, amount, carbon_calculated').limit(5);
  const { data: activities, error: err3 } = await supabase.from('activities').select('id, category').limit(5);
  const { data: profiles, error: err4 } = await supabase.from('profiles').select('*').limit(5);
  
  console.log("Profiles count:", profiles?.length || 0, "Error:", err4);
  console.log("Entries count:", entries?.length || 0, "Error:", err2);
  console.log("Activities count:", activities?.length || 0, "Error:", err3);
}

test();

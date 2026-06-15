"use server";

import { createClient } from "@/services/supabase/server";
import { ScanResultSchema, type ScanResult } from "@/types";

export async function saveReceiptData(rawScanData: ScanResult) {
  const parseResult = ScanResultSchema.safeParse(rawScanData);
  if (!parseResult.success) {
    return { success: false, error: "Invalid receipt data" };
  }
  const scanData = parseResult.data;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    // 1. Get the corresponding activity_id
    let activityName = 'Monthly Purchases';
    if (scanData.receipt_category === 'electricity') activityName = 'Electricity';
    if (scanData.receipt_category === 'fuel') activityName = 'Car'; // Approximation for fuel
    
    const { data: activity } = await supabase
      .from('activities')
      .select('id')
      .eq('name', activityName)
      .single();

    if (!activity) {
      return { success: false, error: 'Activity type not found' };
    }

    // 2. Insert into carbon_entries
    const { error: entryError } = await supabase
      .from('carbon_entries')
      .insert({
        user_id: user.id,
        activity_id: activity.id,
        amount: scanData.total_amount, // We just store the dollar amount or unit amount
        carbon_calculated: scanData.carbon_estimate_kg,
      });

    if (entryError) throw entryError;

    // 3. Insert into receipts
    const { error: receiptError } = await supabase
      .from('receipts')
      .insert({
        user_id: user.id,
        image_url: 'data:image/jpeg;base64,hidden_for_now', // We skip storing the full base64 in DB to save space for now
        merchant_name: scanData.merchant_name,
        total_amount: scanData.total_amount,
        carbon_estimate: scanData.carbon_estimate_kg,
        status: 'completed',
      });

    if (receiptError) throw receiptError;

    // 4. Update user profile totals (simplified logic)
    const { data: profile } = await supabase
      .from("profiles")
      .select("total_carbon_saved")
      .eq("id", user.id)
      .single();

    if (profile) {
      const baseline = 15;
      let newSaved = profile.total_carbon_saved;
      if (scanData.carbon_estimate_kg < baseline) {
        newSaved += (baseline - scanData.carbon_estimate_kg);
      }
      
      let grade = "C";
      if (scanData.carbon_estimate_kg < 5) grade = "A";
      else if (scanData.carbon_estimate_kg < 10) grade = "B";

      await supabase
        .from("profiles")
        .update({
          total_carbon_saved: newSaved,
          sustainability_grade: grade
        })
        .eq("id", user.id);
    }

    return { success: true };

  } catch (error) {
    console.error('Failed to save receipt data:', error);
    return { success: false, error: 'Failed to save to database' };
  }
}

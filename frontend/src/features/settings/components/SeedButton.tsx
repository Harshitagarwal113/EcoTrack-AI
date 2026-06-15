"use client";

import { useState } from "react";
import { seedDemoData } from "@/services/supabase/seed";

export function SeedButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSeed = async () => {
    if (!confirm("Are you sure? This will wipe your current goals, receipts, and entries, replacing them with 6 months of dense realistic data.")) return;

    setIsLoading(true);
    setStatus("idle");
    setErrorMsg("");

    try {
      const result = await seedDemoData();
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(result.error || "Failed to seed data");
      }
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface-container border border-error/30 rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined">warning</span>
        </div>
        <div>
          <h3 className="font-headline-sm font-bold text-on-surface mb-1">Developer & Hackathon Zone</h3>
          <p className="text-on-surface-variant text-sm mb-4">
            One-click populate your account with 6 months of realistic historical data (Carbon entries, receipts, badges, streaks, and goals). Excellent for hackathon demos.
          </p>
          
          <button
            onClick={handleSeed}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-error text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-error/20"
          >
            {isLoading ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
            ) : (
              <span className="material-symbols-outlined text-[20px]">database</span>
            )}
            {isLoading ? "Seeding Database..." : "Seed Demo Data"}
          </button>
          
          {status === "success" && (
            <p className="mt-3 text-sm text-primary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Database successfully seeded! Check your dashboard.
            </p>
          )}
          {status === "error" && (
            <p className="mt-3 text-sm text-error font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {errorMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

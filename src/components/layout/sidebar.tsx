"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { name: "Carbon Tracker", href: "/tracker", icon: "eco" },
  { name: "AI Coach", href: "/coach", icon: "psychology" },
  { name: "Reports", href: "/reports", icon: "summarize" },
  { name: "Goals", href: "/goals", icon: "emoji_events" },
  { name: "History", href: "/history", icon: "history" },
  { name: "Scanner", href: "/scanner", icon: "receipt_long" },
  { name: "Community", href: "/community", icon: "groups" },
  { name: "Settings", href: "/settings", icon: "settings" },
];

const mobileNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { name: "Tracker", href: "/tracker", icon: "eco" },
  { name: "Reports", href: "/reports", icon: "summarize" },
  { name: "Coach", href: "/coach", icon: "psychology" },
  { name: "Scanner", href: "/scanner", icon: "receipt_long" },
  { name: "Goals", href: "/goals", icon: "emoji_events" },
  { name: "Settings", href: "/settings", icon: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col h-[calc(100vh-24px)] p-6 bg-white/70 dark:bg-surface-container-low/70 backdrop-blur-xl fixed left-3 top-3 bottom-3 w-72 rounded-xl border border-white/40 dark:border-outline-variant/20 saturate-150 shadow-[0_40px_40px_rgba(0,108,73,0.1)] z-50">
        <div className="mb-8 flex items-center gap-3 px-4 pt-4">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">energy_savings_leaf</span>
          </div>
          <div>
            <h1 className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary dark:text-primary-fixed text-[24px]">EcoTrack AI</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Sustainable Intelligence</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                  isActive
                    ? "text-on-primary-container dark:text-primary-fixed font-semibold bg-primary/10 dark:bg-primary-fixed/10 scale-95"
                    : "text-on-surface-variant dark:text-surface-variant hover:text-primary hover:bg-white/50 dark:hover:bg-white/10 hover:translate-x-1"
                )}
              >
                <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
                <span className="font-label-md text-label-md">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto space-y-4 pt-4 border-t border-outline-variant/30">
          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-label-md text-label-md font-semibold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity flex justify-center items-center gap-2" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)" }}>
            Upgrade to Pro
          </button>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-on-surface-variant">
              {(user?.user_metadata?.full_name || user?.email) ? (
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-label-lg uppercase shrink-0">
                  {(user?.user_metadata?.full_name || user?.email || "U").charAt(0)}
                </div>
              ) : (
                <span className="material-symbols-outlined" aria-hidden="true">account_circle</span>
              )}
              <span className="font-label-md text-label-md truncate max-w-[120px]">
                {user?.user_metadata?.full_name || user?.email || "User Profile"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button 
                onClick={signOut}
                className="flex items-center justify-center p-1.5 rounded-full text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-white/80 dark:bg-surface-container-low/80 backdrop-blur-xl border border-white/40 shadow-[0_-10px_40px_rgba(16,185,129,0.15)] rounded-2xl flex items-center justify-between px-4 py-3">
          {mobileNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200",
                  isActive ? "text-primary" : "text-on-surface-variant hover:text-primary"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined transition-transform",
                    isActive ? "scale-110" : "scale-100"
                  )}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <span className="font-label-sm text-[10px]">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

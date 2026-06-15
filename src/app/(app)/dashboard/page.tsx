export const dynamic = "force-dynamic";

import { getDashboardMetrics, getFootprintChartData } from "@/features/dashboard/services/dashboard-metrics.service";
import { FootprintChart } from "@/features/dashboard/components/FootprintChart";
import { StreakCards } from "@/features/dashboard/components/StreakCards";
import { AchievementTimeline } from "@/features/dashboard/components/AchievementTimeline";
import { ExportButton } from "@/components/ui/ExportButton";
import { NotificationCenter } from "@/components/ui/NotificationCenter";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();
  const chartData = await getFootprintChartData();

  // Fallbacks if not logged in or no data yet
  const total = metrics?.currentFootprint || 0;
  const trend = metrics?.trend || 0;
  const grade = metrics?.grade || "N/A";
  const progress = metrics?.goalProgress || 0;

  // Calculate SVG stroke offset for the ring
  // Circumference = 2 * pi * r = 2 * 3.14159 * 40 = 251.2
  const circumference = 251.2;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <>
      {/* TopNavBar */}
      <header className="flex items-center justify-between w-full pt-6 px-4 md:px-12 bg-transparent sticky top-0 z-40 backdrop-blur-md md:backdrop-blur-none pb-4 gap-6">
        <div className="md:hidden flex items-center gap-3 shrink-0">
          <span className="material-symbols-outlined text-primary text-[28px]">energy_savings_leaf</span>
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface">EcoTrack AI</h1>
        </div>
        
        {/* Search Bar (Centered on desktop) */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center bg-white/60 border border-white/50 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 transition-shadow w-full max-w-md">
            <span className="material-symbols-outlined text-on-surface-variant mr-2" aria-hidden="true">search</span>
            <input aria-label="Search insights" className="bg-transparent border-none focus:ring-0 focus:outline-none text-body-md w-full placeholder:text-on-surface-variant/60" placeholder="Search insights..." type="text" />
          </div>
        </div>

        <div className="flex items-center gap-4 text-primary dark:text-primary-fixed shrink-0">
          <ExportButton targetId="carbon-analytics-export" filename="Carbon-Analytics.pdf" label="Export" className="hidden sm:flex py-1.5 px-3 text-sm bg-surface-container-lowest/50" />
          <ThemeToggle />
          <NotificationCenter />
          <button aria-label="Help" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none hidden sm:flex">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant cursor-pointer hover:text-primary-container transition-colors" aria-hidden="true">help_outline</span>
          </button>
        </div>
      </header>

      {/* Canvas */}
      <div id="carbon-analytics-export" className="px-4 md:px-12 max-w-container-max mx-auto w-full flex-1 flex flex-col gap-stack-lg pt-4 pb-8 bg-surface rounded-2xl">
        <div className="flex flex-col lg:flex-row gap-gutter">
          {/* Main Dashboard Area */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Hero Section */}
            <section className="liquid-glass-panel rounded-[24px] p-8 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Your Carbon Footprint This Month</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  {trend <= 0 ? "You're on track to beat last month's goal." : "You are currently emitting more than last month."}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mt-auto z-10">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg-mobile md:text-display-lg gradient-text">{total}</span>
                    <span className="font-body-lg text-body-lg text-on-surface-variant font-medium">kg CO2</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-primary">
                    <span className={`material-symbols-outlined text-[18px] ${trend > 0 ? 'text-error' : ''}`}>
                      {trend > 0 ? 'trending_up' : 'trending_down'}
                    </span>
                    <span className={`font-label-md text-label-md font-semibold ${trend > 0 ? 'text-error' : ''}`}>
                      {trend > 0 ? `+${trend}%` : `${trend}%`} from last month
                    </span>
                  </div>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md text-headline-md font-bold shadow-md shadow-primary/20">
                      {grade}
                    </div>
                    <div>
                      <p className="font-label-md text-label-md font-semibold text-on-surface">Sustainability Grade</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">Based on daily averages</p>
                    </div>
                  </div>
                </div>
                {/* Progress Ring */}
                <div className="relative w-40 h-40 flex-shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="none" r="40" stroke="#e2e8f8" strokeWidth="12"></circle>
                    <circle 
                      className="progress-ring-circle transition-all duration-1000 ease-out" 
                      cx="50" 
                      cy="50" 
                      fill="none" 
                      r="40" 
                      stroke="#10B981" 
                      strokeDasharray={circumference} 
                      strokeDashoffset={strokeDashoffset} 
                      strokeLinecap="round" 
                      strokeWidth="12"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-headline-lg text-headline-lg text-on-surface">{progress}%</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">to goal</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Streaks Section */}
            <section className="mt-2 mb-4">
              <h3 className="font-headline-sm text-on-surface mb-4">Your Consistency</h3>
              <StreakCards />
            </section>

            {/* Achievements Section */}
            <section className="mt-2 mb-4">
              <h3 className="font-headline-sm text-on-surface mb-4">Achievements</h3>
              <AchievementTimeline />
            </section>

            {/* Chart Section */}
            <section className="liquid-glass-panel rounded-[24px] p-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-headline-md text-headline-md text-on-surface">Footprint Trend (Last 7 Days)</h3>
              </div>
              <FootprintChart data={chartData} />
            </section>

          </div>

          {/* AI Insights Panel */}
          <section className="w-full lg:w-80 ai-glass-glass rounded-[24px] p-6 flex flex-col shadow-[0_20px_40px_rgba(16,185,129,0.05)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">AI Coach</h3>
            </div>
            <div className="space-y-4 flex-1">
              {metrics && metrics.trend > 0 ? (
                <div className="bg-white/60 rounded-xl p-4 border border-white/50">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-error mt-1">warning</span>
                    <div>
                      <p className="font-label-md text-label-md font-semibold text-on-surface mb-1">Emissions Rising</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">Your footprint is higher than last month. Try tracking more walking days!</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/60 rounded-xl p-4 border border-white/50">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary-container mt-1">directions_walk</span>
                    <div>
                      <p className="font-label-md text-label-md font-semibold text-on-surface mb-1">Great Job!</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">Your emissions are down this month. Keep it up!</p>
                      <span className="inline-block bg-primary/10 text-primary font-label-sm text-label-sm px-2 py-1 rounded-md">Saved {metrics?.carbonSaved || 0}kg CO2 total</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-white/60 rounded-xl p-4 border border-white/50 opacity-80">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-outline mt-1">bolt</span>
                  <div>
                    <p className="font-label-md text-label-md font-semibold text-on-surface mb-1">Phantom Energy Check</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Unplug your workstation over the weekend.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

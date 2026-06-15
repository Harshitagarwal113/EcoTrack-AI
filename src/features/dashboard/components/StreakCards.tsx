"use client";

import { useQuery } from "@tanstack/react-query";
import { getStreaks } from "@/features/dashboard/services/gamification.service";

export function StreakCards() {
  const { data: streaks = [], isLoading } = useQuery({
    queryKey: ['streaks'],
    queryFn: getStreaks,
  });

  const getStreakIcon = (type: string) => {
    if (type === 'completed_goals') return 'task_alt';
    if (type === 'carbon_reductions') return 'trending_down';
    return 'star';
  };

  const getStreakLabel = (type: string) => {
    if (type === 'completed_goals') return 'Goals Completed';
    if (type === 'carbon_reductions') return 'Weeks Reduced';
    return type;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
        {[1, 2].map(i => (
          <div key={i} className="h-32 bg-surface-container/50 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {streaks.map((streak: any) => {
        const isMilestone = streak.current_streak > 0 && streak.current_streak % 7 === 0;
        
        return (
          <div key={streak.streak_type} className="relative p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow">
            {isMilestone && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${streak.current_streak > 0 ? 'bg-error/10 text-error' : 'bg-surface-variant/50 text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-[20px]">{getStreakIcon(streak.streak_type)}</span>
              </div>
              <div className="text-right">
                <p className="font-label-sm text-on-surface-variant">Longest</p>
                <p className="font-headline-sm text-on-surface">{streak.longest_streak}</p>
              </div>
            </div>
            
            <div>
              <p className="font-label-md text-on-surface-variant">{getStreakLabel(streak.streak_type)}</p>
              <div className="flex items-baseline gap-2">
                <p className={`font-display-md ${streak.current_streak > 0 ? 'text-on-surface' : 'text-on-surface-variant/50'}`}>
                  {streak.current_streak}
                </p>
                <p className="font-body-sm text-on-surface-variant font-medium">streak</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { getBadges } from "@/features/dashboard/services/gamification.service";

const BADGE_DEFINITIONS = [
  { id: 'green_starter', name: 'Green Starter', desc: 'Log your first carbon entry', icon: 'psychology_alt', color: 'text-primary bg-primary/10' },
  { id: 'eco_warrior', name: 'Eco Warrior', desc: 'Maintain a 7-day active streak', icon: 'swords', color: 'text-error bg-error/10' },
  { id: 'carbon_saver', name: 'Carbon Saver', desc: 'Save a total of 50kg CO2', icon: 'savings', color: 'text-tertiary bg-tertiary/10' },
  { id: 'sustainability_champion', name: 'Sustainability Champion', desc: 'Achieve an overall Grade A', icon: 'trophy', color: 'text-primary-container bg-primary-container/20' },
  { id: 'energy_master', name: 'Energy Master', desc: 'Log 5 Energy reductions', icon: 'bolt', color: 'text-yellow-600 bg-yellow-500/10' },
  { id: 'public_transport_hero', name: 'Public Transport Hero', desc: 'Log 5 bus, train, or metro rides', icon: 'train', color: 'text-blue-500 bg-blue-500/10' }
];

export function AchievementTimeline() {
  const { data: earnedBadges = [], isLoading } = useQuery({
    queryKey: ['badges'],
    queryFn: getBadges,
  });

  const earnedIds = new Set(earnedBadges.map((b: any) => b.badge_id));

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="min-w-[200px] h-32 bg-surface-container/50 rounded-2xl shrink-0"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
      {BADGE_DEFINITIONS.map((badgeDef) => {
        const isEarned = earnedIds.has(badgeDef.id);
        const earnedData = earnedBadges.find((b: any) => b.badge_id === badgeDef.id);
        return (
          <div 
            key={badgeDef.id} 
            className={`min-w-[240px] snap-start relative p-5 rounded-2xl border transition-all ${
              isEarned 
                ? 'bg-surface-container-low border-outline-variant/30 shadow-sm' 
                : 'bg-surface-variant/20 border-transparent opacity-60 grayscale'
            }`}
          >
            {isEarned && (
              <div className="absolute top-2 right-2 text-[10px] font-label-sm px-2 py-1 bg-primary/10 text-primary rounded-full font-bold">
                EARNED
              </div>
            )}
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isEarned ? badgeDef.color : 'bg-surface-variant/50 text-on-surface-variant'}`}>
              <span className="material-symbols-outlined text-[24px]">{badgeDef.icon}</span>
            </div>
            
            <h4 className="font-headline-sm text-on-surface mb-1">{badgeDef.name}</h4>
            <p className="font-body-sm text-on-surface-variant mb-3">{badgeDef.desc}</p>
            
            {isEarned ? (
              <p className="font-label-sm text-primary">
                Unlocked on {new Date(earnedData.earned_at).toLocaleDateString()}
              </p>
            ) : (
              <p className="font-label-sm text-on-surface-variant/70 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                Locked
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

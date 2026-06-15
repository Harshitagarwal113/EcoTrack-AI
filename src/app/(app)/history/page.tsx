"use client";

import { useQuery } from "@tanstack/react-query";
import { getHistory } from "@/features/history/services/history.service";

export default function HistoryPage() {
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => getHistory(50),
  });

  return (
    <div className="px-4 md:px-12 max-w-container-max mx-auto w-full flex-1 flex flex-col gap-stack-lg pt-10 pb-12">
      <div className="flex flex-col stack-sm">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Activity History</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Review your past sustainability activities and estimated carbon footprint.</p>
      </div>
      
      <div className="liquid-glass-panel flex-1 rounded-[24px] p-8 min-h-[500px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-primary">
            <span className="material-symbols-outlined animate-spin text-[40px]">sync</span>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">history</span>
            <p className="font-body-lg">No activities logged yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {history.map((entry: any) => (
              <div key={entry.id} className="bg-surface/50 dark:bg-inverse-surface/50 p-5 rounded-2xl border border-outline-variant/30 flex justify-between items-center hover:bg-surface transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined">
                      {entry.activities?.category === 'Transport' ? 'directions_car' : 
                       entry.activities?.category === 'Energy' ? 'bolt' : 
                       entry.activities?.category === 'Shopping' ? 'shopping_bag' : 'eco'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-on-surface">{entry.activities?.name || 'Unknown Activity'}</h4>
                    <p className="font-label-sm text-on-surface-variant">{new Date(entry.created_at).toLocaleDateString()} at {new Date(entry.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 text-error justify-end mb-1">
                    <span className="material-symbols-outlined text-[18px]">co2</span>
                    <p className="font-headline-sm">{entry.carbon_saved || 0} kg</p>
                  </div>
                  <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">{entry.activities?.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

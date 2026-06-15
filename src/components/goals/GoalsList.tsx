import React from "react";
import { ExportButton } from "@/components/ui/ExportButton";

interface Goal {
  id: string;
  title: string;
  status: string;
  current_progress: number;
  target_reduction: number;
  deadline: string;
}

interface GoalsListProps {
  goals: Goal[];
  setShowGoalModal: (show: boolean) => void;
}

export const GoalsList: React.FC<GoalsListProps> = ({ goals, setShowGoalModal }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h3 className="font-headline-md text-on-surface">Active Goals</h3>
        <div className="flex gap-3">
          <ExportButton targetId="goals-progress-export" filename="Goals-Progress.pdf" className="py-2.5 rounded-full" />
          <button 
            onClick={() => setShowGoalModal(true)}
            className="bg-primary text-white font-label-md px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors shadow-md shadow-primary/30 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Set Goal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full py-12 text-center liquid-glass-panel rounded-2xl border border-dashed border-white/40">
            <span className="material-symbols-outlined text-[48px] text-primary/40 mb-3">flag</span>
            <p className="font-body-lg text-on-surface-variant">You don&apos;t have any goals yet.</p>
            <button onClick={() => setShowGoalModal(true)} className="mt-4 text-primary font-label-md hover:underline">Set your first goal</button>
          </div>
        ) : (
          goals.map(goal => {
            const progressPercent = Math.min(100, Math.round((goal.current_progress / goal.target_reduction) * 100));
            const isCompleted = goal.status === 'completed' || progressPercent >= 100;
            
            return (
              <div key={goal.id} className="ai-glass-glass rounded-2xl p-6 border border-white/50 flex flex-col shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                {isCompleted && (
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
                )}
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-headline-sm text-on-surface pr-4">{goal.title}</h4>
                  {isCompleted ? (
                    <span className="material-symbols-outlined text-primary" title="Completed">check_circle</span>
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant/50">flag</span>
                  )}
                </div>
                
                <div className="mt-auto space-y-3">
                  <div className="flex justify-between font-label-sm text-on-surface-variant mb-1">
                    <span>Progress</span>
                    <span>{goal.current_progress} / {goal.target_reduction} kg</span>
                  </div>
                  <div className="h-2 w-full bg-surface-variant/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-primary' : 'bg-tertiary'}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="font-label-sm text-on-surface-variant text-right">
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

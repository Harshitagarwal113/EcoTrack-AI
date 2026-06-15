import React from "react";

interface GoalModalProps {
  showGoalModal: boolean;
  setShowGoalModal: (show: boolean) => void;
  newGoalTitle: string;
  setNewGoalTitle: (title: string) => void;
  newGoalTarget: string;
  setNewGoalTarget: (target: string) => void;
  newGoalDuration: string;
  setNewGoalDuration: (duration: string) => void;
  handleCreateGoal: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  showGoalModal,
  setShowGoalModal,
  newGoalTitle,
  setNewGoalTitle,
  newGoalTarget,
  setNewGoalTarget,
  newGoalDuration,
  setNewGoalDuration,
  handleCreateGoal,
  isSubmitting,
}) => {
  if (!showGoalModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl shadow-2xl p-8 border border-outline-variant/20">
        <div className="flex justify-between items-center mb-6">
          <h3 id="modal-title" className="font-headline-md text-on-surface">Set New Goal</h3>
          <button onClick={() => setShowGoalModal(false)} className="text-on-surface-variant hover:text-error">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleCreateGoal} className="space-y-5">
          <div>
            <label htmlFor="goal-title" className="block font-label-md text-on-surface-variant mb-2">Goal Title</label>
            <input 
              id="goal-title"
              required
              type="text" 
              placeholder="e.g. Reduce meat consumption"
              value={newGoalTitle}
              onChange={e => setNewGoalTitle(e.target.value)}
              className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          
          <div>
            <label htmlFor="goal-target" className="block font-label-md text-on-surface-variant mb-2">Target Reduction (kg CO2)</label>
            <input 
              id="goal-target"
              required
              type="number" 
              min="1"
              value={newGoalTarget}
              onChange={e => setNewGoalTarget(e.target.value)}
              className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label htmlFor="goal-duration" className="block font-label-md text-on-surface-variant mb-2">Duration</label>
            <select 
              id="goal-duration"
              value={newGoalDuration}
              onChange={e => setNewGoalDuration(e.target.value)}
              className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
            >
              <option value="7">Weekly (7 Days)</option>
              <option value="30">Monthly (30 Days)</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={() => setShowGoalModal(false)}
              className="flex-1 px-4 py-3 rounded-xl font-label-md text-on-surface-variant hover:bg-on-surface-variant/10 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-white px-4 py-3 rounded-xl font-label-md shadow-md hover:bg-primary/90 transition-colors flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
              ) : (
                "Create Goal"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

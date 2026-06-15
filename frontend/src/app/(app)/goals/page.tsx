"use client";

import { useEffect, useState } from "react";
import { getProfileStats, getGoals, createGoal } from "@/features/goals/services/goals-management.service";
import { getGlobalChallenges, getUserChallenges, joinChallenge } from "@/features/community/services/community-challenges.service";
import { ExportButton } from "@/components/ui/ExportButton";

export default function GoalsPage() {
  const [activeTab, setActiveTab] = useState<"goals" | "challenges">("goals");
  const [stats, setStats] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [joinedChallenges, setJoinedChallenges] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Goal Form State
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("10");
  const [newGoalDuration, setNewGoalDuration] = useState("7");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [statsData, goalsData, challengesData, joinedData] = await Promise.all([
      getProfileStats(),
      getGoals(),
      getGlobalChallenges(),
      getUserChallenges()
    ]);
    
    setStats(statsData);
    setGoals(goalsData || []);
    setChallenges(challengesData || []);
    setJoinedChallenges(joinedData || []);
    setIsLoading(false);
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createGoal(newGoalTitle, Number(newGoalTarget), Number(newGoalDuration));
    setIsSubmitting(false);
    
    if (res.success) {
      setShowGoalModal(false);
      setNewGoalTitle("");
      setNewGoalTarget("10");
      setNewGoalDuration("7");
      loadData();
    } else {
      alert("Failed to create goal: " + res.error);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    const res = await joinChallenge(challengeId);
    if (res.success) {
      loadData();
    } else {
      alert("Failed to join challenge: " + res.error);
    }
  };

  const hasJoinedChallenge = (challengeId: string) => {
    return joinedChallenges.some(jc => jc.challenge_id === challengeId);
  };

  return (
    <div id="goals-progress-export" className="px-4 md:px-12 max-w-container-max mx-auto w-full flex-1 flex flex-col gap-stack-lg pt-10 pb-12 bg-surface dark:bg-inverse-surface rounded-2xl">
      
      {/* Hero Stats */}
      <section className="liquid-glass-panel rounded-[32px] p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 border border-white/40 shadow-[0_30px_60px_rgba(16,185,129,0.1)] relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col z-10">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2">Your Impact</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            Complete goals and join challenges to earn Sustainability Points and exclusive badges.
          </p>
        </div>

        <div className="flex items-center gap-6 z-10 bg-white/60 p-6 rounded-2xl shadow-sm border border-white/50 backdrop-blur-md">
          <div className="text-center px-4 border-r border-outline-variant/30">
            <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">Points</p>
            <p className="font-display-md text-primary">{stats?.points || 0}</p>
          </div>
          <div className="text-center px-4">
            <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">Badges</p>
            <div className="flex items-center gap-2 mt-2 justify-center">
              {stats?.badges && stats.badges.length > 0 ? (
                stats.badges.map((b: string, i: number) => (
                  <span key={i} className="material-symbols-outlined text-[28px] text-tertiary" title={b}>workspace_premium</span>
                ))
              ) : (
                <span className="font-body-sm text-on-surface-variant">No badges yet</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-outline-variant/30 pb-2">
        <button 
          onClick={() => setActiveTab("goals")}
          className={`font-label-lg px-4 py-2 rounded-t-xl transition-colors ${activeTab === "goals" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface"}`}
        >
          My Goals
        </button>
        <button 
          onClick={() => setActiveTab("challenges")}
          className={`font-label-lg px-4 py-2 rounded-t-xl transition-colors ${activeTab === "challenges" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface"}`}
        >
          Community Challenges
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-primary">
          <span className="material-symbols-outlined animate-spin text-[40px]">sync</span>
        </div>
      ) : (
        <div className="flex-1">
          {/* GOALS TAB */}
          {activeTab === "goals" && (
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
                    <p className="font-body-lg text-on-surface-variant">You don't have any goals yet.</p>
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
          )}

          {/* CHALLENGES TAB */}
          {activeTab === "challenges" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="font-headline-md text-on-surface">Global Challenges</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {challenges.map(challenge => {
                  const joined = hasJoinedChallenge(challenge.id);
                  const isEndingSoon = new Date(challenge.end_date).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000;

                  return (
                    <div key={challenge.id} className="liquid-glass-panel rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start border border-white/50 relative overflow-hidden group">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-tertiary-container to-primary/20 flex items-center justify-center shrink-0 shadow-inner">
                        <span className="material-symbols-outlined text-[32px] text-tertiary">public</span>
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h4 className="font-headline-sm text-on-surface">{challenge.title}</h4>
                          {isEndingSoon && (
                            <span className="font-label-sm text-error bg-error/10 px-2 py-0.5 rounded-md">Ending Soon</span>
                          )}
                        </div>
                        
                        <p className="font-body-md text-on-surface-variant mb-4">{challenge.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-on-surface-variant font-label-sm mt-auto">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">group</span>
                            {challenge.participants_count} Participants
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">event</span>
                            Ends {new Date(challenge.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 md:ml-auto w-full md:w-auto shrink-0 flex flex-col justify-center">
                        {joined ? (
                          <button disabled className="w-full bg-white/50 text-primary font-label-md px-6 py-2.5 rounded-full border border-primary/20 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                            Joined
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleJoinChallenge(challenge.id)}
                            className="w-full bg-gradient-to-r from-primary to-primary-container text-white font-label-md px-6 py-2.5 rounded-full shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
                          >
                            Join Challenge
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Goal Creation Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface dark:bg-inverse-surface w-full max-w-md rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface">Set New Goal</h3>
              <button onClick={() => setShowGoalModal(false)} className="text-on-surface-variant hover:text-error">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateGoal} className="space-y-5">
              <div>
                <label className="block font-label-md text-on-surface-variant mb-2">Goal Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Reduce meat consumption"
                  value={newGoalTitle}
                  onChange={e => setNewGoalTitle(e.target.value)}
                  className="w-full bg-white/50 border border-outline-variant/50 rounded-xl px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              
              <div>
                <label className="block font-label-md text-on-surface-variant mb-2">Target Reduction (kg CO2)</label>
                <input 
                  required
                  type="number" 
                  min="1"
                  value={newGoalTarget}
                  onChange={e => setNewGoalTarget(e.target.value)}
                  className="w-full bg-white/50 border border-outline-variant/50 rounded-xl px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block font-label-md text-on-surface-variant mb-2">Duration</label>
                <select 
                  value={newGoalDuration}
                  onChange={e => setNewGoalDuration(e.target.value)}
                  className="w-full bg-white/50 border border-outline-variant/50 rounded-xl px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
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
      )}

    </div>
  );
}

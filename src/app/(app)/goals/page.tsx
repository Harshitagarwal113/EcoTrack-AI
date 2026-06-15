"use client";

import { useEffect, useState } from "react";
import { getProfileStats, getGoals, createGoal } from "@/features/goals/services/goals-management.service";
import { getGlobalChallenges, getUserChallenges, joinChallenge } from "@/features/community/services/community-challenges.service";
import { ExportButton } from "@/components/ui/ExportButton";
import { GoalModal } from "@/components/goals/GoalModal";
import { GoalsList } from "@/components/goals/GoalsList";
import { ChallengesList } from "@/components/goals/ChallengesList";

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
            <GoalsList goals={goals} setShowGoalModal={setShowGoalModal} />
          )}

          {/* CHALLENGES TAB */}
          {activeTab === "challenges" && (
            <ChallengesList 
              challenges={challenges} 
              hasJoinedChallenge={hasJoinedChallenge} 
              handleJoinChallenge={handleJoinChallenge} 
            />
          )}
        </div>
      )}

      {/* Goal Creation Modal */}
      <GoalModal
        showGoalModal={showGoalModal}
        setShowGoalModal={setShowGoalModal}
        newGoalTitle={newGoalTitle}
        setNewGoalTitle={setNewGoalTitle}
        newGoalTarget={newGoalTarget}
        setNewGoalTarget={setNewGoalTarget}
        newGoalDuration={newGoalDuration}
        setNewGoalDuration={setNewGoalDuration}
        handleCreateGoal={handleCreateGoal}
        isSubmitting={isSubmitting}
      />

    </div>
  );
}

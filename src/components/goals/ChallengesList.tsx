import React from "react";

interface ChallengesListProps {
  challenges: any[];
  hasJoinedChallenge: (challengeId: string) => boolean;
  handleJoinChallenge: (challengeId: string) => Promise<void>;
}

export const ChallengesList: React.FC<ChallengesListProps> = ({ 
  challenges, 
  hasJoinedChallenge, 
  handleJoinChallenge 
}) => {
  return (
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
  );
};

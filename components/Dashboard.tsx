import React from 'react';
import { DailyChallenge, Quest, UserData } from '../types';
import { LEVELS, QUESTS, DAILY_CHALLENGES, MILESTONES } from '../constants';
import { QuestCard } from './QuestCard';
import { TrophyIcon } from './icons/Icons';

interface DashboardProps {
  userData: UserData;
  onSelectQuest: (quest: Quest) => void;
  onCompleteDailyChallenge: (challengeId: string) => void;
}

const DailyChallengeCard: React.FC<{
  challenge: DailyChallenge;
  isCompleted: boolean;
  onComplete: () => void;
}> = ({ challenge, isCompleted, onComplete }) => {
  return (
    <div className={`bg-[#1E1629] rounded-xl p-4 border border-purple-500/20 shadow-lg transition-all duration-300 group ${isCompleted ? 'opacity-60' : 'hover:border-pink-500/50 hover:shadow-pink-500/20'}`}>
      <div className="flex justify-between items-center">
        <div className="flex-grow pr-4">
          <h4 className={`font-bold font-oxanium mb-1 transition-colors ${isCompleted ? 'text-gray-400' : 'text-purple-100 group-hover:text-pink-200'}`}>
            {challenge.title}
          </h4>
          <p className="text-xs text-gray-400">{challenge.description}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className="text-[10px] font-bold bg-[#2a203b] text-yellow-400 px-2 py-1 rounded border border-purple-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
            + {challenge.xp} XP
          </span>
          <button
            onClick={onComplete}
            disabled={isCompleted}
            className={`text-xs font-bold px-3 py-1 rounded-lg transition-all transform active:scale-95 
                ${isCompleted 
                    ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-default' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md shadow-purple-900/40'}`}
          >
            {isCompleted ? 'Concluído' : 'Aceitar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export const Dashboard: React.FC<DashboardProps> = ({ userData, onSelectQuest, onCompleteDailyChallenge }) => {
  const currentLevelInfo = LEVELS.find(l => l.level === userData.level);
  const nextLevelInfo = LEVELS.find(l => l.level === userData.level + 1);
  const xpProgress = currentLevelInfo ? (userData.xp / currentLevelInfo.xpRequired) * 100 : 0;
  
  const activeQuests = QUESTS.filter(q => q.level <= userData.level && !userData.questsCompleted[q.id]).slice(0, 2);

  const isChallengeCompletedToday = (challengeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return userData.completedDailyChallenges[challengeId] === today;
  };

  // Find next milestone
  const nextMilestoneLevel = Object.keys(MILESTONES)
    .map(Number)
    .sort((a, b) => a - b)
    .find(lvl => lvl > userData.level) || userData.level + 5; // Fallback

  const milestone = MILESTONES[nextMilestoneLevel];
  const levelsToMilestone = nextMilestoneLevel - userData.level;

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#2D1B4E] to-[#150a24] p-6 rounded-2xl shadow-2xl border border-purple-500/40 relative overflow-hidden group">
        {/* Neon Glow FX */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-600/20 rounded-full blur-[50px] group-hover:bg-pink-600/30 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none"></div>
        
        <div className="flex justify-between items-end mb-6 relative z-10">
            <div>
                <div className="flex items-center mb-1">
                    <span className="text-purple-300 text-[10px] font-bold uppercase tracking-widest shadow-black drop-shadow-sm">
                        Nível Atual
                    </span>
                    <span className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]" title="Conectado ao Banco de Dados"></span>
                </div>
                <h2 className="font-bold font-oxanium text-2xl text-white tracking-wide drop-shadow-md">
                    {userData.name}
                </h2>
                <p className="text-gray-400 text-xs font-medium mt-1 flex items-center">
                    {currentLevelInfo?.title || 'Viajante'}
                </p>
            </div>
            <div className="text-center bg-[#1a1033]/80 p-3 rounded-xl border border-purple-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                 <span className="block text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 font-oxanium drop-shadow-sm">
                    {userData.level}
                 </span>
            </div>
        </div>

        <div className="relative z-10">
            <div className="flex justify-between text-[10px] text-purple-200 mb-2 font-bold uppercase tracking-wider">
                <span>XP Progresso</span>
                <span>{userData.xp} / {currentLevelInfo?.xpRequired} XP</span>
            </div>
            <div className="w-full bg-[#130b20] rounded-full h-3 shadow-inner border border-purple-500/10">
                <div 
                    className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_15px_rgba(236,72,153,0.5)]" 
                    style={{ width: `${xpProgress}%` }}
                >
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/80 animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                </div>
            </div>
        </div>
      </div>

      {/* Next Milestone Section */}
      {milestone && (
        <div className="bg-gradient-to-r from-[#1e1b2e] to-[#2d1b4e] border border-cyan-500/30 rounded-xl p-4 relative overflow-hidden shadow-[0_0_20px_rgba(8,145,178,0.1)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center">
                     <div className="bg-[#150a24] p-2 rounded-lg mr-3 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                        <TrophyIcon className="w-6 h-6 text-cyan-400" />
                     </div>
                     <div>
                         <p className="text-[10px] text-cyan-300 uppercase tracking-widest font-bold">Próxima Conquista</p>
                         <p className="text-white font-bold font-oxanium text-lg">{milestone.title}</p>
                     </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-white font-oxanium">{levelsToMilestone}</span>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Níveis</span>
                </div>
            </div>
            {/* Visual dots for levels */}
            <div className="flex space-x-1.5 h-2 relative z-10">
                {[...Array(5)].map((_, i) => {
                    const isActive = i < (5 - levelsToMilestone);
                    return (
                        <div key={i} className={`flex-1 rounded-sm skew-x-[-12deg] transition-all duration-500 ${isActive ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-[#150a24] border border-white/5'}`}></div>
                    )
                })}
            </div>
        </div>
      )}

      {/* Daily Challenges */}
      <div>
        <div className="flex items-center justify-between mb-3">
             <h2 className="text-lg font-bold font-oxanium text-white flex items-center">
                <span className="text-purple-500 mr-2">⚡</span> 
                Rotina Diária
             </h2>
             <span className="text-[10px] bg-[#2a203b] text-purple-200 px-2 py-1 rounded border border-purple-500/30 uppercase tracking-wider font-bold">
                24h Reset
             </span>
        </div>
        <div className="grid grid-cols-1 gap-3">
            {DAILY_CHALLENGES.map(challenge => (
                <DailyChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    isCompleted={isChallengeCompletedToday(challenge.id)}
                    onComplete={() => onCompleteDailyChallenge(challenge.id)}
                />
            ))}
        </div>
      </div>
      
      {/* Quests */}
      <div>
        <h2 className="text-lg font-bold font-oxanium text-white mb-3 flex items-center">
             <span className="text-blue-400 mr-2">⚔️</span> 
             Missões Ativas
        </h2>
        <div className="space-y-3">
          {activeQuests.length > 0 ? (
            activeQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} isCompleted={false} onSelect={() => onSelectQuest(quest)} />
            ))
          ) : (
            <div className="text-center p-8 bg-[#1E1629] rounded-xl border border-purple-500/20 border-dashed">
                <div className="text-4xl mb-2 opacity-50">✨</div>
                <p className="text-purple-200 font-medium font-oxanium">Área limpa, Comandante!</p>
                <p className="text-xs text-gray-500 mt-1">Explore os eventos e jogos para mais XP.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
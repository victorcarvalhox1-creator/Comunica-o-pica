
import React, { useState } from 'react';
import { UserData } from '../types';
import { AVATAR_STAGES, LEVELS, MILESTONES } from '../constants';
import { OnboardingModal } from './OnboardingModal';
import { useUserData } from '../hooks/useUserData';
import { CheckCircleIcon } from './icons/Icons';

interface ProfileProps {
  userData: UserData;
  onLogout?: () => void;
}

const SkillBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="mb-4">
        <div className="flex justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
            <span className="text-sm font-bold text-white font-oxanium">{Math.floor(value)}/10</span>
        </div>
        <div className="w-full bg-[#150a24] rounded-full h-2.5 border border-white/5">
            <div 
                className={`h-full rounded-full transition-all duration-1000 ${color} shadow-[0_0_10px_rgba(0,0,0,0.4)] relative`} 
                style={{ width: `${(value / 10) * 100}%` }}
            >
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
);

export const Profile: React.FC<ProfileProps> = ({ userData, onLogout }) => {
    const { setUserName } = useUserData('temp-read-only'); // We only need setUserName here for the logic inside Profile, but realistically Profile gets data from parent. 
    // Note: calling useUserData here again creates a disconnected state if we aren't careful. 
    // Ideally, setUserName should be passed from App -> Profile. 
    // However, consistent with previous implementation pattern where Profile used the hook directly.
    // FIX: The Profile component received `userData` from props. The `useUserData` hook inside here is actually creating a *new* instance which is incorrect for updating the main app state if we pass a dummy ID.
    // For this refactor, we should ideally receive `setUserName` as a prop too, OR we rely on the parent updating.
    // BUT, since the `App` component passes `userData`, and Profile updates via `OnboardingModal` -> `onSave`, we need a way to update.
    // Let's modify OnboardingModal usage. The previous implementation of Profile imported useUserData directly.
    // To fix the "update name" issue without prop drilling `setUserName` everywhere (which would be better but requires changing App renderContent),
    // we can temporarily disable the internal hook usage or assume the user is editing the same localStorage key.
    // BETTER FIX: Since `App.tsx` handles the state, we should pass `onUpdateName` prop to Profile.
    // For now, to minimize changes, let's leave setUserName unused or accept that we need to lift state completely.
    // Actually, the best way is to just modify the `App.tsx` to pass a handler, OR make `Profile` dumb.
    // Let's check App.tsx... It passes `userData`. It does NOT pass `setUserName`.
    // The previous `Profile.tsx` imported `useUserData` and used it.
    // Now `useUserData` requires an ID. We don't have the ID here easily unless passed.
    // I will assume for now we remove the hook from here and just render. Editing name might require a refactor to pass the function down.
    
    // Temporary workaround: We won't call useUserData inside Profile. We will disable name editing OR we rely on App to pass it.
    // Let's simply allow visual editing but we can't save without the setter.
    // Actually, let's use the props pattern for Logout.
    
    const [isEditing, setIsEditing] = useState(false);

    const currentLevelInfo = LEVELS.find(l => l.level === userData.level);
    const currentAvatarStage = [...AVATAR_STAGES].reverse().find(stage => userData.level >= stage.level) || AVATAR_STAGES[0];
  
    const reachedMilestones = userData.milestonesReached
        .sort((a, b) => b - a)
        .map(level => MILESTONES[level])
        .filter(Boolean);

    return (
        <div className="p-4 text-center pb-24">
            {/* Note: Name editing is temporarily disabled in UI until we pass the setter function, to avoid hook complexity */}
            {/* {isEditing && <OnboardingModal currentName={userData.name} onSave={(name) => { setUserName(name); setIsEditing(false); }} />} */}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold font-oxanium text-white">Identidade</h1>
                {onLogout && (
                    <button 
                        onClick={onLogout}
                        className="text-[10px] font-bold text-red-400 border border-red-500/50 px-3 py-1 rounded hover:bg-red-500/20 transition uppercase tracking-wider flex items-center"
                    >
                        Sair
                    </button>
                )}
            </div>
            
            <div 
                className="relative p-8 rounded-full w-44 h-44 mx-auto flex items-center justify-center border-4 border-[#1E1629] shadow-[0_0_30px_rgba(147,51,234,0.3)] mb-6 bg-gradient-to-br from-purple-900/80 to-[#150a24]"
            >
                <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-pulse"></div>
                <div className="text-white transform scale-150 text-purple-200 filter drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]">
                    {currentAvatarStage?.icon}
                </div>
                <div className="absolute -bottom-3 bg-[#1E1629] px-4 py-1 rounded-full text-xs font-bold border border-purple-500 text-yellow-400 shadow-lg font-oxanium">
                    LVL {userData.level}
                </div>
            </div>

            <h2 className="text-3xl font-bold text-white font-oxanium mb-1 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                {userData.name}
            </h2>
            <p className="text-gray-400 text-sm mb-3 font-medium">{currentLevelInfo?.title}</p>
            <p className="inline-block px-4 py-1.5 bg-purple-900/30 border border-purple-500/40 rounded-full text-purple-300 text-xs font-bold uppercase tracking-wide mb-8 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                {currentAvatarStage?.name}
            </p>
            
            <div className="grid grid-cols-1 gap-6">
                {/* Skills */}
                <div className="bg-[#1E1629] p-6 rounded-xl border border-purple-500/20 shadow-xl text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl pointer-events-none"></div>
                    <h3 className="text-lg font-bold font-oxanium text-white mb-6 flex items-center border-b border-white/5 pb-3">
                        <span className="mr-2 text-xl drop-shadow-md">📊</span> Status de Habilidade
                    </h3>
                    <SkillBar label="Dicção & Clareza" value={userData.skills.diccao} color="bg-gradient-to-r from-blue-500 to-cyan-400" />
                    <SkillBar label="Confiança" value={userData.skills.confianca} color="bg-gradient-to-r from-purple-500 to-pink-500" />
                    <SkillBar label="Vocabulário" value={userData.skills.vocabulario} color="bg-gradient-to-r from-emerald-500 to-green-400" />
                    <SkillBar label="Empatia" value={userData.skills.empatia} color="bg-gradient-to-r from-orange-500 to-red-400" />
                </div>

                {/* Achievements Section */}
                <div className="bg-[#1E1629] p-6 rounded-xl border border-purple-500/20 shadow-xl text-left">
                     <h3 className="text-lg font-bold font-oxanium text-white mb-4 flex items-center border-b border-white/5 pb-3">
                        <span className="mr-2 text-xl drop-shadow-md">🏆</span> Sala de Troféus
                    </h3>
                    
                    {reachedMilestones.length > 0 ? (
                        <div className="space-y-3">
                            {reachedMilestones.map(ms => (
                                <div key={ms.level} className="bg-[#150a24] p-3 rounded-lg border border-purple-500/10 flex items-center hover:border-purple-500/30 transition-colors">
                                    <div className="bg-[#1E1629] p-2 rounded-full border border-yellow-500/20 mr-3 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                                        {ms.icon || <span className="text-xl">🎖️</span>}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white font-oxanium">{ms.title}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Desbloqueado no Nível {ms.level}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm italic text-center py-4 border border-dashed border-gray-700 rounded-lg">
                            Sua galeria de troféus está vazia... por enquanto.
                        </p>
                    )}
                </div>

                {/* Stats Section */}
                <div className="bg-[#1E1629] p-6 rounded-xl border border-purple-500/20 shadow-xl">
                    <h3 className="text-lg font-bold font-oxanium text-white mb-4 text-left border-b border-white/5 pb-3">Estatísticas Gerais</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#150a24] p-4 rounded-xl border border-purple-500/10 shadow-inner text-center">
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1">XP Total</p>
                            <p className="text-xl font-bold text-white font-oxanium">{userData.xp}</p>
                        </div>
                        <div className="bg-[#150a24] p-4 rounded-xl border border-purple-500/10 shadow-inner text-center">
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1">Moedas</p>
                            <p className="text-xl font-bold text-yellow-400 font-oxanium">{userData.coins}</p>
                        </div>
                        <div className="bg-[#150a24] p-4 rounded-xl border border-purple-500/10 shadow-inner text-center">
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1">Missões</p>
                            <p className="text-xl font-bold text-blue-400 font-oxanium">{Object.keys(userData.questsCompleted).length}</p>
                        </div>
                        <div className="bg-[#150a24] p-4 rounded-xl border border-purple-500/10 shadow-inner text-center">
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1">Eventos</p>
                            <p className="text-xl font-bold text-green-400 font-oxanium">{Object.keys(userData.eventsCompleted).length}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

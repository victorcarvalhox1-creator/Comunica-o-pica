import React, { useState } from 'react';
import { Quest, UserData } from '../types';
import { QUESTS } from '../constants';
import { QuestCard } from './QuestCard';
import { getQuestFeedback } from '../services/geminiService';
import { CheckCircleIcon } from './icons/Icons';

interface QuestsProps {
  userData: UserData;
  onCompleteQuest: (questId: string, xp: number) => void;
}

const QuestDetailModal: React.FC<{
    quest: Quest;
    onClose: () => void;
    onComplete: (questId: string, xp: number) => void;
    isCompleted: boolean;
}> = ({ quest, onClose, onComplete, isCompleted }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiFeedback, setAiFeedback] = useState<string | null>(null);

    const handleGetFeedback = async () => {
        setIsAnalyzing(true);
        setAiFeedback(null);
        // In a real app, userSubmission would come from a textarea, audio recording, etc.
        const userSubmission = "Eu completei a tarefa de respiração."; 
        const feedback = await getQuestFeedback(quest.title, userSubmission);
        setAiFeedback(feedback);
        setIsAnalyzing(false);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40 p-4" onClick={onClose}>
            <div className="bg-[#150a24] border border-purple-500/40 rounded-xl max-w-md w-full p-6 shadow-[0_0_30px_rgba(147,51,234,0.3)] relative overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                
                <h2 className="text-2xl font-bold font-oxanium text-white mb-2">{quest.title}</h2>
                <p className="text-gray-400 mb-6 leading-relaxed">{quest.description}</p>
                
                <div className="flex justify-between items-center mb-6 bg-[#1E1629] p-3 rounded-lg border border-purple-500/20">
                    <span className="text-gray-400 text-xs uppercase font-bold">Recompensa</span>
                    <span className="text-yellow-400 font-bold font-oxanium text-lg drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">{quest.xp} XP</span>
                </div>

                {isCompleted ? (
                     <div className="text-center p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-green-300 flex items-center justify-center space-x-2 mb-4">
                        <CheckCircleIcon className="w-6 h-6"/>
                        <span className="font-bold">Missão Concluída!</span>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <button 
                            onClick={handleGetFeedback} 
                            disabled={isAnalyzing} 
                            className="w-full bg-[#1E1629] hover:bg-[#2a203b] text-purple-300 border border-purple-500/30 font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 font-oxanium"
                        >
                            {isAnalyzing ? 'Analisando...' : '🤖 Obter Feedback da IA'}
                        </button>
                        <button 
                            onClick={() => { onComplete(quest.id, quest.xp); onClose(); }} 
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition shadow-[0_0_15px_rgba(34,197,94,0.3)] font-oxanium tracking-wide"
                        >
                            COMPLETAR MISSÃO
                        </button>
                    </div>
                )}

                {isAnalyzing && (
                    <div className="mt-4 text-center text-sm text-purple-300 animate-pulse">Aguarde, nossa IA está analisando sua performance...</div>
                )}
                {aiFeedback && (
                    <div className="mt-4 p-4 bg-[#1E1629] rounded-lg border border-purple-500/30">
                        <h4 className="font-bold text-purple-300 mb-1 font-oxanium">Feedback da IA:</h4>
                        <p className="text-sm text-gray-300">{aiFeedback}</p>
                    </div>
                )}
            </div>
        </div>
    );
};


export const Quests: React.FC<QuestsProps> = ({ userData, onCompleteQuest }) => {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const availableQuests = QUESTS.filter(q => q.level <= userData.level);

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold font-oxanium text-white mb-6 flex items-center">
        <span className="mr-2 text-purple-500">📜</span> Central de Missões
      </h1>
      <div className="space-y-4">
        {availableQuests.map(quest => (
          <QuestCard 
            key={quest.id} 
            quest={quest}
            isCompleted={!!userData.questsCompleted[quest.id]}
            onSelect={() => setSelectedQuest(quest)}
          />
        ))}
      </div>
      {selectedQuest && (
        <QuestDetailModal 
            quest={selectedQuest} 
            onClose={() => setSelectedQuest(null)} 
            onComplete={onCompleteQuest}
            isCompleted={!!userData.questsCompleted[selectedQuest.id]}
        />
      )}
    </div>
  );
};
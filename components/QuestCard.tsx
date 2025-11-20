import React from 'react';
import { Quest } from '../types';
import { CheckCircleIcon } from './icons/Icons';

interface QuestCardProps {
    quest: Quest;
    isCompleted: boolean;
    onSelect: () => void;
}

const QuestTypeStyles: Record<Quest['type'], string> = {
    'Q.F.': 'bg-blue-900/30 text-blue-300 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.1)]',
    'Q.I.': 'bg-purple-900/30 text-purple-300 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.1)]',
    'Q.R.': 'bg-pink-900/30 text-pink-300 border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.1)]',
};

export const QuestCard: React.FC<QuestCardProps> = ({ quest, isCompleted, onSelect }) => {
    const typeStyle = QuestTypeStyles[quest.type];
    
    return (
        <div 
            onClick={onSelect}
            className={`bg-[#1E1629] rounded-xl p-5 border border-purple-500/20 shadow-lg transition-all duration-300 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:-translate-y-1 cursor-pointer relative overflow-hidden group ${isCompleted ? 'opacity-50 grayscale' : ''}`}
        >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-purple-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>

            {isCompleted && (
                <div className="absolute inset-0 bg-[#0b0514]/80 flex items-center justify-center z-10 backdrop-blur-[2px]">
                    <div className="bg-green-500/20 p-3 rounded-full border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                        <CheckCircleIcon className="w-10 h-10 text-green-400"/>
                    </div>
                </div>
            )}
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold font-oxanium text-white pr-16 group-hover:text-purple-200 transition-colors">{quest.title}</h3>
                <div className={`text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wide ${typeStyle}`}>
                    {quest.type}
                </div>
            </div>
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{quest.description}</p>
            <div className="flex justify-between items-center border-t border-white/5 pt-3">
                <span className="text-xs font-semibold text-gray-500 bg-[#150a24] px-2 py-1 rounded border border-white/5">
                    Nível {quest.level}
                </span>
                <span className="text-sm font-bold text-yellow-400 flex items-center drop-shadow-[0_0_5px_rgba(250,204,21,0.4)]">
                    +{quest.xp} XP
                </span>
            </div>
        </div>
    );
};
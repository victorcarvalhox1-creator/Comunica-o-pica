import React, { useEffect, useState } from 'react';
import { Level } from '../types';
import { TrophyIcon, CheckCircleIcon } from './icons/Icons';
import { MILESTONES } from '../constants';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevelData: Level;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, onClose, newLevelData }) => {
  const [show, setShow] = useState(false);
  const milestone = MILESTONES[newLevelData.level];
  const isMilestone = !!milestone;

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#05030a]/95 backdrop-blur-md flex items-center justify-center z-[80] p-4" onClick={onClose}>
      <div
        className={`
            bg-[#150a24] border-2 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 text-center transition-all duration-700 transform max-w-sm w-full relative overflow-hidden
            ${show ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10'}
            ${isMilestone ? 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]' : 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[100px] -z-10 opacity-40 ${isMilestone ? 'bg-yellow-600' : 'bg-purple-600'}`}></div>

        <div className="animate-bounce mb-6 relative z-10 mt-2">
          {isMilestone && milestone.icon ? (
             <div className="inline-block p-5 rounded-full bg-[#1E1629] border-2 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                 {milestone.icon}
             </div>
          ) : (
             <TrophyIcon className="w-24 h-24 mx-auto text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]" />
          )}
        </div>

        <h2 className="text-4xl font-extrabold font-oxanium text-white mb-2 tracking-wider italic drop-shadow-lg">
            {isMilestone ? 'MARCO ÉPICO!' : 'LEVEL UP!'}
        </h2>
        
        <div className="mb-8">
             <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-2">Nível Alcançado</p>
             <div className="relative inline-block">
                <p className={`text-7xl font-black font-oxanium leading-none ${isMilestone ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]'}`}>
                    {newLevelData.level}
                </p>
             </div>
             <p className={`text-xl font-bold mt-2 font-oxanium ${isMilestone ? 'text-yellow-200' : 'text-purple-200'}`}>
                 {newLevelData.title}
             </p>
        </div>

        {isMilestone ? (
            <div className="bg-[#0b0514]/60 rounded-xl p-4 text-left mb-6 border border-yellow-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none"></div>
                <h4 className="text-xs font-bold text-yellow-500 uppercase mb-3 flex items-center tracking-wider">
                    <span className="mr-2 text-lg">🔓</span> Desbloqueios
                </h4>
                <ul className="space-y-2">
                    {milestone.rewards.map((reward, idx) => (
                         <li key={`rew-${idx}`} className="flex items-center text-sm text-yellow-100 font-medium">
                             <CheckCircleIcon className="w-4 h-4 text-yellow-500 mr-2" />
                             {reward}
                         </li>
                    ))}
                    {milestone.unlocks.map((unlock, idx) => (
                         <li key={`unl-${idx}`} className="flex items-center text-sm text-purple-100 font-medium">
                             <CheckCircleIcon className="w-4 h-4 text-purple-400 mr-2" />
                             Nova Função: {unlock}
                         </li>
                    ))}
                </ul>
            </div>
        ) : (
            <div className="text-gray-300 text-sm mb-8 bg-[#1E1629]/80 py-3 px-4 rounded-lg border border-purple-500/20">
                <p className="font-bold text-white mb-1">Recompensas:</p>
                <p>+25 Moedas 🪙</p>
                <p>Novas quests liberadas 📜</p>
            </div>
        )}

        <button
          onClick={onClose}
          className={`
            w-full font-bold font-oxanium text-lg py-4 px-6 rounded-xl transition-all transform hover:scale-105 hover:-translate-y-1 shadow-xl
            ${isMilestone 
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white shadow-yellow-900/40' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-900/40'}
          `}
        >
          CONTINUAR JORNADA
        </button>
      </div>
    </div>
  );
};
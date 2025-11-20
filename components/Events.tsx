import React, { useState, useMemo } from 'react';
import { SpecialEvent, UserData } from '../types';
import { EventsIcon, CheckCircleIcon } from './icons/Icons';
import { LEVELS } from '../constants';

interface EventsProps {
    userData: UserData;
    onRegisterEvent: (title: string, description: string, xp: number) => { success: boolean; message: string };
}

export const Events: React.FC<EventsProps> = ({ userData, onRegisterEvent }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requestedXp, setRequestedXp] = useState(50);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const isCooldownActive = userData.lastCustomEventDate === today;

  const currentLevelInfo = LEVELS.find(l => l.level === userData.level);
  const maxXp = useMemo(() => {
      return Math.floor((currentLevelInfo?.xpRequired || 100) * 0.75);
  }, [currentLevelInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
        setFeedback({ type: 'error', msg: 'Preencha todos os campos.' });
        return;
    }

    const result = onRegisterEvent(title, description, requestedXp);
    if (result.success) {
        setFeedback({ type: 'success', msg: result.message });
        setTitle('');
        setDescription('');
        setRequestedXp(50);
    } else {
        setFeedback({ type: 'error', msg: result.message });
    }
  };

  return (
    <div className="p-4 pb-24">
        <div className="flex items-center mb-6">
            <EventsIcon className="w-8 h-8 mr-3 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]"/>
            <h1 className="text-2xl font-bold font-oxanium text-white">Eventos Raros</h1>
        </div>

        <div className="bg-gradient-to-r from-orange-900/20 to-transparent border-l-4 border-orange-500 p-4 rounded-r-lg mb-6">
            <h3 className="font-bold text-orange-300 mb-1 font-oxanium">O que são Eventos Raros?</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
                Situações reais que exigiram coragem! Uma reunião inesperada, uma apresentação difícil... Registre-os para ganhar <span className="text-orange-400 font-bold">XP ÉPICO</span> e fortalecer sua confiança.
            </p>
        </div>

        {feedback && (
            <div className={`p-4 rounded-lg mb-4 text-sm font-bold border ${feedback.type === 'success' ? 'bg-green-900/30 border-green-500/50 text-green-300' : 'bg-red-900/30 border-red-500/50 text-red-300'}`}>
                {feedback.msg}
            </div>
        )}

        <div className="bg-[#1E1629] border border-purple-500/20 rounded-xl p-5 shadow-lg mb-8">
            <h2 className="text-xl font-bold font-oxanium text-white mb-4">Registrar Novo Evento</h2>
            
            {isCooldownActive ? (
                <div className="text-center py-8 bg-[#150a24] rounded-lg border border-dashed border-gray-700">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4 animate-pulse">
                        <span className="text-3xl">⏳</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 font-oxanium">Cooldown Ativo</h3>
                    <p className="text-gray-400 text-sm px-6">
                        Energia recarregando... Você poderá registrar outro evento épico amanhã!
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Título da Conquista</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Ex: Defesa do TCC, Reunião com CEO..."
                            className="w-full bg-[#150a24] border border-purple-500/30 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Relatório da Missão</label>
                        <textarea 
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Descreva o desafio e como você o superou..."
                            className="w-full bg-[#150a24] border border-purple-500/30 rounded-lg p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none h-24 transition-colors"
                        />
                    </div>

                    <div className="bg-[#150a24] p-3 rounded-lg border border-purple-500/10">
                        <div className="flex justify-between mb-2">
                            <label className="block text-[10px] uppercase font-bold text-gray-500">Recompensa Solicitada</label>
                            <span className="text-orange-400 font-bold font-oxanium text-lg">{requestedXp} XP</span>
                        </div>
                        <input 
                            type="range" 
                            min="10" 
                            max={maxXp} 
                            value={requestedXp}
                            onChange={e => setRequestedXp(Number(e.target.value))}
                            className="w-full accent-orange-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-bold">
                            <span>10 XP</span>
                            <span>Limite: {maxXp} XP</span>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(234,88,12,0.4)] active:scale-95 font-oxanium tracking-wide"
                    >
                        REIVINDICAR RECOMPENSA
                    </button>
                </form>
            )}
        </div>

        <div className="space-y-4">
            <h2 className="text-lg font-bold font-oxanium text-white">Diário de Conquistas</h2>
            {userData.eventHistory && userData.eventHistory.length > 0 ? (
                userData.eventHistory.map((event) => (
                    <div key={event.id} className="bg-[#1E1629] border border-purple-500/20 rounded-lg p-4 flex items-start hover:border-orange-500/30 transition-colors">
                        <div className="mt-1 mr-3">
                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white font-oxanium">{event.title}</h4>
                            <p className="text-sm text-gray-400 mb-2">{event.description}</p>
                            <div className="flex items-center space-x-3">
                                <span className="text-[10px] text-gray-500 bg-[#150a24] px-2 py-0.5 rounded">{event.date}</span>
                                <span className="text-xs font-bold text-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.4)]">+{event.xp} XP</span>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-center text-sm py-4">Nenhum evento épico registrado ainda.</p>
            )}
        </div>
    </div>
  );
};
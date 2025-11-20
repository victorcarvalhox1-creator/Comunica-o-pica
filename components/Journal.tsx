import React, { useState } from 'react';
import { UserData } from '../types';

interface JournalProps {
  userData: UserData;
  onAddEntry: (content: string) => void;
}

export const Journal: React.FC<JournalProps> = ({ userData, onAddEntry }) => {
  const [newEntry, setNewEntry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.trim()) {
      onAddEntry(newEntry);
      setNewEntry('');
    }
  };

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold font-oxanium text-white mb-6 flex items-center">
        <span className="mr-2 text-pink-500">✍️</span> Grimoire de Reflexão
      </h1>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-[#1E1629] p-4 rounded-xl border border-purple-500/20 shadow-lg">
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Registre seus aprendizados épicos de hoje..."
          className="w-full h-32 p-4 bg-[#150a24] border border-purple-500/30 rounded-lg text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all mb-4 placeholder-gray-600"
        />
        <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-lg transition shadow-[0_0_15px_rgba(168,85,247,0.3)] font-oxanium">
          SALVAR REGISTRO
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-bold font-oxanium text-white border-b border-white/5 pb-2 mb-4">Arquivos Antigos</h2>
        {userData.journalEntries.length > 0 ? (
          userData.journalEntries.map((entry, index) => (
            <div key={index} className="bg-[#1E1629] p-5 rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-colors">
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2">
                {new Date(entry.date).toLocaleString('pt-BR')}
              </p>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed font-light">{entry.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center p-8 bg-[#1E1629] rounded-xl border border-dashed border-gray-700">
            <p className="text-gray-500 font-medium">Seu grimório está vazio. Comece a escrever sua lenda!</p>
          </div>
        )}
      </div>
    </div>
  );
};
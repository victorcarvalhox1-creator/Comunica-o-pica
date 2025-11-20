import React, { useState } from 'react';

interface OnboardingModalProps {
  currentName: string;
  onSave: (name: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ currentName, onSave }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 2) {
      onSave(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-[#05030a]/95 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-[#150a24] border border-purple-500/40 rounded-2xl p-8 max-w-md w-full shadow-[0_0_40px_rgba(147,51,234,0.3)] text-center relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/30 rounded-full blur-[50px]"></div>
        
        <h2 className="text-3xl font-bold font-oxanium text-white mb-2 relative z-10">Bem-vindo, Jogador!</h2>
        <p className="text-purple-200 mb-8 relative z-10">
          Para iniciar sua jornada épica de comunicação, escolha seu Codinome.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu Nickname..."
            className="w-full bg-[#1E1629] border border-purple-500/30 rounded-xl p-4 text-white text-center text-lg font-oxanium focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-gray-600"
            autoFocus
          />
          
          <button
            type="submit"
            disabled={name.trim().length < 3}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold font-oxanium text-lg py-3 px-6 rounded-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          >
            START GAME
          </button>
        </form>
      </div>
    </div>
  );
};
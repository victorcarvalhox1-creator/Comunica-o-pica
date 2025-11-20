import React, { useState } from 'react';
import { UserData, MiniGame } from '../types';
import { MINI_GAMES } from '../constants';
import { GameControllerIcon } from './icons/Icons';

interface GamesProps {
  userData: UserData;
  onCompleteGame: (game: MiniGame) => void;
}

const GameCard: React.FC<{
  game: MiniGame;
  cooldownInfo: { isOnCooldown: boolean; remainingTime: string };
  onSelect: () => void;
}> = ({ game, cooldownInfo, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full bg-[#1E1629] rounded-xl p-5 border border-purple-500/20 shadow-lg text-left transition-all duration-300 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:-translate-y-1 group`}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold font-oxanium text-white pr-4 group-hover:text-purple-200 transition-colors">{game.title}</h3>
        {cooldownInfo.isOnCooldown ? (
            <span className="text-[10px] font-bold bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">
                {cooldownInfo.remainingTime}
            </span>
        ) : (
            <span className="text-sm font-bold text-yellow-400 animate-pulse drop-shadow-[0_0_5px_rgba(250,204,21,0.6)]">
                +{game.xpReward} XP
            </span>
        )}
      </div>
      <p className="text-sm text-gray-400 mt-2 mb-4">{game.description}</p>
    </button>
  );
};

export const Games: React.FC<GamesProps> = ({ userData, onCompleteGame }) => {
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null);

  const handleGameCompletion = () => {
    if (selectedGame) {
        onCompleteGame(selectedGame);
    }
  };
  
  const handleBackToList = () => {
      setSelectedGame(null);
  }

  const getCooldownInfo = (game: MiniGame) => {
      const lastPlayed = userData.gameCooldowns[game.id];
      if (!lastPlayed) return { isOnCooldown: false, remainingTime: '' };

      const now = new Date();
      const lastDate = new Date(lastPlayed);
      const diffMs = now.getTime() - lastDate.getTime();
      const cooldownMs = game.cooldownHours * 60 * 60 * 1000;

      if (diffMs < cooldownMs) {
          const remainingMs = cooldownMs - diffMs;
          const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
          const remainingMinutes = Math.ceil((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
          return { 
              isOnCooldown: true, 
              remainingTime: `⏳ ${remainingHours}h ${remainingMinutes}m` 
          };
      }
      return { isOnCooldown: false, remainingTime: '' };
  };

  if (selectedGame) {
    const GameComponent = selectedGame.component;
    return (
        <div className="p-4">
             <button onClick={handleBackToList} className="mb-4 text-sm text-purple-300 hover:text-purple-100 flex items-center font-bold uppercase tracking-wide transition-colors">
                <span className="mr-1 text-lg">←</span> Voltar ao Salão
            </button>
            <GameComponent onComplete={handleGameCompletion} />
        </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <GameControllerIcon className="w-8 h-8 mr-3 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
        <h1 className="text-2xl font-bold font-oxanium text-white">Salão de Jogos</h1>
      </div>
      <div className="bg-purple-900/20 border border-purple-500/20 p-4 rounded-lg mb-6">
        <p className="text-gray-300 text-sm">Aprimore suas habilidades de comunicação! Desafios de Elite concedem XP extra a cada 5 horas.</p>
      </div>
      
      <div className="space-y-3">
        {MINI_GAMES.map(game => (
          <GameCard
            key={game.id}
            game={game}
            cooldownInfo={getCooldownInfo(game)}
            onSelect={() => setSelectedGame(game)}
          />
        ))}
        {MINI_GAMES.length === 0 && (
            <p className="text-gray-400 text-center p-4 bg-[#1E1629] rounded-lg border border-gray-700">
                Nenhum jogo disponível no momento.
            </p>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { UserData } from '../types';
import { CoinIcon } from './icons/Icons';

interface HeaderProps {
  userData: UserData;
}

export const Header: React.FC<HeaderProps> = ({ userData }) => {
  return (
    <header className="bg-[#150a24]/80 backdrop-blur-md p-3 sticky top-0 z-30 border-b border-purple-500/30 shadow-[0_4px_20px_rgba(147,51,234,0.15)]">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold font-oxanium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
            {userData.name}
          </h1>
          <p className="text-xs text-purple-300/70 font-medium tracking-wide">Nível {userData.level}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-gray-900/60 border border-purple-500/30 px-3 py-1 rounded-full shadow-inner">
            <CoinIcon className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"/>
            <span className="font-bold text-sm text-yellow-100">{userData.coins}</span>
          </div>
          <div className="flex items-center space-x-1">
             <span className="text-2xl drop-shadow-[0_0_10px_rgba(249,115,22,0.6)]">🔥</span>
            <span className="font-bold text-sm text-orange-200">{userData.streak}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
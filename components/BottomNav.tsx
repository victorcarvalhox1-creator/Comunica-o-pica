import React from 'react';
import { View } from '../types';
import { DashboardIcon, QuestsIcon, EventsIcon, ProfileIcon, GameControllerIcon } from './icons/Icons';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const navItems: { view: View; label: string; icon: React.ElementType }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { view: 'quests', label: 'Quests', icon: QuestsIcon },
  { view: 'games', label: 'Jogos', icon: GameControllerIcon },
  { view: 'events', label: 'Eventos', icon: EventsIcon },
  { view: 'profile', label: 'Perfil', icon: ProfileIcon },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#150a24]/90 backdrop-blur-xl border-t border-purple-500/30 z-30 pb-safe shadow-[0_-4px_20px_rgba(147,51,234,0.2)]">
      <div className="container mx-auto flex justify-around">
        {navItems.map(({ view, label, icon: Icon }) => {
          const isActive = activeView === view;
          return (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`flex flex-col items-center justify-center p-3 w-full transition-all duration-300 relative overflow-hidden group ${
                isActive ? 'text-purple-300' : 'text-gray-500 hover:text-purple-200'
              }`}
            >
              {/* Active Indicator Glow */}
              {isActive && <div className="absolute inset-0 bg-purple-600/10 blur-md rounded-full transform scale-75" />}
              
              <Icon className={`w-6 h-6 mb-1 z-10 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]' : 'group-hover:scale-105'}`} />
              <span className={`text-[10px] font-oxanium font-bold z-10 tracking-wide ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
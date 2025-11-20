
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { Quests } from './components/Quests';
import { Journal } from './components/Journal';
import { Events } from './components/Events';
import { Profile } from './components/Profile';
import { Games } from './components/Games';
import { useUserData } from './hooks/useUserData';
import { View, Quest, MiniGame } from './types';
import { LevelUpModal } from './components/LevelUpModal';
import { Confetti } from './components/Confetti';
import { OnboardingModal } from './components/OnboardingModal';
import { Auth } from './components/Auth';
import { LEVELS } from './constants';
import { supabase } from './services/supabaseClient';
import { Session } from '@supabase/supabase-js';

// Wrapper to handle the authenticated state and user data hook
const AuthenticatedApp: React.FC<{ userId: string; onLogout: () => void }> = ({ userId, onLogout }) => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const { userData, loading, setUserName, completeQuest, registerCustomEvent, completeGame, addJournalEntry, completeDailyChallenge } = useUserData(userId);
  const [levelUpInfo, setLevelUpInfo] = useState<{ isOpen: boolean; newLevel: number | null }>({ isOpen: false, newLevel: null });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
      // Only show onboarding if name is default AND data has finished loading
      if (!loading && userData.name === 'Viajante') {
          setShowOnboarding(true);
      }
  }, [userData.name, loading]);

  const triggerConfetti = () => {
      setShowConfetti(true);
      // Reset confetti state after animation plays (2s)
      setTimeout(() => setShowConfetti(false), 2500);
  };

  const handleLevelUpCheck = (result: { leveledUp: boolean; newLevel: number | null }) => {
    if (result.leveledUp && result.newLevel) {
      // Delay level up modal slightly to let confetti start
      setTimeout(() => {
          setLevelUpInfo({ isOpen: true, newLevel: result.newLevel });
      }, 500);
    }
  };

  const handleCompleteQuest = useCallback((questId: string, xp: number) => {
    const result = completeQuest(questId, xp);
    triggerConfetti();
    handleLevelUpCheck(result);
  }, [completeQuest]);

  const handleRegisterEvent = useCallback((title: string, description: string, xp: number) => {
    const result = registerCustomEvent(title, description, xp);
    if (result.success) {
        triggerConfetti();
        handleLevelUpCheck(result);
    }
    return { success: result.success, message: result.message || '' };
  }, [registerCustomEvent]);

  const handleCompleteDailyChallenge = useCallback((challengeId: string) => {
    const result = completeDailyChallenge(challengeId);
    triggerConfetti();
    handleLevelUpCheck(result);
  }, [completeDailyChallenge]);
  
  const handleCompleteGame = useCallback((game: MiniGame) => {
      const result = completeGame(game.id, game.xpReward, game.cooldownHours);
      if (result.success) {
          if (game.xpReward > 0) triggerConfetti();
          handleLevelUpCheck(result);
      }
  }, [completeGame]);

  const handleSelectQuestFromDashboard = (quest: Quest) => {
      setActiveView('quests');
  };

  const handleSaveName = (name: string) => {
      setUserName(name);
      setShowOnboarding(false);
  };

  const renderContent = () => {
    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                 <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-purple-300 font-oxanium animate-pulse">Carregando dados do servidor...</p>
                 </div>
            </div>
        );
    }

    switch (activeView) {
      case 'dashboard':
        return <Dashboard 
                  userData={userData} 
                  onSelectQuest={handleSelectQuestFromDashboard} 
                  onCompleteDailyChallenge={handleCompleteDailyChallenge}
                />;
      case 'quests':
        return <Quests userData={userData} onCompleteQuest={handleCompleteQuest} />;
      case 'journal':
        return <Journal userData={userData} onAddEntry={addJournalEntry} />;
      case 'events':
        return <Events userData={userData} onRegisterEvent={handleRegisterEvent} />;
      case 'profile':
        return <Profile userData={userData} onLogout={onLogout} />;
      case 'games':
        return <Games userData={userData} onCompleteGame={handleCompleteGame} />;
      default:
        return <Dashboard 
                  userData={userData} 
                  onSelectQuest={handleSelectQuestFromDashboard}
                  onCompleteDailyChallenge={handleCompleteDailyChallenge}
                />;
    }
  };
  
  const newLevelData = levelUpInfo.newLevel ? LEVELS.find(l => l.level === levelUpInfo.newLevel) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-roboto pb-16 md:pb-0">
      <Confetti isActive={showConfetti} />
      {showOnboarding && <OnboardingModal currentName={userData.name} onSave={handleSaveName} />}
      
      <Header userData={userData} />
      
      <main className="container mx-auto max-w-md md:max-w-2xl lg:max-w-4xl">
        {renderContent()}
      </main>
      
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
      
      {newLevelData && (
         <LevelUpModal 
            isOpen={levelUpInfo.isOpen}
            onClose={() => setLevelUpInfo({ isOpen: false, newLevel: null })}
            newLevelData={newLevelData}
         />
      )}
    </div>
  );
}

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAppLoading(false);
    });

    // 2. Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAppLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
      await supabase.auth.signOut();
  };

  if (appLoading) {
      return <div className="min-h-screen bg-[#0b0514] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
  }

  if (!session) {
    // Auth component handles the login calls to Supabase internally
    return <Auth onLogin={() => {/* State update handled by onAuthStateChange */}} />;
  }

  return <AuthenticatedApp userId={session.user.id} onLogout={handleLogout} />;
};

export default App;

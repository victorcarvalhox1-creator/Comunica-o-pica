
import { useState, useEffect, useCallback } from 'react';
import { UserData, SpecialEvent, QuestType } from '../types';
import { LEVELS, QUESTS, MILESTONES } from '../constants';

const INITIAL_USER_DATA: UserData = {
  name: 'Viajante',
  level: 1,
  xp: 0,
  coins: 50,
  streak: 1,
  skills: {
      diccao: 1,
      confianca: 1,
      vocabulario: 1,
      empatia: 1,
  },
  questsCompleted: {},
  eventsCompleted: {},
  lastCustomEventDate: null,
  gameCooldowns: {},
  journalEntries: [],
  completedDailyChallenges: {},
  avatarCustomizations: {
    backgroundColor: '#0f172a',
  },
  purchasedItems: ['bg-default'],
  eventHistory: [],
  unlockedFeatures: [],
  milestonesReached: [],
};

const LOCAL_STORAGE_KEY = 'epic-communication-app-user-data-v4';

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData>(() => {
    try {
      const savedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
          const parsed = JSON.parse(savedData);
          // Merge with initial to ensure new fields exist
          return { 
              ...INITIAL_USER_DATA, 
              ...parsed, 
              skills: { ...INITIAL_USER_DATA.skills, ...(parsed.skills || {}) },
              gameCooldowns: { ...INITIAL_USER_DATA.gameCooldowns, ...(parsed.gameCooldowns || {}) },
              eventHistory: parsed.eventHistory || [],
              lastCustomEventDate: parsed.lastCustomEventDate || null,
              unlockedFeatures: parsed.unlockedFeatures || [],
              milestonesReached: parsed.milestonesReached || [],
          };
      }
      return INITIAL_USER_DATA;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return INITIAL_USER_DATA;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [userData]);

  const setUserName = useCallback((name: string) => {
      setUserData(prev => ({ ...prev, name }));
  }, []);

  const addXp = useCallback((amount: number): { leveledUp: boolean; newLevel: number | null } => {
    let currentXp = userData.xp + amount;
    let currentLevel = userData.level;
    let leveledUp = false;

    let xpForNextLevel = LEVELS.find(l => l.level === currentLevel)?.xpRequired ?? Infinity;

    // Check for level up loop
    while (currentXp >= xpForNextLevel) {
      leveledUp = true;
      currentXp -= xpForNextLevel;
      currentLevel++;
      xpForNextLevel = LEVELS.find(l => l.level === currentLevel)?.xpRequired ?? Infinity;
    }
    
    setUserData(prev => {
        const newUnlockedFeatures = [...prev.unlockedFeatures];
        const newMilestonesReached = [...prev.milestonesReached];
        
        // Check if the new level is a milestone
        if (leveledUp && MILESTONES[currentLevel]) {
            const milestone = MILESTONES[currentLevel];
            if (!newMilestonesReached.includes(currentLevel)) {
                newMilestonesReached.push(currentLevel);
                // Add new features to unlocked list
                milestone.unlocks.forEach(feature => {
                    if (!newUnlockedFeatures.includes(feature)) {
                        newUnlockedFeatures.push(feature);
                    }
                });
            }
        }

        return {
            ...prev,
            xp: currentXp,
            level: currentLevel,
            coins: prev.coins + (leveledUp ? (currentLevel - prev.level) * 25 : 0),
            unlockedFeatures: newUnlockedFeatures,
            milestonesReached: newMilestonesReached,
        };
    });

    return { leveledUp, newLevel: leveledUp ? currentLevel : null };
  }, [userData]);

  const updateSkills = (type: QuestType) => {
      setUserData(prev => {
          const newSkills = { ...prev.skills };
          if (type === 'Q.F.') newSkills.diccao = Math.min(10, newSkills.diccao + 0.1);
          if (type === 'Q.I.') {
              newSkills.confianca = Math.min(10, newSkills.confianca + 0.1);
              newSkills.empatia = Math.min(10, newSkills.empatia + 0.05);
          }
          if (type === 'Q.R.') newSkills.vocabulario = Math.min(10, newSkills.vocabulario + 0.1);
          return { ...prev, skills: newSkills };
      });
  };

  const completeQuest = useCallback((questId: string, xp: number) => {
    if (userData.questsCompleted[questId]) return { leveledUp: false, newLevel: null };

    // Find quest to get type
    const quest = QUESTS.find(q => q.id === questId);
    if (quest) updateSkills(quest.type);

    setUserData(prev => ({
      ...prev,
      questsCompleted: { ...prev.questsCompleted, [questId]: true },
    }));
    return addXp(xp);
  }, [userData, addXp]);

  const completeEvent = useCallback((event: SpecialEvent) => {
      if (userData.eventsCompleted[event.id]) return { leveledUp: false, newLevel: null };

      setUserData(prev => ({
          ...prev,
          eventsCompleted: { ...prev.eventsCompleted, [event.id]: true },
          skills: { ...prev.skills, confianca: Math.min(10, prev.skills.confianca + 0.5) }
      }));
      return addXp(event.xp);
  }, [userData, addXp]);

  // New function to handle User Input Custom Events
  const registerCustomEvent = useCallback((title: string, description: string, requestedXp: number) => {
      const today = new Date().toISOString().split('T')[0];
      
      if (userData.lastCustomEventDate === today) {
          return { success: false, message: 'Você já registrou um evento raro hoje.', leveledUp: false, newLevel: null };
      }

      const currentLevelInfo = LEVELS.find(l => l.level === userData.level);
      const xpRequired = currentLevelInfo ? currentLevelInfo.xpRequired : 100;
      const maxAllowedXp = Math.floor(xpRequired * 0.75);
      
      const finalXp = Math.min(requestedXp, maxAllowedXp);

      const newEvent: SpecialEvent = {
          id: `custom-${Date.now()}`,
          title,
          description,
          xp: finalXp,
          type: 'custom',
          date: today,
      };

      setUserData(prev => ({
          ...prev,
          lastCustomEventDate: today,
          eventHistory: [newEvent, ...prev.eventHistory],
          skills: { 
              ...prev.skills, 
              confianca: Math.min(10, prev.skills.confianca + 0.3),
              diccao: Math.min(10, prev.skills.diccao + 0.2), 
          }
      }));

      const xpResult = addXp(finalXp);
      return { success: true, message: `Evento registrado! +${finalXp} XP`, ...xpResult };
  }, [userData, addXp]);

  const completeGame = useCallback((gameId: string, xpReward: number, cooldownHours: number) => {
    const lastPlayed = userData.gameCooldowns[gameId];
    const now = new Date();
    
    if (lastPlayed) {
        const lastDate = new Date(lastPlayed);
        const diffMs = now.getTime() - lastDate.getTime();
        const cooldownMs = cooldownHours * 60 * 60 * 1000;
        
        if (diffMs < cooldownMs) {
            return { success: false, leveledUp: false, newLevel: null };
        }
    }

    setUserData(prev => ({
        ...prev,
        gameCooldowns: { ...prev.gameCooldowns, [gameId]: now.toISOString() },
        skills: { ...prev.skills, diccao: Math.min(10, prev.skills.diccao + 0.05) }
    }));

    const xpResult = addXp(xpReward);
    return { success: true, ...xpResult };
  }, [userData, addXp]);
  
  const addJournalEntry = useCallback((content: string) => {
      setUserData(prev => ({
          ...prev,
          journalEntries: [{ date: new Date().toISOString(), content }, ...prev.journalEntries],
          skills: { ...prev.skills, vocabulario: Math.min(10, prev.skills.vocabulario + 0.05) }
      }))
  }, []);

  const completeDailyChallenge = useCallback((challengeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (userData.completedDailyChallenges[challengeId] === today) {
        return { leveledUp: false, newLevel: null };
    }

    setUserData(prev => ({
        ...prev,
        completedDailyChallenges: {
            ...prev.completedDailyChallenges,
            [challengeId]: today,
        },
    }));
    return addXp(5); 
  }, [userData, addXp]);

  const addCoins = useCallback((amount: number) => {
      setUserData(prev => ({...prev, coins: prev.coins + amount}));
  }, []);

  return { userData, setUserName, completeQuest, completeEvent, registerCustomEvent, completeGame, addJournalEntry, completeDailyChallenge, addCoins };
};

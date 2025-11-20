
import { useState, useEffect, useCallback, useRef } from 'react';
import { UserData, SpecialEvent, QuestType } from '../types';
import { LEVELS, QUESTS, MILESTONES } from '../constants';
import { supabase } from '../services/supabaseClient';

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

export const useUserData = (userId: string) => {
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);
  const [loading, setLoading] = useState(true);
  // Ref to track if initial load has happened to prevent overwriting DB with initial state
  const isLoaded = useRef(false);
  // Ref for debounce timeout
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  // 1. Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('game_data')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
            console.error("Error loading data:", error);
        }

        if (data && data.game_data) {
          // Merge with initial to ensure new schema fields exist if app updates
          setUserData({
              ...INITIAL_USER_DATA,
              ...data.game_data,
              // Ensure nested objects are merged correctly
              skills: { ...INITIAL_USER_DATA.skills, ...(data.game_data.skills || {}) },
          });
        } else {
            // New user or no data, stick with initial and trigger a save
            setUserData(INITIAL_USER_DATA);
        }
      } catch (err) {
          console.error("Unexpected error loading:", err);
      } finally {
        setLoading(false);
        isLoaded.current = true;
      }
    };

    loadData();
  }, [userId]);

  // 2. Save data to Supabase whenever userData changes (Debounced)
  useEffect(() => {
    if (!userId || !isLoaded.current) return;

    // Clear previous timeout
    if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
    }

    // Set new timeout (autosave after 2 seconds of inactivity)
    saveTimeout.current = setTimeout(async () => {
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({ 
                    id: userId, 
                    game_data: userData,
                    updated_at: new Date().toISOString()
                });
            
            if (error) console.error("Error saving data:", error);
            else console.log("Game saved to Supabase");
        } catch (err) {
            console.error("Unexpected error saving:", err);
        }
    }, 2000);

    return () => {
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [userData, userId]);


  const setUserName = useCallback((name: string) => {
      setUserData(prev => ({ ...prev, name }));
  }, []);

  const addXp = useCallback((amount: number): { leveledUp: boolean; newLevel: number | null } => {
    let result = { leveledUp: false, newLevel: null as number | null };
    
    setUserData(prev => {
        let currentXp = prev.xp + amount;
        let currentLevel = prev.level;
        let leveledUp = false;
        let xpForNextLevel = LEVELS.find(l => l.level === currentLevel)?.xpRequired ?? Infinity;

        // Check for level up loop
        while (currentXp >= xpForNextLevel) {
            leveledUp = true;
            currentXp -= xpForNextLevel;
            currentLevel++;
            xpForNextLevel = LEVELS.find(l => l.level === currentLevel)?.xpRequired ?? Infinity;
        }

        const newUnlockedFeatures = [...prev.unlockedFeatures];
        const newMilestonesReached = [...prev.milestonesReached];
        
        if (leveledUp && MILESTONES[currentLevel]) {
            const milestone = MILESTONES[currentLevel];
            if (!newMilestonesReached.includes(currentLevel)) {
                newMilestonesReached.push(currentLevel);
                milestone.unlocks.forEach(feature => {
                    if (!newUnlockedFeatures.includes(feature)) {
                        newUnlockedFeatures.push(feature);
                    }
                });
            }
        }
        
        // We can't return from the setter, so we calculate here. 
        // To extract the result for the caller, strictly we'd need a ref or separate state, 
        // but for this gamification pattern, the caller usually just wants to know if it happened.
        // Note: The return value of addXp won't update immediately because setState is async.
        // This logic needs to return the CALCULATION, while setting the state.
        
        return {
            ...prev,
            xp: currentXp,
            level: currentLevel,
            coins: prev.coins + (leveledUp ? (currentLevel - prev.level) * 25 : 0),
            unlockedFeatures: newUnlockedFeatures,
            milestonesReached: newMilestonesReached,
        };
    });
    
    // Re-calculate purely for return value (State updates are async)
    // This is a slight duplication but necessary for the immediate feedback UI (confetti/modal)
    let currentXp = userData.xp + amount;
    let currentLevel = userData.level;
    let leveledUp = false;
    let xpForNextLevel = LEVELS.find(l => l.level === currentLevel)?.xpRequired ?? Infinity;
    while (currentXp >= xpForNextLevel) {
      leveledUp = true;
      currentXp -= xpForNextLevel;
      currentLevel++;
      xpForNextLevel = LEVELS.find(l => l.level === currentLevel)?.xpRequired ?? Infinity;
    }

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

  return { userData, loading, setUserName, completeQuest, completeEvent, registerCustomEvent, completeGame, addJournalEntry, completeDailyChallenge, addCoins };
};

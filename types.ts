import { ReactNode } from 'react';

export type QuestType = 'Q.F.' | 'Q.I.' | 'Q.R.';
export type View = 'dashboard' | 'quests' | 'journal' | 'events' | 'profile' | 'games';

export interface Quest {
  id: string;
  title: string;
  description: string;
  xp: number;
  type: QuestType;
  level: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xp: number;
}

export interface SpecialEvent {
    id: string;
    title: string;
    description: string;
    xp: number;
    type: 'emergency' | 'networking' | 'meeting' | 'custom';
    date?: string;
}

export interface Level {
  level: number;
  xpRequired: number;
  title: string;
}

export interface AvatarStage {
  level: number;
  icon: ReactNode;
  name: string;
}

export interface AvatarCustomizations {
    backgroundColor: string;
}

export interface MiniGame {
    id: string;
    title: string;
    description: string;
    minLevel: number;
    xpReward: number;
    cooldownHours: number;
    component: React.FC<{ onComplete: () => void; }>;
}

export interface UserSkills {
    diccao: number;
    confianca: number;
    vocabulario: number;
    empatia: number;
}

export interface ShopItem {
    id: string;
    name: string;
    cost: number;
    type: 'background';
    value: string;
}

export interface Milestone {
    level: number;
    title: string;
    rewards: string[];
    unlocks: string[];
    icon?: ReactNode;
}

export interface UserData {
  name: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  skills: UserSkills;
  questsCompleted: Record<string, boolean>;
  eventsCompleted: Record<string, boolean>; 
  lastCustomEventDate: string | null; // ISODateString YYYY-MM-DD
  gameCooldowns: Record<string, string>; // gameId: ISOString
  journalEntries: { date: string; content: string }[];
  completedDailyChallenges: Record<string, string>; // challengeId: ISODateString
  avatarCustomizations: AvatarCustomizations;
  purchasedItems: string[];
  eventHistory: SpecialEvent[];
  unlockedFeatures: string[];
  milestonesReached: number[];
}
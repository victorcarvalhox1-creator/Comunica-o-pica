
import React from 'react';
import { Level, Quest, AvatarStage, DailyChallenge, MiniGame, SpecialEvent, ShopItem, Milestone } from './types';
import { MicIcon, TrophyIcon, MaskIcon, MegaphoneIcon, ParrotIcon, CrownIcon, FireIcon, DiamondIcon, HaloIcon, UserGroupIcon } from './components/icons/Icons';
import { RankedTongueTwisterGame, FreeTongueTwisterGame } from './components/TongueTwisterGame';

export const MILESTONES: Record<number, Milestone> = {
    5: {
        level: 5,
        title: "Comunicador Consistente",
        rewards: ["+10% XP em Quests Q.F.", "Avatar Dourado"],
        unlocks: ["Gravação de Vídeo", "Análise Básica"],
        icon: <MicIcon className="w-12 h-12 text-amber-400" />
    },
    10: {
        level: 10,
        title: "Orador Corajoso",
        rewards: ["Habilidade: Foco de Aço", "Avatar Máscara Prata"],
        unlocks: ["Eventos em Grupo", "Mentorias"],
        icon: <MaskIcon className="w-12 h-12 text-gray-300" />
    },
    15: {
        level: 15,
        title: "Estrategista Vocal",
        rewards: ["+15% XP em Quests Q.I.", "Badge 'Persuasor'"],
        unlocks: ["Mini-jogos Avançados", "Relatórios Detalhados"],
        icon: <MegaphoneIcon className="w-12 h-12 text-blue-400" />
    },
    20: {
        level: 20,
        title: "Comunicador Profissional",
        rewards: ["Avatar Profissional", "Acesso à Comunidade VIP"],
        unlocks: ["Desafios Corporativos", "Networking Premium"],
        icon: <UserGroupIcon className="w-12 h-12 text-purple-400" />
    },
    25: {
        level: 25,
        title: "Mestre das Conexões",
        rewards: ["Habilidade: Socializador", "+20% XP Global"],
        unlocks: ["Eventos ao Vivo", "Sessões de Mentoria"],
        icon: <DiamondIcon className="w-12 h-12 text-cyan-400" />
    },
    30: {
        level: 30,
        title: "Líder Inspirador",
        rewards: ["Avatar Coroa de Líder", "Badge 'Influenciador'"],
        unlocks: ["Workshops Exclusivos", "Modo Liderança"],
        icon: <CrownIcon className="w-12 h-12 text-yellow-500" />
    }
};

export const LEVELS: Level[] = Array.from({ length: 100 }, (_, i) => {
  const levelNum = i + 1;
  // Use milestone title if available, otherwise generic
  const milestone = MILESTONES[levelNum];
  let title = `Iniciante Nv. ${levelNum}`;
  
  if (milestone) title = milestone.title;
  else if (levelNum > 30) title = `Veterano Nv. ${levelNum}`;
  else if (levelNum > 25) title = `Conector Nv. ${levelNum}`;
  else if (levelNum > 20) title = `Profissional Nv. ${levelNum}`;
  else if (levelNum > 15) title = `Estrategista Nv. ${levelNum}`;
  else if (levelNum > 10) title = `Orador Nv. ${levelNum}`;
  else if (levelNum > 5) title = `Praticante Nv. ${levelNum}`;

  return {
      level: levelNum,
      xpRequired: 100 + i * 50,
      title: title,
  };
});

export const AVATAR_STAGES: AvatarStage[] = [
  { level: 1, icon: <MicIcon className="w-16 h-16" />, name: "Microfone Básico" },
  { level: 11, icon: <MaskIcon className="w-16 h-16" />, name: "Máscara de Teatro" },
  { level: 21, icon: <MegaphoneIcon className="w-16 h-16" />, name: "Megafone" },
  { level: 31, icon: <ParrotIcon className="w-16 h-16" />, name: "Papagaio Persuasor" },
  { level: 41, icon: <CrownIcon className="w-16 h-16" />, name: "Coroa de Líder" },
  { level: 51, icon: <div className="relative"><MaskIcon className="w-16 h-16" /><MaskIcon className="w-12 h-12 absolute -top-2 -right-2 opacity-70" /></div>, name: "Máscara Dupla" },
  { level: 61, icon: <FireIcon className="w-16 h-16" />, name: "Chamas da Fala" },
  { level: 71, icon: <DiamondIcon className="w-16 h-16" />, name: "Cristal Vocal" },
  { level: 81, icon: <HaloIcon className="w-16 h-16" />, name: "Auréola de Luz" },
  { level: 91, icon: <TrophyIcon className="w-16 h-16" />, name: "Troféu Dourado" },
];

const rawQuests: Omit<Quest, 'xp'>[] = [
    { id: 'q1-1', level: 1, title: 'Respiração Diafragmática', description: 'Grave um áudio de 1 minuto praticando respiração diafragmática. Foque em expandir o abdômen ao inspirar.', type: 'Q.F.' },
    { id: 'q1-2', level: 1, title: 'Apresentação Rápida', description: 'Grave um vídeo de 30 segundos se apresentando para a câmera como se estivesse em um evento de networking.', type: 'Q.I.' },
    { id: 'q1-3', level: 1, title: 'Diário de Comunicação', description: 'Escreva no diário sobre uma interação social recente. O que foi bom? O que poderia melhorar?', type: 'Q.R.' },
    { id: 'q2-1', level: 2, title: 'Leitura em Voz Alta', description: 'Escolha um parágrafo de um livro e leia em voz alta, focando na clareza e dicção.', type: 'Q.F.' },
    { id: 'q2-2', level: 2, title: 'Elogio Genuíno', description: 'Faça um elogio sincero a um amigo ou colega hoje e anote a reação no diário.', type: 'Q.I.' },
    { id: 'q2-3', level: 2, title: 'Análise de Discurso', description: 'Assista a um TED Talk de 5 minutos e anote 3 técnicas de oratória que você observou.', type: 'Q.R.' },
    { id: 'q3-1', level: 3, title: 'Trava-Línguas', description: 'Grave-se falando o trava-línguas "O rato roeu a roupa do rei de Roma" 3 vezes, cada vez mais rápido.', type: 'Q.F.'},
    { id: 'q3-2', level: 3, title: 'Iniciando Conversa', description: 'Inicie uma conversa com um barista, caixa ou atendente, perguntando algo além do usual.', type: 'Q.I.'},
    { id: 'q3-3', level: 3, title: 'Definindo Metas', description: 'Escreva no diário qual é seu maior objetivo de comunicação e um pequeno passo para alcançá-lo esta semana.', type: 'Q.R.'}
];

export const QUESTS: Quest[] = rawQuests.map(quest => {
    const levelInfo = LEVELS.find(l => l.level === quest.level);
    const questsInLevel = rawQuests.filter(q => q.level === quest.level);
    const totalXpForLevel = Math.floor((levelInfo?.xpRequired || 100) * 0.7);
    const xpPerQuest = Math.floor(totalXpForLevel / questsInLevel.length);
    const remainder = totalXpForLevel % questsInLevel.length;
    const questIndex = questsInLevel.findIndex(q => q.id === quest.id);
    const finalXp = xpPerQuest + (questIndex < remainder ? 1 : 0);
    return { ...quest, xp: finalXp };
});

export const DAILY_CHALLENGES: DailyChallenge[] = [
    {
        id: 'daily-read',
        title: 'Leitura em Voz Alta',
        description: 'Leia 2 páginas de um livro em voz alta com ênfase.',
        xp: 5,
    },
    {
        id: 'daily-pen',
        title: 'Caneta na Boca',
        description: 'Fale por 2 min com uma caneta entre os dentes.',
        xp: 4,
    },
    {
        id: 'daily-breath',
        title: 'Respiração Diafragmática',
        description: '5 minutos de respiração focada no abdômen.',
        xp: 3,
    },
    {
        id: 'daily-rewrite',
        title: 'Reescrever Parágrafo',
        description: 'Reescreva um texto complexo de forma simples.',
        xp: 5,
    },
    {
        id: 'daily-ted',
        title: 'Bônus: Analisar TED Talk',
        description: 'Assista e identifique uma técnica usada.',
        xp: 3,
    },
    {
        id: 'daily-friend',
        title: 'Bônus: Áudio para Amigo',
        description: 'Envie um áudio claro e estruturado para alguém.',
        xp: 5,
    },
];

export const SPECIAL_EVENTS: SpecialEvent[] = [
    // Kept for reference or legacy support if needed, but the UI will focus on Custom events.
    {
        id: 'evt-meeting',
        title: 'Reunião Inesperada',
        description: 'Seu chefe te chamou para opinar sobre o novo projeto de surpresa na frente de todos!',
        xp: 150,
        type: 'meeting',
    },
    {
        id: 'evt-presentation',
        title: 'Apresentação de Emergência',
        description: 'O palestrante principal faltou e você precisa cobrir 15 minutos do evento agora!',
        xp: 200,
        type: 'emergency',
    },
    {
        id: 'evt-networking',
        title: 'Sessão de Networking',
        description: 'Você tem 1 hora para conseguir 3 contatos valiosos em um evento da indústria.',
        xp: 180,
        type: 'networking',
    }
];

export const MINI_GAMES: MiniGame[] = [
    {
        id: 'game-ranked',
        title: 'Desafio de Elite (XP)',
        description: '3 trava-línguas difíceis aleatórios para testar seus limites. Disponível a cada 5 horas.',
        minLevel: 1,
        xpReward: 4,
        cooldownHours: 5,
        component: RankedTongueTwisterGame,
    },
    {
        id: 'game-free',
        title: 'Treino Livre',
        description: 'Pratique sem limites e sem pressão. Ótimo para aquecer a voz antes de eventos.',
        minLevel: 1,
        xpReward: 0,
        cooldownHours: 0,
        component: FreeTongueTwisterGame,
    },
];

export const SHOP_ITEMS: ShopItem[] = [
    { id: 'bg-default', name: 'Padrão Noturno', cost: 0, type: 'background', value: '#0f172a' },
    { id: 'bg-royal', name: 'Roxo Real', cost: 100, type: 'background', value: '#581c87' },
    { id: 'bg-forest', name: 'Verde Floresta', cost: 150, type: 'background', value: '#14532d' },
    { id: 'bg-ocean', name: 'Azul Oceano', cost: 200, type: 'background', value: '#1e3a8a' },
    { id: 'bg-sunset', name: 'Pôr do Sol', cost: 300, type: 'background', value: '#9a3412' },
    { id: 'bg-gold', name: 'Luxo Dourado', cost: 500, type: 'background', value: '#854d0e' },
];

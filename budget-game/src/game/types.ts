// ============================================
// CORE GAME STATE TYPES (existing)
// ============================================

export interface GameState {
  phase: 'setup' | 'allocation' | 'playing' | 'ended';
  week: number;
  cash: number;
  savings: number;
  happiness: number;
  stress: number;
  income: number;
  fixedExpenses: {
    housing: number;
    basicFood: number;
  };
  funBudget: number;
  funBudgetZeroWeeks: number;
  currentEvent: GameEvent | null;
  eventResolved: boolean;
  selectedChoice: number | null;
  log: LogEntry[];
  seed: number;
  rngState: number;
  endResult: EndResult | null;
  cashWentNegative: boolean;
}

export interface LogEntry {
  week: number;
  text: string;
  type: 'info' | 'expense' | 'income' | 'warning' | 'success';
}

export interface EventChoice {
  label: string;
  needOrWant: 'need' | 'want' | 'neutral';
  cashDelta: number;
  savingsDelta: number;
  happinessDelta: number;
  stressDelta: number;
  outcomeText: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'expense' | 'opportunity' | 'social' | 'emergency' | 'bonus';
  choices?: EventChoice[];
  defaultEffect?: {
    cashDelta: number;
    savingsDelta: number;
    happinessDelta: number;
    stressDelta: number;
    outcomeText: string;
  };
}

export type OutcomeTier = 'stable-planner' | 'fun-focused' | 'over-saver' | 'struggled' | 'burnout';

export interface EndResult {
  tier: OutcomeTier;
  title: string;
  description: string;
  tips: string[];
  finalStats: {
    cash: number;
    savings: number;
    happiness: number;
    stress: number;
  };
}

export type GameAction =
  | { type: 'START_GAME'; seed: number }
  | { type: 'SET_ALLOCATION'; savings: number; funBudget: number }
  | { type: 'RESOLVE_EVENT'; choiceIndex?: number }
  | { type: 'NEXT_WEEK' }
  | { type: 'RESET_GAME' };

// ============================================
// QUEST SYSTEM TYPES (new)
// ============================================

export interface QuestChoice {
  id: string;
  label: string;
  needOrWant: 'need' | 'want' | 'neutral';
  effects: {
    cashDelta: number;
    savingsDelta: number;
    happinessDelta: number;
    stressDelta: number;
  };
  outcomeText: string;
  nextStepId?: string; // Optional branching
}

export interface QuestStep {
  id: string;
  type: 'dialogue' | 'choice' | 'event' | 'info' | 'result';
  speaker?: string; // NPC name or "narrator"
  text: string;
  choices?: QuestChoice[];
  effects?: {
    cashDelta: number;
    savingsDelta: number;
    happinessDelta: number;
    stressDelta: number;
  };
  nextStepId?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  npcName: string;
  npcEmoji: string;
  location: string;
  estimatedMinutes: number;
  xpReward: number;
  bonusXpCondition?: string; // Description of how to earn bonus
  bonusXp?: number;
  badgeReward?: BadgeId;
  steps: QuestStep[];
  requiredQuestId?: string; // Must complete this quest first
}

export type BadgeId = 'first-budget' | 'emergency-ready' | 'goal-setter' | 'helper' | 'balanced';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  emoji: string;
}

// ============================================
// PLAYER PROFILE & PROGRESSION TYPES (new)
// ============================================

export interface PlayerProfile {
  name: string;
  seed: number;
  rngState: number;
  
  // Financial stats (persistent across quests)
  cash: number;
  savings: number;
  happiness: number;
  stress: number;
  
  // Progression
  xp: number;
  level: number;
  badges: BadgeId[];
  
  // Chapter tracking
  currentChapter: number;
  completedQuestIds: string[];
  currentQuestId: string | null;
  
  // Quest state
  currentStepIndex: number;
  questChoicesMade: Record<string, string>; // stepId -> choiceId
  questLog: QuestLogEntry[];
  
  // Stats tracking for badges/tiers
  totalEarned: number;
  totalSpent: number;
  totalSaved: number;
  emergenciesHandled: number;
  wantsResisted: number;
  
  // Meta
  createdAt: number;
  lastPlayedAt: number;
}

export interface QuestLogEntry {
  questId: string;
  stepId: string;
  text: string;
  type: 'dialogue' | 'choice' | 'effect' | 'reward';
  timestamp: number;
}

export interface QuestResult {
  questId: string;
  questTitle: string;
  completed: boolean;
  xpEarned: number;
  bonusXpEarned: number;
  badgeEarned: BadgeId | null;
  statsChanged: {
    cashDelta: number;
    savingsDelta: number;
    happinessDelta: number;
    stressDelta: number;
  };
  choicesSummary: string[];
}

// ============================================
// ADVENTURE STATE (new meta-game state)
// ============================================

export type AdventureScreen = 
  | 'title'
  | 'name-entry'
  | 'map'
  | 'quest'
  | 'quest-result'
  | 'chapter-end';

export interface AdventureState {
  screen: AdventureScreen;
  player: PlayerProfile | null;
  currentQuest: Quest | null;
  questResult: QuestResult | null;
  isLoading: boolean;
}

export type AdventureAction =
  | { type: 'START_NEW_GAME'; playerName: string; seed: number }
  | { type: 'LOAD_GAME'; profile: PlayerProfile }
  | { type: 'START_QUEST'; questId: string }
  | { type: 'ADVANCE_STEP' }
  | { type: 'MAKE_CHOICE'; choiceId: string }
  | { type: 'COMPLETE_QUEST' }
  | { type: 'RETURN_TO_MAP' }
  | { type: 'FINISH_CHAPTER' }
  | { type: 'RESET_GAME' };

// ============================================
// LEVEL THRESHOLDS
// ============================================

export const LEVEL_THRESHOLDS = [
  { level: 1, xpRequired: 0 },
  { level: 2, xpRequired: 100 },
  { level: 3, xpRequired: 250 },
  { level: 4, xpRequired: 450 },
  { level: 5, xpRequired: 700 },
];

// ============================================
// BADGE DEFINITIONS
// ============================================

export const BADGES: Record<BadgeId, Badge> = {
  'first-budget': {
    id: 'first-budget',
    name: 'First Budget',
    description: 'Made your first money decision',
    emoji: '📝'
  },
  'emergency-ready': {
    id: 'emergency-ready',
    name: 'Emergency Ready',
    description: 'Handled an unexpected expense without going negative',
    emoji: '🛡️'
  },
  'goal-setter': {
    id: 'goal-setter',
    name: 'Goal Setter',
    description: 'Started saving toward a personal goal',
    emoji: '🎯'
  },
  'helper': {
    id: 'helper',
    name: 'Community Helper',
    description: 'Helped a neighbor and earned money',
    emoji: '🤝'
  },
  'balanced': {
    id: 'balanced',
    name: 'Balanced Life',
    description: 'Completed Chapter 1 with happiness ≥60 and stress ≤50',
    emoji: '⚖️'
  }
};

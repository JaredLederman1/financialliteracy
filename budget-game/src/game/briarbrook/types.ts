// ============================================
// BRIARBROOK CONTRACT SYSTEM TYPES
// ============================================

// Contract categories
export type ContractCategory = 'earning' | 'budgeting' | 'saving' | 'credit' | 'planning';

// Difficulty levels
export type ContractDifficulty = 1 | 2 | 3;

// Step types
export type ContractStepType = 'info' | 'choice' | 'event' | 'result';

// Choice effects
export interface StepEffects {
  goldDelta?: number;
  savingsDelta?: number;
  happinessDelta?: number;
  stressDelta?: number;
  masteryDelta?: number;
}

// Choice option
export interface ContractChoice {
  id: string;
  label: string;
  effects: StepEffects;
  outcomeText: string;
  isCorrect?: boolean; // For reflection questions
}

// Contract step
export interface ContractStep {
  id: string;
  type: ContractStepType;
  speaker?: string;
  text: string;
  choices?: ContractChoice[];
  effects?: StepEffects;
}

// Briefing screen content
export interface BriefingScreen {
  title: string;
  text: string;
  icon?: string;
}

// Reflection question
export interface ReflectionQuestion {
  question: string;
  choices: ContractChoice[];
  explanation: string;
}

// Contract rewards
export interface ContractRewards {
  goldDelta: number;
  xpDelta: number;
  masteryDelta: number;
}

// Full contract definition
export interface Contract {
  id: string;
  title: string;
  description: string;
  npcName: string;
  npcEmoji: string;
  category: ContractCategory;
  difficulty: ContractDifficulty;
  briefing: BriefingScreen[];
  steps: ContractStep[];
  reflection: ReflectionQuestion;
  rewards: ContractRewards;
  estimatedMinutes?: number;
}

// Building/Location definition
export interface BriarbrookBuilding {
  id: string;
  name: string;
  npcName: string;
  npcEmoji: string;
  category: ContractCategory;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
  icon: string;
}

// Player state for Briarbrook
export interface BriarbrookPlayer {
  name: string;
  seed: number;
  
  // Financial stats
  gold: number;
  savings: number;
  happiness: number;
  stress: number;
  
  // Progression
  xp: number;
  level: number;
  
  // Mastery per category (0-100)
  mastery: Record<ContractCategory, number>;
  
  // Contract tracking
  completedContractIds: string[];
  
  // Long-term goal (from plan_big_quest)
  longTermGoal: string | null;
  
  // Current contract state
  currentContractId: string | null;
  currentStepIndex: number;
  currentBriefingIndex: number;
  contractChoicesMade: Record<string, string>;
  
  // Accumulated effects during contract
  contractEffects: StepEffects;
  
  // Meta
  createdAt: number;
  lastPlayedAt: number;
}

// App screen state
export type BriarbrookScreen = 
  | 'title'
  | 'town'
  | 'contract-menu'
  | 'briefing'
  | 'contract'
  | 'reflection'
  | 'results';

// Contract result
export interface ContractResult {
  contractId: string;
  contractTitle: string;
  completed: boolean;
  xpEarned: number;
  goldEarned: number;
  masteryEarned: number;
  reflectionCorrect: boolean;
  statsChanged: StepEffects;
}

// Full app state
export interface BriarbrookState {
  screen: BriarbrookScreen;
  player: BriarbrookPlayer | null;
  selectedBuildingId: string | null;
  currentContract: Contract | null;
  contractResult: ContractResult | null;
  isMovementPaused: boolean;
}

// Actions
export type BriarbrookAction =
  | { type: 'START_NEW_GAME'; playerName: string; seed: number }
  | { type: 'LOAD_GAME'; player: BriarbrookPlayer }
  | { type: 'OPEN_BUILDING'; buildingId: string }
  | { type: 'CLOSE_MENU' }
  | { type: 'START_CONTRACT'; contractId: string }
  | { type: 'ADVANCE_BRIEFING' }
  | { type: 'START_CONTRACT_STEPS' }
  | { type: 'ADVANCE_STEP' }
  | { type: 'MAKE_CHOICE'; choiceId: string }
  | { type: 'SUBMIT_REFLECTION'; choiceId: string }
  | { type: 'COMPLETE_CONTRACT' }
  | { type: 'RETURN_TO_TOWN' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_LONG_TERM_GOAL'; goal: string };

// ============================================
// CONSTANTS
// ============================================

export const CATEGORY_NAMES: Record<ContractCategory, string> = {
  earning: 'Earning',
  budgeting: 'Budgeting & Spending',
  saving: 'Saving & Banking',
  credit: 'Borrowing & Credit',
  planning: 'Long-Term Planning'
};

export const CATEGORY_COLORS: Record<ContractCategory, string> = {
  earning: 'emerald',
  budgeting: 'amber',
  saving: 'sky',
  credit: 'rose',
  planning: 'violet'
};

export const DIFFICULTY_LABELS: Record<ContractDifficulty, string> = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Capstone'
};

// ============================================
// LEVEL THRESHOLDS
// ============================================

export const LEVEL_THRESHOLDS = [
  { level: 1, xpRequired: 0 },
  { level: 2, xpRequired: 100 },
  { level: 3, xpRequired: 250 },
  { level: 4, xpRequired: 450 },
  { level: 5, xpRequired: 700 },
  { level: 6, xpRequired: 1000 },
  { level: 7, xpRequired: 1400 },
  { level: 8, xpRequired: 1900 },
  { level: 9, xpRequired: 2500 },
  { level: 10, xpRequired: 3200 },
];


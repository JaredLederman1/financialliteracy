import type { BriarbrookPlayer, ContractCategory } from './types';

const STORAGE_KEY = 'briarbrook-game';

// Create a new player
export function createNewPlayer(name: string, seed: number): BriarbrookPlayer {
  return {
    name,
    seed,
    
    // Starting financial stats
    gold: 25,
    savings: 0,
    happiness: 70,
    stress: 20,
    
    // Progression
    xp: 0,
    level: 1,
    
    // Mastery per category
    mastery: {
      earning: 0,
      budgeting: 0,
      saving: 0,
      credit: 0,
      planning: 0,
    },
    
    // Contract tracking
    completedContractIds: [],
    
    // Long-term goal
    longTermGoal: null,
    
    // Current contract state
    currentContractId: null,
    currentStepIndex: 0,
    currentBriefingIndex: 0,
    contractChoicesMade: {},
    contractEffects: {},
    
    // Meta
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
  };
}

// Save player to localStorage
export function savePlayer(player: BriarbrookPlayer): void {
  try {
    const data = JSON.stringify(player);
    localStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error('Failed to save game:', error);
  }
}

// Load player from localStorage
export function loadPlayer(): BriarbrookPlayer | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const player = JSON.parse(data) as BriarbrookPlayer;
    // Validate basic structure
    if (!player.name || typeof player.xp !== 'number') {
      return null;
    }
    
    return player;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

// Check if saved game exists
export function hasSavedGame(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

// Delete saved game
export function deleteSavedGame(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Calculate level from XP
export function calculateLevel(xp: number): number {
  if (xp >= 3200) return 10;
  if (xp >= 2500) return 9;
  if (xp >= 1900) return 8;
  if (xp >= 1400) return 7;
  if (xp >= 1000) return 6;
  if (xp >= 700) return 5;
  if (xp >= 450) return 4;
  if (xp >= 250) return 3;
  if (xp >= 100) return 2;
  return 1;
}

// Get XP progress info
export function getXpProgress(xp: number): {
  currentLevel: number;
  xpNeeded: number;
  progressPercent: number;
} {
  const thresholds = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200];
  const currentLevel = calculateLevel(xp);
  
  if (currentLevel >= 10) {
    return { currentLevel, xpNeeded: 0, progressPercent: 100 };
  }
  
  const currentThreshold = thresholds[currentLevel - 1];
  const nextThreshold = thresholds[currentLevel];
  const xpInLevel = xp - currentThreshold;
  const xpForLevel = nextThreshold - currentThreshold;
  
  return {
    currentLevel,
    xpNeeded: nextThreshold - xp,
    progressPercent: Math.round((xpInLevel / xpForLevel) * 100),
  };
}

// Update mastery for a category
export function addMastery(
  player: BriarbrookPlayer,
  category: ContractCategory,
  amount: number
): BriarbrookPlayer {
  const newMastery = { ...player.mastery };
  newMastery[category] = Math.min(100, newMastery[category] + amount);
  return { ...player, mastery: newMastery };
}

// Apply stat effects
export function applyEffects(
  player: BriarbrookPlayer,
  effects: {
    goldDelta?: number;
    savingsDelta?: number;
    happinessDelta?: number;
    stressDelta?: number;
    masteryDelta?: number;
  },
  category?: ContractCategory
): BriarbrookPlayer {
  let updated = { ...player };
  
  if (effects.goldDelta) {
    updated.gold = Math.max(0, updated.gold + effects.goldDelta);
  }
  if (effects.savingsDelta) {
    updated.savings = Math.max(0, updated.savings + effects.savingsDelta);
  }
  if (effects.happinessDelta) {
    updated.happiness = Math.max(0, Math.min(100, updated.happiness + effects.happinessDelta));
  }
  if (effects.stressDelta) {
    updated.stress = Math.max(0, Math.min(100, updated.stress + effects.stressDelta));
  }
  if (effects.masteryDelta && category) {
    updated = addMastery(updated, category, effects.masteryDelta);
  }
  
  return updated;
}


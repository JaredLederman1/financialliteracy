import type { PlayerProfile } from './types';

const STORAGE_KEY = 'maplewood-budget-game';

// Save player profile to localStorage
export function savePlayerProfile(profile: PlayerProfile): void {
  try {
    const data = JSON.stringify(profile);
    localStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error('Failed to save game:', error);
  }
}

// Load player profile from localStorage
export function loadPlayerProfile(): PlayerProfile | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const profile = JSON.parse(data) as PlayerProfile;
    // Validate basic structure
    if (!profile.name || typeof profile.xp !== 'number') {
      return null;
    }
    
    return profile;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

// Check if a saved game exists
export function hasSavedGame(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

// Delete saved game
export function deleteSavedGame(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Create a new player profile
export function createNewPlayerProfile(name: string, seed: number): PlayerProfile {
  return {
    name,
    seed,
    rngState: seed,
    
    // Starting financial stats
    cash: 0, // Will be set by first quest
    savings: 0,
    happiness: 70,
    stress: 20,
    
    // Progression
    xp: 0,
    level: 1,
    badges: [],
    
    // Chapter tracking
    currentChapter: 1,
    completedQuestIds: [],
    currentQuestId: null,
    
    // Quest state
    currentStepIndex: 0,
    questChoicesMade: {},
    questLog: [],
    
    // Stats tracking
    totalEarned: 0,
    totalSpent: 0,
    totalSaved: 0,
    emergenciesHandled: 0,
    wantsResisted: 0,
    
    // Meta
    createdAt: Date.now(),
    lastPlayedAt: Date.now()
  };
}

// Update last played timestamp
export function updateLastPlayed(profile: PlayerProfile): PlayerProfile {
  return {
    ...profile,
    lastPlayedAt: Date.now()
  };
}


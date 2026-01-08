// ============================================
// ONBOARDING TYPES
// ============================================

// NOTE: This is an MVP prototype. In production, passwords should be
// hashed and stored securely on a backend server, not in localStorage.

export interface Account {
  firstName: string;
  lastName?: string;
  email: string;
  password: string; // MVP only - DO NOT use in production without proper security
  createdAt: number;
}

export interface Avatar {
  hairstyleId: string;
  hairColor: string;
  eyeColor: string;
  skinColor: string;
}

export interface OnboardingProfile {
  worldId: string;
  grade: number;
  avatar: Avatar;
  completedAt: number;
}

export type OnboardingStep = 'account' | 'world' | 'grade' | 'avatar' | 'done';

export interface OnboardingState {
  step: OnboardingStep;
  account: Partial<Account>;
  profile: Partial<OnboardingProfile>;
  errors: Record<string, string>;
}

export type OnboardingAction =
  | { type: 'SET_ACCOUNT_FIELD'; field: keyof Account; value: string }
  | { type: 'SUBMIT_ACCOUNT' }
  | { type: 'SELECT_WORLD'; worldId: string }
  | { type: 'SELECT_GRADE'; grade: number }
  | { type: 'UPDATE_AVATAR'; avatar: Partial<Avatar> }
  | { type: 'FINISH_ONBOARDING' }
  | { type: 'SET_ERROR'; field: string; message: string }
  | { type: 'CLEAR_ERROR'; field: string }
  | { type: 'GO_BACK' }
  | { type: 'RESET' };

// ============================================
// AVATAR OPTIONS DATA
// ============================================

export interface HairstyleOption {
  id: string;
  name: string;
}

export const HAIRSTYLES: HairstyleOption[] = [
  { id: 'short', name: 'Short' },
  { id: 'medium', name: 'Medium' },
  { id: 'long', name: 'Long' },
  { id: 'curly', name: 'Curly' },
];

export const HAIR_COLORS: string[] = [
  '#1C1C1C', // Black
  '#3D2314', // Dark Brown
  '#5C4033', // Brown
  '#8B4513', // Auburn/Light Brown
  '#B55239', // Red/Ginger
  '#C4A77D', // Dirty Blonde
  '#E8D5B7', // Blonde
];

export const EYE_COLORS: string[] = [
  '#2E1A0F', // Dark Brown
  '#634E34', // Brown
  '#8B7355', // Light Brown/Hazel
  '#4A7C59', // Green
  '#6B8E6B', // Light Green
  '#4682B4', // Blue
  '#87CEEB', // Light Blue
];

export const SKIN_COLORS: string[] = [
  '#FFDFC4', // Light
  '#F0C8A0', // Fair
  '#DEB887', // Medium Light
  '#C68642', // Medium
  '#8D5524', // Tan
  '#5C3A21', // Dark
];

// ============================================
// WORLD OPTIONS
// ============================================

export interface WorldOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

export const WORLDS: WorldOption[] = [
  {
    id: 'money',
    name: 'Money World',
    description: 'Learn to budget, save, and make smart money choices!',
    icon: '💰',
    available: true,
  },
];

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULT_AVATAR: Avatar = {
  hairstyleId: 'medium',
  hairColor: '#5C4033',
  eyeColor: '#634E34',
  skinColor: '#F0C8A0',
};

export const createInitialOnboardingState = (): OnboardingState => ({
  step: 'account',
  account: {},
  profile: {
    avatar: { ...DEFAULT_AVATAR },
  },
  errors: {},
});


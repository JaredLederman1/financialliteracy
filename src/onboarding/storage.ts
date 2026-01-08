import type { Account, OnboardingProfile } from './types';

// Storage keys
const ACCOUNT_KEY = 'aat_account';
const PROFILE_KEY = 'aat_profile';

// ============================================
// ACCOUNT STORAGE
// ============================================

/**
 * Save account to localStorage
 * NOTE: MVP only - passwords should never be stored in localStorage in production
 */
export function saveAccount(account: Account): void {
  try {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  } catch (error) {
    console.error('Failed to save account:', error);
  }
}

/**
 * Load account from localStorage
 */
export function loadAccount(): Account | null {
  try {
    const data = localStorage.getItem(ACCOUNT_KEY);
    if (!data) return null;
    return JSON.parse(data) as Account;
  } catch (error) {
    console.error('Failed to load account:', error);
    return null;
  }
}

/**
 * Check if account exists
 */
export function hasAccount(): boolean {
  return localStorage.getItem(ACCOUNT_KEY) !== null;
}

// ============================================
// ONBOARDING PROFILE STORAGE
// ============================================

/**
 * Save onboarding profile to localStorage
 */
export function saveOnboardingProfile(profile: OnboardingProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save profile:', error);
  }
}

/**
 * Load onboarding profile from localStorage
 */
export function loadOnboardingProfile(): OnboardingProfile | null {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (!data) return null;
    return JSON.parse(data) as OnboardingProfile;
  } catch (error) {
    console.error('Failed to load profile:', error);
    return null;
  }
}

/**
 * Check if onboarding is complete (both account and profile exist)
 */
export function isOnboardingComplete(): boolean {
  return hasAccount() && localStorage.getItem(PROFILE_KEY) !== null;
}

// ============================================
// RESET FUNCTIONS
// ============================================

/**
 * Clear all onboarding data (account + profile)
 */
export function clearOnboardingData(): void {
  localStorage.removeItem(ACCOUNT_KEY);
  localStorage.removeItem(PROFILE_KEY);
}

/**
 * Clear all app data (onboarding + game progress)
 */
export function clearAllData(): void {
  clearOnboardingData();
  localStorage.removeItem('maplewood-budget-game');
}


import type { OnboardingState, OnboardingAction, Account, OnboardingProfile } from './types';
import { createInitialOnboardingState, DEFAULT_AVATAR } from './types';
import { saveAccount, saveOnboardingProfile } from './storage';

// ============================================
// VALIDATION HELPERS
// ============================================

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

// ============================================
// REDUCER
// ============================================

export function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState {
  switch (action.type) {
    case 'SET_ACCOUNT_FIELD': {
      return {
        ...state,
        account: {
          ...state.account,
          [action.field]: action.value,
        },
        errors: {
          ...state.errors,
          [action.field]: '', // Clear error when user types
        },
      };
    }

    case 'SUBMIT_ACCOUNT': {
      const errors: Record<string, string> = {};

      // Validate first name
      if (!state.account.firstName?.trim()) {
        errors.firstName = 'First name is required';
      }

      // Validate email
      if (!state.account.email?.trim()) {
        errors.email = 'Email is required';
      } else if (!isValidEmail(state.account.email)) {
        errors.email = 'Please enter a valid email';
      }

      // Validate password
      if (!state.account.password) {
        errors.password = 'Password is required';
      } else if (!isValidPassword(state.account.password)) {
        errors.password = 'Password must be at least 8 characters';
      }

      if (Object.keys(errors).length > 0) {
        return { ...state, errors };
      }

      // Save account and move to next step
      const account: Account = {
        firstName: state.account.firstName!,
        lastName: state.account.lastName,
        email: state.account.email!,
        password: state.account.password!,
        createdAt: Date.now(),
      };
      saveAccount(account);

      // Skip world selection (only Money World exists) and go straight to grade
      return {
        ...state,
        account,
        profile: {
          ...state.profile,
          worldId: 'money', // Auto-select Money World
        },
        step: 'grade',
        errors: {},
      };
    }

    case 'SELECT_WORLD': {
      return {
        ...state,
        profile: {
          ...state.profile,
          worldId: action.worldId,
        },
        step: 'grade',
      };
    }

    case 'SELECT_GRADE': {
      return {
        ...state,
        profile: {
          ...state.profile,
          grade: action.grade,
        },
        step: 'avatar',
      };
    }

    case 'UPDATE_AVATAR': {
      return {
        ...state,
        profile: {
          ...state.profile,
          avatar: {
            ...DEFAULT_AVATAR,
            ...state.profile.avatar,
            ...action.avatar,
          },
        },
      };
    }

    case 'FINISH_ONBOARDING': {
      // Ensure all required fields are present
      const profile: OnboardingProfile = {
        worldId: state.profile.worldId || 'money',
        grade: state.profile.grade || 6,
        avatar: {
          ...DEFAULT_AVATAR,
          ...state.profile.avatar,
        },
        completedAt: Date.now(),
      };
      saveOnboardingProfile(profile);

      return {
        ...state,
        profile,
        step: 'done',
      };
    }

    case 'GO_BACK': {
      // Skip world selection since only Money World exists
      const stepOrder: OnboardingState['step'][] = ['account', 'grade', 'avatar'];
      const currentIndex = stepOrder.indexOf(state.step);
      if (currentIndex > 0) {
        return {
          ...state,
          step: stepOrder[currentIndex - 1],
        };
      }
      return state;
    }

    case 'SET_ERROR': {
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.message,
        },
      };
    }

    case 'CLEAR_ERROR': {
      const newErrors = { ...state.errors };
      delete newErrors[action.field];
      return {
        ...state,
        errors: newErrors,
      };
    }

    case 'RESET': {
      return createInitialOnboardingState();
    }

    default:
      return state;
  }
}

export { createInitialOnboardingState };


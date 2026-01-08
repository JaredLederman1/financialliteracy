import { useReducer } from 'react';
import { AnimatePresence } from 'framer-motion';
import { onboardingReducer, createInitialOnboardingState } from './reducer';
import {
  CreateAccountScreen,
  ChooseGradeScreen,
  AvatarDesignerScreen,
} from './components';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [state, dispatch] = useReducer(onboardingReducer, createInitialOnboardingState());

  // When step becomes 'done', notify parent
  if (state.step === 'done') {
    // Use a microtask to avoid updating parent during render
    queueMicrotask(onComplete);
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {state.step === 'account' && (
        <CreateAccountScreen key="account" state={state} dispatch={dispatch} />
      )}
      {state.step === 'grade' && (
        <ChooseGradeScreen key="grade" state={state} dispatch={dispatch} />
      )}
      {state.step === 'avatar' && (
        <AvatarDesignerScreen key="avatar" state={state} dispatch={dispatch} />
      )}
    </AnimatePresence>
  );
}


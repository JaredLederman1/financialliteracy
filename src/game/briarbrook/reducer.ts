import type {
  BriarbrookState,
  BriarbrookAction,
  BriarbrookPlayer,
  ContractResult,
  StepEffects,
} from './types';
import { getContractById } from './contracts';
import { createNewPlayer, savePlayer, calculateLevel, applyEffects, addMastery } from './storage';

// Initial state
export function createInitialState(): BriarbrookState {
  return {
    screen: 'title',
    player: null,
    selectedBuildingId: null,
    currentContract: null,
    contractResult: null,
    isMovementPaused: false,
  };
}

// Main reducer
export function briarbrookReducer(
  state: BriarbrookState,
  action: BriarbrookAction
): BriarbrookState {
  switch (action.type) {
    case 'START_NEW_GAME': {
      const player = createNewPlayer(action.playerName, action.seed);
      savePlayer(player);
      return {
        ...state,
        screen: 'town',
        player,
        selectedBuildingId: null,
        currentContract: null,
        contractResult: null,
        isMovementPaused: false,
      };
    }

    case 'LOAD_GAME': {
      return {
        ...state,
        screen: 'town',
        player: action.player,
        selectedBuildingId: null,
        currentContract: null,
        contractResult: null,
        isMovementPaused: false,
      };
    }

    case 'OPEN_BUILDING': {
      return {
        ...state,
        screen: 'contract-menu',
        selectedBuildingId: action.buildingId,
        isMovementPaused: true,
      };
    }

    case 'CLOSE_MENU': {
      return {
        ...state,
        screen: 'town',
        selectedBuildingId: null,
        isMovementPaused: false,
      };
    }

    case 'START_CONTRACT': {
      if (!state.player) return state;

      const contract = getContractById(action.contractId);
      if (!contract) return state;

      const updatedPlayer: BriarbrookPlayer = {
        ...state.player,
        currentContractId: contract.id,
        currentStepIndex: 0,
        currentBriefingIndex: 0,
        contractChoicesMade: {},
        contractEffects: {},
        lastPlayedAt: Date.now(),
      };

      savePlayer(updatedPlayer);

      return {
        ...state,
        screen: 'briefing',
        player: updatedPlayer,
        currentContract: contract,
        isMovementPaused: true,
      };
    }

    case 'ADVANCE_BRIEFING': {
      if (!state.player || !state.currentContract) return state;

      const nextBriefingIndex = state.player.currentBriefingIndex + 1;

      // If we've seen all briefing screens, start the contract steps
      if (nextBriefingIndex >= state.currentContract.briefing.length) {
        const updatedPlayer = {
          ...state.player,
          currentBriefingIndex: 0,
          currentStepIndex: 0,
        };
        savePlayer(updatedPlayer);

        return {
          ...state,
          screen: 'contract',
          player: updatedPlayer,
        };
      }

      const updatedPlayer = {
        ...state.player,
        currentBriefingIndex: nextBriefingIndex,
      };
      savePlayer(updatedPlayer);

      return {
        ...state,
        player: updatedPlayer,
      };
    }

    case 'START_CONTRACT_STEPS': {
      if (!state.player) return state;

      const updatedPlayer = {
        ...state.player,
        currentStepIndex: 0,
      };
      savePlayer(updatedPlayer);

      return {
        ...state,
        screen: 'contract',
        player: updatedPlayer,
      };
    }

    case 'ADVANCE_STEP': {
      if (!state.player || !state.currentContract) return state;

      const currentStep = state.currentContract.steps[state.player.currentStepIndex];
      let updatedPlayer = { ...state.player };

      // Apply effects from non-choice steps
      if (currentStep.effects && currentStep.type !== 'choice') {
        updatedPlayer = applyEffects(
          updatedPlayer,
          currentStep.effects,
          state.currentContract.category
        );
        // Accumulate effects for results
        updatedPlayer.contractEffects = accumulateEffects(
          updatedPlayer.contractEffects,
          currentStep.effects
        );
      }

      const nextStepIndex = state.player.currentStepIndex + 1;

      // If we've completed all steps, go to reflection
      if (nextStepIndex >= state.currentContract.steps.length) {
        savePlayer(updatedPlayer);
        return {
          ...state,
          screen: 'reflection',
          player: updatedPlayer,
        };
      }

      updatedPlayer.currentStepIndex = nextStepIndex;
      savePlayer(updatedPlayer);

      return {
        ...state,
        player: updatedPlayer,
      };
    }

    case 'MAKE_CHOICE': {
      if (!state.player || !state.currentContract) return state;

      const currentStep = state.currentContract.steps[state.player.currentStepIndex];
      if (currentStep.type !== 'choice' || !currentStep.choices) return state;

      const choice = currentStep.choices.find(c => c.id === action.choiceId);
      if (!choice) return state;

      // Apply choice effects
      let updatedPlayer = applyEffects(
        state.player,
        choice.effects,
        state.currentContract.category
      );

      // Track the choice
      updatedPlayer.contractChoicesMade = {
        ...updatedPlayer.contractChoicesMade,
        [currentStep.id]: choice.id,
      };

      // Accumulate effects for results
      updatedPlayer.contractEffects = accumulateEffects(
        updatedPlayer.contractEffects,
        choice.effects
      );

      const nextStepIndex = updatedPlayer.currentStepIndex + 1;

      // If we've completed all steps, go to reflection
      if (nextStepIndex >= state.currentContract.steps.length) {
        savePlayer(updatedPlayer);
        return {
          ...state,
          screen: 'reflection',
          player: updatedPlayer,
        };
      }

      updatedPlayer.currentStepIndex = nextStepIndex;
      savePlayer(updatedPlayer);

      return {
        ...state,
        player: updatedPlayer,
      };
    }

    case 'SUBMIT_REFLECTION': {
      if (!state.player || !state.currentContract) return state;

      const reflection = state.currentContract.reflection;
      const choice = reflection.choices.find(c => c.id === action.choiceId);
      if (!choice) return state;

      const isCorrect = choice.isCorrect === true;

      // Apply reflection effects if correct
      let updatedPlayer = { ...state.player };
      if (isCorrect && choice.effects) {
        updatedPlayer = applyEffects(
          updatedPlayer,
          choice.effects,
          state.currentContract.category
        );
      }

      // Apply contract rewards
      const rewards = state.currentContract.rewards;
      updatedPlayer.gold += rewards.goldDelta;
      updatedPlayer.xp += rewards.xpDelta;
      updatedPlayer.level = calculateLevel(updatedPlayer.xp);
      updatedPlayer = addMastery(updatedPlayer, state.currentContract.category, rewards.masteryDelta);

      // Mark contract as completed
      if (!updatedPlayer.completedContractIds.includes(state.currentContract.id)) {
        updatedPlayer.completedContractIds.push(state.currentContract.id);
      }

      // Clear contract state
      updatedPlayer.currentContractId = null;
      updatedPlayer.currentStepIndex = 0;
      updatedPlayer.currentBriefingIndex = 0;

      // Build result
      const result: ContractResult = {
        contractId: state.currentContract.id,
        contractTitle: state.currentContract.title,
        completed: true,
        xpEarned: rewards.xpDelta,
        goldEarned: rewards.goldDelta,
        masteryEarned: rewards.masteryDelta,
        reflectionCorrect: isCorrect,
        statsChanged: updatedPlayer.contractEffects,
      };

      // Clear accumulated effects
      updatedPlayer.contractEffects = {};
      updatedPlayer.contractChoicesMade = {};

      savePlayer(updatedPlayer);

      return {
        ...state,
        screen: 'results',
        player: updatedPlayer,
        contractResult: result,
      };
    }

    case 'COMPLETE_CONTRACT': {
      return state;
    }

    case 'RETURN_TO_TOWN': {
      return {
        ...state,
        screen: 'town',
        selectedBuildingId: null,
        currentContract: null,
        contractResult: null,
        isMovementPaused: false,
      };
    }

    case 'SET_LONG_TERM_GOAL': {
      if (!state.player) return state;

      const updatedPlayer = {
        ...state.player,
        longTermGoal: action.goal,
      };
      savePlayer(updatedPlayer);

      return {
        ...state,
        player: updatedPlayer,
      };
    }

    case 'RESET_GAME': {
      return createInitialState();
    }

    default:
      return state;
  }
}

// Helper to accumulate effects
function accumulateEffects(
  current: StepEffects,
  added: StepEffects
): StepEffects {
  return {
    goldDelta: (current.goldDelta || 0) + (added.goldDelta || 0),
    savingsDelta: (current.savingsDelta || 0) + (added.savingsDelta || 0),
    happinessDelta: (current.happinessDelta || 0) + (added.happinessDelta || 0),
    stressDelta: (current.stressDelta || 0) + (added.stressDelta || 0),
    masteryDelta: (current.masteryDelta || 0) + (added.masteryDelta || 0),
  };
}


import type { 
  AdventureState, 
  AdventureAction, 
  PlayerProfile,
  Quest,
  QuestResult,
  QuestLogEntry,
  BadgeId
} from './types';
import { getQuestById, isChapter1Complete } from './quests';
import { calculateLevel, calculateBonusXp, checkBadgeEarned } from './progression';
import { savePlayerProfile, createNewPlayerProfile } from './storage';

// Initial state
export function createInitialAdventureState(): AdventureState {
  return {
    screen: 'title',
    player: null,
    currentQuest: null,
    questResult: null,
    isLoading: false
  };
}

// Main reducer
export function adventureReducer(state: AdventureState, action: AdventureAction): AdventureState {
  switch (action.type) {
    case 'START_NEW_GAME': {
      const player = createNewPlayerProfile(action.playerName, action.seed);
      savePlayerProfile(player);
      
      return {
        ...state,
        screen: 'map',
        player,
        currentQuest: null,
        questResult: null
      };
    }
    
    case 'LOAD_GAME': {
      return {
        ...state,
        screen: 'map',
        player: action.profile,
        currentQuest: null,
        questResult: null
      };
    }
    
    case 'START_QUEST': {
      if (!state.player) return state;
      
      const quest = getQuestById(action.questId);
      if (!quest) return state;
      
      const updatedPlayer: PlayerProfile = {
        ...state.player,
        currentQuestId: quest.id,
        currentStepIndex: 0,
        questChoicesMade: {},
        lastPlayedAt: Date.now()
      };
      
      savePlayerProfile(updatedPlayer);
      
      return {
        ...state,
        screen: 'quest',
        player: updatedPlayer,
        currentQuest: quest,
        questResult: null
      };
    }
    
    case 'ADVANCE_STEP': {
      if (!state.player || !state.currentQuest) return state;
      
      const currentStep = state.currentQuest.steps[state.player.currentStepIndex];
      const nextStepIndex = state.player.currentStepIndex + 1;
      
      // Apply any effects from current step (non-choice steps)
      let updatedPlayer = { ...state.player };
      
      if (currentStep.effects && currentStep.type !== 'choice') {
        updatedPlayer = applyEffects(updatedPlayer, currentStep.effects);
      }
      
      // Check if quest is complete
      if (nextStepIndex >= state.currentQuest.steps.length) {
        // Quest complete - calculate results
        const result = calculateQuestResult(state.currentQuest, updatedPlayer);
        
        // Apply rewards
        updatedPlayer.xp += result.xpEarned + result.bonusXpEarned;
        updatedPlayer.level = calculateLevel(updatedPlayer.xp);
        updatedPlayer.completedQuestIds.push(state.currentQuest.id);
        updatedPlayer.currentQuestId = null;
        updatedPlayer.currentStepIndex = 0;
        
        // Add badge if earned
        if (result.badgeEarned && !updatedPlayer.badges.includes(result.badgeEarned)) {
          updatedPlayer.badges.push(result.badgeEarned);
        }
        
        savePlayerProfile(updatedPlayer);
        
        // Check if this completes the chapter
        const chapterComplete = isChapter1Complete(updatedPlayer.completedQuestIds);
        
        return {
          ...state,
          screen: chapterComplete ? 'chapter-end' : 'quest-result',
          player: updatedPlayer,
          questResult: result
        };
      }
      
      // Move to next step
      updatedPlayer.currentStepIndex = nextStepIndex;
      savePlayerProfile(updatedPlayer);
      
      return {
        ...state,
        player: updatedPlayer
      };
    }
    
    case 'MAKE_CHOICE': {
      if (!state.player || !state.currentQuest) return state;
      
      const currentStep = state.currentQuest.steps[state.player.currentStepIndex];
      if (currentStep.type !== 'choice' || !currentStep.choices) return state;
      
      const choice = currentStep.choices.find(c => c.id === action.choiceId);
      if (!choice) return state;
      
      // Apply choice effects
      let updatedPlayer = applyEffects(state.player, choice.effects);
      
      // Track the choice
      updatedPlayer.questChoicesMade = {
        ...updatedPlayer.questChoicesMade,
        [currentStep.id]: choice.id
      };
      
      // Track stats for badges
      if (choice.effects.cashDelta > 0) {
        updatedPlayer.totalEarned += choice.effects.cashDelta;
      } else if (choice.effects.cashDelta < 0) {
        updatedPlayer.totalSpent += Math.abs(choice.effects.cashDelta);
      }
      if (choice.effects.savingsDelta > 0) {
        updatedPlayer.totalSaved += choice.effects.savingsDelta;
      }
      if (choice.needOrWant === 'want' && choice.effects.cashDelta === 0) {
        updatedPlayer.wantsResisted++;
      }
      
      // Add to quest log
      const logEntry: QuestLogEntry = {
        questId: state.currentQuest.id,
        stepId: currentStep.id,
        text: `Chose: ${choice.label} - ${choice.outcomeText}`,
        type: 'choice',
        timestamp: Date.now()
      };
      updatedPlayer.questLog = [...updatedPlayer.questLog, logEntry];
      
      // Move to next step
      const nextStepIndex = updatedPlayer.currentStepIndex + 1;
      
      // Check if quest is complete
      if (nextStepIndex >= state.currentQuest.steps.length) {
        const result = calculateQuestResult(state.currentQuest, updatedPlayer);
        
        updatedPlayer.xp += result.xpEarned + result.bonusXpEarned;
        updatedPlayer.level = calculateLevel(updatedPlayer.xp);
        updatedPlayer.completedQuestIds.push(state.currentQuest.id);
        updatedPlayer.currentQuestId = null;
        updatedPlayer.currentStepIndex = 0;
        
        if (result.badgeEarned && !updatedPlayer.badges.includes(result.badgeEarned)) {
          updatedPlayer.badges.push(result.badgeEarned);
        }
        
        savePlayerProfile(updatedPlayer);
        
        const chapterComplete = isChapter1Complete(updatedPlayer.completedQuestIds);
        
        return {
          ...state,
          screen: chapterComplete ? 'chapter-end' : 'quest-result',
          player: updatedPlayer,
          questResult: result
        };
      }
      
      updatedPlayer.currentStepIndex = nextStepIndex;
      savePlayerProfile(updatedPlayer);
      
      return {
        ...state,
        player: updatedPlayer
      };
    }
    
    case 'COMPLETE_QUEST': {
      // This is called when viewing results, just transition
      return state;
    }
    
    case 'RETURN_TO_MAP': {
      return {
        ...state,
        screen: 'map',
        currentQuest: null,
        questResult: null
      };
    }
    
    case 'FINISH_CHAPTER': {
      return {
        ...state,
        screen: 'chapter-end'
      };
    }
    
    case 'RESET_GAME': {
      return createInitialAdventureState();
    }
    
    default:
      return state;
  }
}

// Helper to apply stat effects
function applyEffects(
  player: PlayerProfile,
  effects: { cashDelta: number; savingsDelta: number; happinessDelta: number; stressDelta: number }
): PlayerProfile {
  return {
    ...player,
    cash: player.cash + effects.cashDelta,
    savings: player.savings + effects.savingsDelta,
    happiness: Math.max(0, Math.min(100, player.happiness + effects.happinessDelta)),
    stress: Math.max(0, Math.min(100, player.stress + effects.stressDelta))
  };
}

// Calculate quest result
function calculateQuestResult(quest: Quest, player: PlayerProfile): QuestResult {
  const bonusResult = calculateBonusXp(quest.id, player, player.questChoicesMade);
  
  // Check badge
  let badgeEarned: BadgeId | null = null;
  if (quest.badgeReward) {
    const earned = checkBadgeEarned(quest.badgeReward, player, player.questChoicesMade);
    if (earned) {
      badgeEarned = quest.badgeReward;
    }
  }
  
  // Summarize choices
  const choicesSummary = Object.entries(player.questChoicesMade).map(([stepId, choiceId]) => {
    const step = quest.steps.find((s: { id: string }) => s.id === stepId);
    const choice = step?.choices?.find((c: { id: string; outcomeText: string }) => c.id === choiceId);
    return choice?.outcomeText || '';
  }).filter(Boolean);
  
  return {
    questId: quest.id,
    questTitle: quest.title,
    completed: true,
    xpEarned: quest.xpReward,
    bonusXpEarned: bonusResult.earned ? bonusResult.amount : 0,
    badgeEarned,
    statsChanged: {
      cashDelta: 0, // Would need to track this during quest
      savingsDelta: 0,
      happinessDelta: 0,
      stressDelta: 0
    },
    choicesSummary
  };
}


import type { GameState, GameAction, EndResult, OutcomeTier, GameEvent, LogEntry } from './types';
import { createRNG, randomInt, weightedChoice } from './rng';
import { EVENTS, getWeightedEventTypes } from './events';

// Initial state factory
export function createInitialState(): GameState {
  return {
    phase: 'setup',
    week: 1,
    cash: 0,
    savings: 0,
    happiness: 70,
    stress: 20,
    income: 0,
    fixedExpenses: {
      housing: 400,
      basicFood: 200
    },
    funBudget: 0,
    funBudgetZeroWeeks: 0,
    currentEvent: null,
    eventResolved: false,
    selectedChoice: null,
    log: [],
    seed: 0,
    rngState: 0,
    endResult: null,
    cashWentNegative: false
  };
}

// Pure reducer function
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const rng = createRNG(action.seed);
      
      // Generate income in range [800, 1200] in increments of 50
      const incomeSteps = randomInt(rng, 0, 8); // 0-8 steps of 50
      const income = 800 + incomeSteps * 50;
      
      // Calculate initial cash after fixed expenses
      const totalFixed = 400 + 200; // housing + basicFood
      const cash = income - totalFixed;
      
      const log: LogEntry[] = [
        { week: 1, text: `💵 Monthly income: $${income}`, type: 'info' },
        { week: 1, text: `🏠 Housing expense: -$400`, type: 'expense' },
        { week: 1, text: `🍎 Basic food expense: -$200`, type: 'expense' },
        { week: 1, text: `💰 Starting cash: $${cash}`, type: 'info' }
      ];
      
      return {
        ...state,
        phase: 'allocation',
        seed: action.seed,
        rngState: rng.state,
        income,
        cash,
        log
      };
    }
    
    case 'SET_ALLOCATION': {
      const newCash = state.cash - action.savings;
      const log: LogEntry[] = [
        ...state.log,
        { week: 1, text: `🏦 Moved $${action.savings} to savings`, type: 'info' },
        { week: 1, text: `🎯 Weekly fun budget set: $${action.funBudget}`, type: 'info' }
      ];
      
      // Select first event
      const rng = createRNG(state.rngState);
      const event = selectEvent(rng, 1, []);
      
      return {
        ...state,
        phase: 'playing',
        cash: newCash,
        savings: action.savings,
        funBudget: action.funBudget,
        rngState: rng.state,
        currentEvent: event,
        eventResolved: false,
        selectedChoice: null,
        log
      };
    }
    
    case 'RESOLVE_EVENT': {
      if (!state.currentEvent || state.eventResolved) return state;
      
      let newState = { ...state };
      const event = state.currentEvent;
      
      let outcomeText = '';
      let cashDelta = 0;
      let savingsDelta = 0;
      let happinessDelta = 0;
      let stressDelta = 0;
      
      if (event.choices && action.choiceIndex !== undefined) {
        const choice = event.choices[action.choiceIndex];
        cashDelta = choice.cashDelta;
        savingsDelta = choice.savingsDelta;
        happinessDelta = choice.happinessDelta;
        stressDelta = choice.stressDelta;
        outcomeText = choice.outcomeText;
      } else if (event.defaultEffect) {
        cashDelta = event.defaultEffect.cashDelta;
        savingsDelta = event.defaultEffect.savingsDelta;
        happinessDelta = event.defaultEffect.happinessDelta;
        stressDelta = event.defaultEffect.stressDelta;
        outcomeText = event.defaultEffect.outcomeText;
      }
      
      // Apply changes
      newState.cash += cashDelta;
      newState.savings += savingsDelta;
      newState.happiness += happinessDelta;
      newState.stress += stressDelta;
      
      // Track if cash went negative
      if (newState.cash < 0) {
        newState.cashWentNegative = true;
      }
      
      // Add to log
      const logEntries: LogEntry[] = [...state.log];
      logEntries.push({
        week: state.week,
        text: `📋 ${event.title}: ${outcomeText}`,
        type: cashDelta < 0 ? 'expense' : cashDelta > 0 ? 'income' : 'info'
      });
      
      if (cashDelta !== 0) {
        logEntries.push({
          week: state.week,
          text: `💵 Cash: ${cashDelta >= 0 ? '+' : ''}$${cashDelta}`,
          type: cashDelta >= 0 ? 'income' : 'expense'
        });
      }
      
      // Apply stress rules based on cash level
      if (newState.cash < 0) {
        newState.stress += 25;
        logEntries.push({
          week: state.week,
          text: '😰 Cash went negative! Stress +25',
          type: 'warning'
        });
      } else if (newState.cash < 100) {
        newState.stress += 10;
        logEntries.push({
          week: state.week,
          text: '😟 Cash is low! Stress +10',
          type: 'warning'
        });
      }
      
      // Track fun budget zero weeks
      if (state.funBudget === 0) {
        newState.funBudgetZeroWeeks = state.funBudgetZeroWeeks + 1;
        if (newState.funBudgetZeroWeeks >= 2) {
          newState.happiness -= 10;
          logEntries.push({
            week: state.week,
            text: '😔 No fun budget for 2 weeks. Happiness -10',
            type: 'warning'
          });
        }
      }
      
      // Clamp values
      newState.happiness = Math.max(0, Math.min(100, newState.happiness));
      newState.stress = Math.max(0, Math.min(100, newState.stress));
      
      newState.log = logEntries;
      newState.eventResolved = true;
      newState.selectedChoice = action.choiceIndex ?? null;
      
      // Check for burnout ending
      if (newState.stress >= 90) {
        return {
          ...newState,
          phase: 'ended',
          endResult: calculateEndResult(newState, true)
        };
      }
      
      return newState;
    }
    
    case 'NEXT_WEEK': {
      if (!state.eventResolved) return state;
      
      const nextWeek = state.week + 1;
      
      // Check if game ends
      if (nextWeek > 4) {
        return {
          ...state,
          phase: 'ended',
          endResult: calculateEndResult(state, false)
        };
      }
      
      // Select next event
      const rng = createRNG(state.rngState);
      const usedEventIds = state.log
        .filter(l => l.text.includes('📋'))
        .map(l => l.text);
      const event = selectEvent(rng, nextWeek, usedEventIds);
      
      const logEntries: LogEntry[] = [
        ...state.log,
        { week: nextWeek, text: `📅 Week ${nextWeek} begins`, type: 'info' }
      ];
      
      return {
        ...state,
        week: nextWeek,
        rngState: rng.state,
        currentEvent: event,
        eventResolved: false,
        selectedChoice: null,
        log: logEntries
      };
    }
    
    case 'RESET_GAME': {
      return createInitialState();
    }
    
    default:
      return state;
  }
}

// Helper function to select an event based on week weights
function selectEvent(rng: { next: () => number; state: number }, week: number, usedEventIds: string[]): GameEvent {
  const { types, weights } = getWeightedEventTypes(week);
  
  // Filter out already used events
  const availableEvents = EVENTS.filter(e => 
    !usedEventIds.some(id => id.includes(e.title))
  );
  
  if (availableEvents.length === 0) {
    // If all events used, allow repeats
    const selectedType = weightedChoice(rng, types, weights);
    const eventsOfType = EVENTS.filter(e => e.type === selectedType);
    return eventsOfType[Math.floor(rng.next() * eventsOfType.length)];
  }
  
  // Try to find an event of the weighted type
  for (let attempts = 0; attempts < 10; attempts++) {
    const selectedType = weightedChoice(rng, types, weights);
    const eventsOfType = availableEvents.filter(e => e.type === selectedType);
    
    if (eventsOfType.length > 0) {
      return eventsOfType[Math.floor(rng.next() * eventsOfType.length)];
    }
  }
  
  // Fallback: pick any available event
  return availableEvents[Math.floor(rng.next() * availableEvents.length)];
}

// Calculate end result and tier
function calculateEndResult(state: GameState, burnout: boolean): EndResult {
  const finalStats = {
    cash: state.cash,
    savings: state.savings,
    happiness: state.happiness,
    stress: state.stress
  };
  
  let tier: OutcomeTier;
  let title: string;
  let description: string;
  let tips: string[];
  
  if (burnout) {
    tier = 'burnout';
    title = '💥 Financial Burnout!';
    description = 'Your stress level reached 90 or higher. Managing money can be overwhelming, but with practice, you can learn to handle it better!';
    tips = [
      'Try to keep an emergency fund in savings for unexpected expenses',
      'Sometimes spending a little on fun can prevent stress from building up'
    ];
  } else if (state.cashWentNegative || state.stress >= 80) {
    tier = 'struggled';
    title = '😓 Struggled Through';
    description = 'The month was tough - you either ran out of cash or felt very stressed. But you made it through and learned valuable lessons!';
    tips = [
      'Try saving a small emergency fund before spending on wants',
      'Track your spending to avoid surprises'
    ];
  } else if (state.savings >= 250 && state.happiness < 60) {
    tier = 'over-saver';
    title = '🏦 The Over-Saver';
    description = "You saved a lot of money, but forgot to enjoy life! Balance is important - it's okay to spend on things that make you happy sometimes.";
    tips = [
      'Try setting aside a small "fun budget" each week',
      'Experiences with friends can be worth the cost'
    ];
  } else if (state.happiness >= 75 && state.savings < 100 && state.stress >= 60) {
    tier = 'fun-focused';
    title = '🎉 Fun Focused';
    description = 'You had a great time this month! But watch out - without savings, one emergency could cause big problems.';
    tips = [
      'Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings',
      'Even $10-20 saved each week adds up over time'
    ];
  } else if (state.stress < 60 && state.happiness >= 60 && state.savings >= 100) {
    tier = 'stable-planner';
    title = '⭐ Stable Planner!';
    description = "Excellent work! You balanced your needs, wants, and savings while keeping stress low. You've got the makings of a great money manager!";
    tips = [
      'Keep practicing these habits as expenses get bigger',
      'Try teaching a friend what you learned!'
    ];
  } else {
    // Default case - middle ground
    tier = 'stable-planner';
    title = '👍 Balanced Budget';
    description = 'You made it through the month! There\'s room for improvement, but you showed good money sense.';
    tips = [
      'Keep an eye on both happiness and savings',
      'Practice makes perfect - try again with different choices!'
    ];
  }
  
  return { tier, title, description, tips, finalStats };
}


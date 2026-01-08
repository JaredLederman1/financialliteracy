import type { Quest } from './types';

// ============================================
// CHAPTER 1: STARTER TOWN
// ============================================

export const CHAPTER_1_QUESTS: Quest[] = [
  // ============================================
  // QUEST 1: First Allowance
  // ============================================
  {
    id: 'first-allowance',
    title: 'First Allowance',
    description: 'You just got your first allowance in your new town! Time to learn the basics of managing money.',
    npcName: 'Mom',
    npcEmoji: '👩',
    location: 'Home',
    estimatedMinutes: 3,
    xpReward: 30,
    bonusXp: 10,
    bonusXpCondition: 'Save at least some money',
    badgeReward: 'first-budget',
    steps: [
      {
        id: 'fa-1',
        type: 'dialogue',
        speaker: 'Mom',
        text: "Good morning! Since we just moved to Maplewood, I want to help you get settled. Here's your weekly allowance: $25!",
        nextStepId: 'fa-2'
      },
      {
        id: 'fa-2',
        type: 'info',
        speaker: 'narrator',
        text: '💵 You received $25! This is YOUR money to manage. What you do with it is up to you.',
        effects: {
          cashDelta: 25,
          savingsDelta: 0,
          happinessDelta: 10,
          stressDelta: 0
        },
        nextStepId: 'fa-3'
      },
      {
        id: 'fa-3',
        type: 'dialogue',
        speaker: 'Mom',
        text: "Now, here's a tip: It's smart to put some money aside for later. You never know when you might need it! What would you like to do with your $25?",
        nextStepId: 'fa-4'
      },
      {
        id: 'fa-4',
        type: 'choice',
        speaker: 'narrator',
        text: 'How much do you want to save?',
        choices: [
          {
            id: 'fa-save-10',
            label: 'Save $10, keep $15 for spending',
            needOrWant: 'neutral',
            effects: { cashDelta: -10, savingsDelta: 10, happinessDelta: 5, stressDelta: -5 },
            outcomeText: "Smart choice! You're building a safety net."
          },
          {
            id: 'fa-save-5',
            label: 'Save $5, keep $20 for spending',
            needOrWant: 'neutral',
            effects: { cashDelta: -5, savingsDelta: 5, happinessDelta: 3, stressDelta: 0 },
            outcomeText: "Good start! Even small savings add up."
          },
          {
            id: 'fa-save-0',
            label: "Keep all $25 - I'll save later",
            needOrWant: 'want',
            effects: { cashDelta: 0, savingsDelta: 0, happinessDelta: 8, stressDelta: 5 },
            outcomeText: "More spending money! But remember, emergencies can happen..."
          }
        ],
        nextStepId: 'fa-5'
      },
      {
        id: 'fa-5',
        type: 'dialogue',
        speaker: 'Mom',
        text: "Great! Remember, budgeting is about balance. It's okay to spend on things you enjoy, but it's also important to be prepared. Why don't you explore the town?",
        nextStepId: 'fa-6'
      },
      {
        id: 'fa-6',
        type: 'result',
        speaker: 'narrator',
        text: "🎉 You've made your first money decision! This is the beginning of your budgeting journey in Maplewood."
      }
    ]
  },

  // ============================================
  // QUEST 2: The Hangout Invite
  // ============================================
  {
    id: 'hangout-invite',
    title: 'The Hangout Invite',
    description: 'Your new neighbor wants to hang out! But it might cost money...',
    npcName: 'Jamie',
    npcEmoji: '👋',
    location: 'Neighborhood Park',
    estimatedMinutes: 4,
    xpReward: 35,
    bonusXp: 15,
    bonusXpCondition: 'Make a balanced choice (not all-or-nothing)',
    requiredQuestId: 'first-allowance',
    steps: [
      {
        id: 'hi-1',
        type: 'dialogue',
        speaker: 'Jamie',
        text: "Hey, you're the new kid, right? I'm Jamie! A bunch of us are going to the arcade later. Want to come?",
        nextStepId: 'hi-2'
      },
      {
        id: 'hi-2',
        type: 'dialogue',
        speaker: 'narrator',
        text: "Making friends in a new town is important! But the arcade costs money. Games are about $1-2 each, and most kids spend $8-12.",
        nextStepId: 'hi-3'
      },
      {
        id: 'hi-3',
        type: 'choice',
        speaker: 'narrator',
        text: 'What do you want to do?',
        choices: [
          {
            id: 'hi-arcade-full',
            label: 'Go all out at the arcade! ($12)',
            needOrWant: 'want',
            effects: { cashDelta: -12, savingsDelta: 0, happinessDelta: 20, stressDelta: -10 },
            outcomeText: "You had an AMAZING time and made great friends! Your wallet feels lighter though..."
          },
          {
            id: 'hi-arcade-budget',
            label: 'Go but set a $6 budget',
            needOrWant: 'neutral',
            effects: { cashDelta: -6, savingsDelta: 0, happinessDelta: 12, stressDelta: -5 },
            outcomeText: "You had fun AND kept some money! Jamie thought your budget idea was actually smart."
          },
          {
            id: 'hi-park',
            label: 'Suggest hanging at the park instead (free)',
            needOrWant: 'neutral',
            effects: { cashDelta: 0, savingsDelta: 0, happinessDelta: 8, stressDelta: 0 },
            outcomeText: "Jamie was cool with it! You played frisbee and had a good time. Saved money too!"
          },
          {
            id: 'hi-skip',
            label: "Skip it - I should save my money",
            needOrWant: 'neutral',
            effects: { cashDelta: 0, savingsDelta: 0, happinessDelta: -5, stressDelta: 5 },
            outcomeText: "You stayed home. Your savings are safe, but you feel a bit lonely..."
          }
        ],
        nextStepId: 'hi-4'
      },
      {
        id: 'hi-4',
        type: 'dialogue',
        speaker: 'Jamie',
        text: "That was cool! Hey, we should hang out more. See you around the neighborhood!",
        nextStepId: 'hi-5'
      },
      {
        id: 'hi-5',
        type: 'info',
        speaker: 'narrator',
        text: "💡 TIP: Spending on friends and fun is a WANT, not a need. But happiness matters too! The key is finding balance.",
        nextStepId: 'hi-6'
      },
      {
        id: 'hi-6',
        type: 'result',
        speaker: 'narrator',
        text: "You're starting to fit in at Maplewood! Remember: budgeting isn't about never spending - it's about choosing wisely."
      }
    ]
  },

  // ============================================
  // QUEST 3: Something Breaks
  // ============================================
  {
    id: 'something-breaks',
    title: 'Something Breaks',
    description: "Uh oh! Your phone charger stopped working. You need it for school...",
    npcName: 'You',
    npcEmoji: '😰',
    location: 'Your Room',
    estimatedMinutes: 4,
    xpReward: 40,
    bonusXp: 20,
    bonusXpCondition: "Handle the emergency without going into negative cash",
    badgeReward: 'emergency-ready',
    requiredQuestId: 'hangout-invite',
    steps: [
      {
        id: 'sb-1',
        type: 'dialogue',
        speaker: 'narrator',
        text: "You plug in your phone before bed, but... nothing. The charger is completely dead. Your phone is at 5%! 😱",
        nextStepId: 'sb-2'
      },
      {
        id: 'sb-2',
        type: 'info',
        speaker: 'narrator',
        text: "🚨 EMERGENCY: This is an unexpected expense! You NEED your phone charged for school (alarm, bus schedule, homework app). A new charger costs $10-15.",
        effects: {
          cashDelta: 0,
          savingsDelta: 0,
          happinessDelta: -5,
          stressDelta: 15
        },
        nextStepId: 'sb-3'
      },
      {
        id: 'sb-3',
        type: 'choice',
        speaker: 'narrator',
        text: "What do you do?",
        choices: [
          {
            id: 'sb-buy-new',
            label: 'Buy a new charger at the store ($12)',
            needOrWant: 'need',
            effects: { cashDelta: -12, savingsDelta: 0, happinessDelta: 5, stressDelta: -15 },
            outcomeText: "Problem solved! You got a good quality charger that should last a while."
          },
          {
            id: 'sb-use-savings',
            label: 'Use savings to buy a charger ($12 from savings)',
            needOrWant: 'need',
            effects: { cashDelta: 0, savingsDelta: -12, happinessDelta: 0, stressDelta: -10 },
            outcomeText: "This is EXACTLY what savings are for - emergencies! Smart thinking."
          },
          {
            id: 'sb-cheap',
            label: 'Buy the cheapest one you can find ($6)',
            needOrWant: 'need',
            effects: { cashDelta: -6, savingsDelta: 0, happinessDelta: 0, stressDelta: -5 },
            outcomeText: "It works... for now. Cheap chargers sometimes don't last long though."
          },
          {
            id: 'sb-borrow',
            label: 'Ask Jamie if you can borrow one (free)',
            needOrWant: 'neutral',
            effects: { cashDelta: 0, savingsDelta: 0, happinessDelta: 5, stressDelta: -8 },
            outcomeText: "Jamie had a spare! Good friends help each other out. You'll need your own eventually though."
          }
        ],
        nextStepId: 'sb-4'
      },
      {
        id: 'sb-4',
        type: 'dialogue',
        speaker: 'narrator',
        text: "Your phone is charging again. Crisis averted! 😮‍💨",
        nextStepId: 'sb-5'
      },
      {
        id: 'sb-5',
        type: 'info',
        speaker: 'narrator',
        text: "💡 LESSON: Unexpected expenses happen to everyone! That's why an emergency fund in savings is so important. A phone charger is a NEED - you require it for daily life.",
        nextStepId: 'sb-6'
      },
      {
        id: 'sb-6',
        type: 'result',
        speaker: 'narrator',
        text: "You handled your first emergency! Remember: NEEDS are things you require to function. WANTS are nice-to-haves."
      }
    ]
  },

  // ============================================
  // QUEST 4: Side Gig Choice
  // ============================================
  {
    id: 'side-gig',
    title: 'Side Gig Choice',
    description: 'An opportunity to earn some extra money! But it will cost you time...',
    npcName: 'Mr. Chen',
    npcEmoji: '👴',
    location: "Mr. Chen's House",
    estimatedMinutes: 5,
    xpReward: 45,
    bonusXp: 15,
    bonusXpCondition: 'Help Mr. Chen with his yard work',
    badgeReward: 'helper',
    requiredQuestId: 'something-breaks',
    steps: [
      {
        id: 'sg-1',
        type: 'dialogue',
        speaker: 'Mr. Chen',
        text: "Oh hello! You're the new neighbor, aren't you? I'm Mr. Chen. Say, I could use some help with my yard this weekend. I'd pay you, of course!",
        nextStepId: 'sg-2'
      },
      {
        id: 'sg-2',
        type: 'info',
        speaker: 'narrator',
        text: "💼 OPPORTUNITY: Mr. Chen is offering to pay you $20 to help rake leaves and do yard work. It would take about 2 hours on Saturday morning.",
        nextStepId: 'sg-3'
      },
      {
        id: 'sg-3',
        type: 'choice',
        speaker: 'narrator',
        text: "This is a chance to EARN money! What do you want to do?",
        choices: [
          {
            id: 'sg-accept',
            label: "Accept the job - $20 for 2 hours of work!",
            needOrWant: 'neutral',
            effects: { cashDelta: 20, savingsDelta: 0, happinessDelta: 10, stressDelta: 5 },
            outcomeText: "You worked hard and earned $20! Mr. Chen was impressed with your effort."
          },
          {
            id: 'sg-negotiate',
            label: 'Ask if you can do half the work for $10',
            needOrWant: 'neutral',
            effects: { cashDelta: 10, savingsDelta: 0, happinessDelta: 8, stressDelta: 0 },
            outcomeText: "Mr. Chen agreed! You earned $10 for an hour of work and still had time for other things."
          },
          {
            id: 'sg-decline-polite',
            label: "Politely decline - I have other plans",
            needOrWant: 'neutral',
            effects: { cashDelta: 0, savingsDelta: 0, happinessDelta: 5, stressDelta: -5 },
            outcomeText: "Mr. Chen understood. You enjoyed your free Saturday, but missed out on earning money."
          }
        ],
        nextStepId: 'sg-4'
      },
      {
        id: 'sg-4',
        type: 'dialogue',
        speaker: 'Mr. Chen',
        text: "Thank you for considering it! You know, earning money takes time and effort, but it's a valuable skill to learn young.",
        nextStepId: 'sg-5'
      },
      {
        id: 'sg-5',
        type: 'info',
        speaker: 'narrator',
        text: "💡 LESSON: You can EARN money through work, not just receive it as allowance. Trading time for money is one of the most important financial concepts!",
        nextStepId: 'sg-6'
      },
      {
        id: 'sg-6',
        type: 'choice',
        speaker: 'narrator',
        text: "If you earned money, what do you want to do with it?",
        choices: [
          {
            id: 'sg-save-all',
            label: 'Save it all!',
            needOrWant: 'neutral',
            effects: { cashDelta: 0, savingsDelta: 0, happinessDelta: 3, stressDelta: -5 },
            outcomeText: "Great discipline! Your savings are growing."
          },
          {
            id: 'sg-save-half',
            label: 'Save half, keep half for spending',
            needOrWant: 'neutral',
            effects: { cashDelta: 0, savingsDelta: 0, happinessDelta: 5, stressDelta: -3 },
            outcomeText: "A balanced approach! Some for now, some for later."
          },
          {
            id: 'sg-keep-all',
            label: 'Keep it all as spending money',
            needOrWant: 'want',
            effects: { cashDelta: 0, savingsDelta: 0, happinessDelta: 8, stressDelta: 0 },
            outcomeText: "More fun money! Just remember emergencies can happen."
          }
        ],
        nextStepId: 'sg-7'
      },
      {
        id: 'sg-7',
        type: 'result',
        speaker: 'narrator',
        text: "You've learned that money can be EARNED through work! This is an important skill that will help you your whole life."
      }
    ]
  },

  // ============================================
  // QUEST 5: Saving for a Goal
  // ============================================
  {
    id: 'saving-goal',
    title: 'Saving for a Goal',
    description: "It's time to set a financial goal! What do you want to save up for?",
    npcName: 'Mom',
    npcEmoji: '👩',
    location: 'Home - Kitchen',
    estimatedMinutes: 5,
    xpReward: 50,
    bonusXp: 20,
    bonusXpCondition: 'Commit to a specific savings goal',
    badgeReward: 'goal-setter',
    requiredQuestId: 'side-gig',
    steps: [
      {
        id: 'sfg-1',
        type: 'dialogue',
        speaker: 'Mom',
        text: "I've noticed you've been managing your money! I'm proud of you. Have you thought about what you might want to save up for?",
        nextStepId: 'sfg-2'
      },
      {
        id: 'sfg-2',
        type: 'info',
        speaker: 'narrator',
        text: "💭 Having a GOAL makes saving easier! When you know WHY you're saving, it's easier to say no to impulse purchases.",
        nextStepId: 'sfg-3'
      },
      {
        id: 'sfg-3',
        type: 'choice',
        speaker: 'narrator',
        text: "What would you like to save for?",
        choices: [
          {
            id: 'sfg-bike',
            label: '🚲 A new bike ($75) - for getting around town',
            needOrWant: 'want',
            effects: { cashDelta: 0, savingsDelta: 0, happinessDelta: 10, stressDelta: 0 },
            outcomeText: "A bike would give you freedom to explore! That's a meaningful goal."
          },
          {
            id: 'sfg-headphones',
            label: '🎧 Nice headphones ($40) - for music and studying',
            needOrWant: 'want',
            effects: { cashDelta: 0, savingsDelta: 0, happinessDelta: 8, stressDelta: 0 },
            outcomeText: "Good headphones can help you focus and enjoy music. Solid goal!"
          },
          {
            id: 'sfg-charity',
            label: '💝 Donate to animal shelter ($25)',
            needOrWant: 'neutral',
            effects: { cashDelta: 0, savingsDelta: 0, happinessDelta: 15, stressDelta: -5 },
            outcomeText: "Wow! Saving to help others is really kind. The animals will appreciate it!"
          },
          {
            id: 'sfg-emergency',
            label: '🛡️ Build an emergency fund ($50)',
            needOrWant: 'need',
            effects: { cashDelta: 0, savingsDelta: 0, happinessDelta: 5, stressDelta: -10 },
            outcomeText: "Very mature thinking! An emergency fund protects you from unexpected costs."
          }
        ],
        nextStepId: 'sfg-4'
      },
      {
        id: 'sfg-4',
        type: 'dialogue',
        speaker: 'Mom',
        text: "That's a great goal! Now let's figure out how long it will take you to save up for it.",
        nextStepId: 'sfg-5'
      },
      {
        id: 'sfg-5',
        type: 'info',
        speaker: 'narrator',
        text: "📊 MATH TIME: If you save $10/week, you can reach:\n• $25 in ~3 weeks\n• $40 in ~4 weeks\n• $50 in ~5 weeks\n• $75 in ~8 weeks",
        nextStepId: 'sfg-6'
      },
      {
        id: 'sfg-6',
        type: 'choice',
        speaker: 'narrator',
        text: "How much do you want to commit to saving each week toward your goal?",
        choices: [
          {
            id: 'sfg-commit-15',
            label: '$15/week - I\'ll reach my goal fast!',
            needOrWant: 'neutral',
            effects: { cashDelta: 0, savingsDelta: 15, happinessDelta: 5, stressDelta: 5 },
            outcomeText: "Ambitious! You'll reach your goal quickly, but make sure you have enough for other things."
          },
          {
            id: 'sfg-commit-10',
            label: '$10/week - A balanced approach',
            needOrWant: 'neutral',
            effects: { cashDelta: 0, savingsDelta: 10, happinessDelta: 8, stressDelta: 0 },
            outcomeText: "A sustainable pace! You're making progress while keeping flexibility."
          },
          {
            id: 'sfg-commit-5',
            label: '$5/week - Slow and steady',
            needOrWant: 'neutral',
            effects: { cashDelta: 0, savingsDelta: 5, happinessDelta: 5, stressDelta: -5 },
            outcomeText: "It'll take longer, but you'll still get there! Consistency matters more than speed."
          }
        ],
        nextStepId: 'sfg-7'
      },
      {
        id: 'sfg-7',
        type: 'dialogue',
        speaker: 'Mom',
        text: "I'm really impressed! Setting goals and making a plan is what real budgeting is all about. You're going to do great!",
        nextStepId: 'sfg-8'
      },
      {
        id: 'sfg-8',
        type: 'result',
        speaker: 'narrator',
        text: "🎯 You've set your first savings goal! Remember: Every dollar saved is a step closer to what you want."
      }
    ]
  },

  // ============================================
  // FINAL: Chapter 1 Recap
  // ============================================
  {
    id: 'chapter-1-finale',
    title: 'End of Week One',
    description: "Your first week in Maplewood is coming to an end. Let's see how you did!",
    npcName: 'Mom',
    npcEmoji: '👩',
    location: 'Home - Living Room',
    estimatedMinutes: 3,
    xpReward: 50,
    bonusXp: 25,
    bonusXpCondition: 'End with happiness ≥60 and stress ≤50',
    badgeReward: 'balanced',
    requiredQuestId: 'saving-goal',
    steps: [
      {
        id: 'cf-1',
        type: 'dialogue',
        speaker: 'Mom',
        text: "Wow, what a week! You've already learned so much about managing money. I'm proud of you!",
        nextStepId: 'cf-2'
      },
      {
        id: 'cf-2',
        type: 'info',
        speaker: 'narrator',
        text: "📚 Let's review what you learned this week:\n\n• 💵 INCOME: Money you receive (allowance, earnings)\n• 💸 EXPENSES: Money you spend\n• 🏦 SAVINGS: Money you set aside for later\n• ✅ NEEDS: Things you require (charger, school supplies)\n• 💜 WANTS: Nice-to-haves (arcade, games)",
        nextStepId: 'cf-3'
      },
      {
        id: 'cf-3',
        type: 'dialogue',
        speaker: 'Mom',
        text: "You handled an emergency, made friends, and even earned some money! What was the most important thing you learned?",
        nextStepId: 'cf-4'
      },
      {
        id: 'cf-4',
        type: 'choice',
        speaker: 'narrator',
        text: "What was your biggest takeaway?",
        choices: [
          {
            id: 'cf-learn-balance',
            label: "Balance is key - save some, spend some",
            needOrWant: 'neutral',
            effects: { cashDelta: 0, savingsDelta: 0, happinessDelta: 5, stressDelta: -5 },
            outcomeText: "Exactly! Life is about balance, and so is budgeting."
          },
          {
            id: 'cf-learn-emergency',
            label: "Always have emergency savings!",
            needOrWant: 'neutral',
            effects: { cashDelta: 0, savingsDelta: 0, happinessDelta: 3, stressDelta: -8 },
            outcomeText: "So true! Emergencies are less scary when you're prepared."
          },
          {
            id: 'cf-learn-goals',
            label: "Having a goal makes saving easier",
            needOrWant: 'neutral',
            effects: { cashDelta: 0, savingsDelta: 0, happinessDelta: 8, stressDelta: 0 },
            outcomeText: "Goals give your money a purpose. Great insight!"
          },
          {
            id: 'cf-learn-earn',
            label: "I can earn my own money through work",
            needOrWant: 'neutral',
            effects: { cashDelta: 0, savingsDelta: 0, happinessDelta: 5, stressDelta: 0 },
            outcomeText: "That's a powerful realization! You control your financial future."
          }
        ],
        nextStepId: 'cf-5'
      },
      {
        id: 'cf-5',
        type: 'dialogue',
        speaker: 'Mom',
        text: "I can tell you're going to do great things here in Maplewood. Rest up - next week brings new adventures!",
        nextStepId: 'cf-6'
      },
      {
        id: 'cf-6',
        type: 'result',
        speaker: 'narrator',
        text: "🏆 CHAPTER 1 COMPLETE! You've finished your first week in Maplewood. Your budgeting journey is just beginning!"
      }
    ]
  }
];

// Helper to get quest by ID
export function getQuestById(id: string): Quest | undefined {
  return CHAPTER_1_QUESTS.find(q => q.id === id);
}

// Get all available quests for a player (based on completed quests)
export function getAvailableQuests(completedQuestIds: string[]): Quest[] {
  return CHAPTER_1_QUESTS.filter(quest => {
    // Already completed
    if (completedQuestIds.includes(quest.id)) return false;
    // Check prerequisite
    if (quest.requiredQuestId && !completedQuestIds.includes(quest.requiredQuestId)) return false;
    return true;
  });
}

// Get next quest to play
export function getNextQuest(completedQuestIds: string[]): Quest | null {
  const available = getAvailableQuests(completedQuestIds);
  return available.length > 0 ? available[0] : null;
}

// Check if chapter is complete
export function isChapter1Complete(completedQuestIds: string[]): boolean {
  return CHAPTER_1_QUESTS.every(q => completedQuestIds.includes(q.id));
}


import type { PlayerProfile, BadgeId } from './types';
import { BADGES } from './types';

// Level thresholds
const LEVELS = [
  { level: 1, xpRequired: 0 },
  { level: 2, xpRequired: 100 },
  { level: 3, xpRequired: 250 },
  { level: 4, xpRequired: 450 },
  { level: 5, xpRequired: 700 },
];

// Calculate level from XP
export function calculateLevel(xp: number): number {
  let level = 1;
  for (const threshold of LEVELS) {
    if (xp >= threshold.xpRequired) {
      level = threshold.level;
    } else {
      break;
    }
  }
  return level;
}

// Get XP needed for next level
export function getXpForNextLevel(currentXp: number): { 
  currentLevel: number;
  nextLevel: number;
  xpNeeded: number;
  xpProgress: number;
  progressPercent: number;
} {
  const currentLevel = calculateLevel(currentXp);
  const nextLevelData = LEVELS.find(l => l.level === currentLevel + 1);
  
  if (!nextLevelData) {
    // Max level reached
    return {
      currentLevel,
      nextLevel: currentLevel,
      xpNeeded: 0,
      xpProgress: 0,
      progressPercent: 100
    };
  }
  
  const currentLevelData = LEVELS.find(l => l.level === currentLevel)!;
  const xpIntoCurrentLevel = currentXp - currentLevelData.xpRequired;
  const xpNeededForLevel = nextLevelData.xpRequired - currentLevelData.xpRequired;
  
  return {
    currentLevel,
    nextLevel: nextLevelData.level,
    xpNeeded: nextLevelData.xpRequired - currentXp,
    xpProgress: xpIntoCurrentLevel,
    progressPercent: Math.floor((xpIntoCurrentLevel / xpNeededForLevel) * 100)
  };
}

// Check if player earned a badge
export function checkBadgeEarned(
  badgeId: BadgeId,
  player: PlayerProfile,
  questChoices: Record<string, string>
): boolean {
  switch (badgeId) {
    case 'first-budget':
      // Earned by completing First Allowance quest
      return true; // Quest completion grants this
      
    case 'emergency-ready':
      // Earned by handling emergency without going negative
      return player.cash >= 0 && player.emergenciesHandled > 0;
      
    case 'goal-setter':
      // Earned by committing to a savings goal
      return true; // Quest completion grants this
      
    case 'helper':
      // Earned by helping Mr. Chen
      return questChoices['sg-accept'] !== undefined || 
             questChoices['sg-negotiate'] !== undefined;
      
    case 'balanced':
      // Earned by finishing Chapter 1 with good stats
      return player.happiness >= 60 && player.stress <= 50;
      
    default:
      return false;
  }
}

// Get badge details
export function getBadgeDetails(badgeId: BadgeId) {
  return BADGES[badgeId];
}

// Calculate bonus XP based on quest performance
export function calculateBonusXp(
  questId: string,
  player: PlayerProfile,
  choices: Record<string, string>
): { earned: boolean; amount: number; reason: string } {
  switch (questId) {
    case 'first-allowance':
      // Bonus for saving something
      if (choices['fa-save-10'] || choices['fa-save-5']) {
        return { earned: true, amount: 10, reason: 'Saved some of your allowance!' };
      }
      break;
      
    case 'hangout-invite':
      // Bonus for balanced choice
      if (choices['hi-arcade-budget'] || choices['hi-park']) {
        return { earned: true, amount: 15, reason: 'Made a balanced social choice!' };
      }
      break;
      
    case 'something-breaks':
      // Bonus for handling emergency well
      if (player.cash >= 0) {
        return { earned: true, amount: 20, reason: 'Handled emergency without going negative!' };
      }
      break;
      
    case 'side-gig':
      // Bonus for taking the job
      if (choices['sg-accept'] || choices['sg-negotiate']) {
        return { earned: true, amount: 15, reason: 'Earned money through work!' };
      }
      break;
      
    case 'saving-goal':
      // Bonus for committing to savings
      if (choices['sfg-commit-15'] || choices['sfg-commit-10']) {
        return { earned: true, amount: 20, reason: 'Committed to a savings plan!' };
      }
      break;
      
    case 'chapter-1-finale':
      // Bonus for good final stats
      if (player.happiness >= 60 && player.stress <= 50) {
        return { earned: true, amount: 25, reason: 'Finished with balanced stats!' };
      }
      break;
  }
  
  return { earned: false, amount: 0, reason: '' };
}

// Get encouraging message based on level
export function getLevelUpMessage(level: number): string {
  switch (level) {
    case 2:
      return "🎉 Level 2! You're getting the hang of budgeting!";
    case 3:
      return "🌟 Level 3! You've completed Chapter 1 - amazing progress!";
    case 4:
      return "💪 Level 4! You're becoming a budgeting pro!";
    case 5:
      return "🏆 Level 5! Maximum level reached - you're a money master!";
    default:
      return "Keep going! Every decision teaches you something.";
  }
}

// Get tier based on final stats
export function getChapterTier(player: PlayerProfile): {
  tier: string;
  title: string;
  emoji: string;
  description: string;
  tips: string[];
} {
  const { cash, savings, happiness, stress } = player;
  
  // Check various conditions
  if (stress >= 80 || cash < 0) {
    return {
      tier: 'struggled',
      title: 'The Learner',
      emoji: '📚',
      description: "This week was challenging, but every mistake is a lesson! You now know what NOT to do.",
      tips: [
        'Keep some money in savings for emergencies',
        'It\'s okay to say no to some wants',
        'Try again - you\'ll do better with what you learned!'
      ]
    };
  }
  
  if (savings >= 40 && happiness < 50) {
    return {
      tier: 'over-saver',
      title: 'The Super Saver',
      emoji: '🏦',
      description: "Wow, you saved a lot! But don't forget to enjoy life too. Balance is key.",
      tips: [
        'It\'s okay to spend on things that make you happy',
        'Friends and experiences are valuable too',
        'Try the 50/30/20 rule next time'
      ]
    };
  }
  
  if (happiness >= 80 && savings < 20) {
    return {
      tier: 'fun-focused',
      title: 'The Fun Seeker',
      emoji: '🎉',
      description: "You had a great time! But watch out - without savings, emergencies can be scary.",
      tips: [
        'Try to save at least $10-15 before spending on fun',
        'An emergency fund brings peace of mind',
        'You can have fun AND save - it just takes planning'
      ]
    };
  }
  
  if (happiness >= 60 && stress <= 50 && savings >= 25) {
    return {
      tier: 'balanced',
      title: 'The Balanced Budgeter',
      emoji: '⚖️',
      description: "Excellent work! You found the sweet spot between saving, spending, and enjoying life.",
      tips: [
        'Keep up these great habits!',
        'As you earn more, try to save more too',
        'You\'re ready for bigger financial challenges'
      ]
    };
  }
  
  // Default - middle ground
  return {
    tier: 'progressing',
    title: 'The Growing Budgeter',
    emoji: '🌱',
    description: "You're making progress! Every week you'll get better at balancing your money.",
    tips: [
      'Review your choices - what would you do differently?',
      'Try setting a specific savings goal',
      'Practice makes perfect!'
    ]
  };
}


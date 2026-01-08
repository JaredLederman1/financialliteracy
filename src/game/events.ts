import type { GameEvent } from './types';

export const EVENTS: GameEvent[] = [
  // === NEGATIVE EVENTS (6) ===
  {
    id: 'phone-cracked',
    title: '📱 Cracked Phone Screen',
    description: 'You dropped your phone and the screen cracked! You need it for school and staying in touch with friends.',
    type: 'emergency',
    choices: [
      {
        label: 'Get it repaired properly ($80)',
        needOrWant: 'need',
        cashDelta: -80,
        savingsDelta: 0,
        happinessDelta: 5,
        stressDelta: -5,
        outcomeText: 'Phone fixed! It looks good as new.'
      },
      {
        label: 'Use it cracked for now (free)',
        needOrWant: 'neutral',
        cashDelta: 0,
        savingsDelta: 0,
        happinessDelta: -10,
        stressDelta: 10,
        outcomeText: 'The cracked screen is annoying but you saved money.'
      }
    ]
  },
  {
    id: 'bike-flat',
    title: '🚲 Flat Tire',
    description: 'Your bike has a flat tire! You use it to get to school.',
    type: 'expense',
    choices: [
      {
        label: 'Buy a repair kit and fix it ($15)',
        needOrWant: 'need',
        cashDelta: -15,
        savingsDelta: 0,
        happinessDelta: 5,
        stressDelta: 0,
        outcomeText: 'You learned to fix a tire! Useful skill.'
      },
      {
        label: 'Walk to school instead (free)',
        needOrWant: 'neutral',
        cashDelta: 0,
        savingsDelta: 0,
        happinessDelta: -5,
        stressDelta: 5,
        outcomeText: 'Walking takes longer but you saved money.'
      }
    ]
  },
  {
    id: 'lost-lunch-money',
    title: '💸 Lost Lunch Money',
    description: 'Oh no! You lost $20 somewhere between home and school.',
    type: 'expense',
    defaultEffect: {
      cashDelta: -20,
      savingsDelta: 0,
      happinessDelta: -10,
      stressDelta: 10,
      outcomeText: 'You searched everywhere but the money is gone. Lesson learned: keep money in a safe place!'
    }
  },
  {
    id: 'school-supplies',
    title: '📚 School Supplies Needed',
    description: 'Your teacher says you need new supplies for a project.',
    type: 'expense',
    defaultEffect: {
      cashDelta: -25,
      savingsDelta: 0,
      happinessDelta: 0,
      stressDelta: 5,
      outcomeText: 'You bought the supplies. At least your project will look great!'
    }
  },
  {
    id: 'sick-day',
    title: '🤒 Feeling Sick',
    description: "You're not feeling well. Medicine would help you recover faster.",
    type: 'expense',
    choices: [
      {
        label: 'Buy cold medicine ($12)',
        needOrWant: 'need',
        cashDelta: -12,
        savingsDelta: 0,
        happinessDelta: 5,
        stressDelta: -5,
        outcomeText: 'The medicine helped! You feel better already.'
      },
      {
        label: 'Rest and drink water (free)',
        needOrWant: 'neutral',
        cashDelta: 0,
        savingsDelta: 0,
        happinessDelta: -5,
        stressDelta: 5,
        outcomeText: 'You recovered but it took longer. Rest is important too!'
      }
    ]
  },
  {
    id: 'pet-vet',
    title: '🐕 Pet Needs Vet Visit',
    description: 'Your pet seems unwell and might need to see the vet.',
    type: 'emergency',
    choices: [
      {
        label: 'Take them to the vet ($60)',
        needOrWant: 'need',
        cashDelta: -60,
        savingsDelta: 0,
        happinessDelta: 10,
        stressDelta: -10,
        outcomeText: 'Good news! The vet said it was minor. Your pet is happy and healthy!'
      },
      {
        label: 'Wait and see if they improve',
        needOrWant: 'neutral',
        cashDelta: 0,
        savingsDelta: 0,
        happinessDelta: -15,
        stressDelta: 15,
        outcomeText: 'Your pet seems okay but you feel guilty for not checking.'
      }
    ]
  },

  // === POSITIVE EVENTS (6) ===
  {
    id: 'birthday-money',
    title: '🎂 Birthday Gift!',
    description: 'Grandma sent you $50 for your birthday! What will you do with it?',
    type: 'bonus',
    choices: [
      {
        label: 'Save it all',
        needOrWant: 'neutral',
        cashDelta: 0,
        savingsDelta: 50,
        happinessDelta: 5,
        stressDelta: -5,
        outcomeText: 'Smart choice! Your savings are growing.'
      },
      {
        label: 'Keep it as spending money',
        needOrWant: 'want',
        cashDelta: 50,
        savingsDelta: 0,
        happinessDelta: 10,
        stressDelta: -5,
        outcomeText: 'Nice! You have extra cash for fun stuff.'
      }
    ]
  },
  {
    id: 'found-money',
    title: '💰 Lucky Find!',
    description: 'You found $10 on the ground! No one was around to claim it.',
    type: 'bonus',
    defaultEffect: {
      cashDelta: 10,
      savingsDelta: 0,
      happinessDelta: 10,
      stressDelta: -5,
      outcomeText: 'What a lucky day!'
    }
  },
  {
    id: 'good-grade-reward',
    title: '📝 Great Report Card!',
    description: 'Your parents are proud of your grades and give you $30 as a reward!',
    type: 'bonus',
    defaultEffect: {
      cashDelta: 30,
      savingsDelta: 0,
      happinessDelta: 15,
      stressDelta: -10,
      outcomeText: 'Hard work pays off! You feel proud and rewarded.'
    }
  },
  {
    id: 'neighbor-help',
    title: '🏡 Neighbor Needs Help',
    description: 'Your neighbor offers to pay you $25 to help with yard work this weekend.',
    type: 'opportunity',
    choices: [
      {
        label: 'Help out and earn $25',
        needOrWant: 'neutral',
        cashDelta: 25,
        savingsDelta: 0,
        happinessDelta: 5,
        stressDelta: 5,
        outcomeText: 'Hard work but worth it! You earned some extra cash.'
      },
      {
        label: 'Decline - you need rest',
        needOrWant: 'neutral',
        cashDelta: 0,
        savingsDelta: 0,
        happinessDelta: 5,
        stressDelta: -10,
        outcomeText: 'You enjoyed a relaxing weekend instead.'
      }
    ]
  },
  {
    id: 'recycling-reward',
    title: '♻️ Recycling Pays Off',
    description: 'You collected cans and bottles and earned $8 from recycling!',
    type: 'bonus',
    defaultEffect: {
      cashDelta: 8,
      savingsDelta: 0,
      happinessDelta: 8,
      stressDelta: 0,
      outcomeText: 'Helping the environment AND your wallet!'
    }
  },
  {
    id: 'tutoring-gig',
    title: '📖 Tutoring Opportunity',
    description: "A younger student's parent offers you $20 to help with homework.",
    type: 'opportunity',
    choices: [
      {
        label: 'Do the tutoring session',
        needOrWant: 'neutral',
        cashDelta: 20,
        savingsDelta: 0,
        happinessDelta: 10,
        stressDelta: 0,
        outcomeText: 'Teaching is rewarding! You helped someone learn.'
      },
      {
        label: 'Too busy right now',
        needOrWant: 'neutral',
        cashDelta: 0,
        savingsDelta: 0,
        happinessDelta: 0,
        stressDelta: -5,
        outcomeText: 'Maybe next time!'
      }
    ]
  },

  // === MIXED/SOCIAL EVENTS (4) ===
  {
    id: 'friend-movie',
    title: '🎬 Movie Night Invite',
    description: 'Friends want to go to the movies this weekend. Tickets are $15.',
    type: 'social',
    choices: [
      {
        label: 'Go to the movies ($15)',
        needOrWant: 'want',
        cashDelta: -15,
        savingsDelta: 0,
        happinessDelta: 15,
        stressDelta: -10,
        outcomeText: 'Great time with friends! The movie was awesome.'
      },
      {
        label: 'Suggest a free hangout instead',
        needOrWant: 'neutral',
        cashDelta: 0,
        savingsDelta: 0,
        happinessDelta: 5,
        stressDelta: 0,
        outcomeText: 'You hung out at the park instead. Still fun!'
      }
    ]
  },
  {
    id: 'game-sale',
    title: '🎮 Video Game Sale!',
    description: "That game you've been wanting is on sale for $30!",
    type: 'opportunity',
    choices: [
      {
        label: 'Buy it! ($30)',
        needOrWant: 'want',
        cashDelta: -30,
        savingsDelta: 0,
        happinessDelta: 20,
        stressDelta: -5,
        outcomeText: "Yes! You've been waiting for this. Time to play!"
      },
      {
        label: 'Wait for a bigger sale',
        needOrWant: 'neutral',
        cashDelta: 0,
        savingsDelta: 0,
        happinessDelta: -5,
        stressDelta: 0,
        outcomeText: 'Patience is hard but your wallet thanks you.'
      }
    ]
  },
  {
    id: 'pizza-party',
    title: '🍕 Pizza Party Contribution',
    description: "Your friend group is doing a pizza party. Everyone's chipping in $8.",
    type: 'social',
    choices: [
      {
        label: 'Chip in for pizza ($8)',
        needOrWant: 'want',
        cashDelta: -8,
        savingsDelta: 0,
        happinessDelta: 12,
        stressDelta: -5,
        outcomeText: 'Pizza with friends - nothing better!'
      },
      {
        label: 'Bring snacks from home instead',
        needOrWant: 'neutral',
        cashDelta: 0,
        savingsDelta: 0,
        happinessDelta: 5,
        stressDelta: 0,
        outcomeText: 'Everyone appreciated the variety!'
      }
    ]
  },
  {
    id: 'charity-drive',
    title: '💝 School Charity Drive',
    description: 'Your school is raising money for a good cause. Will you donate?',
    type: 'social',
    choices: [
      {
        label: 'Donate $10',
        needOrWant: 'neutral',
        cashDelta: -10,
        savingsDelta: 0,
        happinessDelta: 15,
        stressDelta: -5,
        outcomeText: 'Giving feels great! You made a difference.'
      },
      {
        label: 'Volunteer time instead',
        needOrWant: 'neutral',
        cashDelta: 0,
        savingsDelta: 0,
        happinessDelta: 10,
        stressDelta: 5,
        outcomeText: 'You helped set up the event. Time is valuable too!'
      }
    ]
  }
];

// Get events weighted by week
export function getWeightedEventTypes(week: number): { types: string[]; weights: number[] } {
  switch (week) {
    case 1:
      // Week 1: More social/neutral events
      return {
        types: ['social', 'bonus', 'opportunity', 'expense', 'emergency'],
        weights: [30, 25, 25, 15, 5]
      };
    case 2:
    case 3:
      // Weeks 2-3: More mixed
      return {
        types: ['social', 'bonus', 'opportunity', 'expense', 'emergency'],
        weights: [20, 20, 20, 25, 15]
      };
    case 4:
      // Week 4: Higher chance of emergency/expense
      return {
        types: ['social', 'bonus', 'opportunity', 'expense', 'emergency'],
        weights: [10, 15, 15, 30, 30]
      };
    default:
      return {
        types: ['social', 'bonus', 'opportunity', 'expense', 'emergency'],
        weights: [20, 20, 20, 20, 20]
      };
  }
}


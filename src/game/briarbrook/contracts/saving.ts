import type { Contract } from '../types';

export const SAVING_CONTRACTS: Contract[] = [
  {
    id: 'save_chest_or_pocket',
    title: 'Chest or Pocket',
    description: 'Learn why keeping money in a safe place matters!',
    npcName: 'Vaultkeeper Orin',
    npcEmoji: '🏦',
    category: 'saving',
    difficulty: 1,
    estimatedMinutes: 5,
    briefing: [
      { title: 'Welcome to the Town Vault!', text: 'Vaultkeeper Orin guards Briarbrook\'s savings. He\'ll teach you about keeping money safe.', icon: '🏦' },
      { title: 'Why Save?', text: 'Money in your pocket is easy to spend. Money in savings grows and stays safe for when you need it.', icon: '🐷' },
      { title: 'Safe Keeping', text: 'Banks (or vaults) protect your gold from loss, theft, and impulsive spending!', icon: '🔒' }
    ],
    steps: [
      { id: 'cop-1', type: 'info', speaker: 'Orin', text: "Ah, a young saver! Let me tell you a tale of two adventurers with 50 gold each..." },
      { id: 'cop-2', type: 'info', speaker: 'Orin', text: "One kept gold in their pocket. The other deposited in my vault. After one month..." },
      {
        id: 'cop-3', type: 'choice', speaker: 'narrator', text: 'Orin asks: "What do you think happened to the pocket-keeper\'s gold?"',
        choices: [
          { id: 'cop-3a', label: 'They probably spent it bit by bit', effects: { happinessDelta: 5 }, outcomeText: '"Exactly! Little purchases added up. They had only 15 gold left!"' },
          { id: 'cop-3b', label: 'Someone stole it', effects: {}, outcomeText: '"That happened to some! But mostly they just spent it without noticing."' },
          { id: 'cop-3c', label: 'They still had all 50', effects: {}, outcomeText: '"Rare! Most people find pocket money too easy to spend."' }
        ]
      },
      {
        id: 'cop-4', type: 'choice', speaker: 'narrator', text: 'Now it\'s your turn. You have 20 gold. How much do you want to deposit in the vault?',
        choices: [
          { id: 'cop-4a', label: 'Deposit 15 gold, keep 5', effects: { savingsDelta: 15, goldDelta: -15 }, outcomeText: 'Great! 75% saved. Your future self will thank you.' },
          { id: 'cop-4b', label: 'Deposit 10 gold, keep 10', effects: { savingsDelta: 10, goldDelta: -10 }, outcomeText: '50/50 split - a balanced approach!' },
          { id: 'cop-4c', label: 'Keep it all for now', effects: { stressDelta: 5 }, outcomeText: 'Your choice, but watch out for spontaneous spending!' }
        ]
      },
      { id: 'cop-5', type: 'info', speaker: 'Orin', text: "The vault also earns INTEREST - your gold grows over time just by sitting here! Let me show you..." },
      {
        id: 'cop-6', type: 'choice', speaker: 'narrator', text: 'Orin offers: "Leave your savings for one month and I\'ll add 1 gold as interest. Deal?"',
        choices: [
          { id: 'cop-6a', label: 'Deal! Free gold!', effects: { happinessDelta: 10 }, outcomeText: '"Smart! Your money works for you while you sleep!"' },
          { id: 'cop-6b', label: 'What\'s the catch?', effects: { happinessDelta: 5 }, outcomeText: '"No catch! We use your gold to help others, and share the profit. It\'s called banking!"' },
          { id: 'cop-6c', label: 'I might need it sooner', effects: {}, outcomeText: '"That\'s okay - you can withdraw anytime. The interest is just a bonus for waiting!"' }
        ]
      },
      { id: 'cop-7', type: 'result', speaker: 'Orin', text: "Remember: Out of sight, out of mind. Gold in savings is gold protected from impulse spending!" }
    ],
    reflection: {
      question: 'Why is keeping savings separate from spending money helpful?',
      choices: [
        { id: 'r1', label: 'It makes withdrawing harder to annoy you', effects: {}, outcomeText: 'The slight friction is a feature, not a bug - it prevents impulse spending!', isCorrect: false },
        { id: 'r2', label: 'You\'re less likely to spend money you don\'t see', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Separation reduces temptation and builds wealth over time.', isCorrect: true },
        { id: 'r3', label: 'Banks just want your gold', effects: {}, outcomeText: 'Banks provide valuable services like interest and security!', isCorrect: false }
      ],
      explanation: '"Out of sight, out of mind" works for savings. When money is in a separate account, you\'re less likely to spend it impulsively. Plus, savings can earn interest!'
    },
    rewards: { goldDelta: 0, xpDelta: 30, masteryDelta: 10 }
  },
  {
    id: 'save_emergency_pouch',
    title: 'Emergency Pouch',
    description: 'Build your first emergency fund for unexpected expenses!',
    npcName: 'Vaultkeeper Orin',
    npcEmoji: '🏦',
    category: 'saving',
    difficulty: 1,
    estimatedMinutes: 5,
    briefing: [
      { title: 'Life Happens!', text: 'Emergencies don\'t ask permission. A broken tool, sudden illness, or lost item can strike anytime.', icon: '🚨' },
      { title: 'Emergency Fund', text: 'An emergency fund is savings specifically for unexpected costs. It\'s your financial safety net!', icon: '🛡️' },
      { title: 'Peace of Mind', text: 'Having emergency savings reduces stress because you KNOW you can handle surprises.', icon: '😌' }
    ],
    steps: [
      { id: 'ep-1', type: 'info', speaker: 'Orin', text: "Let me tell you about emergency funds. Life WILL surprise you - the question is whether you're prepared." },
      {
        id: 'ep-2', type: 'choice', speaker: 'narrator', text: 'How much should an emergency fund be? Orin suggests starting with 30 gold (about 2 weeks of expenses).',
        choices: [
          { id: 'ep-2a', label: 'Start saving 5 gold/week toward 30', effects: { savingsDelta: 5, happinessDelta: 10 }, outcomeText: 'Great plan! In 6 weeks you\'ll have a full emergency fund.' },
          { id: 'ep-2b', label: 'Save 10 gold/week - build it faster', effects: { savingsDelta: 10, happinessDelta: 5, stressDelta: 5 }, outcomeText: 'Ambitious! 3 weeks to full fund, but tight spending for now.' },
          { id: 'ep-2c', label: 'I\'ll think about it later', effects: { stressDelta: 10 }, outcomeText: 'Emergencies don\'t wait for you to be "ready"...' }
        ]
      },
      {
        id: 'ep-3', type: 'choice', speaker: 'narrator', text: 'EMERGENCY! Your adventuring boots just broke. Repair costs 15 gold. Do you have it?',
        choices: [
          { id: 'ep-3a', label: 'Use emergency fund - that\'s what it\'s for!', effects: { savingsDelta: -15, stressDelta: -10 }, outcomeText: 'Perfect use! No stress, no debt. You handled it easily.' },
          { id: 'ep-3b', label: 'I don\'t have emergency savings...', effects: { stressDelta: 20, happinessDelta: -10 }, outcomeText: 'Now you need to scramble for gold or go without boots. Stressful!' },
          { id: 'ep-3c', label: 'Borrow from a friend', effects: { goldDelta: -15, stressDelta: 5 }, outcomeText: 'It works, but now you owe someone. Emergency funds prevent this!' }
        ]
      },
      {
        id: 'ep-4', type: 'choice', speaker: 'narrator', text: 'After the emergency, Orin advises: "Rebuild your fund before spending on wants again."',
        choices: [
          { id: 'ep-4a', label: 'Good idea - rebuild first', effects: { savingsDelta: 5, happinessDelta: 5 }, outcomeText: 'Smart! Refilling your safety net should be priority one.' },
          { id: 'ep-4b', label: 'But I want to have some fun too!', effects: { happinessDelta: 10, stressDelta: 5 }, outcomeText: 'Balance is fine, but try to save something toward the fund too!' },
          { id: 'ep-4c', label: 'One emergency won\'t happen again soon', effects: { stressDelta: 10 }, outcomeText: 'Famous last words! Murphy\'s Law says otherwise...' }
        ]
      },
      { id: 'ep-5', type: 'result', speaker: 'Orin', text: "An emergency fund is FREEDOM. You don't fear surprises because you're prepared. Start building yours today!" }
    ],
    reflection: {
      question: 'What is an emergency fund for?',
      choices: [
        { id: 'r1', label: 'Buying things you really want', effects: {}, outcomeText: 'That\'s savings for goals - emergency funds are for unexpected needs!', isCorrect: false },
        { id: 'r2', label: 'Covering unexpected necessary expenses', effects: { masteryDelta: 5 }, outcomeText: 'Correct! It\'s for true emergencies like repairs, illness, or job loss.', isCorrect: true },
        { id: 'r3', label: 'Making you feel rich', effects: {}, outcomeText: 'It does bring peace of mind, but its purpose is practical protection!', isCorrect: false }
      ],
      explanation: 'Emergency funds cover UNEXPECTED NECESSARY expenses - not wants, not planned purchases. Aim for 3-6 months of expenses as an adult, but even a small fund helps!'
    },
    rewards: { goldDelta: 0, xpDelta: 30, masteryDelta: 10 }
  },
  {
    id: 'save_fee_mystery',
    title: 'Vault Fee Mystery',
    description: 'Learn about account fees and how they can eat into your savings!',
    npcName: 'Vaultkeeper Orin',
    npcEmoji: '🏦',
    category: 'saving',
    difficulty: 2,
    estimatedMinutes: 6,
    briefing: [
      { title: 'The Fine Print', text: 'Not all savings accounts are created equal. Some have hidden costs!', icon: '📜' },
      { title: 'Fees', text: 'Banks sometimes charge fees for certain services. Understanding these protects your gold.', icon: '💸' },
      { title: 'Comparison Shopping', text: 'Just like products, you should compare different banks and accounts!', icon: '⚖️' }
    ],
    steps: [
      { id: 'fm-1', type: 'info', speaker: 'Orin', text: "A customer was confused why their savings weren't growing. Let me show you what happened..." },
      { id: 'fm-2', type: 'info', speaker: 'Orin', text: "They deposited 100 gold. Earned 2 gold interest. But the account had a 3 gold monthly fee. Net result: LOST 1 gold!" },
      {
        id: 'fm-3', type: 'choice', speaker: 'narrator', text: 'Orin shows you three account options. Which do you choose?',
        choices: [
          { id: 'fm-3a', label: 'Basic Account: No fees, 1% interest', effects: { happinessDelta: 5 }, outcomeText: 'Slow but steady! Your gold will grow, even if slowly.' },
          { id: 'fm-3b', label: 'Premium Account: 2 gold fee, 3% interest', effects: {}, outcomeText: 'Good if you have lots of gold - fees hurt small balances more.' },
          { id: 'fm-3c', label: 'Free Account: No fees, no interest', effects: { stressDelta: 5 }, outcomeText: 'Safe but not growing. Better than losing to fees though!' }
        ]
      },
      {
        id: 'fm-4', type: 'choice', speaker: 'narrator', text: 'A flashy new vault advertises "HIGHEST INTEREST IN TOWN!" but you notice tiny text about fees...',
        choices: [
          { id: 'fm-4a', label: 'Read the fine print carefully', effects: { happinessDelta: 10 }, outcomeText: 'Smart! You discover a 5 gold/month fee that wipes out the interest.' },
          { id: 'fm-4b', label: 'Trust the advertisement', effects: { goldDelta: -5, stressDelta: 10 }, outcomeText: 'The fees ate your interest and then some! Always read the details.' },
          { id: 'fm-4c', label: 'Ask Orin for his honest opinion', effects: { happinessDelta: 5 }, outcomeText: 'Orin warns you about the hidden fees. Good to ask experts!' }
        ]
      },
      {
        id: 'fm-5', type: 'choice', speaker: 'narrator', text: 'Orin offers to waive your account fee if you maintain a 50 gold minimum balance. Good deal?',
        choices: [
          { id: 'fm-5a', label: 'Yes! I\'ll keep 50 gold minimum', effects: { savingsDelta: 50, happinessDelta: 5 }, outcomeText: 'No fees AND your savings grow! The minimum requirement helps you save.' },
          { id: 'fm-5b', label: 'I can\'t commit to keeping that much', effects: {}, outcomeText: 'That\'s okay - the no-fee basic account is better for smaller balances.' },
          { id: 'fm-5c', label: 'What happens if I go under 50?', effects: { happinessDelta: 5 }, outcomeText: 'Great question! Orin explains: "You pay the fee that month. No surprises."' }
        ]
      },
      { id: 'fm-6', type: 'result', speaker: 'Orin', text: "Fees are sneaky! Always ask: What fees exist? Can I avoid them? Is the interest worth it? Read everything!" }
    ],
    reflection: {
      question: 'Why is it important to understand account fees?',
      choices: [
        { id: 'r1', label: 'Fees don\'t really matter much', effects: {}, outcomeText: 'Fees can actually consume your entire interest earnings!', isCorrect: false },
        { id: 'r2', label: 'Fees can cost more than you earn in interest', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Always compare fees vs. interest to find the best deal.', isCorrect: true },
        { id: 'r3', label: 'To complain to the bank', effects: {}, outcomeText: 'Better to understand upfront and choose wisely!', isCorrect: false }
      ],
      explanation: 'Account fees can cancel out or exceed interest earnings, especially on small balances. Always compare: (Interest earned) - (Fees paid) = Real return. Look for fee-free options when starting out!'
    },
    rewards: { goldDelta: 0, xpDelta: 40, masteryDelta: 15 }
  },
  {
    id: 'save_goal_bicycle_rune',
    title: 'Savings Goal: Bicycle Rune',
    description: 'Save up for something big by setting and tracking a goal!',
    npcName: 'Vaultkeeper Orin',
    npcEmoji: '🏦',
    category: 'saving',
    difficulty: 2,
    estimatedMinutes: 6,
    briefing: [
      { title: 'Dream Big!', text: 'You want a Bicycle Rune (80 gold) to travel faster around town. Let\'s make it happen!', icon: '🚲' },
      { title: 'Goal Setting', text: 'Savings goals work better when they\'re specific: What, how much, and by when?', icon: '🎯' },
      { title: 'Tracking Progress', text: 'Watching your savings grow toward a goal is motivating!', icon: '📈' }
    ],
    steps: [
      { id: 'br-1', type: 'info', speaker: 'Orin', text: "A Bicycle Rune costs 80 gold. You currently have 20 in savings. That's 60 more to save!" },
      {
        id: 'br-2', type: 'choice', speaker: 'narrator', text: 'How many weeks do you want to save for? This affects how much per week.',
        choices: [
          { id: 'br-2a', label: '4 weeks (15 gold/week) - I want it fast!', effects: { stressDelta: 10, happinessDelta: 10 }, outcomeText: 'Aggressive! You\'ll need to cut spending significantly.' },
          { id: 'br-2b', label: '6 weeks (10 gold/week) - balanced pace', effects: { happinessDelta: 5 }, outcomeText: 'A sustainable pace that leaves room for other things.' },
          { id: 'br-2c', label: '10 weeks (6 gold/week) - slow and steady', effects: { stressDelta: -5 }, outcomeText: 'Easy on your budget but requires patience!' }
        ]
      },
      {
        id: 'br-3', type: 'choice', speaker: 'narrator', text: 'Week 2: You\'re on track! But a limited-edition game just came out for 20 gold...',
        choices: [
          { id: 'br-3a', label: 'Stay focused - Bicycle Rune is the goal', effects: { savingsDelta: 10, happinessDelta: -5 }, outcomeText: 'Strong willpower! Your goal gets closer while the game will be there later.' },
          { id: 'br-3b', label: 'Buy the game, extend my timeline', effects: { goldDelta: -20, happinessDelta: 15, stressDelta: 5 }, outcomeText: 'Fun! But now the rune is 2 more weeks away...' },
          { id: 'br-3c', label: 'Save half of what I planned this week', effects: { savingsDelta: 5, happinessDelta: 8 }, outcomeText: 'Compromise: Some progress, some fun. Balance!' }
        ]
      },
      {
        id: 'br-4', type: 'choice', speaker: 'narrator', text: 'Week 4: You\'ve saved 50 gold! A used Bicycle Rune (not as nice) is available for 50 gold NOW.',
        choices: [
          { id: 'br-4a', label: 'Buy the used one - good enough!', effects: { savingsDelta: -50, happinessDelta: 15 }, outcomeText: 'Goal achieved early! The used rune works, even if it\'s not perfect.' },
          { id: 'br-4b', label: 'Wait for the new one I really want', effects: { happinessDelta: 5 }, outcomeText: 'Patience! Getting exactly what you want feels better.' },
          { id: 'br-4c', label: 'Compare quality - is new worth 30 more?', effects: { happinessDelta: 10 }, outcomeText: 'Smart thinking! You discover the new one lasts twice as long.' }
        ]
      },
      { id: 'br-5', type: 'result', speaker: 'Orin', text: "Whether you bought now or waited, you ACHIEVED A GOAL! That's the power of intentional saving!" }
    ],
    reflection: {
      question: 'What makes a savings goal effective?',
      choices: [
        { id: 'r1', label: 'Just wanting something really badly', effects: {}, outcomeText: 'Desire helps, but you need a plan!', isCorrect: false },
        { id: 'r2', label: 'A specific amount, deadline, and weekly plan', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Specific, measurable goals with deadlines work best.', isCorrect: true },
        { id: 'r3', label: 'Having a lot of money to start', effects: {}, outcomeText: 'You can achieve goals from any starting point with good planning!', isCorrect: false }
      ],
      explanation: 'SMART goals: Specific (what?), Measurable (how much?), Achievable (realistic?), Relevant (do you want it?), Time-bound (by when?). This framework makes goals happen!'
    },
    rewards: { goldDelta: 0, xpDelta: 40, masteryDelta: 15 }
  },
  {
    id: 'save_rainy_day_storm',
    title: 'Rainy Day Storm',
    description: 'A major unexpected expense tests your financial preparedness!',
    npcName: 'Vaultkeeper Orin',
    npcEmoji: '🏦',
    category: 'saving',
    difficulty: 3,
    estimatedMinutes: 7,
    briefing: [
      { title: 'Storm Warning!', text: 'A massive storm is coming to Briarbrook. It will cause damage and disruptions.', icon: '🌧️' },
      { title: 'Multiple Emergencies', text: 'Sometimes problems pile up. This tests how well you\'ve prepared.', icon: '📚' },
      { title: 'Prioritization', text: 'When money is tight, you must choose what\'s most important.', icon: '⚖️' }
    ],
    steps: [
      { id: 'rds-1', type: 'info', speaker: 'Orin', text: "A big storm hit! Let's see how your savings hold up against multiple challenges." },
      {
        id: 'rds-2', type: 'choice', speaker: 'narrator', text: 'The storm damaged your roof (30 gold repair). Your emergency fund has 40 gold. What do you do?',
        choices: [
          { id: 'rds-2a', label: 'Use emergency fund - that\'s its purpose', effects: { savingsDelta: -30, stressDelta: -5 }, outcomeText: 'Roof fixed! You have 10 gold left in emergency fund.' },
          { id: 'rds-2b', label: 'Try to fix it yourself to save gold', effects: { goldDelta: -10, stressDelta: 15, happinessDelta: -10 }, outcomeText: 'Your repair held but wasn\'t great. Might cause issues later.' },
          { id: 'rds-2c', label: 'Get 3 quotes to find the best price', effects: { savingsDelta: -25, happinessDelta: 5 }, outcomeText: 'Great thinking! You found a 25 gold option and saved 5 gold.' }
        ]
      },
      {
        id: 'rds-3', type: 'choice', speaker: 'narrator', text: 'Second problem: Storm ruined the town\'s food supply. Prices doubled! Food costs 20 gold this week instead of 10.',
        choices: [
          { id: 'rds-3a', label: 'Pay the higher prices from spending money', effects: { goldDelta: -20, stressDelta: 10 }, outcomeText: 'Your belly is full but wallet is empty.' },
          { id: 'rds-3b', label: 'Use some emergency fund for needs', effects: { savingsDelta: -10, goldDelta: -10 }, outcomeText: 'Split between funds - reasonable for a true emergency.' },
          { id: 'rds-3c', label: 'Eat simpler meals, only buy essentials', effects: { goldDelta: -12, happinessDelta: -5 }, outcomeText: 'Rice and beans! Not exciting but affordable.' }
        ]
      },
      {
        id: 'rds-4', type: 'choice', speaker: 'narrator', text: 'Third hit: Work canceled for a week. No income! But you still need to eat and rebuild savings.',
        choices: [
          { id: 'rds-4a', label: 'Look for temporary storm cleanup work', effects: { goldDelta: 15, stressDelta: 5, happinessDelta: 5 }, outcomeText: 'You found work helping clear debris! Some income is better than none.' },
          { id: 'rds-4b', label: 'Live off remaining savings carefully', effects: { savingsDelta: -10, stressDelta: 10 }, outcomeText: 'Savings being used as intended, but it\'s stressful.' },
          { id: 'rds-4c', label: 'Ask neighbors for help/trading', effects: { happinessDelta: 10 }, outcomeText: 'Community came together! You traded skills and shared resources.' }
        ]
      },
      { id: 'rds-5', type: 'result', speaker: 'Orin', text: "The storm passed! This is why we save - not for fun purchases, but for life's uncertainties. Rebuild and prepare for next time." }
    ],
    reflection: {
      question: 'What\'s the best strategy when facing multiple financial emergencies?',
      choices: [
        { id: 'r1', label: 'Panic and spend everything immediately', effects: {}, outcomeText: 'Panic leads to poor decisions. Stay calm and prioritize!', isCorrect: false },
        { id: 'r2', label: 'Prioritize needs, find creative solutions, use savings wisely', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Triage problems, get creative, and preserve resources where possible.', isCorrect: true },
        { id: 'r3', label: 'Ignore problems until they go away', effects: {}, outcomeText: 'Financial problems grow worse when ignored!', isCorrect: false }
      ],
      explanation: 'In crisis: 1) Stay calm, 2) List all problems, 3) Prioritize by urgency, 4) Explore creative solutions, 5) Use savings for true emergencies, 6) Rebuild savings after.'
    },
    rewards: { goldDelta: 0, xpDelta: 60, masteryDelta: 25 }
  }
];


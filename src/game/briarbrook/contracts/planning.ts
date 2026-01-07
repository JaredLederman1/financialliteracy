import type { Contract } from '../types';

export const PLANNING_CONTRACTS: Contract[] = [
  {
    id: 'plan_big_quest',
    title: 'Pick Your Big Quest',
    description: 'Choose a long-term financial goal that will guide your journey!',
    npcName: 'Captain Rowan',
    npcEmoji: '🦅',
    category: 'planning',
    difficulty: 1,
    estimatedMinutes: 5,
    briefing: [
      { title: 'Welcome to the Guild Hall!', text: 'Captain Rowan leads Briarbrook\'s adventuring guild. She\'ll help you think about your future.', icon: '🦅' },
      { title: 'The Big Picture', text: 'Day-to-day budgeting is important, but so is knowing what you\'re working toward!', icon: '🗺️' },
      { title: 'Your First Big Goal', text: 'Let\'s choose a major financial goal that will take months to achieve.', icon: '⭐' }
    ],
    steps: [
      { id: 'bq-1', type: 'info', speaker: 'Rowan', text: "Every great adventurer needs a quest. Not just daily tasks - a BIG goal that gives direction to everything else." },
      {
        id: 'bq-2', type: 'choice', speaker: 'narrator', text: 'What kind of long-term goal excites you most?',
        choices: [
          { id: 'bq-2a', label: '🏠 Save for something big (100+ gold)', effects: { happinessDelta: 10 }, outcomeText: 'A saver! Big purchases feel amazing when you\'ve earned them.' },
          { id: 'bq-2b', label: '🎓 Invest in skills and education', effects: { happinessDelta: 10 }, outcomeText: 'An investor! Skills pay dividends forever.' },
          { id: 'bq-2c', label: '🏰 Build long-term security', effects: { happinessDelta: 10 }, outcomeText: 'A planner! Security brings peace of mind.' },
          { id: 'bq-2d', label: '🌍 Save for experiences and travel', effects: { happinessDelta: 10 }, outcomeText: 'An explorer! Experiences create lifelong memories.' }
        ]
      },
      { id: 'bq-3', type: 'info', speaker: 'Rowan', text: "Good choice! Now let's make it specific. A vague goal is just a wish. A specific goal is a plan." },
      {
        id: 'bq-3b', type: 'choice', speaker: 'narrator', text: 'Make your goal specific: What exactly do you want?',
        choices: [
          { id: 'bq-3b-a', label: 'A new enchanted bicycle (150 gold)', effects: {}, outcomeText: 'Specific! 150 gold, clear target, achievable timeline.' },
          { id: 'bq-3b-b', label: 'Guild membership for training (200 gold)', effects: {}, outcomeText: 'An investment in yourself! Clear cost, valuable outcome.' },
          { id: 'bq-3b-c', label: '6-month emergency fund (300 gold)', effects: {}, outcomeText: 'Security first! A foundation for all future goals.' },
          { id: 'bq-3b-d', label: 'Trip to the Crystal Mountains (250 gold)', effects: {}, outcomeText: 'Adventure! A memorable experience worth saving for.' }
        ]
      },
      {
        id: 'bq-4', type: 'choice', speaker: 'narrator', text: 'Rowan asks: "How long will you give yourself to reach this goal?"',
        choices: [
          { id: 'bq-4a', label: '3 months - aggressive saving!', effects: { stressDelta: 5, happinessDelta: 5 }, outcomeText: 'Ambitious! You\'ll need to save a lot each week.' },
          { id: 'bq-4b', label: '6 months - steady progress', effects: { happinessDelta: 10 }, outcomeText: 'Balanced! Achievable without sacrificing everything.' },
          { id: 'bq-4c', label: '1 year - slow and steady', effects: { happinessDelta: 5, stressDelta: -5 }, outcomeText: 'Patience! Lower weekly commitment, longer wait.' }
        ]
      },
      { id: 'bq-5', type: 'result', speaker: 'Rowan', text: "Your Big Quest is set! This goal will guide your financial decisions. Every choice can now ask: 'Does this help or hurt my quest?'" }
    ],
    reflection: {
      question: 'Why is it important to have a specific financial goal?',
      choices: [
        { id: 'r1', label: 'It impresses other people', effects: {}, outcomeText: 'Goals are for YOU, not to impress others!', isCorrect: false },
        { id: 'r2', label: 'Specific goals help you make daily decisions and stay motivated', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Goals give direction and help you say no to distractions.', isCorrect: true },
        { id: 'r3', label: 'You can brag about it on social scrolls', effects: {}, outcomeText: 'Keep your goals private - they\'re more likely to happen!', isCorrect: false }
      ],
      explanation: 'SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) are more likely to succeed. "Save more money" is a wish. "Save 150 gold for a bicycle in 6 months" is a plan!'
    },
    rewards: { goldDelta: 0, xpDelta: 30, masteryDelta: 10 }
  },
  {
    id: 'plan_path_after_school',
    title: 'Path After School',
    description: 'Explore different career paths and their financial implications.',
    npcName: 'Captain Rowan',
    npcEmoji: '🦅',
    category: 'planning',
    difficulty: 1,
    estimatedMinutes: 5,
    briefing: [
      { title: 'Your Future Path', text: 'Different careers offer different incomes, but also different costs and lifestyles.', icon: '🛤️' },
      { title: 'Trade-offs', text: 'Some paths pay more but cost more to enter. Others pay less but start earning sooner.', icon: '⚖️' },
      { title: 'No Wrong Answers', text: 'What matters is choosing consciously and planning accordingly!', icon: '✨' }
    ],
    steps: [
      { id: 'pas-1', type: 'info', speaker: 'Rowan', text: "Guild members come from all backgrounds. Let me show you different paths and their financial realities." },
      {
        id: 'pas-2', type: 'choice', speaker: 'narrator', text: 'Rowan presents three paths. Which interests you?',
        choices: [
          { id: 'pas-2a', label: '⚔️ Warrior (trade school, 1 year)', effects: { happinessDelta: 5 }, outcomeText: 'Quick training! Earn 40 gold/week after 1 year, moderate debt.' },
          { id: 'pas-2b', label: '🔮 Mage (academy, 4 years)', effects: { happinessDelta: 5 }, outcomeText: 'Long training! Earn 80 gold/week after 4 years, significant debt.' },
          { id: 'pas-2c', label: '🏪 Merchant (start now, apprentice)', effects: { happinessDelta: 5 }, outcomeText: 'Start immediately! Earn 25 gold/week now, grows with experience.' }
        ]
      },
      { id: 'pas-3', type: 'info', speaker: 'Rowan', text: "Over 10 years: Warrior earns ~18,000g. Mage earns ~25,000g but starts 3 years later. Merchant earns ~15,000g but with no debt." },
      {
        id: 'pas-4', type: 'choice', speaker: 'narrator', text: 'What factor matters MOST to you in choosing a path?',
        choices: [
          { id: 'pas-4a', label: 'Maximum lifetime earnings', effects: {}, outcomeText: 'The Mage path earns most eventually, despite late start.' },
          { id: 'pas-4b', label: 'Starting to earn money quickly', effects: {}, outcomeText: 'Merchant or Warrior let you earn sooner and avoid debt.' },
          { id: 'pas-4c', label: 'Doing work I enjoy', effects: { happinessDelta: 10 }, outcomeText: 'Most important! Money matters, but so does daily happiness.' },
          { id: 'pas-4d', label: 'Work-life balance', effects: { happinessDelta: 5 }, outcomeText: 'Valid! Some high-paying jobs demand more time and energy.' }
        ]
      },
      {
        id: 'pas-5', type: 'choice', speaker: 'narrator', text: 'Rowan asks: "If training costs money, how would you pay for it?"',
        choices: [
          { id: 'pas-5a', label: 'Save up before starting', effects: { happinessDelta: 5 }, outcomeText: 'Delayed start but no debt. A conservative approach.' },
          { id: 'pas-5b', label: 'Take a student loan', effects: {}, outcomeText: 'Start sooner but carry debt. Higher earners can handle this.' },
          { id: 'pas-5c', label: 'Work while training', effects: { stressDelta: 5 }, outcomeText: 'Harder but possible! No debt, slower progress.' },
          { id: 'pas-5d', label: 'Apply for scholarships', effects: { happinessDelta: 10 }, outcomeText: 'Free money exists! Always look for grants and scholarships first.' }
        ]
      },
      { id: 'pas-6', type: 'result', speaker: 'Rowan', text: "There's no universally 'best' path - only the best path for YOU. Consider earnings, costs, time, and happiness." }
    ],
    reflection: {
      question: 'What should you consider when choosing a career path?',
      choices: [
        { id: 'r1', label: 'Only how much it pays', effects: {}, outcomeText: 'Money matters, but so does enjoyment and lifestyle!', isCorrect: false },
        { id: 'r2', label: 'Income, costs, time to start earning, and personal fulfillment', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Balance financial and personal factors for the best fit.', isCorrect: true },
        { id: 'r3', label: 'Whatever your parents say', effects: {}, outcomeText: 'Their input matters but it\'s YOUR life to live!', isCorrect: false }
      ],
      explanation: 'Career planning involves: potential income, cost to enter (training/education), time before earning, job satisfaction, work-life balance, and future outlook. No single factor should dominate!'
    },
    rewards: { goldDelta: 0, xpDelta: 30, masteryDelta: 10 }
  },
  {
    id: 'plan_map_of_months',
    title: 'The Map of Months',
    description: 'Create a multi-month financial plan for a complex goal.',
    npcName: 'Captain Rowan',
    npcEmoji: '🦅',
    category: 'planning',
    difficulty: 2,
    estimatedMinutes: 6,
    briefing: [
      { title: 'Planning Ahead', text: 'Big goals need month-by-month planning. Let\'s map out a 6-month journey!', icon: '🗓️' },
      { title: 'Milestones', text: 'Break big goals into smaller checkpoints to track progress and stay motivated.', icon: '🏁' },
      { title: 'Flexibility', text: 'Plans will change! Good planning includes room for adjustment.', icon: '🔄' }
    ],
    steps: [
      { id: 'mom-1', type: 'info', speaker: 'Rowan', text: "Let's plan a 6-month journey to save 180 gold (30 gold/month). I'll show you how to map it." },
      {
        id: 'mom-2', type: 'choice', speaker: 'narrator', text: 'Month 1-2 strategy: You\'re starting fresh. How do you begin?',
        choices: [
          { id: 'mom-2a', label: 'Start at 30 gold/month immediately', effects: { stressDelta: 5 }, outcomeText: 'Ambitious! Starting strong but might burn out.' },
          { id: 'mom-2b', label: 'Start with 25, increase later', effects: { happinessDelta: 5 }, outcomeText: 'Ramp-up approach! Build the habit first.' },
          { id: 'mom-2c', label: 'Start with 35 to build a buffer', effects: { happinessDelta: 10 }, outcomeText: 'Excellent! Extra early creates safety margin for later.' }
        ]
      },
      {
        id: 'mom-3', type: 'choice', speaker: 'narrator', text: 'Month 3: Checkpoint! You\'ve saved 70 gold (target was 90). You\'re behind. What do you do?',
        choices: [
          { id: 'mom-3a', label: 'Increase savings next 3 months to catch up', effects: { stressDelta: 10, happinessDelta: 5 }, outcomeText: 'Recovery plan! You\'ll need 37 gold/month now.' },
          { id: 'mom-3b', label: 'Extend deadline by 1 month', effects: { happinessDelta: 5 }, outcomeText: 'Adjust the plan, not yourself. Still achievable!' },
          { id: 'mom-3c', label: 'Find extra income this month', effects: { goldDelta: 10, happinessDelta: 10 }, outcomeText: 'Creative! One-time effort gets you back on track.' }
        ]
      },
      {
        id: 'mom-4', type: 'choice', speaker: 'narrator', text: 'Month 4: Good news! You got a bonus of 40 gold. How do you use it?',
        choices: [
          { id: 'mom-4a', label: 'All toward the goal', effects: { savingsDelta: 40, happinessDelta: 10 }, outcomeText: 'You\'re ahead of schedule now! Could finish early.' },
          { id: 'mom-4b', label: '30 to goal, 10 for a small reward', effects: { savingsDelta: 30, happinessDelta: 15 }, outcomeText: 'Balance! Progress + celebration keeps you motivated.' },
          { id: 'mom-4c', label: 'Put it in emergency fund instead', effects: { savingsDelta: 40, stressDelta: -10 }, outcomeText: 'Unexpected wisdom! Security is also a worthy goal.' }
        ]
      },
      {
        id: 'mom-5', type: 'choice', speaker: 'narrator', text: 'Month 6: You reached 180 gold! But you see something else you want for 50 gold. Use goal money?',
        choices: [
          { id: 'mom-5a', label: 'No! Stick to the original plan', effects: { happinessDelta: 15 }, outcomeText: 'Discipline! Your original goal matters more than shiny distractions.' },
          { id: 'mom-5b', label: 'Wait - is this a better use of the money?', effects: { happinessDelta: 10 }, outcomeText: 'Good question! Sometimes goals DO change with new information.' },
          { id: 'mom-5c', label: 'Split it - 150 for goal, 30 for this', effects: { happinessDelta: 8 }, outcomeText: 'Compromise, but your original goal now gets less...' }
        ]
      },
      { id: 'mom-6', type: 'result', speaker: 'Rowan', text: "You completed a 6-month plan! Remember: plans guide but don't control. Adapt as needed while keeping your goal in sight." }
    ],
    reflection: {
      question: 'What should you do when you fall behind on a savings plan?',
      choices: [
        { id: 'r1', label: 'Give up - the plan failed', effects: {}, outcomeText: 'Never give up! Plans can be adjusted.', isCorrect: false },
        { id: 'r2', label: 'Adjust the plan, timeline, or find extra income', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Flexibility is key - adjust and continue forward.', isCorrect: true },
        { id: 'r3', label: 'Ignore it and hope it works out', effects: {}, outcomeText: 'Ignoring problems makes them worse!', isCorrect: false }
      ],
      explanation: 'When behind on a plan: 1) Don\'t panic or quit, 2) Analyze why you\'re behind, 3) Adjust timeline or contributions, 4) Find ways to recover (extra income, reduced spending), 5) Continue with adjusted plan!'
    },
    rewards: { goldDelta: 0, xpDelta: 40, masteryDelta: 15 }
  },
  {
    id: 'plan_seed_of_growth',
    title: 'Seed of Growth',
    description: 'Learn the basics of investing and growing your wealth over time.',
    npcName: 'Captain Rowan',
    npcEmoji: '🦅',
    category: 'planning',
    difficulty: 2,
    estimatedMinutes: 6,
    briefing: [
      { title: 'Beyond Saving', text: 'Saving protects money. INVESTING can make it grow faster - but with risks!', icon: '🌱' },
      { title: 'Time and Growth', text: 'The longer money is invested, the more it can grow through compound returns.', icon: '📈' },
      { title: 'Risk and Reward', text: 'Higher potential returns usually mean higher risk. Balance is key!', icon: '⚖️' }
    ],
    steps: [
      { id: 'sog-1', type: 'info', speaker: 'Rowan', text: "You've learned to save. Now let's talk about making your gold GROW. This is called investing." },
      {
        id: 'sog-2', type: 'choice', speaker: 'narrator', text: 'Rowan explains: "If you invest 100 gold and it grows 10% per year, after 1 year you have..."',
        choices: [
          { id: 'sog-2a', label: '100 gold (same amount)', effects: {}, outcomeText: 'Not quite! 10% growth means you gained something.' },
          { id: 'sog-2b', label: '110 gold (gained 10)', effects: { happinessDelta: 10 }, outcomeText: 'Correct! 100 + 10% = 110. Your money worked for you!' },
          { id: 'sog-2c', label: '1000 gold (10x growth)', effects: {}, outcomeText: '10% growth, not 10x! That would be 1000% growth.' }
        ]
      },
      { id: 'sog-3', type: 'info', speaker: 'Rowan', text: "Here's the magic: Compound growth. Year 2, you earn 10% on 110 gold = 121 gold. The growth GROWS!" },
      {
        id: 'sog-4', type: 'choice', speaker: 'narrator', text: 'Rowan offers three investment seeds: Safe (3% growth, low risk), Balanced (7%, medium risk), Risky (15%, high risk).',
        choices: [
          { id: 'sog-4a', label: 'Safe - I can\'t lose money', effects: { happinessDelta: 5 }, outcomeText: 'Slow but steady! 100 gold becomes 134 in 10 years.' },
          { id: 'sog-4b', label: 'Balanced - some risk for better returns', effects: { happinessDelta: 10 }, outcomeText: 'Reasonable! 100 gold becomes 197 in 10 years.' },
          { id: 'sog-4c', label: 'Risky - go big or go home!', effects: { stressDelta: 5 }, outcomeText: 'Exciting! 100 could become 404... or 50. High variance!' }
        ]
      },
      {
        id: 'sog-5', type: 'choice', speaker: 'narrator', text: 'Rowan asks: "When should you start investing?"',
        choices: [
          { id: 'sog-5a', label: 'When I have lots of gold', effects: {}, outcomeText: 'Actually, starting early matters more than starting big!' },
          { id: 'sog-5b', label: 'As early as possible, even small amounts', effects: { happinessDelta: 15 }, outcomeText: 'Exactly! Time is your biggest advantage. Start small, start early.' },
          { id: 'sog-5c', label: 'After I pay off all debt', effects: { happinessDelta: 5 }, outcomeText: 'Depends on interest rates! Sometimes do both.' }
        ]
      },
      { id: 'sog-6', type: 'result', speaker: 'Rowan', text: "Investing is planting seeds for future you. Start early, diversify risk, and let time do the heavy lifting!" }
    ],
    reflection: {
      question: 'Why is starting to invest early so powerful?',
      choices: [
        { id: 'r1', label: 'You can show off to friends sooner', effects: {}, outcomeText: 'Investing isn\'t about showing off!', isCorrect: false },
        { id: 'r2', label: 'Compound growth has more time to work', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Time turns small amounts into large ones through compounding.', isCorrect: true },
        { id: 'r3', label: 'Banks give better rates to young people', effects: {}, outcomeText: 'Not really - it\'s about time, not age-based rates!', isCorrect: false }
      ],
      explanation: 'Compound growth is exponential - money earns returns, then those returns earn returns. Starting 10 years earlier can DOUBLE your final amount with the same monthly contribution. Time > amount!'
    },
    rewards: { goldDelta: 0, xpDelta: 40, masteryDelta: 15 }
  },
  {
    id: 'plan_briarbrook_trial',
    title: 'Capstone: The Briarbrook Trial',
    description: 'Face a comprehensive financial challenge combining everything you\'ve learned!',
    npcName: 'Captain Rowan',
    npcEmoji: '🦅',
    category: 'planning',
    difficulty: 3,
    estimatedMinutes: 8,
    briefing: [
      { title: 'The Ultimate Test', text: 'Captain Rowan has designed a trial that tests ALL your financial skills!', icon: '⚔️' },
      { title: 'Real-World Simulation', text: 'You\'ll face earning, budgeting, saving, credit, and planning decisions in one scenario.', icon: '🌍' },
      { title: 'Prove Your Mastery', text: 'Success means you\'ve truly learned the principles of financial wisdom.', icon: '🏆' }
    ],
    steps: [
      { id: 'bt-1', type: 'info', speaker: 'Rowan', text: "The Briarbrook Trial: One year in the life of a young adventurer. Every choice matters. Begin!" },
      { id: 'bt-2', type: 'info', speaker: 'narrator', text: "You start with 50 gold in cash, 20 in savings. Income: 30 gold/week. Goal: Build wealth while staying happy and stress-free." },
      {
        id: 'bt-3', type: 'choice', speaker: 'narrator', text: 'MONTH 1 - EARNING: Extra work opportunity! Garden job pays 40 gold but takes a weekend.',
        choices: [
          { id: 'bt-3a', label: 'Take the job - 40 gold is worth it', effects: { goldDelta: 40, stressDelta: 10, happinessDelta: -5 }, outcomeText: 'You earned 40 gold but missed a friend\'s gathering.' },
          { id: 'bt-3b', label: 'Skip it - weekends are for fun', effects: { happinessDelta: 10 }, outcomeText: 'Great weekend! But your savings grow slower.' },
          { id: 'bt-3c', label: 'Negotiate half-day work for 20 gold', effects: { goldDelta: 20, happinessDelta: 5 }, outcomeText: 'Balance! Some extra gold, some weekend fun.' }
        ]
      },
      {
        id: 'bt-4', type: 'choice', speaker: 'narrator', text: 'MONTH 3 - BUDGETING: Your friend\'s birthday! Gift options: 5 gold (basic), 15 gold (nice), 30 gold (extravagant).',
        choices: [
          { id: 'bt-4a', label: '5 gold - it\'s the thought that counts', effects: { goldDelta: -5, happinessDelta: 5 }, outcomeText: 'Thoughtful but simple. Your friend appreciates it.' },
          { id: 'bt-4b', label: '15 gold - balance of quality and budget', effects: { goldDelta: -15, happinessDelta: 10 }, outcomeText: 'A great gift within your means! Perfect choice.' },
          { id: 'bt-4c', label: '30 gold - they deserve the best!', effects: { goldDelta: -30, happinessDelta: 15, stressDelta: 10 }, outcomeText: 'They loved it! But that was a big chunk of savings...' }
        ]
      },
      {
        id: 'bt-5', type: 'choice', speaker: 'narrator', text: 'MONTH 5 - SAVING: Emergency! You need 60 gold for urgent tool repair. You have 80 saved.',
        choices: [
          { id: 'bt-5a', label: 'Use savings - that\'s what it\'s for', effects: { savingsDelta: -60, stressDelta: -10 }, outcomeText: 'Emergency handled smoothly! This is why you saved.' },
          { id: 'bt-5b', label: 'Get 3 quotes, find cheaper option (45g)', effects: { savingsDelta: -45, happinessDelta: 5 }, outcomeText: 'Research saved 15 gold! Always shop around.' },
          { id: 'bt-5c', label: 'Borrow instead to protect savings', effects: { stressDelta: 15 }, outcomeText: 'You have savings for this! Borrowing adds unnecessary cost.' }
        ]
      },
      {
        id: 'bt-6', type: 'choice', speaker: 'narrator', text: 'MONTH 8 - CREDIT: "Buy Now Pay Later" offer for new armor (100 gold = 4 x 25 payments). You have 60 gold saved.',
        choices: [
          { id: 'bt-6a', label: 'Use BNPL - get armor now', effects: { goldDelta: -25, stressDelta: 10 }, outcomeText: 'Armor acquired but 3 more payments loom ahead.' },
          { id: 'bt-6b', label: 'Wait and save 40 more gold', effects: { happinessDelta: 5 }, outcomeText: 'Patience! In 2 months you buy it outright, no stress.' },
          { id: 'bt-6c', label: 'Buy used armor for 50 gold now', effects: { goldDelta: -50, happinessDelta: 8 }, outcomeText: 'Creative solution! Good enough armor, no debt.' }
        ]
      },
      {
        id: 'bt-7', type: 'choice', speaker: 'narrator', text: 'MONTH 12 - PLANNING: Year-end review! You can invest 50 gold for long-term growth. Do you?',
        choices: [
          { id: 'bt-7a', label: 'Yes - start building for the future', effects: { savingsDelta: -50, happinessDelta: 15 }, outcomeText: 'Invested! This will grow over time. You\'re thinking ahead.' },
          { id: 'bt-7b', label: 'Not yet - build emergency fund first', effects: { savingsDelta: 50, happinessDelta: 10 }, outcomeText: 'Security first! A valid strategy before investing.' },
          { id: 'bt-7c', label: 'Invest 25, keep 25 in savings', effects: { savingsDelta: -25, happinessDelta: 12 }, outcomeText: 'Balance! Some growth potential, some security.' }
        ]
      },
      { id: 'bt-8', type: 'result', speaker: 'Rowan', text: "The Briarbrook Trial is complete! You've demonstrated financial wisdom across all domains. You are now a certified Briarbrook Financial Adventurer!" }
    ],
    reflection: {
      question: 'What\'s the most important financial principle you\'ve learned?',
      choices: [
        { id: 'r1', label: 'Always save every single gold piece', effects: {}, outcomeText: 'Balance matters! Saving is important but so is living.', isCorrect: false },
        { id: 'r2', label: 'Balance is key - plan, save, enjoy, and adapt', effects: { masteryDelta: 10 }, outcomeText: 'Perfect! Financial success is about balance and conscious choices.', isCorrect: true },
        { id: 'r3', label: 'Spend now, worry later', effects: {}, outcomeText: 'This leads to stress and debt! Planning ahead is crucial.', isCorrect: false }
      ],
      explanation: 'Financial mastery isn\'t about extreme saving OR extreme spending. It\'s about: conscious choices, balancing present and future, preparing for emergencies, avoiding bad debt, and investing in growth. You\'ve learned it all!'
    },
    rewards: { goldDelta: 100, xpDelta: 100, masteryDelta: 30 }
  }
];


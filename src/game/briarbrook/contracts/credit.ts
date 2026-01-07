import type { Contract } from '../types';

export const CREDIT_CONTRACTS: Contract[] = [
  {
    id: 'cred_borrowed_lantern',
    title: 'Borrowed Lantern',
    description: 'Learn what borrowing really means through a simple example.',
    npcName: 'Selene the Deal Maker',
    npcEmoji: '🌙',
    category: 'credit',
    difficulty: 1,
    estimatedMinutes: 5,
    briefing: [
      { title: 'The Merchant of Deals', text: 'Selene offers loans and credit. She\'ll teach you how borrowing works - and its costs.', icon: '🌙' },
      { title: 'What is Borrowing?', text: 'Borrowing means using someone else\'s money now and paying it back later - usually with extra (interest).', icon: '🤝' },
      { title: 'When to Borrow', text: 'Borrowing can help in emergencies, but it always has a cost. Let\'s learn when it makes sense.', icon: '⚖️' }
    ],
    steps: [
      { id: 'bl-1', type: 'info', speaker: 'Selene', text: "Welcome! I lend gold to those who need it. But remember - borrowed gold must be repaid, with interest." },
      {
        id: 'bl-2', type: 'choice', speaker: 'narrator', text: 'You need a lantern for tonight\'s safe travel (10 gold). You only have 5 gold. Selene offers to lend you 5 gold, but you\'ll owe 6 back.',
        choices: [
          { id: 'bl-2a', label: 'Borrow 5, owe 6 - I need the lantern now', effects: { goldDelta: 5, stressDelta: 5 }, outcomeText: 'You got the lantern! But you now owe Selene 6 gold.' },
          { id: 'bl-2b', label: 'Wait and save the 5 gold I need', effects: { stressDelta: 10, happinessDelta: -5 }, outcomeText: 'You traveled unsafely tonight but won\'t have debt tomorrow.' },
          { id: 'bl-2c', label: 'Ask to borrow the lantern itself overnight', effects: { happinessDelta: 5 }, outcomeText: 'Creative! Selene agrees to rent it for 2 gold. Cheaper than buying!' }
        ]
      },
      { id: 'bl-3', type: 'info', speaker: 'Selene', text: "Interest is the COST of borrowing. Borrow 5, owe 6. That 1 extra gold is my fee for the service." },
      {
        id: 'bl-4', type: 'choice', speaker: 'narrator', text: 'A week later, you owe Selene 6 gold. You have 8 gold. How do you handle the debt?',
        choices: [
          { id: 'bl-4a', label: 'Pay all 6 gold immediately', effects: { goldDelta: -6, happinessDelta: 10, stressDelta: -10 }, outcomeText: 'Debt cleared! You have 2 gold left but freedom from owing anyone.' },
          { id: 'bl-4b', label: 'Pay 3 gold now, 3 gold next week', effects: { goldDelta: -3, stressDelta: 5 }, outcomeText: 'Selene agrees but adds 1 more gold interest. Now you owe 4 total.' },
          { id: 'bl-4c', label: 'Skip payment - I\'ll pay later', effects: { stressDelta: 15, happinessDelta: -5 }, outcomeText: 'Bad idea! Selene adds fees. You now owe 8 gold!' }
        ]
      },
      {
        id: 'bl-5', type: 'choice', speaker: 'narrator', text: 'Selene asks: "Would you borrow 10 gold to buy a toy you want but don\'t need?"',
        choices: [
          { id: 'bl-5a', label: 'No - borrowing for wants is risky', effects: { happinessDelta: 10 }, outcomeText: '"Wise! Debt for wants leads to trouble. Only borrow for true needs."' },
          { id: 'bl-5b', label: 'Maybe if I really wanted it', effects: { stressDelta: 5 }, outcomeText: '"Be careful. Wants feel urgent but debt lasts longer than excitement."' },
          { id: 'bl-5c', label: 'What\'s the interest rate?', effects: { happinessDelta: 5 }, outcomeText: '"Good question! Understanding cost before borrowing is smart."' }
        ]
      },
      { id: 'bl-6', type: 'result', speaker: 'Selene', text: "Remember: Borrowing costs money. It can help in emergencies, but avoiding debt is usually better than getting into it." }
    ],
    reflection: {
      question: 'What is interest on a loan?',
      choices: [
        { id: 'r1', label: 'A gift from the lender', effects: {}, outcomeText: 'No, interest is actually what YOU pay to the lender!', isCorrect: false },
        { id: 'r2', label: 'The extra amount you pay for borrowing money', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Interest is the cost of using someone else\'s money.', isCorrect: true },
        { id: 'r3', label: 'Optional tip if you feel like it', effects: {}, outcomeText: 'Interest is required, not optional!', isCorrect: false }
      ],
      explanation: 'Interest is the fee charged for borrowing money. If you borrow 100 gold at 10% interest, you owe 110 gold back. The lender profits, you pay extra for the convenience of money now.'
    },
    rewards: { goldDelta: 0, xpDelta: 30, masteryDelta: 10 }
  },
  {
    id: 'cred_min_payment_curse',
    title: 'Minimum Payment Curse',
    description: 'Discover why paying only the minimum is a trap!',
    npcName: 'Selene the Deal Maker',
    npcEmoji: '🌙',
    category: 'credit',
    difficulty: 1,
    estimatedMinutes: 5,
    briefing: [
      { title: 'The Minimum Trap', text: 'Lenders often let you pay small "minimum payments." Sounds nice, right? It\'s actually a trap.', icon: '🪤' },
      { title: 'Growing Debt', text: 'When you pay only the minimum, interest keeps adding up. Your debt can grow even while paying!', icon: '📈' },
      { title: 'Math Matters', text: 'Understanding how interest compounds is crucial for avoiding debt traps.', icon: '🧮' }
    ],
    steps: [
      { id: 'mpc-1', type: 'info', speaker: 'Selene', text: "Let me show you my most profitable secret... the minimum payment. Good for me, bad for borrowers!" },
      { id: 'mpc-2', type: 'info', speaker: 'Selene', text: "Example: You owe 30 gold. Interest is 3 gold/month. Minimum payment is just 2 gold. What happens?" },
      {
        id: 'mpc-3', type: 'choice', speaker: 'narrator', text: 'Month 1: Owed 30 gold, paid 2 gold minimum, interest added 3 gold. How much do you owe now?',
        choices: [
          { id: 'mpc-3a', label: '28 gold (30 - 2 = 28)', effects: {}, outcomeText: 'You forgot the interest! 30 - 2 + 3 = 31 gold. Your debt GREW!' },
          { id: 'mpc-3b', label: '31 gold (30 - 2 + 3 = 31)', effects: { happinessDelta: 10 }, outcomeText: 'Exactly! Even though you paid, you owe MORE than before.' },
          { id: 'mpc-3c', label: '25 gold', effects: {}, outcomeText: 'Nope! Interest is added. You owe 31 gold now.' }
        ]
      },
      {
        id: 'mpc-4', type: 'choice', speaker: 'narrator', text: 'To actually reduce a 30 gold debt with 3 gold/month interest, how much must you pay monthly?',
        choices: [
          { id: 'mpc-4a', label: 'More than 3 gold', effects: { happinessDelta: 10 }, outcomeText: 'Correct! You must pay MORE than the interest just to make progress.' },
          { id: 'mpc-4b', label: 'Exactly 3 gold', effects: {}, outcomeText: 'That only covers interest - debt stays the same!' },
          { id: 'mpc-4c', label: 'The minimum they ask for', effects: { stressDelta: 5 }, outcomeText: 'Minimums are designed to keep you in debt longer!' }
        ]
      },
      {
        id: 'mpc-5', type: 'choice', speaker: 'narrator', text: 'You have a 20 gold debt. You can pay 5 gold/month or 10 gold/month. Interest is 2 gold/month. Which is smarter?',
        choices: [
          { id: 'mpc-5a', label: '5 gold/month - easier on budget', effects: { stressDelta: 5 }, outcomeText: 'Easier now, but you pay more total interest over time.' },
          { id: 'mpc-5b', label: '10 gold/month - pay off faster', effects: { happinessDelta: 10, stressDelta: -5 }, outcomeText: 'Smart! Faster payoff = less total interest paid. Freedom sooner!' },
          { id: 'mpc-5c', label: 'Doesn\'t matter, same total', effects: {}, outcomeText: 'It does matter! Longer time = more interest charges.' }
        ]
      },
      { id: 'mpc-6', type: 'result', speaker: 'Selene', text: "Now you know my secret! Always pay MORE than minimum. Better yet - avoid debt in the first place." }
    ],
    reflection: {
      question: 'Why is paying only the minimum payment dangerous?',
      choices: [
        { id: 'r1', label: 'It\'s not dangerous, it\'s smart', effects: {}, outcomeText: 'Minimums are designed to benefit lenders, not you!', isCorrect: false },
        { id: 'r2', label: 'Interest can grow faster than your payments reduce debt', effects: { masteryDelta: 5 }, outcomeText: 'Correct! You can end up owing MORE even while making payments.', isCorrect: true },
        { id: 'r3', label: 'The bank will be sad', effects: {}, outcomeText: 'Actually, banks profit more from minimum payments!', isCorrect: false }
      ],
      explanation: 'Minimum payments are designed to keep you paying for as long as possible. If minimum < interest, your debt grows! Always pay at least enough to cover interest, ideally much more.'
    },
    rewards: { goldDelta: 0, xpDelta: 30, masteryDelta: 10 }
  },
  {
    id: 'cred_trust_score',
    title: 'Trust Score',
    description: 'Learn how your financial reputation affects borrowing ability.',
    npcName: 'Selene the Deal Maker',
    npcEmoji: '🌙',
    category: 'credit',
    difficulty: 2,
    estimatedMinutes: 6,
    briefing: [
      { title: 'Your Reputation', text: 'Lenders track how reliably you repay. This becomes your "credit score" or trust rating.', icon: '⭐' },
      { title: 'Why It Matters', text: 'Good scores mean better loan terms. Bad scores mean higher interest or no loans at all.', icon: '📊' },
      { title: 'Building Trust', text: 'Trust is built slowly through responsible behavior and lost quickly through mistakes.', icon: '🏗️' }
    ],
    steps: [
      { id: 'ts-1', type: 'info', speaker: 'Selene', text: "Every borrower gets a Trust Score. It affects what I'll lend you and at what rate." },
      {
        id: 'ts-2', type: 'choice', speaker: 'narrator', text: 'Selene shows your score: 650 (Fair). "Want to see how different actions affect it?"',
        choices: [
          { id: 'ts-2a', label: 'Yes, show me!', effects: { happinessDelta: 5 }, outcomeText: 'Great! Understanding this system gives you power over it.' },
          { id: 'ts-2b', label: 'Why should I care about a number?', effects: {}, outcomeText: '"This number determines if you can buy a house someday. It matters!"' },
          { id: 'ts-2c', label: 'Is this like grades in school?', effects: { happinessDelta: 5 }, outcomeText: '"Similar! It measures financial responsibility, not intelligence."' }
        ]
      },
      { id: 'ts-3', type: 'info', speaker: 'Selene', text: "Actions that HELP your score: paying on time, keeping debt low, having accounts for a long time." },
      { id: 'ts-4', type: 'info', speaker: 'Selene', text: "Actions that HURT your score: late payments, maxing out credit, closing old accounts, too many new loans." },
      {
        id: 'ts-5', type: 'choice', speaker: 'narrator', text: 'Scenario: You have 50 gold credit limit and spent 45 gold. Is this good or bad for your score?',
        choices: [
          { id: 'ts-5a', label: 'Good - I\'m using what I\'m given!', effects: { stressDelta: 5 }, outcomeText: 'Actually bad! Using 90% of your limit lowers your score.' },
          { id: 'ts-5b', label: 'Bad - I should use less of my limit', effects: { happinessDelta: 10 }, outcomeText: 'Correct! Aim to use under 30% of your credit limit.' },
          { id: 'ts-5c', label: 'Doesn\'t matter as long as I pay', effects: {}, outcomeText: 'Utilization matters too! High usage looks risky to lenders.' }
        ]
      },
      {
        id: 'ts-6', type: 'choice', speaker: 'narrator', text: 'You forgot one payment (by accident). What happens to your score?',
        choices: [
          { id: 'ts-6a', label: 'Nothing - one mistake doesn\'t count', effects: { stressDelta: 10 }, outcomeText: 'Wrong! Late payments can drop your score significantly and stay on record.' },
          { id: 'ts-6b', label: 'It drops, and stays affected for months', effects: { happinessDelta: 5 }, outcomeText: 'Sadly true. One late payment can take months or years to recover from.' },
          { id: 'ts-6c', label: 'Call immediately and explain', effects: { happinessDelta: 10 }, outcomeText: 'Good instinct! Sometimes lenders won\'t report if you pay right away and explain.' }
        ]
      },
      { id: 'ts-7', type: 'result', speaker: 'Selene', text: "Your Trust Score follows you for life. Build it by being responsible - it opens doors when you need them." }
    ],
    reflection: {
      question: 'What\'s the best way to build a good credit/trust score?',
      choices: [
        { id: 'r1', label: 'Borrow as much as possible', effects: {}, outcomeText: 'High debt actually hurts your score!', isCorrect: false },
        { id: 'r2', label: 'Pay bills on time and keep debt low', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Consistent, responsible behavior over time builds trust.', isCorrect: true },
        { id: 'r3', label: 'Never borrow anything', effects: {}, outcomeText: 'You need some credit history to build a score!', isCorrect: false }
      ],
      explanation: 'Good credit comes from: 1) Paying on time, always, 2) Keeping credit utilization under 30%, 3) Having a mix of account types, 4) Not opening too many new accounts. Build trust slowly!'
    },
    rewards: { goldDelta: 0, xpDelta: 40, masteryDelta: 15 }
  },
  {
    id: 'cred_bnpl_boots',
    title: 'Buy Now, Pay Later Boots',
    description: 'Explore the tempting world of "Buy Now, Pay Later" offers.',
    npcName: 'Selene the Deal Maker',
    npcEmoji: '🌙',
    category: 'credit',
    difficulty: 2,
    estimatedMinutes: 6,
    briefing: [
      { title: 'Instant Gratification', text: '"Buy Now, Pay Later" lets you get things immediately and pay over time. Sounds great, right?', icon: '🛒' },
      { title: 'The Hidden Costs', text: 'These services often have fees, interest, or late penalties that aren\'t obvious upfront.', icon: '🔍' },
      { title: 'Impulse Danger', text: 'Easy payment options can lead to buying things you can\'t really afford.', icon: '⚠️' }
    ],
    steps: [
      { id: 'bnpl-1', type: 'info', speaker: 'Selene', text: "I offer 'Buy Now, Pay in 4!' Split any purchase into 4 easy payments. No interest!* (*if you pay on time)" },
      {
        id: 'bnpl-2', type: 'choice', speaker: 'narrator', text: 'Beautiful boots cost 40 gold. BNPL: 4 payments of 10 gold. You have 15 gold right now.',
        choices: [
          { id: 'bnpl-2a', label: 'Use BNPL - I can make 10g payments', effects: { goldDelta: -10, happinessDelta: 15 }, outcomeText: 'Boots are yours! But you\'ve committed to 30 more gold in payments.' },
          { id: 'bnpl-2b', label: 'Wait until I have 40 gold saved', effects: { happinessDelta: -5 }, outcomeText: 'Patience! No debt, no stress about future payments.' },
          { id: 'bnpl-2c', label: 'Ask what happens if I miss a payment', effects: { happinessDelta: 5 }, outcomeText: '"Smart! Late fee of 5 gold, plus your Trust Score drops."' }
        ]
      },
      {
        id: 'bnpl-3', type: 'choice', speaker: 'narrator', text: 'Week 2 payment due: 10 gold. But you only have 8 gold because of an unexpected expense.',
        choices: [
          { id: 'bnpl-3a', label: 'Pay what I can (8 gold)', effects: { goldDelta: -8, stressDelta: 10 }, outcomeText: 'Not enough! 5 gold late fee added. Now you owe 7 gold.' },
          { id: 'bnpl-3b', label: 'Borrow 2 gold from a friend to pay full', effects: { goldDelta: -10 }, outcomeText: 'Debt to pay debt - risky but avoided the late fee.' },
          { id: 'bnpl-3c', label: 'Contact Selene and explain', effects: { stressDelta: 5 }, outcomeText: 'Selene offers a 3-day grace period. Crisis delayed but not solved.' }
        ]
      },
      {
        id: 'bnpl-4', type: 'choice', speaker: 'narrator', text: 'Selene offers: "Use BNPL for this jacket too! Only 15 gold in 3 payments!"',
        choices: [
          { id: 'bnpl-4a', label: 'Sure, why not!', effects: { goldDelta: -5, stressDelta: 15 }, outcomeText: 'Now you have TWO payment schedules to track. Stress increases!' },
          { id: 'bnpl-4b', label: 'No - finish paying boots first', effects: { happinessDelta: 10 }, outcomeText: 'Wise! One debt at a time. Stacking payments is dangerous.' },
          { id: 'bnpl-4c', label: 'Can I put the jacket on my existing plan?', effects: { happinessDelta: 5 }, outcomeText: '"No, each item is separate." Good question though!' }
        ]
      },
      { id: 'bnpl-5', type: 'result', speaker: 'Selene', text: "BNPL can be useful, but it's still debt. Only use it for things you COULD afford to buy outright if you saved a bit longer." }
    ],
    reflection: {
      question: 'When is "Buy Now, Pay Later" appropriate to use?',
      choices: [
        { id: 'r1', label: 'Anytime you want something you can\'t afford', effects: {}, outcomeText: 'Danger! If you can\'t afford it now, can you afford payments later?', isCorrect: false },
        { id: 'r2', label: 'For planned purchases where you\'re certain of future income', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Only use when you\'re confident you can make all payments.', isCorrect: true },
        { id: 'r3', label: 'Never - it\'s always bad', effects: {}, outcomeText: 'It can be a tool when used responsibly!', isCorrect: false }
      ],
      explanation: 'BNPL is appropriate when: 1) You could afford it now but prefer cash flow flexibility, 2) You\'re 100% confident in making all payments, 3) There\'s no interest/fees, 4) It\'s a need, not an impulse want.'
    },
    rewards: { goldDelta: 0, xpDelta: 40, masteryDelta: 15 }
  },
  {
    id: 'cred_debt_snowball',
    title: 'Debt Snowball Choice',
    description: 'Learn strategies for paying off multiple debts efficiently.',
    npcName: 'Selene the Deal Maker',
    npcEmoji: '🌙',
    category: 'credit',
    difficulty: 3,
    estimatedMinutes: 7,
    briefing: [
      { title: 'Multiple Debts', text: 'What if you owe money to several lenders? There are strategies to pay them off efficiently.', icon: '❄️' },
      { title: 'Snowball Method', text: 'Pay off smallest debts first for quick wins that motivate you to continue.', icon: '⛷️' },
      { title: 'Avalanche Method', text: 'Pay off highest-interest debts first to save the most money mathematically.', icon: '🏔️' }
    ],
    steps: [
      { id: 'ds-1', type: 'info', speaker: 'Selene', text: "You have 3 debts: Small (10g, 5% interest), Medium (25g, 10% interest), Large (50g, 15% interest). Total: 85 gold." },
      { id: 'ds-2', type: 'info', speaker: 'Selene', text: "You can pay 20 gold/month. Strategy 1 (Snowball): Kill the small one first. Strategy 2 (Avalanche): Attack the high-interest one." },
      {
        id: 'ds-3', type: 'choice', speaker: 'narrator', text: 'Which strategy do you choose?',
        choices: [
          { id: 'ds-3a', label: 'Snowball - quick win on small debt', effects: { happinessDelta: 10 }, outcomeText: 'The 10g debt is gone in 1 month! Motivation boost. But high interest grows.' },
          { id: 'ds-3b', label: 'Avalanche - attack 15% interest first', effects: { happinessDelta: 5 }, outcomeText: 'Mathematically optimal! Takes longer to feel progress but saves money.' },
          { id: 'ds-3c', label: 'Split payments equally between all', effects: { stressDelta: 10 }, outcomeText: 'Least efficient! Interest piles up on everything.' }
        ]
      },
      {
        id: 'ds-4', type: 'choice', speaker: 'narrator', text: 'Month 2: You got a 30 gold bonus! How do you use it for debt?',
        choices: [
          { id: 'ds-4a', label: 'Throw it all at the highest interest debt', effects: { happinessDelta: 10, stressDelta: -10 }, outcomeText: 'Smart! Reducing high-interest debt saves the most long-term.' },
          { id: 'ds-4b', label: 'Completely wipe out the smallest debt', effects: { happinessDelta: 15 }, outcomeText: 'One debt eliminated! Feels great, even if not mathematically optimal.' },
          { id: 'ds-4c', label: 'Save it instead of extra debt payment', effects: { stressDelta: 5 }, outcomeText: 'Logical to have safety net, but debt interest costs more than savings earn.' }
        ]
      },
      {
        id: 'ds-5', type: 'choice', speaker: 'narrator', text: 'Selene offers to consolidate: "One 85g loan at 8% interest." Good deal?',
        choices: [
          { id: 'ds-5a', label: 'Yes - simpler and lower average rate', effects: { happinessDelta: 5 }, outcomeText: 'Good for simplicity! Average was ~12%, now 8%. But watch the new terms.' },
          { id: 'ds-5b', label: 'Calculate if it actually saves money', effects: { happinessDelta: 10 }, outcomeText: 'Smart! You realize the longer term means more total interest despite lower rate.' },
          { id: 'ds-5c', label: 'No - I like my current payoff strategy', effects: {}, outcomeText: 'Staying the course can work if your plan is solid!' }
        ]
      },
      { id: 'ds-6', type: 'result', speaker: 'Selene', text: "Both Snowball and Avalanche work - pick what keeps you motivated. The worst strategy is no strategy!" }
    ],
    reflection: {
      question: 'What\'s the difference between Snowball and Avalanche debt payoff?',
      choices: [
        { id: 'r1', label: 'They\'re the same thing', effects: {}, outcomeText: 'They\'re different strategies with different benefits!', isCorrect: false },
        { id: 'r2', label: 'Snowball: smallest first; Avalanche: highest interest first', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Snowball builds momentum, Avalanche saves the most money.', isCorrect: true },
        { id: 'r3', label: 'Avalanche is always better', effects: {}, outcomeText: 'Mathematically yes, but psychology matters - some need quick wins!', isCorrect: false }
      ],
      explanation: 'Snowball (smallest debt first) gives quick motivational wins. Avalanche (highest interest first) saves the most money. Pick based on your personality - staying motivated is key to paying off debt!'
    },
    rewards: { goldDelta: 0, xpDelta: 60, masteryDelta: 25 }
  }
];


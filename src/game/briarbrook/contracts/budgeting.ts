import type { Contract } from '../types';

export const BUDGETING_CONTRACTS: Contract[] = [
  {
    id: 'bud_snack_trap',
    title: 'Snack Trap',
    description: 'Navigate the tempting market without blowing your budget on treats!',
    npcName: 'Tobin the Shopkeeper',
    npcEmoji: '🏪',
    category: 'budgeting',
    difficulty: 1,
    estimatedMinutes: 5,
    briefing: [
      { title: 'Welcome to Market Row!', text: 'Tobin runs the general store. He\'ll teach you about the difference between needs and wants.', icon: '🏪' },
      { title: 'Your Mission', text: 'You need to buy bread for dinner (a NEED). But the market is full of tempting snacks (WANTS)...', icon: '🍞' },
      { title: 'Budgeting Basics', text: 'Budgeting means deciding BEFORE you spend. Let\'s see if you can stick to your plan!', icon: '📋' }
    ],
    steps: [
      { id: 'st-1', type: 'info', speaker: 'Tobin', text: "Ah, shopping day! You have 10 gold. Bread costs 4 gold. That leaves 6 gold for other things - IF you want them." },
      {
        id: 'st-2', type: 'choice', speaker: 'narrator', text: 'Right at the entrance: Fresh-baked cookies! They smell amazing and cost 3 gold.',
        choices: [
          { id: 'st-2a', label: 'Buy the cookies (3 gold)', effects: { goldDelta: -3, happinessDelta: 10 }, outcomeText: 'Delicious! But now you only have 3 gold left after buying bread.' },
          { id: 'st-2b', label: 'Resist - stick to your list', effects: { happinessDelta: -5 }, outcomeText: 'You walked past. It was hard, but your budget is intact!' },
          { id: 'st-2c', label: 'Buy just one cookie (1 gold)', effects: { goldDelta: -1, happinessDelta: 5 }, outcomeText: 'A small treat! You satisfied the craving without overspending.' }
        ]
      },
      { id: 'st-3', type: 'info', speaker: 'narrator', text: "You buy the bread for 4 gold. ✓ Need satisfied!" },
      {
        id: 'st-4', type: 'choice', speaker: 'narrator', text: 'A street vendor is selling a toy you\'ve wanted. It costs 5 gold - more than you might have left.',
        choices: [
          { id: 'st-4a', label: 'Check if I can afford it first', effects: { happinessDelta: 5 }, outcomeText: 'Smart! You counted your remaining gold before deciding.' },
          { id: 'st-4b', label: 'Buy it! I want it!', effects: { goldDelta: -5, happinessDelta: 10, stressDelta: 10 }, outcomeText: 'You bought it... but do you even have 5 gold left?' },
          { id: 'st-4c', label: 'Save up - come back next week', effects: { happinessDelta: 5 }, outcomeText: 'Patience! You\'ll appreciate it more when you can truly afford it.' }
        ]
      },
      {
        id: 'st-5', type: 'choice', speaker: 'narrator', text: 'At checkout, there\'s a "buy 2 get 1 free" deal on juice. Each costs 2 gold.',
        choices: [
          { id: 'st-5a', label: 'Great deal! Buy 2 get 1 free (4 gold)', effects: { goldDelta: -4, happinessDelta: 5 }, outcomeText: 'Three juices for 4 gold! But did you need three juices?' },
          { id: 'st-5b', label: 'Just buy one (2 gold)', effects: { goldDelta: -2, happinessDelta: 3 }, outcomeText: 'One is enough. Deals are only good if you need the item!' },
          { id: 'st-5c', label: 'Skip juice entirely', effects: {}, outcomeText: 'You didn\'t need juice today. Budget protected!' }
        ]
      },
      { id: 'st-6', type: 'result', speaker: 'Tobin', text: "Shopping complete! Remember: A budget isn't about never buying things - it's about buying the RIGHT things." }
    ],
    reflection: {
      question: 'What\'s the difference between a need and a want?',
      choices: [
        { id: 'r1', label: 'Needs are boring, wants are fun', effects: {}, outcomeText: 'Not quite - some needs can be enjoyable too!', isCorrect: false },
        { id: 'r2', label: 'Needs are required for living, wants are nice-to-haves', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Needs are essential, wants are optional but enjoyable.', isCorrect: true },
        { id: 'r3', label: 'There\'s no real difference', effects: {}, outcomeText: 'There is a difference, and knowing it helps you budget!', isCorrect: false }
      ],
      explanation: 'Needs are things required for survival and basic functioning (food, shelter, clothing). Wants are things that improve quality of life but aren\'t essential. Budgeting means prioritizing needs first!'
    },
    rewards: { goldDelta: 0, xpDelta: 30, masteryDelta: 10 }
  },
  {
    id: 'bud_gear_vs_glam',
    title: 'Gear vs Glam',
    description: 'Choose between practical gear and stylish items. What\'s worth your gold?',
    npcName: 'Tobin the Shopkeeper',
    npcEmoji: '🏪',
    category: 'budgeting',
    difficulty: 1,
    estimatedMinutes: 5,
    briefing: [
      { title: 'A Shopping Dilemma', text: 'You need new boots for adventuring. But there are also some really cool items on sale...', icon: '👢' },
      { title: 'Practical vs Pretty', text: 'Sometimes the flashiest option isn\'t the smartest choice. Let\'s think it through!', icon: '✨' },
      { title: 'Value Thinking', text: 'Consider: How long will this last? How often will I use it? Is it worth the gold?', icon: '🤔' }
    ],
    steps: [
      { id: 'gvg-1', type: 'info', speaker: 'Tobin', text: "You have 25 gold. You NEED sturdy boots for the upcoming hike. Let's look at your options." },
      {
        id: 'gvg-2', type: 'choice', speaker: 'narrator', text: 'Three boot options: Basic (10g, will last 1 season), Quality (18g, lasts 3 seasons), or Fancy Designer (25g, 2 seasons).',
        choices: [
          { id: 'gvg-2a', label: 'Basic boots (10 gold)', effects: { goldDelta: -10, happinessDelta: 3 }, outcomeText: 'Cheap now, but you\'ll need new ones soon.' },
          { id: 'gvg-2b', label: 'Quality boots (18 gold)', effects: { goldDelta: -18, happinessDelta: 10 }, outcomeText: 'Great value! These will serve you well for years.' },
          { id: 'gvg-2c', label: 'Fancy Designer boots (25 gold)', effects: { goldDelta: -25, happinessDelta: 15, stressDelta: 5 }, outcomeText: 'They look amazing! But you spent all your gold...' }
        ]
      },
      {
        id: 'gvg-3', type: 'choice', speaker: 'narrator', text: 'You spot a sparkly hat on sale - was 15 gold, now 8 gold. "Limited time offer!"',
        choices: [
          { id: 'gvg-3a', label: 'Buy it - such a good deal!', effects: { goldDelta: -8, happinessDelta: 8 }, outcomeText: 'It IS cute... but do you need a sparkly hat?' },
          { id: 'gvg-3b', label: 'Ask yourself: Would I buy this at full price?', effects: { happinessDelta: 5 }, outcomeText: 'Good question! A sale isn\'t a deal if you don\'t need the item.' },
          { id: 'gvg-3c', label: 'Pass - sales can be traps', effects: { stressDelta: -5 }, outcomeText: 'Smart! You saved 8 gold that would\'ve been wasted.' }
        ]
      },
      {
        id: 'gvg-4', type: 'choice', speaker: 'narrator', text: 'Last decision: A practical rain cloak (7g) or a trendy but thin jacket (12g)?',
        choices: [
          { id: 'gvg-4a', label: 'Practical rain cloak', effects: { goldDelta: -7, happinessDelta: 5 }, outcomeText: 'You\'ll be dry in any weather. Practical wins!' },
          { id: 'gvg-4b', label: 'Trendy jacket', effects: { goldDelta: -12, happinessDelta: 10, stressDelta: 5 }, outcomeText: 'Looks great until it rains... then you\'re cold AND wet.' },
          { id: 'gvg-4c', label: 'Neither - I have a jacket at home', effects: {}, outcomeText: 'Using what you have! The best purchase is no purchase.' }
        ]
      },
      { id: 'gvg-5', type: 'result', speaker: 'Tobin', text: "Shopping done! Remember: Cost per use matters. Something expensive that lasts can be cheaper than something cheap you replace often." }
    ],
    reflection: {
      question: 'What should you consider before making a purchase?',
      choices: [
        { id: 'r1', label: 'Only if it\'s on sale', effects: {}, outcomeText: 'Sales can be traps - the real question is if you need it!', isCorrect: false },
        { id: 'r2', label: 'How often you\'ll use it and how long it lasts', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Value = usefulness over time, not just price.', isCorrect: true },
        { id: 'r3', label: 'If your friends have one', effects: {}, outcomeText: 'What others have shouldn\'t drive your spending!', isCorrect: false }
      ],
      explanation: 'Smart shopping means thinking about cost-per-use. A 30 gold item you use daily for years is better value than a 10 gold item you use once! Consider durability, frequency of use, and if you really need it.'
    },
    rewards: { goldDelta: 0, xpDelta: 30, masteryDelta: 10 }
  },
  {
    id: 'bud_weekly_plan',
    title: 'Weekly Budget Plan',
    description: 'Create your first real budget and try to stick to it for a week!',
    npcName: 'Tobin the Shopkeeper',
    npcEmoji: '🏪',
    category: 'budgeting',
    difficulty: 2,
    estimatedMinutes: 6,
    briefing: [
      { title: 'Budget Creation', text: 'A budget is a PLAN for your money. Let\'s make one together!', icon: '📊' },
      { title: 'Categories', text: 'We\'ll divide your gold into: Needs (must pay), Wants (fun stuff), and Savings (future you).', icon: '📁' },
      { title: 'Flexibility', text: 'Good budgets have some wiggle room. Unexpected things happen!', icon: '🔄' }
    ],
    steps: [
      { id: 'wp-1', type: 'info', speaker: 'Tobin', text: "You have 40 gold for the week. Let's plan how to spend it BEFORE it burns a hole in your pocket!" },
      {
        id: 'wp-2', type: 'choice', speaker: 'narrator', text: 'First, your NEEDS: Food (10g required), School supplies (5g required). That\'s 15g total. How much for savings?',
        choices: [
          { id: 'wp-2a', label: 'Save 10 gold (25% of income)', effects: { savingsDelta: 10 }, outcomeText: 'Great savings rate! You\'ll have 15g left for wants.' },
          { id: 'wp-2b', label: 'Save 5 gold (12.5%)', effects: { savingsDelta: 5 }, outcomeText: 'Some savings is better than none. 20g left for wants.' },
          { id: 'wp-2c', label: 'Save nothing - I\'ll save next week', effects: { stressDelta: 5 }, outcomeText: 'Risky! "Next week" often never comes...' }
        ]
      },
      { id: 'wp-3', type: 'info', speaker: 'narrator', text: "✅ Budget set! Now let's see if you can stick to it..." },
      {
        id: 'wp-4', type: 'choice', speaker: 'narrator', text: 'Day 2: Your friend wants to go to the arcade. It\'ll cost about 8 gold.',
        choices: [
          { id: 'wp-4a', label: 'Check my wants budget first', effects: { happinessDelta: 5 }, outcomeText: 'You checked - the arcade fits in your wants budget! Smart.' },
          { id: 'wp-4b', label: 'Just go - figure it out later', effects: { goldDelta: -8, stressDelta: 10 }, outcomeText: 'Fun but now your budget is stressed...' },
          { id: 'wp-4c', label: 'Suggest a cheaper activity', effects: { happinessDelta: 8 }, outcomeText: 'You went to the park instead - free fun!' }
        ]
      },
      {
        id: 'wp-5', type: 'choice', speaker: 'narrator', text: 'Day 5: Emergency! You need 8 gold for a school project you forgot about.',
        choices: [
          { id: 'wp-5a', label: 'Take from savings this once', effects: { savingsDelta: -8, stressDelta: 5 }, outcomeText: 'That\'s what emergency funds are for, but try to replace it!' },
          { id: 'wp-5b', label: 'Cut from wants budget', effects: { happinessDelta: -8 }, outcomeText: 'Sacrifice now, budget stays healthy. Responsible!' },
          { id: 'wp-5c', label: 'Ask to borrow from parents, pay back', effects: { goldDelta: -8 }, outcomeText: 'Borrowing works but creates a debt you\'ll need to repay.' }
        ]
      },
      { id: 'wp-6', type: 'result', speaker: 'Tobin', text: "Week\'s over! Budgets aren\'t about perfection - they\'re about AWARENESS of where your gold goes." }
    ],
    reflection: {
      question: 'What\'s the main benefit of having a budget?',
      choices: [
        { id: 'r1', label: 'It tells you that you can\'t buy anything', effects: {}, outcomeText: 'No! A budget helps you buy what matters, not restrict everything.', isCorrect: false },
        { id: 'r2', label: 'It helps you decide in advance where money goes', effects: { masteryDelta: 5 }, outcomeText: 'Correct! A budget is a plan that prevents surprise shortfalls.', isCorrect: true },
        { id: 'r3', label: 'It impresses your friends', effects: {}, outcomeText: 'While money skills are impressive, the real benefit is personal control!', isCorrect: false }
      ],
      explanation: 'A budget is a spending PLAN, not a restriction. It ensures your gold goes to things you actually value, helps you prepare for emergencies, and reduces money stress!'
    },
    rewards: { goldDelta: 0, xpDelta: 40, masteryDelta: 15 }
  },
  {
    id: 'bud_sale_sign',
    title: 'The Sale Sign',
    description: 'Learn to spot real deals versus marketing traps!',
    npcName: 'Tobin the Shopkeeper',
    npcEmoji: '🏪',
    category: 'budgeting',
    difficulty: 2,
    estimatedMinutes: 6,
    briefing: [
      { title: 'Sale Season!', text: 'The market is full of "AMAZING DEALS!" But are they really?', icon: '🏷️' },
      { title: 'Marketing Tricks', text: 'Stores want you to buy. Their job is to make everything seem like a deal.', icon: '🎭' },
      { title: 'Critical Thinking', text: 'A smart shopper asks: "Would I buy this at full price? Do I actually need it?"', icon: '🧠' }
    ],
    steps: [
      { id: 'ss-1', type: 'info', speaker: 'Tobin', text: "I\'ll let you in on a secret: I use these tricks too! Let me show you how to see through them." },
      {
        id: 'ss-2', type: 'choice', speaker: 'narrator', text: '"50% OFF!" screams a sign on a mediocre sword. Original price: 30g. Sale: 15g. You don\'t need a sword.',
        choices: [
          { id: 'ss-2a', label: 'Half off! I have to buy it!', effects: { goldDelta: -15, stressDelta: 5 }, outcomeText: 'You bought something you don\'t need. "Saving" 15g cost you 15g!' },
          { id: 'ss-2b', label: '50% off nothing is still nothing I need', effects: { happinessDelta: 5 }, outcomeText: 'Perfect logic! You can\'t "save" money by spending it.' },
          { id: 'ss-2c', label: 'Put it on my wish list for later', effects: {}, outcomeText: 'Smart! If you still want it in a week, maybe consider it then.' }
        ]
      },
      {
        id: 'ss-3', type: 'choice', speaker: 'narrator', text: '"Buy 3, Get 1 FREE!" on health potions (5g each). You only need 1 potion.',
        choices: [
          { id: 'ss-3a', label: 'Buy 3 for the free one (15g)', effects: { goldDelta: -15, stressDelta: 5 }, outcomeText: 'You spent 15g when you only needed to spend 5g. "Free" cost you 10 extra!' },
          { id: 'ss-3b', label: 'Just buy the 1 you need (5g)', effects: { goldDelta: -5 }, outcomeText: 'Smart! The "deal" only benefits you if you need multiple.' },
          { id: 'ss-3c', label: 'Split with friends who also need them', effects: { goldDelta: -5, happinessDelta: 5 }, outcomeText: 'Brilliant! Everyone saves by buying together.' }
        ]
      },
      {
        id: 'ss-4', type: 'choice', speaker: 'narrator', text: '"LIMITED TIME ONLY!" creates urgency on a backpack. You actually need a new backpack.',
        choices: [
          { id: 'ss-4a', label: 'Rush to buy before it\'s gone!', effects: { goldDelta: -20, stressDelta: 5 }, outcomeText: 'Urgency made you skip research. There might\'ve been a better deal!' },
          { id: 'ss-4b', label: 'Check other stores first, quickly', effects: { goldDelta: -15, happinessDelta: 5 }, outcomeText: 'You found the same backpack cheaper elsewhere!' },
          { id: 'ss-4c', label: 'It\'ll still be here or somewhere else', effects: { stressDelta: -5 }, outcomeText: '"Limited" is usually marketing. Similar deals come around.' }
        ]
      },
      { id: 'ss-5', type: 'result', speaker: 'Tobin', text: "Now you know the tricks! Remember: The best deal is not buying what you don\'t need, no matter the discount." }
    ],
    reflection: {
      question: 'When is a sale actually a good deal?',
      choices: [
        { id: 'r1', label: 'Whenever the price is reduced', effects: {}, outcomeText: 'A reduced price on something you don\'t need isn\'t a deal.', isCorrect: false },
        { id: 'r2', label: 'When it\'s something you already planned to buy', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Sales are only deals on things you actually need.', isCorrect: true },
        { id: 'r3', label: 'When the sign says "AMAZING DEAL"', effects: {}, outcomeText: 'Signs can say anything - your judgment matters more!', isCorrect: false }
      ],
      explanation: 'A real deal is a lower price on something you already planned to buy. If a sale makes you buy something you wouldn\'t have bought otherwise, you\'re not saving - you\'re spending!'
    },
    rewards: { goldDelta: 0, xpDelta: 40, masteryDelta: 15 }
  },
  {
    id: 'bud_travel_pack',
    title: 'Travel Pack',
    description: 'Budget for a big trip! Plan, save, and spend wisely on adventure.',
    npcName: 'Tobin the Shopkeeper',
    npcEmoji: '🏪',
    category: 'budgeting',
    difficulty: 3,
    estimatedMinutes: 7,
    briefing: [
      { title: 'Adventure Awaits!', text: 'You\'re going on a class trip to the Crystal Caves! But it requires careful planning.', icon: '🏔️' },
      { title: 'Trip Budget', text: 'Travel costs add up: transport, food, activities, souvenirs, emergencies. Let\'s plan it all!', icon: '🧳' },
      { title: 'Big Purchase Planning', text: 'Big expenses need advance planning. You can\'t budget for a trip the day before!', icon: '📅' }
    ],
    steps: [
      { id: 'tp-1', type: 'info', speaker: 'Tobin', text: "The trip costs 60 gold total. You have 3 weeks to save. That's 20 gold per week you need to set aside!" },
      {
        id: 'tp-2', type: 'choice', speaker: 'narrator', text: 'Week 1: You earned 30 gold. You need to save 20 for the trip. What about the other 10?',
        choices: [
          { id: 'tp-2a', label: 'Save all 30 - get ahead on trip fund', effects: { savingsDelta: 30, stressDelta: -5, happinessDelta: -5 }, outcomeText: 'Ahead of schedule! But you have no spending money this week.' },
          { id: 'tp-2b', label: 'Save 20, keep 10 for weekly needs', effects: { savingsDelta: 20, happinessDelta: 5 }, outcomeText: 'Perfect balance! On track for the trip with some fun money.' },
          { id: 'tp-2c', label: 'Save 15, spend 15 - I\'ll catch up later', effects: { savingsDelta: 15, happinessDelta: 10, stressDelta: 5 }, outcomeText: 'Fun now, but you\'re 5 gold behind schedule...' }
        ]
      },
      {
        id: 'tp-3', type: 'choice', speaker: 'narrator', text: 'Week 2: Unexpected! You need to buy a required travel pouch (10 gold). This wasn\'t in your budget.',
        choices: [
          { id: 'tp-3a', label: 'Adjust trip savings down this week', effects: { savingsDelta: 10 }, outcomeText: 'You saved only 10 this week. Now you need 30 in week 3!' },
          { id: 'tp-3b', label: 'Do extra chores to earn the 10 gold', effects: { savingsDelta: 20, stressDelta: 10, happinessDelta: 5 }, outcomeText: 'Hard work but you stayed on budget! Great problem-solving.' },
          { id: 'tp-3c', label: 'Borrow from next week\'s budget', effects: { savingsDelta: 20, stressDelta: 5 }, outcomeText: 'Borrowing from yourself works, but week 3 will be tight.' }
        ]
      },
      {
        id: 'tp-4', type: 'choice', speaker: 'narrator', text: 'Trip day! You have your 60 gold. Now for souvenir shopping: cool crystal (25g), medium crystal (15g), or postcard (3g)?',
        choices: [
          { id: 'tp-4a', label: 'Buy the cool crystal - I saved for this!', effects: { goldDelta: -25, happinessDelta: 15 }, outcomeText: 'Beautiful souvenir! But that was a big chunk of your savings.' },
          { id: 'tp-4b', label: 'Medium crystal - balance quality and cost', effects: { goldDelta: -15, happinessDelta: 10 }, outcomeText: 'Nice choice! A meaningful memento without overspending.' },
          { id: 'tp-4c', label: 'Just the postcard - memories are free', effects: { goldDelta: -3, happinessDelta: 5 }, outcomeText: 'Frugal! You\'ll remember the trip even without an expensive souvenir.' }
        ]
      },
      { id: 'tp-5', type: 'result', speaker: 'Tobin', text: "Trip complete! You learned that big expenses need weeks of planning. Start saving early and you can afford amazing experiences!" }
    ],
    reflection: {
      question: 'How should you prepare for a big planned expense?',
      choices: [
        { id: 'r1', label: 'Wait until the last minute and hope you have enough', effects: {}, outcomeText: 'This causes stress and might mean missing out!', isCorrect: false },
        { id: 'r2', label: 'Calculate the total cost and save a portion each week', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Planning ahead makes big purchases stress-free.', isCorrect: true },
        { id: 'r3', label: 'Borrow the full amount and pay back later', effects: {}, outcomeText: 'Borrowing has costs and risks. Saving ahead is better!', isCorrect: false }
      ],
      explanation: 'For big expenses, divide the total by weeks until needed. Save that amount weekly, adjust your regular budget, and build in a small buffer for surprises. This is called "sinking fund" budgeting!'
    },
    rewards: { goldDelta: 0, xpDelta: 60, masteryDelta: 25 }
  }
];


import type { Contract } from '../types';

export const EARNING_CONTRACTS: Contract[] = [
  {
    id: 'earn_parcel_sprint',
    title: 'Parcel Sprint',
    description: 'Help Mira deliver packages around town and earn your first gold!',
    npcName: 'Mira the Messenger',
    npcEmoji: '📬',
    category: 'earning',
    difficulty: 1,
    estimatedMinutes: 5,
    briefing: [
      {
        title: 'Welcome to the Job Board!',
        text: "Mira runs the town's message and parcel delivery service. She's always looking for reliable helpers!",
        icon: '📬'
      },
      {
        title: 'Your Task',
        text: "You'll deliver 3 packages to different locations in Briarbrook. Each successful delivery earns you gold!",
        icon: '📦'
      },
      {
        title: 'What You\'ll Learn',
        text: 'This contract teaches you about EARNING - how work and effort translate into income you can save or spend.',
        icon: '💡'
      }
    ],
    steps: [
      {
        id: 'ps-1',
        type: 'info',
        speaker: 'Mira',
        text: "Perfect timing! I have three urgent deliveries. I'll pay you 5 gold per package - that's 15 gold total if you complete them all!"
      },
      {
        id: 'ps-2',
        type: 'choice',
        speaker: 'narrator',
        text: 'First delivery: The baker needs their flour order. But the direct path goes through a muddy shortcut...',
        choices: [
          { id: 'ps-2a', label: 'Take the muddy shortcut (faster)', effects: { happinessDelta: -5 }, outcomeText: 'You got muddy but delivered quickly! The baker is pleased.' },
          { id: 'ps-2b', label: 'Take the clean, longer path', effects: { stressDelta: 5 }, outcomeText: 'Took a bit longer, but you arrived clean and professional.' },
          { id: 'ps-2c', label: 'Ask a friend to help carry it', effects: { goldDelta: -2, happinessDelta: 5 }, outcomeText: "Your friend helped! You split 2 gold with them but it was more fun." }
        ]
      },
      {
        id: 'ps-3',
        type: 'info',
        speaker: 'narrator',
        text: "📦 First delivery complete! The baker hands you a warm cookie as thanks."
      },
      {
        id: 'ps-4',
        type: 'choice',
        speaker: 'narrator',
        text: "Second delivery: Mrs. Thornwood's medicine. She lives up a steep hill and offers a tip if you hurry.",
        choices: [
          { id: 'ps-4a', label: 'Rush to get the tip (+3 gold)', effects: { goldDelta: 3, stressDelta: 10 }, outcomeText: 'You sprinted up the hill and earned a nice tip! But you\'re exhausted.' },
          { id: 'ps-4b', label: 'Walk at a steady pace', effects: { happinessDelta: 5 }, outcomeText: 'You arrived calmly. Mrs. Thornwood appreciated your careful handling.' }
        ]
      },
      {
        id: 'ps-5',
        type: 'choice',
        speaker: 'narrator',
        text: "Final delivery: A fragile crystal vase to the mayor's office. This one pays double (10 gold) but if it breaks, you pay for it!",
        choices: [
          { id: 'ps-5a', label: 'Carry it yourself, very carefully', effects: { stressDelta: 5 }, outcomeText: 'Nerve-wracking, but you delivered it safely! Great job.' },
          { id: 'ps-5b', label: 'Rent a padded cart (costs 3 gold)', effects: { goldDelta: -3 }, outcomeText: 'Smart thinking! The cart made it easy and safe.' },
          { id: 'ps-5c', label: 'Ask Mira for packing materials', effects: {}, outcomeText: 'Mira gave you bubble wrap - resourceful thinking!' }
        ]
      },
      {
        id: 'ps-6',
        type: 'result',
        speaker: 'Mira',
        text: "Excellent work! You've completed all three deliveries. Here's your payment - you've earned it through honest work!"
      }
    ],
    reflection: {
      question: 'What is the main way people earn money?',
      choices: [
        { id: 'r1', label: 'Finding it on the ground', effects: {}, outcomeText: 'Not quite - this is very rare and unreliable!', isCorrect: false },
        { id: 'r2', label: 'By working and providing value to others', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Work is how most people earn their income.', isCorrect: true },
        { id: 'r3', label: 'Waiting for someone to give it to you', effects: {}, outcomeText: 'This is passive - earning usually requires effort!', isCorrect: false }
      ],
      explanation: 'Earning money comes from exchanging your time, skills, or effort for payment. The more value you provide, the more you can earn!'
    },
    rewards: { goldDelta: 15, xpDelta: 30, masteryDelta: 10 }
  },
  {
    id: 'earn_potion_labels',
    title: 'Potion Labels',
    description: 'Help the apothecary organize and label potions for extra gold.',
    npcName: 'Mira the Messenger',
    npcEmoji: '📬',
    category: 'earning',
    difficulty: 1,
    estimatedMinutes: 5,
    briefing: [
      { title: 'A New Opportunity', text: "The local apothecary needs help labeling potions. It's detail-oriented work that pays well!", icon: '🧪' },
      { title: 'The Job', text: "You'll sort potions by color and write clear labels. Accuracy is more important than speed.", icon: '🏷️' },
      { title: 'Skills & Earning', text: 'Different jobs require different skills. Some pay more for specialized work!', icon: '💰' }
    ],
    steps: [
      { id: 'pl-1', type: 'info', speaker: 'Apothecary', text: "I'll pay 3 gold per batch of potions you label correctly. Mistakes cost me money, so accuracy matters!" },
      {
        id: 'pl-2', type: 'choice', speaker: 'narrator', text: 'First batch: 10 healing potions. How do you approach this?',
        choices: [
          { id: 'pl-2a', label: 'Work quickly to label more batches', effects: { goldDelta: 6, stressDelta: 10 }, outcomeText: 'You labeled 2 batches but made some errors. 6 gold earned.' },
          { id: 'pl-2b', label: 'Work carefully on each label', effects: { goldDelta: 3, happinessDelta: 5 }, outcomeText: 'Perfect labels! The apothecary is impressed. 3 gold earned.' },
          { id: 'pl-2c', label: 'Ask for a demonstration first', effects: { goldDelta: 3 }, outcomeText: 'You learned the proper technique and did it right. 3 gold earned.' }
        ]
      },
      {
        id: 'pl-3', type: 'choice', speaker: 'narrator', text: 'The apothecary offers overtime: "Stay another hour for 5 gold, but you\'ll miss your friend\'s invitation."',
        choices: [
          { id: 'pl-3a', label: 'Take the overtime', effects: { goldDelta: 5, happinessDelta: -10 }, outcomeText: 'More gold, but you missed out on fun with friends.' },
          { id: 'pl-3b', label: 'Leave to see your friend', effects: { happinessDelta: 10 }, outcomeText: 'Work-life balance! You had a great time with your friend.' },
          { id: 'pl-3c', label: 'Offer to come back tomorrow instead', effects: { goldDelta: 5 }, outcomeText: 'The apothecary agrees - you get both the gold AND see your friend later!' }
        ]
      },
      { id: 'pl-4', type: 'result', speaker: 'narrator', text: "You've finished your shift at the apothecary. Skilled work often pays better than simple labor!" }
    ],
    reflection: {
      question: 'Why might some jobs pay more than others?',
      choices: [
        { id: 'r1', label: 'The boss likes some workers more', effects: {}, outcomeText: 'While relationships matter, pay is usually based on other factors.', isCorrect: false },
        { id: 'r2', label: 'Jobs requiring more skill or responsibility often pay more', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Specialized skills and responsibility increase earning potential.', isCorrect: true },
        { id: 'r3', label: 'It\'s completely random', effects: {}, outcomeText: 'Actually, there are patterns - skills, demand, and difficulty affect pay.', isCorrect: false }
      ],
      explanation: 'Jobs that require specialized skills, education, or carry more responsibility tend to pay higher wages. Investing in your skills can increase your earning potential!'
    },
    rewards: { goldDelta: 12, xpDelta: 30, masteryDelta: 10 }
  },
  {
    id: 'earn_garden_cleanup',
    title: 'Garden Cleanup',
    description: 'Help clear overgrown gardens around town - hard work, honest pay.',
    npcName: 'Mira the Messenger',
    npcEmoji: '📬',
    category: 'earning',
    difficulty: 2,
    estimatedMinutes: 6,
    briefing: [
      { title: 'Physical Labor', text: 'Garden work is tiring but pays well. Sometimes the hardest jobs have the best rewards!', icon: '🌿' },
      { title: 'Multiple Clients', text: "You'll work for three different homeowners today. Each has different expectations.", icon: '🏡' },
      { title: 'Negotiation', text: "Learn that you can sometimes negotiate your pay - but be fair and professional!", icon: '🤝' }
    ],
    steps: [
      { id: 'gc-1', type: 'info', speaker: 'Mira', text: "Three gardens need cleanup today. Standard pay is 8 gold per garden. Do good work and you might get tips!" },
      {
        id: 'gc-2', type: 'choice', speaker: 'narrator', text: 'First garden: Mr. Bramble\'s yard is huge. He offers 8 gold but it looks like a lot of work.',
        choices: [
          { id: 'gc-2a', label: 'Accept the standard rate', effects: { goldDelta: 8, stressDelta: 15 }, outcomeText: 'Tough work, but you earned your 8 gold.' },
          { id: 'gc-2b', label: 'Politely ask for 10 gold given the size', effects: { goldDelta: 10, stressDelta: 10 }, outcomeText: 'He respects your confidence and agrees! 10 gold earned.' },
          { id: 'gc-2c', label: 'Offer to do half for 5 gold', effects: { goldDelta: 5, happinessDelta: 5 }, outcomeText: 'He agrees to the partial job. Less money but less stress.' }
        ]
      },
      {
        id: 'gc-3', type: 'choice', speaker: 'narrator', text: 'Second garden: Mrs. Willow is elderly and kind. She offers 8 gold plus lunch.',
        choices: [
          { id: 'gc-3a', label: 'Accept gratefully', effects: { goldDelta: 8, happinessDelta: 10 }, outcomeText: 'Her homemade lunch was delicious! A great work experience.' },
          { id: 'gc-3b', label: 'Decline lunch, ask for 10 gold instead', effects: { goldDelta: 10 }, outcomeText: 'She agrees, but seemed a bit hurt. Business is business though.' },
          { id: 'gc-3c', label: 'Do extra work as thanks for lunch', effects: { goldDelta: 8, happinessDelta: 15 }, outcomeText: 'She was so touched she promised to recommend you to neighbors!' }
        ]
      },
      {
        id: 'gc-4', type: 'choice', speaker: 'narrator', text: 'Third garden: The town square. Pay is 12 gold but everyone will see your work quality.',
        choices: [
          { id: 'gc-4a', label: 'Do your absolute best work', effects: { goldDelta: 12, stressDelta: 10, happinessDelta: 10 }, outcomeText: 'People complimented your work! Great for your reputation.' },
          { id: 'gc-4b', label: 'Do standard quality work', effects: { goldDelta: 12 }, outcomeText: 'Job done. Nothing special, but you got paid.' },
          { id: 'gc-4c', label: 'Rush through it', effects: { goldDelta: 12, stressDelta: -5, happinessDelta: -10 }, outcomeText: 'You finished fast but it looked sloppy. Some people noticed.' }
        ]
      },
      { id: 'gc-5', type: 'result', speaker: 'narrator', text: "A full day's work! Hard labor can be rewarding, both financially and personally." }
    ],
    reflection: {
      question: 'When is it appropriate to negotiate for higher pay?',
      choices: [
        { id: 'r1', label: 'Whenever you want more money', effects: {}, outcomeText: 'Negotiation should be based on reasons, not just wanting more.', isCorrect: false },
        { id: 'r2', label: 'When the job requires more effort than expected', effects: { masteryDelta: 5 }, outcomeText: 'Correct! If work is harder or takes longer, asking for fair compensation is reasonable.', isCorrect: true },
        { id: 'r3', label: 'Never - always accept what\'s offered', effects: {}, outcomeText: 'Actually, respectful negotiation is a valuable skill!', isCorrect: false }
      ],
      explanation: 'Negotiating is a normal part of work. When a job requires more than expected, it\'s fair to discuss compensation. Be professional, explain your reasoning, and be willing to compromise.'
    },
    rewards: { goldDelta: 20, xpDelta: 40, masteryDelta: 15 }
  },
  {
    id: 'earn_festival_helper',
    title: 'Festival Helper',
    description: 'The annual Briarbrook Festival needs volunteers - with perks!',
    npcName: 'Mira the Messenger',
    npcEmoji: '📬',
    category: 'earning',
    difficulty: 2,
    estimatedMinutes: 6,
    briefing: [
      { title: 'Festival Time!', text: 'The Briarbrook Harvest Festival is here! Volunteers get paid PLUS free food and games.', icon: '🎪' },
      { title: 'Multiple Roles', text: "Different jobs pay differently. Some are fun, some are tough. You'll choose your role.", icon: '🎭' },
      { title: 'Benefits vs Wages', text: "Sometimes job 'perks' (like free food) are worth as much as extra pay!", icon: '🎁' }
    ],
    steps: [
      { id: 'fh-1', type: 'info', speaker: 'Festival Organizer', text: "Welcome! We have three roles: Ticket Booth (10 gold, boring), Game Runner (8 gold + play games free), or Cleanup Crew (15 gold, hard work)." },
      {
        id: 'fh-2', type: 'choice', speaker: 'narrator', text: 'Which role do you choose for the festival?',
        choices: [
          { id: 'fh-2a', label: 'Ticket Booth - steady and predictable', effects: { goldDelta: 10, stressDelta: 5 }, outcomeText: 'A calm day. You earned 10 gold and met lots of visitors.' },
          { id: 'fh-2b', label: 'Game Runner - less pay but fun perks', effects: { goldDelta: 8, happinessDelta: 15 }, outcomeText: 'You had a blast running games AND got to play for free! The fun was worth it.' },
          { id: 'fh-2c', label: 'Cleanup Crew - hard work, best pay', effects: { goldDelta: 15, stressDelta: 15, happinessDelta: -5 }, outcomeText: 'Exhausting but profitable. 15 gold is the most anyone earned today.' }
        ]
      },
      {
        id: 'fh-3', type: 'choice', speaker: 'narrator', text: 'Midway through, a food vendor offers you free lunch OR 3 gold. Which do you take?',
        choices: [
          { id: 'fh-3a', label: 'Take the free lunch', effects: { happinessDelta: 10 }, outcomeText: 'The festival food was amazing! A meal that would\'ve cost 5 gold.' },
          { id: 'fh-3b', label: 'Take the 3 gold', effects: { goldDelta: 3 }, outcomeText: 'You pocket the gold and eat your packed lunch instead.' }
        ]
      },
      {
        id: 'fh-4', type: 'choice', speaker: 'narrator', text: 'End of the day: Work 2 extra hours for 8 more gold, or enjoy the fireworks show?',
        choices: [
          { id: 'fh-4a', label: 'Work the extra hours', effects: { goldDelta: 8, happinessDelta: -15, stressDelta: 10 }, outcomeText: 'More gold, but you missed the fireworks everyone\'s talking about.' },
          { id: 'fh-4b', label: 'Watch the fireworks', effects: { happinessDelta: 20 }, outcomeText: 'The fireworks were magical! Some experiences are priceless.' },
          { id: 'fh-4c', label: 'Work 1 hour, catch half the show', effects: { goldDelta: 4, happinessDelta: 10 }, outcomeText: 'A balanced choice! You got extra gold and saw part of the show.' }
        ]
      },
      { id: 'fh-5', type: 'result', speaker: 'narrator', text: "Festival day is over! Remember: sometimes the best 'payment' isn't just gold." }
    ],
    reflection: {
      question: 'Why might someone choose a job with lower pay but better perks?',
      choices: [
        { id: 'r1', label: 'They\'re bad at math', effects: {}, outcomeText: 'Actually, comparing total value takes good thinking!', isCorrect: false },
        { id: 'r2', label: 'Perks like free food or fun can have real value', effects: { masteryDelta: 5 }, outcomeText: 'Correct! Total compensation includes more than just the paycheck.', isCorrect: true },
        { id: 'r3', label: 'They don\'t care about money', effects: {}, outcomeText: 'Most people do care - they\'re just weighing different benefits.', isCorrect: false }
      ],
      explanation: 'Total compensation includes wages, benefits, perks, and job satisfaction. A job paying less gold but offering free meals, fun experiences, or good work environment might actually be the better deal!'
    },
    rewards: { goldDelta: 15, xpDelta: 40, masteryDelta: 15 }
  },
  {
    id: 'earn_paycheck_split',
    title: 'Paycheck Split',
    description: 'Learn how to divide your earnings wisely between spending and saving.',
    npcName: 'Mira the Messenger',
    npcEmoji: '📬',
    category: 'earning',
    difficulty: 3,
    estimatedMinutes: 7,
    briefing: [
      { title: 'Your Biggest Paycheck Yet!', text: "You've been working hard and earned 50 gold! Now comes the important part - what to do with it.", icon: '💰' },
      { title: 'The Split Decision', text: 'How you divide money between spending, saving, and goals matters more than how much you earn!', icon: '⚖️' },
      { title: 'Building Habits', text: 'The habits you build now with small amounts will help you handle big amounts later.', icon: '📈' }
    ],
    steps: [
      { id: 'pcs-1', type: 'info', speaker: 'Mira', text: "Congratulations! You've earned 50 gold from this week's work. Let me teach you about the 50/30/20 rule." },
      { id: 'pcs-2', type: 'info', speaker: 'Mira', text: "50% for NEEDS (things you must have), 30% for WANTS (fun stuff), and 20% for SAVINGS. Let's practice!" },
      {
        id: 'pcs-3', type: 'choice', speaker: 'narrator', text: 'How do you want to split your 50 gold?',
        choices: [
          { id: 'pcs-3a', label: '25 needs / 15 wants / 10 savings (50/30/20)', effects: { savingsDelta: 10, happinessDelta: 10 }, outcomeText: 'Perfect balance! You\'re following smart money principles.' },
          { id: 'pcs-3b', label: '20 needs / 25 wants / 5 savings', effects: { savingsDelta: 5, happinessDelta: 15 }, outcomeText: 'More fun now, but less saved for later. Risky!' },
          { id: 'pcs-3c', label: '20 needs / 10 wants / 20 savings', effects: { savingsDelta: 20, happinessDelta: 5, stressDelta: 5 }, outcomeText: 'Great savings! But don\'t forget to enjoy life too.' }
        ]
      },
      {
        id: 'pcs-4', type: 'choice', speaker: 'narrator', text: 'Your friend invites you to a concert that costs 20 gold. This would break your budget plan.',
        choices: [
          { id: 'pcs-4a', label: 'Stick to your plan - decline', effects: { happinessDelta: -5, stressDelta: -10 }, outcomeText: 'Discipline! Your budget stays intact. Your friend understands.' },
          { id: 'pcs-4b', label: 'Go to the concert, adjust savings', effects: { savingsDelta: -10, happinessDelta: 20 }, outcomeText: 'Amazing concert! But your savings took a hit.' },
          { id: 'pcs-4c', label: 'Offer to do extra work to afford it', effects: { goldDelta: 10, happinessDelta: 15, stressDelta: 10 }, outcomeText: 'You worked extra hours and earned it! Best of both worlds.' }
        ]
      },
      {
        id: 'pcs-5', type: 'choice', speaker: 'narrator', text: 'End of month: Your savings goal was 10 gold. Did you meet it?',
        choices: [
          { id: 'pcs-5a', label: 'Yes! I saved 10 or more', effects: { happinessDelta: 10 }, outcomeText: 'Goal achieved! This is how wealth is built - one goal at a time.' },
          { id: 'pcs-5b', label: 'Close - I saved about 5', effects: { happinessDelta: 5 }, outcomeText: 'Not quite, but you\'re building the habit. Next month will be better!' },
          { id: 'pcs-5c', label: 'No, I spent it all', effects: { stressDelta: 10 }, outcomeText: 'It happens. Learn from this and try again next month.' }
        ]
      },
      { id: 'pcs-6', type: 'result', speaker: 'Mira', text: "You're learning that EARNING is only half the equation. What you DO with your money matters just as much!" }
    ],
    reflection: {
      question: 'What is the 50/30/20 rule?',
      choices: [
        { id: 'r1', label: '50% savings, 30% needs, 20% wants', effects: {}, outcomeText: 'Close, but that would be very hard to live on!', isCorrect: false },
        { id: 'r2', label: '50% needs, 30% wants, 20% savings', effects: { masteryDelta: 5 }, outcomeText: 'Correct! This is a popular guideline for balanced money management.', isCorrect: true },
        { id: 'r3', label: '50% fun, 30% more fun, 20% savings', effects: {}, outcomeText: 'That sounds fun but wouldn\'t cover your bills!', isCorrect: false }
      ],
      explanation: 'The 50/30/20 rule suggests spending 50% on needs (rent, food, bills), 30% on wants (entertainment, dining out), and saving 20%. It\'s a flexible guideline, not a strict rule!'
    },
    rewards: { goldDelta: 50, xpDelta: 60, masteryDelta: 25 }
  }
];


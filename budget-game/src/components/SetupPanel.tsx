import { useState } from 'react';
import { generateSeed } from '../game/rng';

interface SetupPanelProps {
  onStart: (seed: number) => void;
}

export function SetupPanel({ onStart }: SetupPanelProps) {
  const [seedInput, setSeedInput] = useState('');
  
  const handleStart = () => {
    const seed = seedInput.trim() ? parseInt(seedInput, 10) : generateSeed();
    if (!isNaN(seed)) {
      onStart(seed);
    } else {
      onStart(generateSeed());
    }
  };

  return (
    <div className="game-panel text-center max-w-lg mx-auto">
      <div className="text-6xl mb-4">🎮</div>
      
      <h2 className="font-display text-2xl font-bold text-amber-800 mb-4">
        Ready to Start?
      </h2>
      
      <p className="font-body text-gray-700 mb-6">
        You'll manage your budget for one month (4 weeks). Pay your bills, 
        handle unexpected events, and try to stay happy while avoiding financial stress!
      </p>
      
      <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200 mb-6 text-left">
        <h3 className="font-display font-semibold text-amber-800 mb-2">🎯 Goals</h3>
        <ul className="font-body text-sm text-gray-700 space-y-1">
          <li>✓ Keep some money in savings for emergencies</li>
          <li>✓ Stay happy by budgeting for fun</li>
          <li>✓ Manage stress by avoiding money problems</li>
          <li>✓ Make it through all 4 weeks!</li>
        </ul>
      </div>
      
      <div className="mb-6">
        <label className="block font-body text-sm text-gray-600 mb-2">
          🎲 Custom Seed (optional - leave blank for random)
        </label>
        <input
          type="text"
          value={seedInput}
          onChange={(e) => setSeedInput(e.target.value)}
          placeholder="e.g., 12345"
          className="w-full max-w-xs px-4 py-2 border-2 border-amber-300 rounded-lg font-mono text-center focus:outline-none focus:border-amber-500"
        />
        <p className="text-xs text-gray-500 mt-1 font-body">
          Use the same seed to replay the exact same events!
        </p>
      </div>
      
      <button onClick={handleStart} className="btn-primary text-xl px-10">
        🚀 Start Game
      </button>
    </div>
  );
}


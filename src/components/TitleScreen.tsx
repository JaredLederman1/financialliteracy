import { useState } from 'react';
import { hasSavedGame, loadPlayerProfile, deleteSavedGame } from '../game/storage';
import { generateSeed } from '../game/rng';
import type { PlayerProfile } from '../game/types';

interface TitleScreenProps {
  onNewGame: (name: string, seed: number) => void;
  onLoadGame: (profile: PlayerProfile) => void;
}

export function TitleScreen({ onNewGame, onLoadGame }: TitleScreenProps) {
  const [showNameEntry, setShowNameEntry] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [seedInput, setSeedInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const savedGame = hasSavedGame();
  const savedProfile = savedGame ? loadPlayerProfile() : null;

  const handleStartNew = () => {
    if (!playerName.trim()) return;
    const seed = seedInput.trim() ? parseInt(seedInput, 10) : generateSeed();
    onNewGame(playerName.trim(), isNaN(seed) ? generateSeed() : seed);
  };

  const handleContinue = () => {
    if (savedProfile) {
      onLoadGame(savedProfile);
    }
  };

  const handleDeleteSave = () => {
    if (confirm('Are you sure you want to delete your saved game? This cannot be undone.')) {
      deleteSavedGame();
      window.location.reload();
    }
  };

  if (showNameEntry) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="game-panel max-w-md w-full text-center">
          <button
            onClick={() => setShowNameEntry(false)}
            className="absolute top-4 left-4 text-amber-600 hover:text-amber-800"
          >
            ← Back
          </button>
          
          <div className="text-5xl mb-4">🏠</div>
          <h2 className="font-display text-2xl font-bold text-amber-800 mb-2">
            Welcome to Maplewood!
          </h2>
          <p className="font-body text-gray-600 mb-6">
            What's your name, new neighbor?
          </p>
          
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            maxLength={20}
            className="w-full px-4 py-3 text-lg border-2 border-amber-300 rounded-xl font-body text-center focus:outline-none focus:border-amber-500 mb-4"
            autoFocus
          />
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-amber-600 hover:text-amber-800 mb-4"
          >
            {showAdvanced ? '▲ Hide advanced options' : '▼ Advanced options'}
          </button>
          
          {showAdvanced && (
            <div className="mb-4 p-3 bg-amber-50 rounded-lg">
              <label className="block text-sm text-gray-600 mb-1 font-body">
                Custom Seed (for replay)
              </label>
              <input
                type="text"
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                placeholder="Leave blank for random"
                className="w-full px-3 py-2 border border-amber-200 rounded-lg font-mono text-sm"
              />
            </div>
          )}
          
          <button
            onClick={handleStartNew}
            disabled={!playerName.trim()}
            className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🚀 Start Adventure
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo/Title Area */}
        <div className="game-panel mb-6 py-8">
          <div className="text-6xl mb-4">🏘️💰</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-amber-800 mb-3">
            Maplewood
          </h1>
          <p className="font-display text-xl text-amber-600 mb-2">
            Budget Adventures
          </p>
          <p className="font-body text-gray-600 text-sm max-w-xs mx-auto">
            Learn to manage money, make friends, and reach your goals in this charming town!
          </p>
        </div>
        
        {/* Buttons */}
        <div className="space-y-3">
          {savedGame && savedProfile && (
            <>
              <button
                onClick={handleContinue}
                className="btn-primary w-full text-lg"
              >
                ▶️ Continue as {savedProfile.name}
                <span className="block text-sm font-normal opacity-80">
                  Level {savedProfile.level} • {savedProfile.completedQuestIds.length}/6 quests
                </span>
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNameEntry(true)}
                  className="btn-secondary flex-1"
                >
                  🆕 New Game
                </button>
                <button
                  onClick={handleDeleteSave}
                  className="px-4 py-2 text-red-600 hover:text-red-800 font-body text-sm"
                >
                  🗑️ Delete Save
                </button>
              </div>
            </>
          )}
          
          {!savedGame && (
            <button
              onClick={() => setShowNameEntry(true)}
              className="btn-primary w-full text-xl py-4"
            >
              🎮 Start Your Adventure
            </button>
          )}
        </div>
        
        {/* Info */}
        <div className="mt-8 text-sm text-amber-700 font-body">
          <p>Chapter 1: Your First Week</p>
          <p className="text-xs text-amber-600 mt-1">~15-20 minutes to complete</p>
        </div>
      </div>
    </div>
  );
}


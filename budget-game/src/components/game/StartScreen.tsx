import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RefreshCw, Trash2, Settings, UserX } from 'lucide-react';
import { hasSavedGame, loadPlayerProfile, deleteSavedGame } from '../../game/storage';
import { generateSeed } from '../../game/rng';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { PlayerProfile } from '../../game/types';

interface StartScreenProps {
  onNewGame: (name: string, seed: number) => void;
  onLoadGame: (profile: PlayerProfile) => void;
  onResetProfile?: () => void;
}

export function StartScreen({ onNewGame, onLoadGame, onResetProfile }: StartScreenProps) {
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
    if (confirm('Delete your saved game? This cannot be undone.')) {
      deleteSavedGame();
      window.location.reload();
    }
  };

  // Name entry screen
  if (showNameEntry) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="bg-blob bg-primary-200/40 w-72 h-72" style={{ top: '10%', left: '5%' }} />
          <div className="bg-blob bg-positive-200/30 w-64 h-64" style={{ bottom: '20%', right: '10%' }} />
        </div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' }}
        >
          <Card className="max-w-md w-full text-center relative">
            <button
              onClick={() => setShowNameEntry(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 text-sm font-medium"
            >
              ← Back
            </button>
            
            <motion.div 
              className="text-6xl mb-4"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏘️
            </motion.div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Welcome to Maplewood!
            </h2>
            <p className="text-slate-500 mb-6">
              What's your name, new neighbor?
            </p>
            
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              className="input text-center text-lg mb-4"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleStartNew()}
            />
            
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1 mx-auto"
            >
              <Settings className="w-4 h-4" />
              {showAdvanced ? 'Hide options' : 'Advanced options'}
            </button>
            
            {showAdvanced && (
              <motion.div 
                className="mb-4 p-3 bg-surface-50 rounded-xl"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
              >
                <label className="block text-sm text-slate-500 mb-1">
                  Custom Seed (for replay)
                </label>
                <input
                  type="text"
                  value={seedInput}
                  onChange={(e) => setSeedInput(e.target.value)}
                  placeholder="Leave blank for random"
                  className="input text-sm"
                />
              </motion.div>
            )}
            
            <Button
              onClick={handleStartNew}
              disabled={!playerName.trim()}
              fullWidth
              size="lg"
              icon={<Play className="w-5 h-5" />}
            >
              Start Adventure
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Main title screen
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="bg-blob bg-primary-200/40 w-80 h-80"
          style={{ top: '5%', left: '10%' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="bg-blob bg-positive-200/30 w-64 h-64"
          style={{ top: '30%', right: '5%' }}
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="bg-blob bg-purple-200/30 w-56 h-56"
          style={{ bottom: '10%', left: '20%' }}
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-md w-full text-center relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
        >
          <Card className="mb-6 py-8">
            <motion.div 
              className="text-7xl mb-4"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              🏘️
            </motion.div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Maplewood
            </h1>
            <p className="text-xl text-primary-500 font-semibold mb-3">
              Budget Adventures
            </p>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              Learn to manage money, make friends, and reach your goals in this charming town!
            </p>
          </Card>
        </motion.div>

        {/* Buttons */}
        <motion.div 
          className="space-y-3"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          {savedGame && savedProfile && (
            <>
              <Button
                onClick={handleContinue}
                fullWidth
                size="lg"
                icon={<Play className="w-5 h-5" />}
              >
                <div className="text-left">
                  <div>Continue as {savedProfile.name}</div>
                  <div className="text-sm opacity-80 font-normal">
                    Level {savedProfile.level} • {savedProfile.completedQuestIds.length}/6 quests
                  </div>
                </div>
              </Button>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowNameEntry(true)}
                  variant="secondary"
                  className="flex-1"
                  icon={<RefreshCw className="w-4 h-4" />}
                >
                  New Game
                </Button>
                <Button
                  onClick={handleDeleteSave}
                  variant="ghost"
                  className="text-danger-500 hover:bg-danger-50"
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Delete
                </Button>
              </div>
            </>
          )}
          
          {!savedGame && (
            <Button
              onClick={() => setShowNameEntry(true)}
              fullWidth
              size="lg"
              icon={<Play className="w-5 h-5" />}
            >
              Start Your Adventure
            </Button>
          )}
        </motion.div>

        {/* Chapter info */}
        <motion.div 
          className="mt-8 text-slate-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p>Chapter 1: Your First Week</p>
          <p className="text-xs mt-1">~15-20 minutes to complete</p>
        </motion.div>

        {/* Reset Profile button for development */}
        {onResetProfile && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => {
                if (confirm('Reset your profile and start over? This will clear all progress including your account.')) {
                  onResetProfile();
                }
              }}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm mx-auto transition-colors"
            >
              <UserX className="w-4 h-4" />
              Reset Profile
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}


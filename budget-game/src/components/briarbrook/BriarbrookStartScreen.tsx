/**
 * BriarbrookStartScreen - Cozy Illustrated Style
 * 
 * Title screen with soft colors, floating elements,
 * and friendly welcome message.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RefreshCw, Trash2, Settings, Sparkles, TreeDeciduous } from 'lucide-react';
import { hasSavedGame, loadPlayer, deleteSavedGame } from '../../game/briarbrook/storage';
import type { BriarbrookPlayer } from '../../game/briarbrook/types';
import { Button } from '../ui/Button';

interface BriarbrookStartScreenProps {
  onNewGame: (name: string, seed: number) => void;
  onLoadGame: (player: BriarbrookPlayer) => void;
  onReset?: () => void;
}

export function BriarbrookStartScreen({ 
  onNewGame, 
  onLoadGame,
  onReset,
}: BriarbrookStartScreenProps) {
  const [showNameEntry, setShowNameEntry] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [seedInput, setSeedInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const savedGame = hasSavedGame();
  const savedPlayer = savedGame ? loadPlayer() : null;

  const handleStartNew = () => {
    if (!playerName.trim()) return;
    const seed = seedInput.trim() ? parseInt(seedInput, 10) : Date.now();
    onNewGame(playerName.trim(), isNaN(seed) ? Date.now() : seed);
  };

  const handleContinue = () => {
    if (savedPlayer) {
      onLoadGame(savedPlayer);
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
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-100 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 bg-teal-300/50 rounded-full blur-3xl top-1/4 -left-20" />
        <div className="absolute w-64 h-64 bg-amber-300/40 rounded-full blur-3xl bottom-1/4 -right-20" />
        </div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
            <button
              onClick={() => setShowNameEntry(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium flex items-center gap-1 mb-4"
            >
              ← Back
            </button>

            <motion.div
              className="text-6xl mb-4 text-center"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🌿
            </motion.div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">
              Welcome, Adventurer!
            </h2>
            <p className="text-slate-500 mb-6 text-center">
              What shall we call you in Briarbrook?
            </p>

            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:bg-white transition-all text-center text-lg mb-4"
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
                className="mb-4 p-4 bg-slate-50 rounded-2xl border border-slate-100"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
              >
                <label className="block text-sm text-slate-500 mb-2 font-medium">
                  Custom Seed (for replay)
                </label>
                <input
                  type="text"
                  value={seedInput}
                  onChange={(e) => setSeedInput(e.target.value)}
                  placeholder="Leave blank for random"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-teal-400"
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
              Begin Adventure
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main title screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-100 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-80 h-80 bg-teal-300/50 rounded-full blur-3xl"
          style={{ top: '5%', left: '10%' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-amber-200/30 rounded-full blur-3xl"
          style={{ top: '30%', right: '5%' }}
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-56 h-56 bg-violet-200/30 rounded-full blur-3xl"
          style={{ bottom: '10%', left: '20%' }}
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating leaves */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-60"
            style={{
              left: `${10 + i * 12}%`,
              top: '-10%',
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, Math.sin(i) * 50, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              delay: i * 2,
              ease: 'linear',
            }}
          >
            🍃
          </motion.div>
        ))}

        {/* Soft clouds */}
        <motion.div
          className="absolute w-32 h-20 bg-white/60 rounded-full blur-sm"
          style={{ top: '15%', left: '20%' }}
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-24 h-14 bg-white/50 rounded-full blur-sm"
          style={{ top: '10%', right: '25%' }}
          animate={{ x: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-md w-full text-center relative z-10">
        {/* Logo Card */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-6 border border-white/50">
            <motion.div
              className="text-7xl mb-4"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              🌿
            </motion.div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2 tracking-tight">
              Briarbrook
            </h1>
            <p className="text-xl text-teal-600 font-semibold mb-3 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Financial Adventures
            </p>
            <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
              Learn to earn, budget, save, borrow wisely, and plan for your future in this cozy magical town!
            </p>

            {/* Features */}
            <div className="flex justify-center gap-4 mt-5 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">
                <TreeDeciduous className="w-3 h-3" /> 5 Buildings
              </span>
              <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full">25 Contracts</span>
              <span className="bg-sky-50 text-sky-600 px-2.5 py-1 rounded-full">Free Roam</span>
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          {savedGame && savedPlayer && (
            <>
              <Button
                onClick={handleContinue}
                fullWidth
                size="lg"
                icon={<Play className="w-5 h-5" />}
              >
                <div className="text-left">
                  <div>Continue as {savedPlayer.name}</div>
                  <div className="text-sm opacity-80 font-normal">
                    Level {savedPlayer.level} • {savedPlayer.completedContractIds.length}/25 contracts
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
                  className="text-rose-500 hover:bg-rose-50"
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

        {/* Info */}
        <motion.div
          className="mt-8 text-slate-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p>Learn financial literacy through adventure!</p>
          <p className="text-xs mt-1 text-slate-400">~30-45 minutes to complete all contracts</p>
        </motion.div>

        {/* Reset button */}
        {onReset && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => {
                if (confirm('Reset everything and start over?')) {
                  onReset();
                }
              }}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Reset All Progress
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

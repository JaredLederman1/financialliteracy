/**
 * ContractResultsOverlay - Cozy Illustrated Style
 * 
 * Celebration screen with confetti, reward display,
 * and encouraging feedback.
 */

import { motion } from 'framer-motion';
import { Trophy, Coins, Sparkles, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { ContractResult, BriarbrookPlayer } from '../../game/briarbrook/types';
import { getXpProgress } from '../../game/briarbrook/storage';
import { Button } from '../ui/Button';

interface ContractResultsOverlayProps {
  result: ContractResult;
  player: BriarbrookPlayer;
  onContinue: () => void;
}

export function ContractResultsOverlay({
  result,
  player,
  onContinue,
}: ContractResultsOverlayProps) {
  const xpInfo = getXpProgress(player.xp);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Celebration particles - confetti */}
      <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              backgroundColor: ['#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'][Math.floor(Math.random() * 5)],
            }}
            initial={{ 
              y: -20, 
              opacity: 1,
              scale: Math.random() * 0.5 + 0.5,
              rotate: 0,
            }}
            animate={{ 
              y: '100vh',
              opacity: 0,
              rotate: Math.random() * 720 - 360,
            }}
            transition={{ 
              duration: Math.random() * 2.5 + 1.5,
              delay: Math.random() * 0.8,
              ease: 'easeIn',
            }}
          />
        ))}
      </div>

      {/* Panel */}
      <motion.div
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50"
        initial={{ opacity: 0, scale: 0.85, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 50 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-16 h-16 border-2 border-white/40 rounded-full"
                  style={{
                    left: `${(i % 3) * 40}%`,
                    top: `${Math.floor(i / 3) * 60}%`,
                  }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-2xl bg-white/25 backdrop-blur-sm mx-auto flex items-center justify-center mb-3 shadow-lg border border-white/30">
                <Trophy className="w-10 h-10 text-amber-300" />
              </div>
            </motion.div>

            <motion.h2 
              className="text-2xl font-bold text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Contract Complete!
            </motion.h2>
            <motion.p 
              className="text-emerald-100 font-medium"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {result.contractTitle}
            </motion.p>
          </div>

          {/* Rewards */}
          <div className="p-5 space-y-4">
            {/* XP earned */}
            <motion.div
              className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-4 text-center border border-teal-100"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-teal-600">
                <Sparkles className="w-6 h-6" />
                +{result.xpEarned} XP
              </div>
            </motion.div>

            {/* Other rewards */}
            <motion.div 
              className="grid grid-cols-2 gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-amber-50 rounded-2xl p-4 text-center border border-amber-100">
                <div className="w-10 h-10 rounded-xl bg-amber-100 mx-auto flex items-center justify-center mb-2">
                  <Coins className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-amber-700 font-bold text-lg">
                  {result.goldEarned > 0 ? `+${result.goldEarned}` : result.goldEarned}
                </div>
                <div className="text-amber-600/70 text-xs font-medium">Gold</div>
              </div>
              <div className="bg-violet-50 rounded-2xl p-4 text-center border border-violet-100">
                <div className="w-10 h-10 rounded-xl bg-violet-100 mx-auto flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-violet-600" />
                </div>
                <div className="text-violet-700 font-bold text-lg">
                  +{result.masteryEarned}
                </div>
                <div className="text-violet-600/70 text-xs font-medium">Mastery</div>
              </div>
            </motion.div>

            {/* Reflection result */}
            <motion.div
              className={`rounded-2xl p-3 text-center border ${
                result.reflectionCorrect 
                  ? 'bg-emerald-50 border-emerald-100' 
                  : 'bg-amber-50 border-amber-100'
              }`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${result.reflectionCorrect ? 'text-emerald-500' : 'text-amber-500'}`} />
                <span className={`font-medium text-sm ${result.reflectionCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
                  Reflection: {result.reflectionCorrect ? 'Correct!' : 'Keep learning!'}
                </span>
              </div>
            </motion.div>

            {/* Level progress */}
            <motion.div
              className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 font-medium">Level {xpInfo.currentLevel}</span>
                <span className="text-slate-500">
                  {xpInfo.xpNeeded > 0 ? `${xpInfo.xpNeeded} XP to next` : 'Max Level!'}
                </span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpInfo.progressPercent}%` }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </div>
            </motion.div>

            {/* Current stats */}
            <motion.div 
              className="grid grid-cols-4 gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <StatMini label="Gold" value={player.gold} colorClass="bg-amber-50 text-amber-700 border-amber-100" />
              <StatMini label="Saved" value={player.savings} colorClass="bg-sky-50 text-sky-700 border-sky-100" />
              <StatMini label="Happy" value={`${player.happiness}%`} colorClass="bg-emerald-50 text-emerald-700 border-emerald-100" />
              <StatMini label="Stress" value={`${player.stress}%`} colorClass="bg-rose-50 text-rose-600 border-rose-100" />
            </motion.div>

            {/* Continue button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                onClick={onContinue}
                fullWidth
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Return to Town
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// Mini stat display
function StatMini({ label, value, colorClass }: { label: string; value: string | number; colorClass: string }) {
  return (
    <div className={`${colorClass} rounded-xl p-2.5 text-center border`}>
      <div className="font-bold text-sm">{value}</div>
      <div className="text-[10px] opacity-70 font-medium">{label}</div>
    </div>
  );
}

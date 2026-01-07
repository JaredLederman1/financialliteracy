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
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Celebration particles */}
      <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: ['#10B981', '#F59E0B', '#8B5CF6', '#EC4899'][Math.floor(Math.random() * 4)],
            }}
            initial={{ 
              y: -20, 
              opacity: 1,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{ 
              y: '100vh',
              opacity: 0,
              rotate: Math.random() * 360,
            }}
            transition={{ 
              duration: Math.random() * 2 + 2,
              delay: Math.random() * 0.5,
              ease: 'easeIn',
            }}
          />
        ))}
      </div>

      {/* Panel */}
      <motion.div
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-16 h-16 border-2 border-white/30 rounded-full"
                  style={{
                    left: `${(i % 3) * 40}%`,
                    top: `${Math.floor(i / 3) * 60}%`,
                  }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-3">
                <Trophy className="w-10 h-10 text-yellow-300" />
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
              className="text-emerald-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {result.contractTitle}
            </motion.p>
          </div>

          {/* Rewards */}
          <div className="p-6 space-y-4">
            {/* XP earned */}
            <motion.div
              className="bg-gradient-to-r from-primary-900/50 to-primary-800/50 rounded-xl p-4 text-center border border-primary-700"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-primary-300">
                <Sparkles className="w-7 h-7" />
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
              <div className="bg-yellow-500/20 rounded-xl p-3 text-center border border-yellow-600/50">
                <Coins className="w-5 h-5 mx-auto text-yellow-400 mb-1" />
                <div className="text-yellow-400 font-bold">
                  {result.goldEarned > 0 ? `+${result.goldEarned}` : result.goldEarned} Gold
                </div>
              </div>
              <div className="bg-purple-500/20 rounded-xl p-3 text-center border border-purple-600/50">
                <Star className="w-5 h-5 mx-auto text-purple-400 mb-1" />
                <div className="text-purple-400 font-bold">
                  +{result.masteryEarned} Mastery
                </div>
              </div>
            </motion.div>

            {/* Reflection result */}
            <motion.div
              className={`rounded-xl p-3 text-center ${
                result.reflectionCorrect 
                  ? 'bg-emerald-500/20 border border-emerald-600/50' 
                  : 'bg-amber-500/20 border border-amber-600/50'
              }`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className={`w-5 h-5 ${result.reflectionCorrect ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span className={`font-medium ${result.reflectionCorrect ? 'text-emerald-300' : 'text-amber-300'}`}>
                  Reflection: {result.reflectionCorrect ? 'Correct!' : 'Keep learning!'}
                </span>
              </div>
            </motion.div>

            {/* Level progress */}
            <motion.div
              className="bg-slate-700/50 rounded-xl p-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Level {xpInfo.currentLevel}</span>
                <span className="text-slate-400">
                  {xpInfo.xpNeeded > 0 ? `${xpInfo.xpNeeded} XP to Level ${xpInfo.currentLevel + 1}` : 'Max Level!'}
                </span>
              </div>
              <div className="h-3 bg-slate-600 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
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
              <StatMini label="Gold" value={player.gold} color="yellow" />
              <StatMini label="Saved" value={player.savings} color="sky" />
              <StatMini label="Happy" value={`${player.happiness}%`} color="emerald" />
              <StatMini label="Stress" value={`${player.stress}%`} color="rose" />
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
function StatMini({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colorClasses: Record<string, string> = {
    yellow: 'bg-yellow-500/20 text-yellow-400',
    sky: 'bg-sky-500/20 text-sky-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    rose: 'bg-rose-500/20 text-rose-400',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-2 text-center`}>
      <div className="font-bold text-sm">{value}</div>
      <div className="text-xs opacity-70">{label}</div>
    </div>
  );
}


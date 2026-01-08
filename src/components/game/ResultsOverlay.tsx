import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { QuestResult, PlayerProfile } from '../../game/types';
import { BADGES } from '../../game/types';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { getXpForNextLevel } from '../../game/progression';

interface ResultsOverlayProps {
  result: QuestResult;
  player: PlayerProfile;
  onContinue: () => void;
}

export function ResultsOverlay({ result, player, onContinue }: ResultsOverlayProps) {
  const xpInfo = getXpForNextLevel(player.xp);
  const totalXp = result.xpEarned + result.bonusXpEarned;
  
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      
      {/* Modal */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {/* Header with celebration */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-6 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-5xl mb-2"
            >
              🎊
            </motion.div>
            <h2 className="text-2xl font-bold">Quest Complete!</h2>
            <p className="text-primary-100 mt-1">{result.questTitle}</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* XP earned */}
            <motion.div 
              className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-4 text-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-3xl font-bold text-primary-600">
                +{totalXp} XP
              </div>
              <div className="text-sm text-primary-500 mt-1">
                {result.xpEarned} base{result.bonusXpEarned > 0 && <span className="text-positive-600"> + {result.bonusXpEarned} bonus!</span>}
              </div>
            </motion.div>

            {/* Level progress */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Level {xpInfo.currentLevel}</span>
                <span>{xpInfo.xpNeeded > 0 ? `${xpInfo.xpNeeded} XP to next` : 'Max level!'}</span>
              </div>
              <ProgressBar value={xpInfo.progressPercent} color="primary" size="md" />
            </motion.div>

            {/* Badge earned */}
            {result.badgeEarned && (
              <motion.div
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 text-center border-2 border-purple-200"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                <motion.div
                  className="text-4xl mb-2"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  {BADGES[result.badgeEarned].emoji}
                </motion.div>
                <div className="font-bold text-purple-700">
                  New Badge Earned!
                </div>
                <div className="text-sm text-purple-600">
                  {BADGES[result.badgeEarned].name}
                </div>
              </motion.div>
            )}

            {/* Current stats */}
            <motion.div 
              className="grid grid-cols-4 gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-positive-50 rounded-xl p-2 text-center">
                <div className="text-lg font-bold text-positive-600">${player.cash}</div>
                <div className="text-xs text-slate-500">Cash</div>
              </div>
              <div className="bg-primary-50 rounded-xl p-2 text-center">
                <div className="text-lg font-bold text-primary-600">${player.savings}</div>
                <div className="text-xs text-slate-500">Saved</div>
              </div>
              <div className="bg-warning-100 rounded-xl p-2 text-center">
                <div className="text-lg font-bold text-amber-600">{player.happiness}</div>
                <div className="text-xs text-slate-500">Happy</div>
              </div>
              <div className="bg-danger-50 rounded-xl p-2 text-center">
                <div className="text-lg font-bold text-danger-500">{player.stress}</div>
                <div className="text-xs text-slate-500">Stress</div>
              </div>
            </motion.div>

            {/* Continue button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button 
                onClick={onContinue} 
                fullWidth 
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Return to Map
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}


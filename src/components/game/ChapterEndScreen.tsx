import { motion } from 'framer-motion';
import { RefreshCw, Trophy, Target, BookOpen, Coins } from 'lucide-react';
import type { PlayerProfile } from '../../game/types';
import { BADGES } from '../../game/types';
import { getChapterTier, getXpForNextLevel } from '../../game/progression';
import { deleteSavedGame } from '../../game/storage';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { BadgeChip } from '../ui/BadgeChip';

interface ChapterEndScreenProps {
  player: PlayerProfile;
  onPlayAgain: () => void;
}

export function ChapterEndScreen({ player, onPlayAgain }: ChapterEndScreenProps) {
  const tier = getChapterTier(player);
  const xpInfo = getXpForNextLevel(player.xp);

  const handlePlayAgain = () => {
    deleteSavedGame();
    onPlayAgain();
  };

  const tierGradients: Record<string, string> = {
    'balanced': 'from-positive-500 to-teal-500',
    'over-saver': 'from-primary-500 to-blue-500',
    'fun-focused': 'from-purple-500 to-pink-500',
    'struggled': 'from-amber-500 to-orange-500',
    'progressing': 'from-primary-400 to-primary-600',
  };

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="bg-blob bg-primary-200/30 w-80 h-80"
          style={{ top: '5%', right: '10%' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="bg-blob bg-positive-200/20 w-64 h-64"
          style={{ bottom: '20%', left: '5%' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-lg mx-auto relative z-10">
        {/* Trophy header */}
        <motion.div 
          className="text-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <motion.div
            className="text-7xl mb-4"
            animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🏆
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-800">Chapter 1 Complete!</h1>
          <p className="text-slate-500 mt-1">You finished your first week in Maplewood!</p>
        </motion.div>

        {/* Tier result */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card 
            className={`bg-gradient-to-br ${tierGradients[tier.tier]} text-white mb-4 text-center`}
            padding="lg"
          >
            <div className="text-5xl mb-3">{tier.emoji}</div>
            <h2 className="text-2xl font-bold">{tier.title}</h2>
            <p className="text-white/90 mt-2 text-sm">{tier.description}</p>
          </Card>
        </motion.div>

        {/* Final stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-4">
            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-500" />
              Final Stats
            </h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-positive-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-positive-600">${player.cash}</div>
                <div className="text-xs text-slate-500">Cash</div>
              </div>
              <div className="bg-primary-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-primary-600">${player.savings}</div>
                <div className="text-xs text-slate-500">Saved</div>
              </div>
              <div className="bg-warning-100 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-amber-600">{player.happiness}</div>
                <div className="text-xs text-slate-500">Happy</div>
              </div>
              <div className="bg-danger-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-danger-500">{player.stress}</div>
                <div className="text-xs text-slate-500">Stress</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* XP and Level */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-700">Level {xpInfo.currentLevel}</span>
              <span className="text-sm text-slate-500">{player.xp} XP</span>
            </div>
            <ProgressBar value={xpInfo.progressPercent} color="primary" />
          </Card>
        </motion.div>

        {/* Badges */}
        {player.badges.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="mb-4">
              <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Badges Earned
              </h3>
              <div className="flex flex-wrap gap-2">
                {player.badges.map(badgeId => {
                  const badge = BADGES[badgeId];
                  return (
                    <BadgeChip 
                      key={badgeId} 
                      emoji={badge.emoji} 
                      label={badge.name}
                      variant="earned"
                    />
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Tips */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="mb-4 bg-primary-50 border border-primary-100">
            <h3 className="font-bold text-primary-700 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Tips for Next Time
            </h3>
            <ul className="space-y-2">
              {tier.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600 text-sm">
                  <span className="text-primary-500 mt-0.5">✦</span>
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* Key lessons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="mb-6 bg-gradient-to-br from-surface-50 to-primary-50/30">
            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Coins className="w-5 h-5 text-positive-500" />
              What You Learned
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white rounded-xl p-3">
                <div className="font-semibold text-positive-600 mb-1">✅ NEEDS</div>
                <p className="text-slate-500 text-xs">Things you require for daily life</p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="font-semibold text-purple-600 mb-1">💜 WANTS</div>
                <p className="text-slate-500 text-xs">Nice-to-haves that bring joy</p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="font-semibold text-primary-600 mb-1">🏦 SAVINGS</div>
                <p className="text-slate-500 text-xs">Money set aside for later</p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="font-semibold text-amber-600 mb-1">💪 EARNING</div>
                <p className="text-slate-500 text-xs">Making money through work</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Play again */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button 
            onClick={handlePlayAgain} 
            fullWidth 
            size="lg"
            icon={<RefreshCw className="w-5 h-5" />}
          >
            Play Again (New Character)
          </Button>
          <p className="text-center text-xs text-slate-400 mt-3">
            Try different choices to unlock all badges!
          </p>
        </motion.div>

        {/* Coming soon */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Card className="bg-surface-100 border border-surface-200">
            <div className="text-2xl mb-2">🚧</div>
            <p className="font-bold text-slate-600">Chapter 2 Coming Soon!</p>
            <p className="text-xs text-slate-400 mt-1">
              New quests and bigger money challenges await...
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}


import type { PlayerProfile } from '../game/types';
import { BADGES } from '../game/types';
import { getChapterTier, getXpForNextLevel } from '../game/progression';
import { deleteSavedGame } from '../game/storage';

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

  const tierColors: Record<string, string> = {
    'balanced': 'from-green-400 to-emerald-500',
    'over-saver': 'from-blue-400 to-cyan-500',
    'fun-focused': 'from-purple-400 to-pink-500',
    'struggled': 'from-orange-400 to-amber-500',
    'progressing': 'from-amber-400 to-yellow-500'
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Celebration header */}
        <div className="text-center mb-6">
          <div className="text-7xl mb-4">🏆</div>
          <h1 className="font-display text-4xl font-bold text-amber-800 mb-2">
            Chapter 1 Complete!
          </h1>
          <p className="font-body text-lg text-gray-600">
            You finished your first week in Maplewood!
          </p>
        </div>

        {/* Tier result */}
        <div className={`game-panel bg-gradient-to-r ${tierColors[tier.tier]} text-white mb-4`}>
          <div className="text-center py-4">
            <div className="text-5xl mb-2">{tier.emoji}</div>
            <h2 className="font-display text-2xl font-bold">{tier.title}</h2>
            <p className="font-body mt-2 opacity-90">{tier.description}</p>
          </div>
        </div>

        {/* Final stats */}
        <div className="game-panel mb-4">
          <h3 className="font-display font-bold text-amber-800 mb-3">📊 Final Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">💵</div>
              <div className="font-display font-bold text-xl text-green-700">${player.cash}</div>
              <div className="text-xs text-gray-500">Cash</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🏦</div>
              <div className="font-display font-bold text-xl text-blue-700">${player.savings}</div>
              <div className="text-xs text-gray-500">Savings</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">😊</div>
              <div className="font-display font-bold text-xl text-yellow-700">{player.happiness}</div>
              <div className="text-xs text-gray-500">Happiness</div>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">😰</div>
              <div className="font-display font-bold text-xl text-red-700">{player.stress}</div>
              <div className="text-xs text-gray-500">Stress</div>
            </div>
          </div>
        </div>

        {/* XP and Level */}
        <div className="game-panel mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-display font-bold text-amber-800">Level {xpInfo.currentLevel}</span>
              <span className="text-amber-600 ml-2">({player.xp} XP)</span>
            </div>
            <div className="text-sm text-amber-600">
              {xpInfo.xpNeeded > 0 ? `${xpInfo.xpNeeded} to next level` : 'Max level!'}
            </div>
          </div>
          <div className="w-full bg-amber-100 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full"
              style={{ width: `${xpInfo.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Badges earned */}
        {player.badges.length > 0 && (
          <div className="game-panel mb-4">
            <h3 className="font-display font-bold text-amber-800 mb-3">🏅 Badges Earned</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {player.badges.map(badgeId => {
                const badge = BADGES[badgeId];
                return (
                  <div key={badgeId} className="bg-purple-50 rounded-xl p-3 text-center">
                    <div className="text-3xl mb-1">{badge.emoji}</div>
                    <div className="font-display font-semibold text-sm text-purple-800">
                      {badge.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tips for next time */}
        <div className="game-panel mb-6">
          <h3 className="font-display font-bold text-amber-800 mb-3">💡 Tips for Next Time</h3>
          <ul className="space-y-2">
            {tier.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 font-body text-gray-700">
                <span className="text-amber-500 mt-0.5">✦</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Key lessons */}
        <div className="game-panel mb-6 bg-gradient-to-r from-blue-50 to-sky-50">
          <h3 className="font-display font-bold text-blue-800 mb-3">📚 What You Learned</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm font-body">
            <div className="bg-white/70 rounded-lg p-3">
              <div className="font-semibold text-green-700 mb-1">✅ NEEDS</div>
              <p className="text-gray-600">Things you require - like a phone charger for school</p>
            </div>
            <div className="bg-white/70 rounded-lg p-3">
              <div className="font-semibold text-purple-700 mb-1">💜 WANTS</div>
              <p className="text-gray-600">Nice-to-haves - like arcade games with friends</p>
            </div>
            <div className="bg-white/70 rounded-lg p-3">
              <div className="font-semibold text-blue-700 mb-1">🏦 SAVINGS</div>
              <p className="text-gray-600">Money set aside for emergencies and goals</p>
            </div>
            <div className="bg-white/70 rounded-lg p-3">
              <div className="font-semibold text-amber-700 mb-1">💪 EARNING</div>
              <p className="text-gray-600">You can make money through work and helping others</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button onClick={handlePlayAgain} className="btn-primary w-full text-lg">
            🔄 Play Again (New Character)
          </button>
          <p className="text-center text-sm text-amber-600 font-body">
            Try different choices to unlock all badges and see different endings!
          </p>
        </div>

        {/* Coming soon teaser */}
        <div className="mt-8 text-center p-4 bg-gray-100 rounded-xl">
          <div className="text-2xl mb-2">🚧</div>
          <p className="font-display font-bold text-gray-700">Chapter 2 Coming Soon!</p>
          <p className="text-sm text-gray-500 font-body">
            New quests, bigger decisions, and more money challenges await...
          </p>
        </div>
      </div>
    </div>
  );
}


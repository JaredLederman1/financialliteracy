import type { QuestResult, PlayerProfile } from '../game/types';
import { BADGES } from '../game/types';
import { getXpForNextLevel } from '../game/progression';

interface QuestResultScreenProps {
  result: QuestResult;
  player: PlayerProfile;
  onContinue: () => void;
}

export function QuestResultScreen({ result, player, onContinue }: QuestResultScreenProps) {
  const xpInfo = getXpForNextLevel(player.xp);
  const totalXp = result.xpEarned + result.bonusXpEarned;
  
  return (
    <div className="min-h-screen flex items-center justify-center py-6 px-4">
      <div className="max-w-lg w-full">
        <div className="game-panel text-center">
          {/* Success header */}
          <div className="text-6xl mb-4">🎊</div>
          <h1 className="font-display text-3xl font-bold text-amber-800 mb-2">
            Quest Complete!
          </h1>
          <p className="font-body text-lg text-gray-600 mb-6">
            {result.questTitle}
          </p>
          
          {/* XP earned */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 mb-4">
            <div className="text-4xl font-display font-bold text-amber-800">
              +{totalXp} XP
            </div>
            <div className="text-sm text-amber-600 font-body mt-1">
              {result.xpEarned} base{result.bonusXpEarned > 0 && ` + ${result.bonusXpEarned} bonus!`}
            </div>
          </div>
          
          {/* Level progress */}
          <div className="bg-white rounded-xl p-4 border border-amber-200 mb-4">
            <div className="flex justify-between text-sm font-body text-amber-700 mb-2">
              <span>Level {xpInfo.currentLevel}</span>
              <span>{xpInfo.xpNeeded > 0 ? `${xpInfo.xpNeeded} XP to Level ${xpInfo.nextLevel}` : 'Max!'}</span>
            </div>
            <div className="w-full bg-amber-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-1000"
                style={{ width: `${xpInfo.progressPercent}%` }}
              />
            </div>
          </div>
          
          {/* Badge earned */}
          {result.badgeEarned && (
            <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200 mb-4">
              <div className="text-3xl mb-2">{BADGES[result.badgeEarned].emoji}</div>
              <div className="font-display font-bold text-purple-800">
                New Badge: {BADGES[result.badgeEarned].name}!
              </div>
              <div className="text-sm text-purple-600 font-body">
                {BADGES[result.badgeEarned].description}
              </div>
            </div>
          )}
          
          {/* Current stats */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            <div className="bg-green-50 rounded-lg p-2">
              <div className="font-display font-bold text-green-700">${player.cash}</div>
              <div className="text-xs text-gray-500">Cash</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-2">
              <div className="font-display font-bold text-blue-700">${player.savings}</div>
              <div className="text-xs text-gray-500">Savings</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-2">
              <div className="font-display font-bold text-yellow-700">{player.happiness}</div>
              <div className="text-xs text-gray-500">Happy</div>
            </div>
            <div className="bg-red-50 rounded-lg p-2">
              <div className="font-display font-bold text-red-700">{player.stress}</div>
              <div className="text-xs text-gray-500">Stress</div>
            </div>
          </div>
          
          {/* Choice summary */}
          {result.choicesSummary.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-display font-semibold text-gray-700 mb-2">Your Choices:</h3>
              <ul className="space-y-1 text-sm font-body text-gray-600">
                {result.choicesSummary.slice(0, 3).map((summary, idx) => (
                  <li key={idx}>• {summary}</li>
                ))}
              </ul>
            </div>
          )}
          
          <button onClick={onContinue} className="btn-primary w-full text-lg">
            Continue to Map →
          </button>
        </div>
      </div>
    </div>
  );
}


import type { PlayerProfile } from '../game/types';
import { CHAPTER_1_QUESTS, getAvailableQuests } from '../game/quests';
import { getXpForNextLevel } from '../game/progression';
import { BADGES } from '../game/types';
import { QuestNode } from './QuestNode';

interface MapScreenProps {
  player: PlayerProfile;
  onStartQuest: (questId: string) => void;
}

export function MapScreen({ player, onStartQuest }: MapScreenProps) {
  const xpInfo = getXpForNextLevel(player.xp);
  const availableQuests = getAvailableQuests(player.completedQuestIds);
  const nextQuest = availableQuests[0];

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with player info */}
        <div className="game-panel mb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-amber-800">
                🏘️ Maplewood
              </h1>
              <p className="font-body text-gray-600">Chapter 1: Your First Week</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Player Stats */}
              <div className="text-right">
                <div className="font-display font-bold text-amber-800">
                  {player.name}
                </div>
                <div className="text-sm text-amber-600">
                  Level {xpInfo.currentLevel}
                </div>
              </div>
              
              {/* Avatar placeholder */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-2xl shadow-md">
                😊
              </div>
            </div>
          </div>
          
          {/* XP Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs font-body text-amber-700 mb-1">
              <span>XP: {player.xp}</span>
              <span>
                {xpInfo.xpNeeded > 0 ? `${xpInfo.xpNeeded} XP to Level ${xpInfo.nextLevel}` : 'Max Level!'}
              </span>
            </div>
            <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-500"
                style={{ width: `${xpInfo.progressPercent}%` }}
              />
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-2 mt-4 text-center">
            <div className="bg-green-50 rounded-lg p-2">
              <div className="text-lg">💵</div>
              <div className="font-display font-bold text-green-700">${player.cash}</div>
              <div className="text-xs text-gray-500">Cash</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-2">
              <div className="text-lg">🏦</div>
              <div className="font-display font-bold text-blue-700">${player.savings}</div>
              <div className="text-xs text-gray-500">Savings</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-2">
              <div className="text-lg">😊</div>
              <div className="font-display font-bold text-yellow-700">{player.happiness}</div>
              <div className="text-xs text-gray-500">Happy</div>
            </div>
            <div className="bg-red-50 rounded-lg p-2">
              <div className="text-lg">😰</div>
              <div className="font-display font-bold text-red-700">{player.stress}</div>
              <div className="text-xs text-gray-500">Stress</div>
            </div>
          </div>
        </div>
        
        {/* Badges */}
        {player.badges.length > 0 && (
          <div className="game-panel mb-4">
            <h3 className="font-display font-semibold text-amber-800 mb-2">🏅 Badges</h3>
            <div className="flex flex-wrap gap-2">
              {player.badges.map(badgeId => {
                const badge = BADGES[badgeId];
                return (
                  <div
                    key={badgeId}
                    className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full"
                    title={badge.description}
                  >
                    <span>{badge.emoji}</span>
                    <span className="font-body text-sm text-amber-800">{badge.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Quest Map */}
        <div className="game-panel">
          <h2 className="font-display text-xl font-bold text-amber-800 mb-4">
            📍 Quest Map
          </h2>
          
          <div className="relative">
            {/* Path line connecting quests */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-amber-200 rounded-full" />
            
            {/* Quest nodes */}
            <div className="space-y-4 relative">
              {CHAPTER_1_QUESTS.map((quest) => {
                const isCompleted = player.completedQuestIds.includes(quest.id);
                const isAvailable = availableQuests.some(q => q.id === quest.id);
                const isNext = nextQuest?.id === quest.id;
                const isLocked = !isCompleted && !isAvailable;
                
                return (
                  <QuestNode
                    key={quest.id}
                    quest={quest}
                    isCompleted={isCompleted}
                    isAvailable={isAvailable}
                    isNext={isNext}
                    isLocked={isLocked}
                    onStart={() => onStartQuest(quest.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Completion status */}
        <div className="text-center mt-4 font-body text-amber-700">
          {player.completedQuestIds.length} / {CHAPTER_1_QUESTS.length} quests completed
        </div>
      </div>
    </div>
  );
}


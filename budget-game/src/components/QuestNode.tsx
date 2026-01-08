import type { Quest } from '../game/types';

interface QuestNodeProps {
  quest: Quest;
  isCompleted: boolean;
  isAvailable: boolean;
  isNext: boolean;
  isLocked: boolean;
  onStart: () => void;
}

export function QuestNode({
  quest,
  isCompleted,
  isAvailable,
  isNext,
  isLocked,
  onStart
}: QuestNodeProps) {
  const getStatusStyles = () => {
    if (isCompleted) {
      return {
        node: 'bg-green-400 border-green-500 text-white',
        card: 'bg-green-50 border-green-200',
        text: 'text-green-800'
      };
    }
    if (isNext) {
      return {
        node: 'bg-amber-400 border-amber-500 text-white animate-pulse',
        card: 'bg-amber-50 border-amber-300 shadow-lg',
        text: 'text-amber-800'
      };
    }
    if (isAvailable) {
      return {
        node: 'bg-amber-300 border-amber-400 text-amber-800',
        card: 'bg-amber-50 border-amber-200',
        text: 'text-amber-700'
      };
    }
    return {
      node: 'bg-gray-300 border-gray-400 text-gray-500',
      card: 'bg-gray-50 border-gray-200 opacity-60',
      text: 'text-gray-500'
    };
  };

  const styles = getStatusStyles();

  return (
    <div className="flex items-start gap-4 relative">
      {/* Node circle */}
      <div
        className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl z-10 ${styles.node}`}
      >
        {isCompleted ? '✓' : isLocked ? '🔒' : quest.npcEmoji}
      </div>
      
      {/* Quest card */}
      <div className={`flex-1 rounded-xl border-2 p-4 ${styles.card}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`font-display font-bold ${styles.text}`}>
                {isLocked ? '???' : quest.title}
              </h3>
              {isCompleted && (
                <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                  Complete
                </span>
              )}
              {isNext && (
                <span className="text-xs bg-amber-300 text-amber-800 px-2 py-0.5 rounded-full animate-bounce">
                  Start Here!
                </span>
              )}
            </div>
            
            <p className={`font-body text-sm mt-1 ${isLocked ? 'text-gray-400' : styles.text}`}>
              {isLocked ? 'Complete previous quests to unlock' : quest.description}
            </p>
            
            {!isLocked && (
              <div className="flex items-center gap-3 mt-2 text-xs font-body text-gray-500">
                <span>📍 {quest.location}</span>
                <span>👤 {quest.npcName}</span>
                <span>⏱️ ~{quest.estimatedMinutes} min</span>
                <span>⭐ {quest.xpReward} XP</span>
              </div>
            )}
          </div>
          
          {isAvailable && !isCompleted && (
            <button
              onClick={onStart}
              className={`btn-${isNext ? 'primary' : 'secondary'} whitespace-nowrap`}
            >
              {isNext ? '▶️ Play' : 'Start'}
            </button>
          )}
        </div>
        
        {/* Badge reward indicator */}
        {!isLocked && quest.badgeReward && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <span className="text-xs text-purple-600 font-body">
              🏅 Can earn badge: {quest.badgeReward.replace('-', ' ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}


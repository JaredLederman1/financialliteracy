import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Trees, Wrench, Users, Store, Building2, Lock, Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { PlayerProfile } from '../../game/types';
import { CHAPTER_1_QUESTS, getAvailableQuests } from '../../game/quests';
import { StatPill } from '../ui/StatPill';
import { ProgressBar } from '../ui/ProgressBar';
import { getXpForNextLevel } from '../../game/progression';
import { BADGES } from '../../game/types';

interface MapViewProps {
  player: PlayerProfile;
  onSelectQuest: (questId: string) => void;
}

// Map node configurations with icons and positions
const MAP_NODES = [
  { 
    questId: 'first-allowance', 
    icon: Home, 
    label: 'Home',
    x: 20,
    y: 15,
    color: 'bg-blue-400',
  },
  { 
    questId: 'hangout-invite', 
    icon: Trees, 
    label: 'Park',
    x: 55,
    y: 25,
    color: 'bg-green-400',
  },
  { 
    questId: 'something-breaks', 
    icon: Wrench, 
    label: 'Repair Shop',
    x: 30,
    y: 42,
    color: 'bg-orange-400',
  },
  { 
    questId: 'side-gig', 
    icon: Users, 
    label: "Mr. Chen's",
    x: 65,
    y: 55,
    color: 'bg-purple-400',
  },
  { 
    questId: 'saving-goal', 
    icon: Store, 
    label: 'Main Street',
    x: 35,
    y: 70,
    color: 'bg-pink-400',
  },
  { 
    questId: 'chapter-1-finale', 
    icon: Building2, 
    label: 'Town Hall',
    x: 60,
    y: 85,
    color: 'bg-indigo-400',
  },
];

export function MapView({ player, onSelectQuest }: MapViewProps) {
  const [statsOpen, setStatsOpen] = useState(false);
  const xpInfo = getXpForNextLevel(player.xp);
  const availableQuests = getAvailableQuests(player.completedQuestIds);
  const nextQuestId = availableQuests[0]?.id;

  const getNodeState = (questId: string) => {
    if (player.completedQuestIds.includes(questId)) return 'completed';
    if (availableQuests.some(q => q.id === questId)) return 'available';
    return 'locked';
  };

  // Draw path between nodes - static, no animation
  const renderPath = () => {
    const pathPoints = MAP_NODES.map(node => ({
      x: node.x,
      y: node.y,
    }));

    let pathD = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    for (let i = 1; i < pathPoints.length; i++) {
      const prev = pathPoints[i - 1];
      const curr = pathPoints[i];
      const midX = (prev.x + curr.x) / 2;
      pathD += ` Q ${midX} ${prev.y}, ${midX} ${(prev.y + curr.y) / 2}`;
      pathD += ` Q ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={pathD}
          fill="none"
          stroke="rgba(99, 102, 241, 0.25)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Static background decorations - no animations to prevent flickering */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute rounded-full bg-white/30 blur-3xl w-64 h-64"
          style={{ top: '5%', left: '10%' }}
        />
        <div 
          className="absolute rounded-full bg-white/25 blur-3xl w-48 h-48"
          style={{ top: '20%', right: '15%' }}
        />
        <div 
          className="absolute rounded-full bg-primary-100/20 blur-3xl w-56 h-56"
          style={{ bottom: '15%', left: '20%' }}
        />
        <div 
          className="absolute rounded-full bg-positive-100/15 blur-3xl w-40 h-40"
          style={{ bottom: '30%', right: '10%' }}
        />
      </div>

      {/* Collapsible Stats Button - Top Right */}
      <div className="fixed top-4 right-4 z-30">
        <motion.button
          onClick={() => setStatsOpen(!statsOpen)}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full shadow-soft px-3 py-2 hover:bg-white transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold">
            {player.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-slate-700 text-sm">Lv.{xpInfo.currentLevel}</span>
          {statsOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </motion.button>

        {/* Expanded Stats Panel */}
        <AnimatePresence>
          {statsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-14 right-0 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-4"
            >
              {/* Player info */}
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-surface-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{player.name}</div>
                  <div className="text-xs text-slate-500">Level {xpInfo.currentLevel}</div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <StatPill icon="💵" label="Cash" value={`$${player.cash}`} color="green" />
                <StatPill icon="🏦" label="Saved" value={`$${player.savings}`} color="blue" />
                <StatPill icon="😊" label="Happy" value={player.happiness} color="amber" showBar barValue={player.happiness} />
                <StatPill icon="😰" label="Stress" value={player.stress} color="rose" showBar barValue={player.stress} />
              </div>

              {/* XP Bar */}
              <div className="pt-2 border-t border-surface-200">
                <ProgressBar 
                  value={xpInfo.progressPercent} 
                  color="primary" 
                  size="sm" 
                  showLabel 
                  label={`${player.xp} XP`}
                />
              </div>

              {/* Badges */}
              {player.badges.length > 0 && (
                <div className="mt-3 pt-3 border-t border-surface-200">
                  <div className="text-xs font-semibold text-slate-500 mb-2">Badges</div>
                  <div className="flex flex-wrap gap-1">
                    {player.badges.map(badgeId => {
                      const badge = BADGES[badgeId];
                      return (
                        <span
                          key={badgeId}
                          className="text-lg"
                          title={badge.name}
                        >
                          {badge.emoji}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map title - centered, no overlap */}
      <div className="pt-6 pb-4 text-center">
        <h1 className="text-3xl font-bold text-slate-800">🏘️ Maplewood</h1>
        <p className="text-slate-500 mt-1">Chapter 1: Your First Week</p>
        <p className="text-xs text-slate-400 mt-1">
          {player.completedQuestIds.length} / {CHAPTER_1_QUESTS.length} quests completed
        </p>
      </div>

      {/* Map area */}
      <div className="relative w-full max-w-lg mx-auto px-4" style={{ height: '65vh', minHeight: '450px' }}>
        {renderPath()}
        
        {/* Map nodes - reduced animations */}
        {MAP_NODES.map((node) => {
          const state = getNodeState(node.questId);
          const quest = CHAPTER_1_QUESTS.find(q => q.id === node.questId);
          const Icon = node.icon;
          const isNext = node.questId === nextQuestId;
          
          return (
            <div
              key={node.questId}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <button
                onClick={() => state !== 'locked' && onSelectQuest(node.questId)}
                disabled={state === 'locked'}
                className="flex flex-col items-center group"
              >
                {/* Node circle - static styling, only pulse on "next" */}
                <div
                  className={`
                    relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-soft
                    transition-transform duration-200
                    ${state === 'completed' 
                      ? 'bg-positive-400 text-white' 
                      : state === 'available'
                        ? `${node.color} text-white`
                        : 'bg-surface-200 text-slate-400'
                    }
                    ${state !== 'locked' ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed'}
                    ${isNext ? 'ring-4 ring-primary-300/50 animate-pulse-soft' : ''}
                  `}
                >
                  {state === 'completed' ? (
                    <Check className="w-7 h-7" />
                  ) : state === 'locked' ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    <Icon className="w-7 h-7" />
                  )}
                </div>

                {/* Label */}
                <div className={`
                  mt-2 px-2 py-1 rounded-lg text-xs font-semibold text-center whitespace-nowrap
                  ${state === 'locked' ? 'text-slate-400' : 'text-slate-700 bg-white/80'}
                `}>
                  {state === 'locked' ? '???' : node.label}
                </div>

                {/* Quest title tooltip on hover */}
                {state !== 'locked' && quest && (
                  <div className="
                    absolute -bottom-8 left-1/2 transform -translate-x-1/2
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    px-3 py-1 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap
                    pointer-events-none z-10
                  ">
                    {quest.title}
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

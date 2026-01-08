import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { TownScene } from './TownScene';
import { gameEventBus } from './eventBus';
import type { PlayerProfile } from '../game/types';
import type { Avatar } from '../onboarding/types';
import type { PhaserToReactEvent } from './types';
import { loadOnboardingProfile } from '../onboarding/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { StatPill } from '../components/ui/StatPill';
import { ProgressBar } from '../components/ui/ProgressBar';
import { getXpForNextLevel } from '../game/progression';
import { BADGES } from '../game/types';

interface PhaserTownViewProps {
  player: PlayerProfile;
  onSelectQuest: (questId: string) => void;
}

export function PhaserTownView({ player, onSelectQuest }: PhaserTownViewProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Get avatar from onboarding profile
  const [avatar, setAvatar] = useState<Avatar | null>(null);

  useEffect(() => {
    const profile = loadOnboardingProfile();
    if (profile?.avatar) {
      setAvatar(profile.avatar);
    }
  }, []);

  // Initialize Phaser game
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 600,
      backgroundColor: '#87CEEB',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: TownScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    gameRef.current = new Phaser.Game(config);

    // Pass initial data to scene
    gameRef.current.events.once('ready', () => {
      const scene = gameRef.current?.scene.getScene('TownScene') as TownScene;
      if (scene) {
        scene.scene.restart({
          completedQuestIds: player.completedQuestIds,
          avatar: avatar,
        });
      }
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  // Update Phaser when player data changes
  useEffect(() => {
    gameEventBus.emitToPhaser({
      type: 'UPDATE_UNLOCKED_QUESTS',
      completedQuestIds: player.completedQuestIds,
    });
  }, [player.completedQuestIds]);

  // Update avatar in Phaser
  useEffect(() => {
    if (avatar) {
      gameEventBus.emitToPhaser({
        type: 'UPDATE_PLAYER_AVATAR',
        avatar,
      });
    }
  }, [avatar]);

  // Listen for Phaser events
  useEffect(() => {
    const unsubscribe = gameEventBus.onPhaserEvent((event: PhaserToReactEvent) => {
      if (event.type === 'BUILDING_CLICKED' && event.questId) {
        onSelectQuest(event.questId);
      }
    });

    return unsubscribe;
  }, [onSelectQuest]);

  const xpInfo = getXpForNextLevel(player.xp);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-slate-200 relative">
      {/* Phaser Game Container */}
      <div 
        ref={containerRef} 
        className="w-full h-screen flex items-center justify-center"
      />

      {/* Stats HUD - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <motion.button
          className="glass rounded-full p-2 shadow-soft flex items-center gap-2 text-slate-700 hover:bg-white/90 transition-colors"
          onClick={() => setIsStatsOpen(!isStatsOpen)}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
            {player.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-sm hidden sm:inline">Lv. {xpInfo.currentLevel}</span>
          {isStatsOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>

        <AnimatePresence>
          {isStatsOpen && (
            <motion.div
              className="glass rounded-2xl shadow-soft p-4 mt-2 w-72 origin-top-right"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{player.name}</div>
                  <div className="text-xs text-slate-500">Level {xpInfo.currentLevel}</div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <StatPill icon="💵" label="Cash" value={`$${player.cash}`} color="green" />
                <StatPill icon="🏦" label="Saved" value={`$${player.savings}`} color="blue" />
                <StatPill icon="😊" label="Happy" value={player.happiness} color="amber" showBar barValue={player.happiness} />
                <StatPill icon="😰" label="Stress" value={player.stress} color="rose" showBar barValue={player.stress} />
              </div>

              <div className="mb-4">
                <ProgressBar
                  value={xpInfo.progressPercent}
                  color="primary"
                  size="sm"
                  showLabel
                  label={`${player.xp} / ${xpInfo.xpNeeded + player.xp} XP`}
                />
              </div>

              {player.badges.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-2">Badges:</h3>
                  <div className="flex flex-wrap gap-2">
                    {player.badges.map(badgeId => {
                      const badge = BADGES[badgeId];
                      return (
                        <div
                          key={badgeId}
                          className="flex items-center gap-1 bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs font-semibold"
                          title={badge.description}
                        >
                          <span>{badge.emoji}</span>
                          <span className="hidden sm:inline">{badge.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress indicator */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="glass rounded-2xl shadow-soft px-4 py-2 text-sm text-slate-600 text-center">
          <span className="font-medium">{player.completedQuestIds.length} / 6</span> quests completed
          <div className="text-xs text-slate-400 mt-1">
            Use WASD or click to move • Press E near buildings to enter
          </div>
        </div>
      </div>
    </div>
  );
}


import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { BriarbrookScene } from './BriarbrookScene';
import { gameEventBus } from './eventBus';
import type { BriarbrookPlayer } from '../game/briarbrook/types';
import type { PhaserToReactEvent } from './types';
import { motion } from 'framer-motion';
import { Coins, PiggyBank, Smile, Brain } from 'lucide-react';
import { getXpProgress } from '../game/briarbrook/storage';

interface BriarbrookTownViewProps {
  player: BriarbrookPlayer;
  onBuildingClick: (buildingId: string) => void;
  isOverlayOpen: boolean;
}

export function BriarbrookTownView({ 
  player, 
  onBuildingClick, 
  isOverlayOpen 
}: BriarbrookTownViewProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Phaser game
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 600,
      backgroundColor: '#2D5016',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: BriarbrookScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  // Pause/resume movement based on overlay state
  useEffect(() => {
    if (isOverlayOpen) {
      gameEventBus.emitToPhaser({ type: 'PAUSE_MOVEMENT' });
    } else {
      gameEventBus.emitToPhaser({ type: 'RESUME_MOVEMENT' });
    }
  }, [isOverlayOpen]);

  // Listen for Phaser events
  useEffect(() => {
    const unsubscribe = gameEventBus.onPhaserEvent((event: PhaserToReactEvent) => {
      if (event.type === 'BUILDING_CLICKED' && event.buildingId) {
        onBuildingClick(event.buildingId);
      }
    });

    return unsubscribe;
  }, [onBuildingClick]);

  const xpInfo = getXpProgress(player.xp);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-slate-900 relative overflow-hidden">
      {/* Phaser Game Container */}
      <div 
        ref={containerRef} 
        className="w-full h-screen flex items-center justify-center"
      />

      {/* Stats HUD - Top Left */}
      <motion.div 
        className="fixed top-4 left-4 z-30"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-700">
          {/* Player name and level */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-white font-bold text-sm">{player.name}</div>
              <div className="text-emerald-400 text-xs">Level {xpInfo.currentLevel}</div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2">
            <StatBox icon={<Coins className="w-4 h-4" />} label="Gold" value={player.gold} color="yellow" />
            <StatBox icon={<PiggyBank className="w-4 h-4" />} label="Savings" value={player.savings} color="sky" />
            <StatBox icon={<Smile className="w-4 h-4" />} label="Happy" value={player.happiness} color="green" isPercent />
            <StatBox icon={<Brain className="w-4 h-4" />} label="Stress" value={player.stress} color="rose" isPercent />
          </div>

          {/* XP Bar */}
          <div className="mt-3 pt-2 border-t border-slate-700">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>XP</span>
              <span>{xpInfo.xpNeeded > 0 ? `${xpInfo.xpNeeded} to next` : 'MAX'}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${xpInfo.progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contracts completed indicator - Top Right */}
      <motion.div
        className="fixed top-4 right-4 z-30"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-slate-900/90 backdrop-blur-md rounded-xl px-4 py-2 shadow-xl border border-slate-700">
          <div className="text-slate-400 text-xs">Contracts Completed</div>
          <div className="text-white font-bold text-lg">
            {player.completedContractIds.length} / 25
          </div>
        </div>
      </motion.div>

      {/* Controls hint - Bottom Center */}
      <motion.div 
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl px-4 py-2 text-sm text-slate-300 text-center border border-slate-700">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs font-mono">W</kbd>
              <kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs font-mono">A</kbd>
              <kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs font-mono">S</kbd>
              <kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs font-mono">D</kbd>
              <span className="text-slate-500 ml-1">Move</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs font-mono">E</kbd>
              <span className="text-slate-500 ml-1">Interact</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Stat display component
function StatBox({ 
  icon, 
  label, 
  value, 
  color,
  isPercent = false 
}: { 
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'yellow' | 'sky' | 'green' | 'rose';
  isPercent?: boolean;
}) {
  const colorClasses = {
    yellow: 'text-yellow-400 bg-yellow-500/20',
    sky: 'text-sky-400 bg-sky-500/20',
    green: 'text-emerald-400 bg-emerald-500/20',
    rose: 'text-rose-400 bg-rose-500/20',
  };

  return (
    <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${colorClasses[color]}`}>
      {icon}
      <div>
        <div className="text-xs text-slate-400">{label}</div>
        <div className={`font-bold text-sm ${colorClasses[color].split(' ')[0]}`}>
          {isPercent ? `${value}%` : value}
        </div>
      </div>
    </div>
  );
}


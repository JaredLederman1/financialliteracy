/**
 * BriarbrookTownView - Fullscreen Game Container
 * 
 * Renders the Phaser game at full screen with HUD overlay
 */

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { BriarbrookScene } from './BriarbrookScene';
import { gameEventBus } from './eventBus';
import { createGameConfig } from './config';
import type { BriarbrookPlayer } from '../game/briarbrook/types';
import type { PhaserToReactEvent } from './types';
import { motion } from 'framer-motion';
import { Coins, PiggyBank, Smile, Brain, Sparkles, ScrollText } from 'lucide-react';
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

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config = createGameConfig(containerRef.current, [BriarbrookScene]);
    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isOverlayOpen) {
      gameEventBus.emitToPhaser({ type: 'PAUSE_MOVEMENT' });
    } else {
      gameEventBus.emitToPhaser({ type: 'RESUME_MOVEMENT' });
    }
  }, [isOverlayOpen]);

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
    <div className="fixed inset-0 bg-black">
      {/* Phaser Canvas - Fullscreen */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Stats HUD - Top Left */}
      <motion.div 
        className="fixed top-4 left-4 z-30"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold shadow-md">
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-slate-800 font-bold">{player.name}</div>
              <div className="flex items-center gap-1 text-teal-600 text-sm font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Level {xpInfo.currentLevel}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <StatBox icon={<Coins className="w-4 h-4" />} label="Gold" value={player.gold} color="amber" />
            <StatBox icon={<PiggyBank className="w-4 h-4" />} label="Savings" value={player.savings} color="sky" />
            <StatBox icon={<Smile className="w-4 h-4" />} label="Happy" value={player.happiness} color="emerald" isPercent />
            <StatBox icon={<Brain className="w-4 h-4" />} label="Stress" value={player.stress} color="rose" isPercent />
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
              <span>Experience</span>
              <span>{xpInfo.xpNeeded > 0 ? `${xpInfo.xpNeeded} to next` : 'MAX'}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpInfo.progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contracts completed - Top Right */}
      <motion.div
        className="fixed top-4 right-4 z-30"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl px-5 py-3 shadow-xl border border-white/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shadow-md">
              <ScrollText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-slate-500 text-xs font-medium">Contracts</div>
              <div className="text-slate-800 font-bold text-lg">
                {player.completedContractIds.length} / 20
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls - Bottom Center */}
      <motion.div 
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
      >
        <div className="bg-white/95 backdrop-blur-md rounded-full px-6 py-3 shadow-xl border border-white/50">
          <div className="flex items-center gap-5 text-sm">
            <span className="flex items-center gap-2">
              <div className="flex gap-1">
                {['W', 'A', 'S', 'D'].map(k => (
                  <kbd key={k} className="px-2.5 py-1.5 bg-slate-100 rounded-lg text-xs font-mono text-slate-600 border border-slate-200 shadow-sm">{k}</kbd>
                ))}
              </div>
              <span className="text-slate-500 font-medium">Move</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-2">
              <kbd className="px-3 py-1.5 bg-teal-50 rounded-lg text-xs font-mono text-teal-700 border border-teal-200 shadow-sm">E</kbd>
              <span className="text-slate-500 font-medium">Interact</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Location hint - Bottom Left */}
      <motion.div 
        className="fixed bottom-4 left-4 z-30"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <div className="bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-white/50">
          <div className="text-slate-500 text-xs font-medium">💡 Tip: Walk right to reach town square</div>
        </div>
      </motion.div>
    </div>
  );
}

function StatBox({ 
  icon, label, value, color, isPercent = false 
}: { 
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'amber' | 'sky' | 'emerald' | 'rose';
  isPercent?: boolean;
}) {
  const colors = {
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    sky: 'text-sky-600 bg-sky-50 border-sky-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    rose: 'text-rose-500 bg-rose-50 border-rose-100',
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${colors[color]}`}>
      {icon}
      <div>
        <div className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">{label}</div>
        <div className="font-bold text-sm">{isPercent ? `${value}%` : value}</div>
      </div>
    </div>
  );
}

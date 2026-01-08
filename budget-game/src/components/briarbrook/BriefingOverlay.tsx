/**
 * BriefingOverlay - Cozy Illustrated Style
 * 
 * Contract briefing screens with friendly, readable typography
 * and soft animations.
 */

import { motion } from 'framer-motion';
import { ChevronRight, MessageCircle } from 'lucide-react';
import type { Contract, BriarbrookPlayer } from '../../game/briarbrook/types';
import { Button } from '../ui/Button';

interface BriefingOverlayProps {
  contract: Contract;
  player: BriarbrookPlayer;
  onAdvance: () => void;
}

export function BriefingOverlay({
  contract,
  player,
  onAdvance,
}: BriefingOverlayProps) {
  const currentBriefing = contract.briefing[player.currentBriefingIndex];
  const isLastScreen = player.currentBriefingIndex >= contract.briefing.length - 1;
  const progress = ((player.currentBriefingIndex + 1) / contract.briefing.length) * 100;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Header with NPC */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 flex items-center gap-3 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-2xl shadow-lg">
              {contract.npcEmoji}
            </div>
            <div className="flex-1">
              <div className="text-slate-800 font-bold">{contract.title}</div>
              <div className="text-slate-500 text-sm flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {contract.npcName}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-slate-100">
            <motion.div 
              className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Briefing content */}
          <motion.div
            key={player.currentBriefingIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {/* Icon */}
            {currentBriefing.icon && (
              <div className="text-center mb-5">
                <motion.div 
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center shadow-sm border border-amber-200/50"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                >
                  <span className="text-4xl">{currentBriefing.icon}</span>
                </motion.div>
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl font-bold text-slate-800 text-center mb-3">
              {currentBriefing.title}
            </h2>

            {/* Text */}
            <p className="text-slate-600 text-center leading-relaxed text-sm">
              {currentBriefing.text}
            </p>
          </motion.div>

          {/* Footer */}
          <div className="p-5 pt-0">
            {/* Screen indicators */}
            <div className="flex justify-center gap-2 mb-4">
              {contract.briefing.map((_, idx) => (
                <motion.div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx <= player.currentBriefingIndex 
                      ? 'bg-teal-500 w-4' 
                      : 'bg-slate-200 w-2'
                  }`}
                  animate={idx === player.currentBriefingIndex ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>

            <Button 
              onClick={onAdvance} 
              fullWidth 
              size="lg"
              icon={<ChevronRight className="w-5 h-5" />}
            >
              {isLastScreen ? 'Start Contract' : 'Continue'}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
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
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
          {/* Header with NPC */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 flex items-center gap-3 border-b border-slate-600">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl">
              {contract.npcEmoji}
            </div>
            <div>
              <div className="text-white font-bold">{contract.title}</div>
              <div className="text-slate-400 text-sm">{contract.npcName}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-slate-700">
            <motion.div 
              className="h-full bg-primary-500"
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
              <div className="text-center mb-4">
                <motion.span 
                  className="text-5xl inline-block"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                >
                  {currentBriefing.icon}
                </motion.span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl font-bold text-white text-center mb-3">
              {currentBriefing.title}
            </h2>

            {/* Text */}
            <p className="text-slate-300 text-center leading-relaxed">
              {currentBriefing.text}
            </p>
          </motion.div>

          {/* Footer */}
          <div className="p-4 pt-0">
            {/* Screen indicators */}
            <div className="flex justify-center gap-2 mb-4">
              {contract.briefing.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx <= player.currentBriefingIndex 
                      ? 'bg-primary-500' 
                      : 'bg-slate-600'
                  }`}
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


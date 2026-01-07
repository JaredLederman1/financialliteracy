import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import type { Quest, PlayerProfile } from '../../game/types';
import { Button } from '../ui/Button';
import { StatPill } from '../ui/StatPill';
import { useState } from 'react';

interface QuestOverlayProps {
  quest: Quest;
  player: PlayerProfile;
  onAdvance: () => void;
  onMakeChoice: (choiceId: string) => void;
  onClose: () => void;
}

export function QuestOverlay({ quest, player, onAdvance, onMakeChoice, onClose }: QuestOverlayProps) {
  const currentStep = quest.steps[player.currentStepIndex];
  const progress = ((player.currentStepIndex + 1) / quest.steps.length) * 100;
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showingOutcome, setShowingOutcome] = useState(false);

  const handleChoiceClick = (choiceId: string) => {
    setSelectedChoice(choiceId);
    setShowingOutcome(true);
    // Small delay to show outcome before advancing
    setTimeout(() => {
      onMakeChoice(choiceId);
      setSelectedChoice(null);
      setShowingOutcome(false);
    }, 1500);
  };

  const getSpeakerDisplay = () => {
    if (!currentStep.speaker || currentStep.speaker === 'narrator') {
      return null;
    }
    const isNpc = currentStep.speaker === quest.npcName;
    return {
      name: currentStep.speaker,
      emoji: isNpc ? quest.npcEmoji : '😊',
      isPlayer: currentStep.speaker === player.name || currentStep.speaker === 'You'
    };
  };

  const speaker = getSpeakerDisplay();
  const selectedChoiceData = currentStep.choices?.find(c => c.id === selectedChoice);

  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'dialogue':
        return (
          <div className="space-y-4">
            {speaker && (
              <motion.div 
                className={`flex items-start gap-3 ${speaker.isPlayer ? 'flex-row-reverse' : ''}`}
                initial={{ x: speaker.isPlayer ? 20 : -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0
                  ${speaker.isPlayer 
                    ? 'bg-gradient-to-br from-primary-400 to-primary-600' 
                    : 'bg-gradient-to-br from-positive-400 to-positive-600'
                  }
                `}>
                  {speaker.emoji}
                </div>
                <div className={`flex-1 ${speaker.isPlayer ? 'text-right' : ''}`}>
                  <div className="text-sm font-semibold text-slate-500 mb-1">
                    {speaker.name}
                  </div>
                  <div className={`
                    inline-block p-4 rounded-2xl text-lg leading-relaxed
                    ${speaker.isPlayer
                      ? 'bg-primary-100 text-primary-900 rounded-tr-sm'
                      : 'bg-white shadow-soft rounded-tl-sm'
                    }
                  `}>
                    {currentStep.text}
                  </div>
                </div>
              </motion.div>
            )}
            
            {!speaker && (
              <motion.div 
                className="bg-white rounded-2xl p-5 shadow-soft text-lg leading-relaxed text-slate-700"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {currentStep.text}
              </motion.div>
            )}
            
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button onClick={onAdvance} fullWidth icon={<ArrowRight className="w-5 h-5" />}>
                Continue
              </Button>
            </motion.div>
          </div>
        );

      case 'info':
        return (
          <div className="space-y-4">
            <motion.div 
              className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-5 border border-primary-200"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
                {currentStep.text}
              </div>
            </motion.div>
            
            <Button onClick={onAdvance} fullWidth icon={<ArrowRight className="w-5 h-5" />}>
              Continue
            </Button>
          </div>
        );

      case 'choice':
        return (
          <div className="space-y-4">
            <motion.div 
              className="bg-white rounded-2xl p-4 shadow-soft text-lg text-slate-700"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {currentStep.text}
            </motion.div>
            
            {/* Show outcome if choice was made */}
            <AnimatePresence>
              {showingOutcome && selectedChoiceData && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-positive-50 border border-positive-200 rounded-2xl p-4"
                >
                  <div className="text-positive-800 font-medium">
                    {selectedChoiceData.outcomeText}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedChoiceData.effects.cashDelta !== 0 && (
                      <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                        selectedChoiceData.effects.cashDelta > 0 
                          ? 'bg-positive-100 text-positive-700' 
                          : 'bg-danger-100 text-danger-700'
                      }`}>
                        💵 {selectedChoiceData.effects.cashDelta > 0 ? '+' : ''}{selectedChoiceData.effects.cashDelta}
                      </span>
                    )}
                    {selectedChoiceData.effects.savingsDelta !== 0 && (
                      <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                        selectedChoiceData.effects.savingsDelta > 0 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'bg-danger-100 text-danger-700'
                      }`}>
                        🏦 {selectedChoiceData.effects.savingsDelta > 0 ? '+' : ''}{selectedChoiceData.effects.savingsDelta}
                      </span>
                    )}
                    {selectedChoiceData.effects.happinessDelta !== 0 && (
                      <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                        selectedChoiceData.effects.happinessDelta > 0 
                          ? 'bg-positive-100 text-positive-700' 
                          : 'bg-danger-100 text-danger-700'
                      }`}>
                        😊 {selectedChoiceData.effects.happinessDelta > 0 ? '+' : ''}{selectedChoiceData.effects.happinessDelta}
                      </span>
                    )}
                    {selectedChoiceData.effects.stressDelta !== 0 && (
                      <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                        selectedChoiceData.effects.stressDelta < 0 
                          ? 'bg-positive-100 text-positive-700' 
                          : 'bg-danger-100 text-danger-700'
                      }`}>
                        😰 {selectedChoiceData.effects.stressDelta > 0 ? '+' : ''}{selectedChoiceData.effects.stressDelta}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Choice buttons - hidden when showing outcome */}
            {!showingOutcome && (
              <div className="space-y-3">
                {currentStep.choices?.map((choice, index) => (
                  <motion.button
                    key={choice.id}
                    onClick={() => handleChoiceClick(choice.id)}
                    className={`
                      w-full p-4 rounded-2xl text-left transition-all
                      ${choice.needOrWant === 'need'
                        ? 'bg-positive-50 hover:bg-positive-100 border-2 border-positive-200'
                        : choice.needOrWant === 'want'
                        ? 'bg-purple-50 hover:bg-purple-100 border-2 border-purple-200'
                        : 'bg-white hover:bg-surface-50 border-2 border-surface-200'
                      }
                    `}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold text-slate-800">
                        {choice.label}
                      </span>
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full font-bold uppercase flex-shrink-0
                        ${choice.needOrWant === 'need'
                          ? 'bg-positive-200 text-positive-800'
                          : choice.needOrWant === 'want'
                          ? 'bg-purple-200 text-purple-800'
                          : 'bg-surface-200 text-slate-600'
                        }
                      `}>
                        {choice.needOrWant}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        );

      case 'result':
        return (
          <div className="space-y-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-6xl"
            >
              🎉
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-primary-50 to-positive-50 rounded-2xl p-5 border border-primary-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-lg text-slate-700 leading-relaxed">
                {currentStep.text}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button onClick={onAdvance} variant="positive" fullWidth size="lg">
                Complete Quest ✓
              </Button>
            </motion.div>
          </div>
        );

      default:
        return (
          <div>
            <p className="text-slate-700">{currentStep.text}</p>
            <Button onClick={onAdvance} fullWidth className="mt-4">
              Continue
            </Button>
          </div>
        );
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Panel */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="bg-gradient-to-b from-surface-50 to-white rounded-t-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-surface-200 px-4 py-3 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{quest.npcEmoji}</span>
                <div>
                  <h2 className="font-bold text-slate-800">{quest.title}</h2>
                  <p className="text-xs text-slate-500">📍 {quest.location}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-surface-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 h-1.5 bg-surface-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="text-xs text-slate-500 mt-1 text-right">
              Step {player.currentStepIndex + 1} / {quest.steps.length}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 pb-8 max-h-[60vh] overflow-y-auto">
            {renderStepContent()}
          </div>

          {/* Stats bar */}
          <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-surface-200 px-4 py-2">
            <div className="flex justify-around text-center gap-2">
              <StatPill icon="💵" label="Cash" value={`$${player.cash}`} color="green" />
              <StatPill icon="🏦" label="Saved" value={`$${player.savings}`} color="blue" />
              <StatPill icon="😊" label="Happy" value={player.happiness} color="amber" />
              <StatPill icon="😰" label="Stress" value={player.stress} color="rose" />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}


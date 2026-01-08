import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Quest, PlayerProfile, QuestChoice } from '../../game/types';
import { Button } from '../ui/Button';
import { StatPill } from '../ui/StatPill';

interface CharacterDialogueProps {
  quest: Quest;
  player: PlayerProfile;
  onAdvance: () => void;
  onMakeChoice: (choiceId: string) => void;
}

export function CharacterDialogue({ quest, player, onAdvance, onMakeChoice }: CharacterDialogueProps) {
  const currentStep = quest.steps[player.currentStepIndex];
  const [selectedChoice, setSelectedChoice] = useState<QuestChoice | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);

  const handleChoiceClick = (choice: QuestChoice) => {
    setSelectedChoice(choice);
    setShowOutcome(true);
    
    setTimeout(() => {
      onMakeChoice(choice.id);
      setSelectedChoice(null);
      setShowOutcome(false);
    }, 2000);
  };

  const isPlayerSpeaking = currentStep.speaker === player.name || currentStep.speaker === 'You';
  const isNarrator = !currentStep.speaker || currentStep.speaker === 'narrator';

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-b from-slate-900/40 to-slate-900/60 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Main container */}
      <motion.div
        className="fixed inset-0 z-50 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Stats bar at top */}
        <div className="bg-white/90 backdrop-blur-md border-b border-surface-200 px-4 py-2">
          <div className="max-w-lg mx-auto flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">📍</span>
              <span className="font-medium text-slate-700">{quest.location}</span>
            </div>
            <div className="flex gap-2">
              <StatPill icon="💵" label="Cash" value={`$${player.cash}`} color="green" />
              <StatPill icon="🏦" label="Saved" value={`$${player.savings}`} color="blue" />
            </div>
          </div>
        </div>

        {/* Character and dialogue area */}
        <div className="flex-1 flex items-end justify-center pb-4 px-4">
          <div className="w-full max-w-lg">
            
            {/* NPC Character - Left side */}
            {!isPlayerSpeaking && !isNarrator && (
              <motion.div
                className="flex items-end gap-4 mb-4"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 20 }}
              >
                {/* Character avatar */}
                <div className="flex-shrink-0">
                  <motion.div
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-4 border-white shadow-lg flex items-center justify-center"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <span className="text-5xl sm:text-6xl">{quest.npcEmoji}</span>
                  </motion.div>
                  <div className="text-center mt-2">
                    <span className="text-sm font-bold text-white bg-slate-800/70 px-3 py-1 rounded-full">
                      {quest.npcName}
                    </span>
                  </div>
                </div>

                {/* Speech bubble */}
                <motion.div
                  className="flex-1 relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Bubble tail */}
                  <div className="absolute left-0 bottom-6 w-4 h-4 bg-white transform -translate-x-2 rotate-45" />
                  
                  {/* Bubble content */}
                  <div className="bg-white rounded-2xl rounded-bl-sm p-5 shadow-lg">
                    <p className="text-lg text-slate-800 leading-relaxed">
                      {currentStep.text}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Player speaking - Right side */}
            {isPlayerSpeaking && (
              <motion.div
                className="flex items-end gap-4 mb-4 flex-row-reverse"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 20 }}
              >
                {/* Player avatar */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-3xl">😊</span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm font-bold text-white bg-primary-600 px-3 py-1 rounded-full">
                      You
                    </span>
                  </div>
                </div>

                {/* Speech bubble */}
                <motion.div
                  className="flex-1 relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Bubble tail */}
                  <div className="absolute right-0 bottom-6 w-4 h-4 bg-primary-100 transform translate-x-2 rotate-45" />
                  
                  <div className="bg-primary-100 rounded-2xl rounded-br-sm p-5 shadow-lg">
                    <p className="text-lg text-primary-900 leading-relaxed">
                      {currentStep.text}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Narrator / Info box */}
            {isNarrator && currentStep.type !== 'choice' && currentStep.type !== 'result' && (
              <motion.div
                className="mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className={`
                  rounded-2xl p-5 shadow-lg text-lg leading-relaxed
                  ${currentStep.type === 'info' 
                    ? 'bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 text-slate-700'
                    : 'bg-white text-slate-800'
                  }
                `}>
                  {currentStep.text}
                </div>
              </motion.div>
            )}

            {/* Result celebration */}
            {currentStep.type === 'result' && (
              <motion.div
                className="mb-4 text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  🎉
                </motion.div>
                <div className="bg-gradient-to-br from-positive-50 to-primary-50 rounded-2xl p-5 shadow-lg border border-positive-200">
                  <p className="text-lg text-slate-700 leading-relaxed">
                    {currentStep.text}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Action area */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-4">
              {/* Choices */}
              {currentStep.type === 'choice' && currentStep.choices && !showOutcome && (
                <div className="space-y-2">
                  <p className="text-sm text-slate-500 mb-3 text-center">{currentStep.text}</p>
                  {currentStep.choices.map((choice) => (
                    <motion.button
                      key={choice.id}
                      onClick={() => handleChoiceClick(choice)}
                      className={`
                        w-full px-4 py-3 rounded-xl text-left font-medium transition-colors
                        ${choice.needOrWant === 'need'
                          ? 'bg-positive-50 hover:bg-positive-100 text-positive-800 border border-positive-200'
                          : choice.needOrWant === 'want'
                            ? 'bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }
                      `}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{choice.label}</span>
                        <span className={`
                          text-xs px-2 py-0.5 rounded-full font-bold uppercase
                          ${choice.needOrWant === 'need'
                            ? 'bg-positive-200 text-positive-700'
                            : choice.needOrWant === 'want'
                              ? 'bg-purple-200 text-purple-700'
                              : 'bg-slate-200 text-slate-600'
                          }
                        `}>
                          {choice.needOrWant}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Outcome display */}
              <AnimatePresence>
                {showOutcome && selectedChoice && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <div className="bg-positive-50 border border-positive-200 rounded-xl p-4">
                      <p className="text-positive-800 font-medium">{selectedChoice.outcomeText}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedChoice.effects.cashDelta !== 0 && (
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          selectedChoice.effects.cashDelta > 0 
                            ? 'bg-positive-100 text-positive-700' 
                            : 'bg-danger-100 text-danger-700'
                        }`}>
                          💵 {selectedChoice.effects.cashDelta > 0 ? '+' : ''}{selectedChoice.effects.cashDelta}
                        </span>
                      )}
                      {selectedChoice.effects.savingsDelta !== 0 && (
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          selectedChoice.effects.savingsDelta > 0 
                            ? 'bg-primary-100 text-primary-700' 
                            : 'bg-danger-100 text-danger-700'
                        }`}>
                          🏦 {selectedChoice.effects.savingsDelta > 0 ? '+' : ''}{selectedChoice.effects.savingsDelta}
                        </span>
                      )}
                      {selectedChoice.effects.happinessDelta !== 0 && (
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          selectedChoice.effects.happinessDelta > 0 
                            ? 'bg-positive-100 text-positive-700' 
                            : 'bg-danger-100 text-danger-700'
                        }`}>
                          😊 {selectedChoice.effects.happinessDelta > 0 ? '+' : ''}{selectedChoice.effects.happinessDelta}
                        </span>
                      )}
                      {selectedChoice.effects.stressDelta !== 0 && (
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          selectedChoice.effects.stressDelta < 0 
                            ? 'bg-positive-100 text-positive-700' 
                            : 'bg-danger-100 text-danger-700'
                        }`}>
                          😰 {selectedChoice.effects.stressDelta > 0 ? '+' : ''}{selectedChoice.effects.stressDelta}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Continue button */}
              {currentStep.type !== 'choice' && (
                <Button 
                  onClick={onAdvance} 
                  fullWidth 
                  variant={currentStep.type === 'result' ? 'positive' : 'primary'}
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  {currentStep.type === 'result' ? 'Complete Quest ✓' : 'Continue'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}


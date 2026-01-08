import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import type { Contract, BriarbrookPlayer } from '../../game/briarbrook/types';
import { Button } from '../ui/Button';

interface ReflectionOverlayProps {
  contract: Contract;
  player: BriarbrookPlayer;
  onSubmit: (choiceId: string) => void;
}

export function ReflectionOverlay({
  contract,
  player: _player,
  onSubmit,
}: ReflectionOverlayProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const reflection = contract.reflection;

  const handleSubmit = () => {
    if (!selectedId) return;
    
    const choice = reflection.choices.find(c => c.id === selectedId);
    setIsCorrect(choice?.isCorrect === true);
    setSubmitted(true);
  };

  const handleContinue = () => {
    if (selectedId) {
      onSubmit(selectedId);
    }
  };

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
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-bold">Reflection Time!</div>
              <div className="text-purple-200 text-sm">Test your understanding</div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {/* Question */}
                  <h3 className="text-xl font-bold text-white mb-4">
                    {reflection.question}
                  </h3>

                  {/* Choices */}
                  <div className="space-y-3 mb-6">
                    {reflection.choices.map((choice) => (
                      <motion.button
                        key={choice.id}
                        onClick={() => setSelectedId(choice.id)}
                        className={`
                          w-full p-4 rounded-xl text-left transition-all border-2
                          ${selectedId === choice.id
                            ? 'bg-purple-900/50 border-purple-500 text-white'
                            : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700'
                          }
                        `}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                            ${selectedId === choice.id
                              ? 'border-purple-400 bg-purple-500'
                              : 'border-slate-500'
                            }
                          `}>
                            {selectedId === choice.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-white rounded-full"
                              />
                            )}
                          </div>
                          <span className="font-medium">{choice.label}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Submit button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedId}
                    fullWidth
                    size="lg"
                  >
                    Check Answer
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {/* Result icon */}
                  <div className="text-center mb-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', delay: 0.1 }}
                      className={`
                        w-20 h-20 rounded-full mx-auto flex items-center justify-center
                        ${isCorrect ? 'bg-emerald-500/20' : 'bg-amber-500/20'}
                      `}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                      ) : (
                        <XCircle className="w-12 h-12 text-amber-400" />
                      )}
                    </motion.div>
                  </div>

                  {/* Result text */}
                  <h3 className={`text-xl font-bold text-center mb-2 ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isCorrect ? 'Correct!' : 'Not quite!'}
                  </h3>

                  {/* Selected answer feedback */}
                  <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
                    <p className="text-slate-300 text-sm">
                      {reflection.choices.find(c => c.id === selectedId)?.outcomeText}
                    </p>
                  </div>

                  {/* Explanation */}
                  <div className="bg-purple-900/30 border border-purple-700 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <p className="text-purple-200 text-sm">
                        {reflection.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Bonus if correct */}
                  {isCorrect && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-900/30 border border-emerald-700 rounded-xl p-3 mb-4 text-center"
                    >
                      <span className="text-emerald-400 font-bold">+5 Mastery Bonus!</span>
                    </motion.div>
                  )}

                  {/* Continue button */}
                  <Button
                    onClick={handleContinue}
                    fullWidth
                    size="lg"
                    icon={<ArrowRight className="w-5 h-5" />}
                  >
                    See Results
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
}


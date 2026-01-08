/**
 * ReflectionOverlay - Cozy Illustrated Style
 * 
 * Multiple choice reflection question with friendly feedback
 * and encouraging animations.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, Sparkles, Lightbulb } from 'lucide-react';
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
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 to-violet-600 p-5 flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg">Reflection Time!</div>
              <div className="text-violet-100 text-sm font-medium">Test your understanding</div>
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
                  <h3 className="text-xl font-bold text-slate-800 mb-5 leading-snug">
                    {reflection.question}
                  </h3>

                  {/* Choices */}
                  <div className="space-y-3 mb-6">
                    {reflection.choices.map((choice, index) => (
                      <motion.button
                        key={choice.id}
                        onClick={() => setSelectedId(choice.id)}
                        className={`
                          w-full p-4 rounded-2xl text-left transition-all border-2
                          ${selectedId === choice.id
                            ? 'bg-violet-50 border-violet-400 text-violet-800'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
                          }
                        `}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                            ${selectedId === choice.id
                              ? 'border-violet-500 bg-violet-500'
                              : 'border-slate-300 bg-white'
                            }
                          `}>
                            {selectedId === choice.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2.5 h-2.5 bg-white rounded-full"
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
                  <div className="text-center mb-5">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', delay: 0.1 }}
                      className={`
                        w-20 h-20 rounded-2xl mx-auto flex items-center justify-center shadow-lg
                        ${isCorrect 
                          ? 'bg-gradient-to-br from-emerald-400 to-emerald-500' 
                          : 'bg-gradient-to-br from-amber-400 to-amber-500'
                        }
                      `}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      ) : (
                        <XCircle className="w-10 h-10 text-white" />
                      )}
                    </motion.div>
                  </div>

                  {/* Result text */}
                  <h3 className={`text-2xl font-bold text-center mb-4 ${isCorrect ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {isCorrect ? 'Correct!' : 'Not quite!'}
                  </h3>

                  {/* Selected answer feedback */}
                  <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {reflection.choices.find(c => c.id === selectedId)?.outcomeText}
                    </p>
                  </div>

                  {/* Explanation */}
                  <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-4 h-4 text-violet-600" />
                      </div>
                      <p className="text-violet-700 text-sm leading-relaxed">
                        {reflection.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Bonus if correct */}
                  {isCorrect && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-3 mb-4 text-center"
                    >
                      <span className="flex items-center justify-center gap-2 text-emerald-600 font-bold">
                        <Sparkles className="w-4 h-4" />
                        +5 Mastery Bonus!
                      </span>
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

/**
 * ContractRunnerOverlay - Cozy Illustrated Style
 * 
 * Interactive contract dialogue with chat-like interface,
 * soft colors, and friendly animations.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Coins, PiggyBank, Heart, Brain } from 'lucide-react';
import type { Contract, BriarbrookPlayer, ContractChoice } from '../../game/briarbrook/types';
import { Button } from '../ui/Button';

interface ContractRunnerOverlayProps {
  contract: Contract;
  player: BriarbrookPlayer;
  onAdvance: () => void;
  onMakeChoice: (choiceId: string) => void;
}

interface DialogueMessage {
  id: string;
  type: 'npc' | 'narrator' | 'player' | 'effect';
  text: string;
  speaker?: string;
}

export function ContractRunnerOverlay({
  contract,
  player,
  onAdvance,
  onMakeChoice,
}: ContractRunnerOverlayProps) {
  const currentStep = contract.steps[player.currentStepIndex];
  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<ContractChoice | null>(null);
  const [showingOutcome, setShowingOutcome] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Progress
  const progress = ((player.currentStepIndex + 1) / contract.steps.length) * 100;

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Add message when step changes
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      
      const messageType = currentStep.speaker === contract.npcName || currentStep.speaker?.includes('the') 
        ? 'npc' 
        : currentStep.speaker === 'narrator' 
          ? 'narrator' 
          : 'npc';

      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          type: messageType,
          text: currentStep.text,
          speaker: currentStep.speaker,
        },
      ]);
    }, 600);

    return () => clearTimeout(timer);
  }, [currentStep, contract.npcName]);

  const handleChoiceClick = (choice: ContractChoice) => {
    // Add player message
    setMessages(prev => [
      ...prev,
      { id: `player-${Date.now()}`, type: 'player', text: choice.label },
    ]);

    setSelectedChoice(choice);
    setShowingOutcome(true);

    // Show outcome
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: `outcome-${Date.now()}`, type: 'effect', text: choice.outcomeText },
      ]);
    }, 400);

    // Advance after showing outcome
    setTimeout(() => {
      onMakeChoice(choice.id);
      setSelectedChoice(null);
      setShowingOutcome(false);
    }, 1500);
  };

  const handleContinue = () => {
    onAdvance();
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="fixed inset-x-4 bottom-4 top-16 md:inset-auto md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg md:h-[80vh] z-50"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-3 flex items-center gap-3 border-b border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-xl shadow-md">
              {contract.npcEmoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-slate-800 font-bold text-sm truncate">{contract.title}</div>
              <div className="text-slate-500 text-xs">{contract.npcName}</div>
            </div>
            {/* Stats mini-display */}
            <div className="flex gap-2 text-xs font-medium">
              <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-full">{player.gold}g</span>
              <span className="text-sky-600 bg-sky-50 px-2 py-1 rounded-full">{player.savings}s</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-slate-100">
            <motion.div 
              className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.type === 'player' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[85%] px-4 py-3 text-sm leading-relaxed shadow-sm
                      ${msg.type === 'player' 
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl rounded-br-md' 
                        : msg.type === 'npc'
                          ? 'bg-white text-slate-700 rounded-2xl rounded-bl-md border border-slate-100'
                          : msg.type === 'effect'
                            ? 'bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200 italic'
                            : 'bg-slate-100 text-slate-600 rounded-2xl italic'
                      }
                    `}
                  >
                    {msg.speaker && msg.type === 'npc' && (
                      <div className="text-teal-600 text-xs font-bold mb-1">{msg.speaker}</div>
                    )}
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-slate-100">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-slate-300 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Effect display */}
              {showingOutcome && selectedChoice && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-center"
                >
                  <EffectBadges effects={selectedChoice.effects} />
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-slate-100 bg-white">
            {currentStep.type === 'choice' && currentStep.choices && !showingOutcome ? (
              <div className="space-y-2">
                {currentStep.choices.map((choice, index) => (
                  <motion.button
                    key={choice.id}
                    onClick={() => handleChoiceClick(choice)}
                    className="w-full px-4 py-3 rounded-xl text-left text-sm font-medium bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 hover:border-teal-300 transition-all shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{choice.label}</span>
                      <EffectPreview effects={choice.effects} />
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : !showingOutcome && !isTyping ? (
              <Button 
                onClick={handleContinue} 
                fullWidth
                icon={<ChevronRight className="w-5 h-5" />}
              >
                {currentStep.type === 'result' ? 'Complete' : 'Continue'}
              </Button>
            ) : (
              <div className="text-center text-slate-400 text-sm py-2">
                {isTyping ? 'Listening...' : 'Processing...'}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

// Effect preview (small pills)
function EffectPreview({ effects }: { effects: ContractChoice['effects'] }) {
  const items = [];
  
  if (effects.goldDelta && effects.goldDelta !== 0) {
    items.push(
      <span key="gold" className={`${effects.goldDelta > 0 ? 'text-amber-600' : 'text-rose-500'}`}>
        {effects.goldDelta > 0 ? '+' : ''}{effects.goldDelta}g
      </span>
    );
  }
  if (effects.savingsDelta && effects.savingsDelta !== 0) {
    items.push(
      <span key="savings" className={`${effects.savingsDelta > 0 ? 'text-sky-600' : 'text-rose-500'}`}>
        {effects.savingsDelta > 0 ? '+' : ''}{effects.savingsDelta}s
      </span>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="flex gap-2 text-xs font-bold">
      {items}
    </div>
  );
}

// Effect badges (shown after choice)
function EffectBadges({ effects }: { effects: ContractChoice['effects'] }) {
  const badges = [];

  if (effects.goldDelta && effects.goldDelta !== 0) {
    badges.push(
      <span key="gold" className={`flex items-center gap-1 ${effects.goldDelta > 0 ? 'text-amber-600' : 'text-rose-500'}`}>
        <Coins className="w-3.5 h-3.5" />
        {effects.goldDelta > 0 ? '+' : ''}{effects.goldDelta}
      </span>
    );
  }
  if (effects.savingsDelta && effects.savingsDelta !== 0) {
    badges.push(
      <span key="savings" className={`flex items-center gap-1 ${effects.savingsDelta > 0 ? 'text-sky-600' : 'text-rose-500'}`}>
        <PiggyBank className="w-3.5 h-3.5" />
        {effects.savingsDelta > 0 ? '+' : ''}{effects.savingsDelta}
      </span>
    );
  }
  if (effects.happinessDelta && effects.happinessDelta !== 0) {
    badges.push(
      <span key="happy" className={`flex items-center gap-1 ${effects.happinessDelta > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
        <Heart className="w-3.5 h-3.5" />
        {effects.happinessDelta > 0 ? '+' : ''}{effects.happinessDelta}
      </span>
    );
  }
  if (effects.stressDelta && effects.stressDelta !== 0) {
    badges.push(
      <span key="stress" className={`flex items-center gap-1 ${effects.stressDelta < 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
        <Brain className="w-3.5 h-3.5" />
        {effects.stressDelta > 0 ? '+' : ''}{effects.stressDelta}
      </span>
    );
  }

  if (badges.length === 0) return null;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2.5 flex gap-4 text-xs font-bold shadow-lg border border-slate-100">
      {badges}
    </div>
  );
}

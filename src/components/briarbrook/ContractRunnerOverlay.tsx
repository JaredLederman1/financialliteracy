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
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-40"
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
        <div className="h-full bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-3 flex items-center gap-3 border-b border-slate-600">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xl">
              {contract.npcEmoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm truncate">{contract.title}</div>
              <div className="text-slate-400 text-xs">{contract.npcName}</div>
            </div>
            {/* Stats mini-display */}
            <div className="flex gap-2 text-xs">
              <span className="text-yellow-400">{player.gold}g</span>
              <span className="text-sky-400">{player.savings}s</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-slate-700">
            <motion.div 
              className="h-full bg-primary-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                      max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                      ${msg.type === 'player' 
                        ? 'bg-primary-500 text-white rounded-br-md' 
                        : msg.type === 'npc'
                          ? 'bg-slate-700 text-white rounded-bl-md'
                          : msg.type === 'effect'
                            ? 'bg-emerald-900/50 text-emerald-300 rounded-lg border border-emerald-700 italic'
                            : 'bg-slate-600/50 text-slate-300 rounded-lg italic'
                      }
                    `}
                  >
                    {msg.speaker && msg.type === 'npc' && (
                      <div className="text-primary-400 text-xs font-bold mb-1">{msg.speaker}</div>
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
                  <div className="bg-slate-700 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-slate-400 rounded-full"
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
          <div className="p-3 border-t border-slate-700 bg-slate-800/80">
            {currentStep.type === 'choice' && currentStep.choices && !showingOutcome ? (
              <div className="space-y-2">
                {currentStep.choices.map((choice) => (
                  <motion.button
                    key={choice.id}
                    onClick={() => handleChoiceClick(choice)}
                    className="w-full px-4 py-2.5 rounded-xl text-left text-sm font-medium bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 transition-colors"
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
              <div className="text-center text-slate-500 text-sm py-2">
                {isTyping ? 'Listening...' : 'Processing...'}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

// Effect preview (small icons)
function EffectPreview({ effects }: { effects: ContractChoice['effects'] }) {
  const items = [];
  
  if (effects.goldDelta && effects.goldDelta !== 0) {
    items.push(
      <span key="gold" className={effects.goldDelta > 0 ? 'text-yellow-400' : 'text-red-400'}>
        {effects.goldDelta > 0 ? '+' : ''}{effects.goldDelta}g
      </span>
    );
  }
  if (effects.savingsDelta && effects.savingsDelta !== 0) {
    items.push(
      <span key="savings" className={effects.savingsDelta > 0 ? 'text-sky-400' : 'text-red-400'}>
        {effects.savingsDelta > 0 ? '+' : ''}{effects.savingsDelta}s
      </span>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="flex gap-2 text-xs opacity-70">
      {items}
    </div>
  );
}

// Effect badges (shown after choice)
function EffectBadges({ effects }: { effects: ContractChoice['effects'] }) {
  const badges = [];

  if (effects.goldDelta && effects.goldDelta !== 0) {
    badges.push(
      <span key="gold" className={`flex items-center gap-1 ${effects.goldDelta > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
        <Coins className="w-3 h-3" />
        {effects.goldDelta > 0 ? '+' : ''}{effects.goldDelta}
      </span>
    );
  }
  if (effects.savingsDelta && effects.savingsDelta !== 0) {
    badges.push(
      <span key="savings" className={`flex items-center gap-1 ${effects.savingsDelta > 0 ? 'text-sky-400' : 'text-red-400'}`}>
        <PiggyBank className="w-3 h-3" />
        {effects.savingsDelta > 0 ? '+' : ''}{effects.savingsDelta}
      </span>
    );
  }
  if (effects.happinessDelta && effects.happinessDelta !== 0) {
    badges.push(
      <span key="happy" className={`flex items-center gap-1 ${effects.happinessDelta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        <Heart className="w-3 h-3" />
        {effects.happinessDelta > 0 ? '+' : ''}{effects.happinessDelta}
      </span>
    );
  }
  if (effects.stressDelta && effects.stressDelta !== 0) {
    badges.push(
      <span key="stress" className={`flex items-center gap-1 ${effects.stressDelta < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
        <Brain className="w-3 h-3" />
        {effects.stressDelta > 0 ? '+' : ''}{effects.stressDelta}
      </span>
    );
  }

  if (badges.length === 0) return null;

  return (
    <div className="bg-slate-700/80 rounded-full px-4 py-2 flex gap-3 text-xs font-bold">
      {badges}
    </div>
  );
}


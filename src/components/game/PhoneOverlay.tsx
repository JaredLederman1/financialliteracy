import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Wifi, Signal } from 'lucide-react';
import type { Quest, PlayerProfile, QuestChoice } from '../../game/types';
import { Button } from '../ui/Button';

interface PhoneOverlayProps {
  quest: Quest;
  player: PlayerProfile;
  onAdvance: () => void;
  onMakeChoice: (choiceId: string) => void;
}

interface Message {
  id: string;
  sender: 'them' | 'you' | 'system';
  text: string;
  timestamp: string;
}

export function PhoneOverlay({ quest, player, onAdvance, onMakeChoice }: PhoneOverlayProps) {
  const currentStep = quest.steps[player.currentStepIndex];
  const [messages, setMessages] = useState<Message[]>([]);
  const [showingChoice, setShowingChoice] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<QuestChoice | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Get current time for phone display
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping, showingChoice, showOutcome]);

  // Build messages based on step type
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      
      if (currentStep.type === 'dialogue' || currentStep.type === 'info') {
        const isFromMom = currentStep.speaker === 'Mom' || currentStep.speaker === quest.npcName;
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}`,
          sender: isFromMom ? 'them' : 'system',
          text: currentStep.text,
          timestamp: currentTime,
        }]);
        setShowingChoice(false);
      } else if (currentStep.type === 'choice') {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}`,
          sender: 'system',
          text: currentStep.text,
          timestamp: currentTime,
        }]);
        setShowingChoice(true);
      } else if (currentStep.type === 'result') {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}`,
          sender: 'system',
          text: currentStep.text,
          timestamp: currentTime,
        }]);
        setShowingChoice(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [currentStep, currentTime, quest.npcName]);

  const handleChoiceClick = (choice: QuestChoice) => {
    // Add player's choice as a message
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      sender: 'you',
      text: choice.label,
      timestamp: currentTime,
    }]);
    
    setSelectedChoice(choice);
    setShowingChoice(false);
    setShowOutcome(true);

    // Show outcome then advance
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-outcome`,
        sender: 'system',
        text: `${choice.outcomeText}`,
        timestamp: currentTime,
      }]);
    }, 500);

    setTimeout(() => {
      onMakeChoice(choice.id);
      setSelectedChoice(null);
      setShowOutcome(false);
    }, 2000);
  };

  const handleContinue = () => {
    onAdvance();
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      
      {/* Phone container */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
      >
        {/* Cartoon phone */}
        <div className="w-full max-w-sm">
          {/* Phone frame */}
          <div className="bg-slate-800 rounded-[2.5rem] p-3 shadow-2xl">
            {/* Screen bezel */}
            <div className="bg-slate-900 rounded-[2rem] overflow-hidden">
              {/* Status bar */}
              <div className="bg-slate-900 px-6 py-2 flex items-center justify-between text-white text-xs">
                <span className="font-medium">{currentTime}</span>
                <div className="flex items-center gap-1">
                  <Signal className="w-3.5 h-3.5" />
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>

              {/* Messages header */}
              <div className="bg-primary-500 px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                  {quest.npcEmoji}
                </div>
                <div className="text-white">
                  <div className="font-bold">{quest.npcName}</div>
                  <div className="text-xs text-white/70">
                    {isTyping ? 'typing...' : 'online'}
                  </div>
                </div>
              </div>

              {/* Messages area */}
              <div 
                ref={messagesContainerRef}
                className="bg-gradient-to-b from-slate-100 to-slate-50 px-3 py-4 space-y-3 overflow-y-auto scroll-smooth"
                style={{ height: '45vh', maxHeight: '350px' }}
              >
                <AnimatePresence mode="popLayout">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`
                          max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                          ${msg.sender === 'you' 
                            ? 'bg-primary-500 text-white rounded-br-md' 
                            : msg.sender === 'them'
                              ? 'bg-white text-slate-800 shadow-sm rounded-bl-md'
                              : 'bg-slate-200 text-slate-600 rounded-lg italic'
                          }
                        `}
                      >
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
                      <div className="bg-white shadow-sm rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1">
                          <motion.div
                            className="w-2 h-2 bg-slate-400 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-slate-400 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-slate-400 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Show outcome effects */}
                  {showOutcome && selectedChoice && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-center"
                    >
                      <div className="bg-positive-100 border border-positive-200 rounded-xl px-4 py-2 flex flex-wrap gap-2 justify-center">
                        {selectedChoice.effects.cashDelta !== 0 && (
                          <span className={`text-sm font-bold ${
                            selectedChoice.effects.cashDelta > 0 ? 'text-positive-600' : 'text-danger-600'
                          }`}>
                            💵 {selectedChoice.effects.cashDelta > 0 ? '+' : ''}{selectedChoice.effects.cashDelta}
                          </span>
                        )}
                        {selectedChoice.effects.savingsDelta !== 0 && (
                          <span className={`text-sm font-bold ${
                            selectedChoice.effects.savingsDelta > 0 ? 'text-primary-600' : 'text-danger-600'
                          }`}>
                            🏦 {selectedChoice.effects.savingsDelta > 0 ? '+' : ''}{selectedChoice.effects.savingsDelta}
                          </span>
                        )}
                        {selectedChoice.effects.happinessDelta !== 0 && (
                          <span className={`text-sm font-bold ${
                            selectedChoice.effects.happinessDelta > 0 ? 'text-positive-600' : 'text-danger-600'
                          }`}>
                            😊 {selectedChoice.effects.happinessDelta > 0 ? '+' : ''}{selectedChoice.effects.happinessDelta}
                          </span>
                        )}
                        {selectedChoice.effects.stressDelta !== 0 && (
                          <span className={`text-sm font-bold ${
                            selectedChoice.effects.stressDelta < 0 ? 'text-positive-600' : 'text-danger-600'
                          }`}>
                            😰 {selectedChoice.effects.stressDelta > 0 ? '+' : ''}{selectedChoice.effects.stressDelta}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area / Actions */}
              <div className="bg-white border-t border-slate-200 px-3 py-3">
                {showingChoice && currentStep.choices ? (
                  <div className="space-y-2">
                    {currentStep.choices.map((choice) => (
                      <motion.button
                        key={choice.id}
                        onClick={() => handleChoiceClick(choice)}
                        className={`
                          w-full px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-colors
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
                            text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold
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
                ) : !showOutcome && !isTyping ? (
                  <Button onClick={handleContinue} fullWidth>
                    {currentStep.type === 'result' ? 'Complete Quest ✓' : 'Continue'}
                  </Button>
                ) : (
                  <div className="text-center text-slate-400 text-sm py-2">
                    {isTyping ? 'Waiting for response...' : 'Processing...'}
                  </div>
                )}
              </div>

              {/* Home indicator */}
              <div className="bg-slate-900 py-2 flex justify-center">
                <div className="w-32 h-1 bg-slate-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}


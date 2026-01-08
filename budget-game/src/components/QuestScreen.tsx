import type { Quest, PlayerProfile } from '../game/types';

interface QuestScreenProps {
  quest: Quest;
  player: PlayerProfile;
  onAdvance: () => void;
  onMakeChoice: (choiceId: string) => void;
}

export function QuestScreen({ quest, player, onAdvance, onMakeChoice }: QuestScreenProps) {
  const currentStep = quest.steps[player.currentStepIndex];
  const progress = ((player.currentStepIndex + 1) / quest.steps.length) * 100;

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

  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'dialogue':
        return (
          <div className="space-y-4">
            {speaker && (
              <div className={`flex items-start gap-3 ${speaker.isPlayer ? 'flex-row-reverse' : ''}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  speaker.isPlayer 
                    ? 'bg-gradient-to-br from-blue-300 to-blue-500' 
                    : 'bg-gradient-to-br from-amber-300 to-orange-400'
                }`}>
                  {speaker.emoji}
                </div>
                <div className={`flex-1 ${speaker.isPlayer ? 'text-right' : ''}`}>
                  <div className="font-display font-semibold text-amber-800 text-sm">
                    {speaker.name}
                  </div>
                  <div className={`mt-1 p-4 rounded-2xl font-body text-lg leading-relaxed ${
                    speaker.isPlayer
                      ? 'bg-blue-100 rounded-tr-none'
                      : 'bg-white rounded-tl-none shadow-md'
                  }`}>
                    {currentStep.text}
                  </div>
                </div>
              </div>
            )}
            
            {!speaker && (
              <div className="bg-white rounded-xl p-4 shadow-md font-body text-lg leading-relaxed">
                {currentStep.text}
              </div>
            )}
            
            <button onClick={onAdvance} className="btn-primary w-full mt-4">
              Continue →
            </button>
          </div>
        );

      case 'info':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-5 border-2 border-blue-200">
              <div className="font-body text-lg text-gray-800 leading-relaxed whitespace-pre-line">
                {currentStep.text}
              </div>
            </div>
            
            {currentStep.effects && (
              <div className="flex flex-wrap justify-center gap-3">
                {currentStep.effects.cashDelta !== 0 && (
                  <div className={`px-3 py-1 rounded-full font-display font-bold ${
                    currentStep.effects.cashDelta > 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    💵 {currentStep.effects.cashDelta > 0 ? '+' : ''}{currentStep.effects.cashDelta}
                  </div>
                )}
                {currentStep.effects.happinessDelta !== 0 && (
                  <div className={`px-3 py-1 rounded-full font-display font-bold ${
                    currentStep.effects.happinessDelta > 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    😊 {currentStep.effects.happinessDelta > 0 ? '+' : ''}{currentStep.effects.happinessDelta}
                  </div>
                )}
                {currentStep.effects.stressDelta !== 0 && (
                  <div className={`px-3 py-1 rounded-full font-display font-bold ${
                    currentStep.effects.stressDelta < 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    😰 {currentStep.effects.stressDelta > 0 ? '+' : ''}{currentStep.effects.stressDelta}
                  </div>
                )}
              </div>
            )}
            
            <button onClick={onAdvance} className="btn-primary w-full">
              Continue →
            </button>
          </div>
        );

      case 'choice':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md font-body text-lg">
              {currentStep.text}
            </div>
            
            <div className="space-y-3">
              {currentStep.choices?.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => onMakeChoice(choice.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:shadow-lg hover:scale-[1.02] ${
                    choice.needOrWant === 'need'
                      ? 'border-green-300 bg-green-50 hover:bg-green-100'
                      : choice.needOrWant === 'want'
                      ? 'border-purple-300 bg-purple-50 hover:bg-purple-100'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-body font-semibold text-gray-800">
                      {choice.label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                      choice.needOrWant === 'need'
                        ? 'bg-green-200 text-green-800'
                        : choice.needOrWant === 'want'
                        ? 'bg-purple-200 text-purple-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {choice.needOrWant}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2 text-sm">
                    {choice.effects.cashDelta !== 0 && (
                      <span className={choice.effects.cashDelta > 0 ? 'text-green-600' : 'text-red-600'}>
                        💵 {choice.effects.cashDelta > 0 ? '+' : ''}{choice.effects.cashDelta}
                      </span>
                    )}
                    {choice.effects.savingsDelta !== 0 && (
                      <span className={choice.effects.savingsDelta > 0 ? 'text-blue-600' : 'text-red-600'}>
                        🏦 {choice.effects.savingsDelta > 0 ? '+' : ''}{choice.effects.savingsDelta}
                      </span>
                    )}
                    {choice.effects.happinessDelta !== 0 && (
                      <span className={choice.effects.happinessDelta > 0 ? 'text-green-600' : 'text-red-600'}>
                        😊 {choice.effects.happinessDelta > 0 ? '+' : ''}{choice.effects.happinessDelta}
                      </span>
                    )}
                    {choice.effects.stressDelta !== 0 && (
                      <span className={choice.effects.stressDelta < 0 ? 'text-green-600' : 'text-red-600'}>
                        😰 {choice.effects.stressDelta > 0 ? '+' : ''}{choice.effects.stressDelta}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'result':
        return (
          <div className="space-y-4 text-center">
            <div className="text-5xl mb-2">🎉</div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border-2 border-amber-300">
              <div className="font-body text-lg text-gray-800 leading-relaxed">
                {currentStep.text}
              </div>
            </div>
            
            <button onClick={onAdvance} className="btn-primary w-full text-lg">
              Complete Quest ✓
            </button>
          </div>
        );

      default:
        return (
          <div>
            <p>{currentStep.text}</p>
            <button onClick={onAdvance} className="btn-primary w-full mt-4">
              Continue
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Quest header */}
        <div className="game-panel mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{quest.npcEmoji}</span>
              <div>
                <h2 className="font-display font-bold text-amber-800">{quest.title}</h2>
                <p className="text-xs text-gray-500 font-body">📍 {quest.location}</p>
              </div>
            </div>
            
            {/* Mini stats */}
            <div className="flex gap-2 text-sm">
              <span className="bg-green-100 px-2 py-1 rounded-lg">💵 ${player.cash}</span>
              <span className="bg-blue-100 px-2 py-1 rounded-lg">🏦 ${player.savings}</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-amber-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-amber-600 mt-1 font-body text-right">
            Step {player.currentStepIndex + 1} of {quest.steps.length}
          </div>
        </div>
        
        {/* Step content */}
        <div className="game-panel">
          {renderStepContent()}
        </div>
        
        {/* Stats bar at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-amber-200 p-2">
          <div className="max-w-2xl mx-auto flex justify-around text-center">
            <div>
              <div className="font-display font-bold text-green-600">${player.cash}</div>
              <div className="text-xs text-gray-500">Cash</div>
            </div>
            <div>
              <div className="font-display font-bold text-blue-600">${player.savings}</div>
              <div className="text-xs text-gray-500">Savings</div>
            </div>
            <div>
              <div className="font-display font-bold text-yellow-600">{player.happiness}</div>
              <div className="text-xs text-gray-500">Happy</div>
            </div>
            <div>
              <div className="font-display font-bold text-red-600">{player.stress}</div>
              <div className="text-xs text-gray-500">Stress</div>
            </div>
          </div>
        </div>
        
        {/* Spacer for fixed bottom bar */}
        <div className="h-16" />
      </div>
    </div>
  );
}


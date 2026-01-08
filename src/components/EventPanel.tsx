import type { GameEvent } from '../game/types';

interface EventPanelProps {
  event: GameEvent;
  eventResolved: boolean;
  week: number;
  selectedChoice: number | null;
  onResolve: (choiceIndex?: number) => void;
  onNextWeek: () => void;
}

export function EventPanel({ event, eventResolved, week, selectedChoice, onResolve, onNextWeek }: EventPanelProps) {
  const typeColors: Record<string, string> = {
    expense: 'bg-red-100 text-red-700 border-red-300',
    emergency: 'bg-orange-100 text-orange-700 border-orange-300',
    bonus: 'bg-green-100 text-green-700 border-green-300',
    opportunity: 'bg-blue-100 text-blue-700 border-blue-300',
    social: 'bg-purple-100 text-purple-700 border-purple-300'
  };

  const typeEmoji: Record<string, string> = {
    expense: '💸',
    emergency: '🚨',
    bonus: '🎁',
    opportunity: '💡',
    social: '👥'
  };

  // Get the outcome text based on what was chosen
  const getOutcomeText = () => {
    if (event.choices && selectedChoice !== null) {
      return event.choices[selectedChoice].outcomeText;
    }
    return event.defaultEffect?.outcomeText || '';
  };

  return (
    <div className="game-panel mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-xl font-bold text-amber-800">
          📅 Week {week} Event
        </h2>
        <span className={`badge border ${typeColors[event.type]}`}>
          {typeEmoji[event.type]} {event.type}
        </span>
      </div>
      
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-4">
        <h3 className="font-display text-lg font-bold text-amber-900 mb-2">
          {event.title}
        </h3>
        <p className="font-body text-gray-700">
          {event.description}
        </p>
      </div>
      
      {!eventResolved && (
        <div className="space-y-3">
          {event.choices ? (
            <>
              <p className="font-body font-semibold text-gray-700">What do you do?</p>
              {event.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => onResolve(index)}
                  className={`btn-choice ${choice.needOrWant}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span>{choice.label}</span>
                    <span className={`badge ${
                      choice.needOrWant === 'need' ? 'badge-need' : 
                      choice.needOrWant === 'want' ? 'badge-want' : 
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {choice.needOrWant}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-2 text-xs">
                    {choice.cashDelta !== 0 && (
                      <span className={choice.cashDelta > 0 ? 'text-green-600' : 'text-red-600'}>
                        💵 {choice.cashDelta > 0 ? '+' : ''}{choice.cashDelta}
                      </span>
                    )}
                    {choice.happinessDelta !== 0 && (
                      <span className={choice.happinessDelta > 0 ? 'text-green-600' : 'text-red-600'}>
                        😊 {choice.happinessDelta > 0 ? '+' : ''}{choice.happinessDelta}
                      </span>
                    )}
                    {choice.stressDelta !== 0 && (
                      <span className={choice.stressDelta < 0 ? 'text-green-600' : 'text-red-600'}>
                        😰 {choice.stressDelta > 0 ? '+' : ''}{choice.stressDelta}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </>
          ) : (
            <button
              onClick={() => onResolve()}
              className="btn-primary w-full"
            >
              Continue →
            </button>
          )}
        </div>
      )}
      
      {eventResolved && (
        <div className="space-y-3">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3">
            <p className="font-body text-green-800">
              ✅ {getOutcomeText()}
            </p>
          </div>
          
          <button
            onClick={onNextWeek}
            className="btn-primary w-full"
          >
            {week < 4 ? `→ Continue to Week ${week + 1}` : '📊 See Final Results'}
          </button>
        </div>
      )}
    </div>
  );
}

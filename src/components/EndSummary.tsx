import type { EndResult } from '../game/types';

interface EndSummaryProps {
  result: EndResult;
  onPlayAgain: () => void;
}

export function EndSummary({ result, onPlayAgain }: EndSummaryProps) {
  const tierColors: Record<string, string> = {
    'stable-planner': 'from-green-400 to-emerald-500',
    'fun-focused': 'from-purple-400 to-pink-500',
    'over-saver': 'from-blue-400 to-cyan-500',
    'struggled': 'from-orange-400 to-amber-500',
    'burnout': 'from-red-400 to-rose-500'
  };

  const tierBg: Record<string, string> = {
    'stable-planner': 'bg-green-50 border-green-300',
    'fun-focused': 'bg-purple-50 border-purple-300',
    'over-saver': 'bg-blue-50 border-blue-300',
    'struggled': 'bg-orange-50 border-orange-300',
    'burnout': 'bg-red-50 border-red-300'
  };

  return (
    <div className="game-panel text-center">
      <div className={`bg-gradient-to-r ${tierColors[result.tier]} text-white rounded-xl p-6 mb-6`}>
        <h2 className="font-display text-3xl font-bold mb-2">
          {result.title}
        </h2>
        <p className="font-body text-white/90">
          The month is over! Here's how you did...
        </p>
      </div>
      
      <div className={`rounded-xl p-4 border-2 mb-6 ${tierBg[result.tier]}`}>
        <p className="font-body text-gray-700 text-lg">
          {result.description}
        </p>
      </div>
      
      {/* Final Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="stat-card border-green-300 bg-green-50">
          <div className="text-2xl mb-1">💵</div>
          <div className="font-display font-bold text-xl">${result.finalStats.cash}</div>
          <div className="font-body text-xs text-gray-600">Final Cash</div>
        </div>
        
        <div className="stat-card border-blue-300 bg-blue-50">
          <div className="text-2xl mb-1">🏦</div>
          <div className="font-display font-bold text-xl">${result.finalStats.savings}</div>
          <div className="font-body text-xs text-gray-600">Savings</div>
        </div>
        
        <div className="stat-card border-yellow-300 bg-yellow-50">
          <div className="text-2xl mb-1">😊</div>
          <div className="font-display font-bold text-xl">{result.finalStats.happiness}</div>
          <div className="font-body text-xs text-gray-600">Happiness</div>
        </div>
        
        <div className="stat-card border-red-300 bg-red-50">
          <div className="text-2xl mb-1">😰</div>
          <div className="font-display font-bold text-xl">{result.finalStats.stress}</div>
          <div className="font-body text-xs text-gray-600">Stress</div>
        </div>
      </div>
      
      {/* Tips */}
      <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200 mb-6 text-left">
        <h3 className="font-display font-bold text-amber-800 mb-3">💡 Tips for Next Time</h3>
        <ul className="space-y-2">
          {result.tips.map((tip, idx) => (
            <li key={idx} className="font-body text-gray-700 flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">✦</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
      
      <button onClick={onPlayAgain} className="btn-primary text-xl px-8">
        🔄 Play Again
      </button>
    </div>
  );
}


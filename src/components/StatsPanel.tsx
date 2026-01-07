import type { GameState } from '../game/types';

interface StatsPanelProps {
  state: GameState;
}

export function StatsPanel({ state }: StatsPanelProps) {
  const happinessColor = state.happiness >= 70 ? 'border-green-400 bg-green-50' :
                         state.happiness >= 40 ? 'border-yellow-400 bg-yellow-50' :
                         'border-red-400 bg-red-50';
  
  const stressColor = state.stress >= 70 ? 'border-red-400 bg-red-50' :
                      state.stress >= 40 ? 'border-yellow-400 bg-yellow-50' :
                      'border-green-400 bg-green-50';
  
  const cashColor = state.cash >= 200 ? 'border-green-400 bg-green-50' :
                    state.cash >= 50 ? 'border-yellow-400 bg-yellow-50' :
                    'border-red-400 bg-red-50';

  return (
    <div className="game-panel mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-xl font-bold text-amber-800">📊 Your Stats</h2>
        <div className="bg-amber-200 px-4 py-1 rounded-full">
          <span className="font-display font-bold text-amber-800">Week {state.week} of 4</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`stat-card ${cashColor}`}>
          <div className="text-2xl mb-1">💵</div>
          <div className="font-display font-bold text-xl">${state.cash}</div>
          <div className="font-body text-xs text-gray-600">Cash</div>
        </div>
        
        <div className="stat-card border-blue-400 bg-blue-50">
          <div className="text-2xl mb-1">🏦</div>
          <div className="font-display font-bold text-xl">${state.savings}</div>
          <div className="font-body text-xs text-gray-600">Savings</div>
        </div>
        
        <div className={`stat-card ${happinessColor}`}>
          <div className="text-2xl mb-1">😊</div>
          <div className="font-display font-bold text-xl">{state.happiness}</div>
          <div className="font-body text-xs text-gray-600">Happiness</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.happiness}%` }}
            />
          </div>
        </div>
        
        <div className={`stat-card ${stressColor}`}>
          <div className="text-2xl mb-1">😰</div>
          <div className="font-display font-bold text-xl">{state.stress}</div>
          <div className="font-body text-xs text-gray-600">Stress</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.stress}%` }}
            />
          </div>
        </div>
      </div>
      
      {state.phase !== 'setup' && (
        <div className="mt-3 pt-3 border-t border-amber-200 flex flex-wrap gap-4 text-sm font-body">
          <span className="text-gray-600">
            📈 Income: <span className="font-bold text-green-700">${state.income}/mo</span>
          </span>
          <span className="text-gray-600">
            🏠 Housing: <span className="font-bold text-red-600">-${state.fixedExpenses.housing}</span>
          </span>
          <span className="text-gray-600">
            🍎 Food: <span className="font-bold text-red-600">-${state.fixedExpenses.basicFood}</span>
          </span>
          <span className="text-gray-600">
            🎯 Fun Budget: <span className="font-bold text-purple-600">${state.funBudget}/wk</span>
          </span>
        </div>
      )}
    </div>
  );
}


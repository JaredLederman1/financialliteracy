import { useState } from 'react';

interface AllocationPanelProps {
  availableCash: number;
  onConfirm: (savings: number, funBudget: number) => void;
}

export function AllocationPanel({ availableCash, onConfirm }: AllocationPanelProps) {
  const [savings, setSavings] = useState(0);
  const [funBudget, setFunBudget] = useState(0);
  
  const remainingAfterSavings = availableCash - savings;
  const maxFunBudget = Math.floor(remainingAfterSavings / 4); // Weekly budget for 4 weeks
  
  const handleSavingsChange = (value: number) => {
    const newSavings = Math.max(0, Math.min(availableCash, value));
    setSavings(newSavings);
    // Adjust fun budget if necessary
    const newRemaining = availableCash - newSavings;
    const newMaxFun = Math.floor(newRemaining / 4);
    if (funBudget > newMaxFun) {
      setFunBudget(newMaxFun);
    }
  };
  
  const handleFunBudgetChange = (value: number) => {
    const newFunBudget = Math.max(0, Math.min(maxFunBudget, value));
    setFunBudget(newFunBudget);
  };

  return (
    <div className="game-panel mb-4">
      <h2 className="font-display text-xl font-bold text-amber-800 mb-4">
        📝 Plan Your Month
      </h2>
      
      <p className="font-body text-gray-700 mb-4">
        You have <span className="font-bold text-green-600">${availableCash}</span> after paying 
        fixed expenses. How do you want to allocate your money?
      </p>
      
      <div className="space-y-6">
        {/* Savings Allocation */}
        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
          <label className="block font-display font-semibold text-blue-800 mb-2">
            🏦 How much to save?
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max={availableCash}
              step="10"
              value={savings}
              onChange={(e) => handleSavingsChange(Number(e.target.value))}
              className="flex-1 h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex items-center gap-2">
              <span className="font-body text-gray-600">$</span>
              <input
                type="number"
                min="0"
                max={availableCash}
                step="10"
                value={savings}
                onChange={(e) => handleSavingsChange(Number(e.target.value))}
                className="w-20 px-2 py-1 border-2 border-blue-300 rounded-lg font-display font-bold text-center"
              />
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2 font-body">
            💡 Savings help with emergencies and big future goals!
          </p>
        </div>
        
        {/* Fun Budget */}
        <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
          <label className="block font-display font-semibold text-purple-800 mb-2">
            🎯 Weekly fun budget?
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max={maxFunBudget}
              step="5"
              value={funBudget}
              onChange={(e) => handleFunBudgetChange(Number(e.target.value))}
              className="flex-1 h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex items-center gap-2">
              <span className="font-body text-gray-600">$</span>
              <input
                type="number"
                min="0"
                max={maxFunBudget}
                step="5"
                value={funBudget}
                onChange={(e) => handleFunBudgetChange(Number(e.target.value))}
                className="w-20 px-2 py-1 border-2 border-purple-300 rounded-lg font-display font-bold text-center"
              />
              <span className="font-body text-gray-600">/week</span>
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-2 font-body">
            💡 Fun is important! But 0 fun budget for 2+ weeks hurts happiness.
          </p>
        </div>
        
        {/* Summary */}
        <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-300">
          <h3 className="font-display font-semibold text-amber-800 mb-2">📋 Summary</h3>
          <div className="grid grid-cols-2 gap-2 text-sm font-body">
            <span className="text-gray-600">Starting Cash:</span>
            <span className="font-bold text-right">${availableCash}</span>
            
            <span className="text-gray-600">→ To Savings:</span>
            <span className="font-bold text-blue-600 text-right">-${savings}</span>
            
            <span className="text-gray-600">Remaining Cash:</span>
            <span className="font-bold text-right">${remainingAfterSavings}</span>
            
            <span className="text-gray-600">Fun Budget (×4 weeks):</span>
            <span className="font-bold text-purple-600 text-right">${funBudget * 4}</span>
            
            <span className="text-gray-600 font-semibold border-t border-amber-200 pt-1">Flexible Cash:</span>
            <span className="font-bold text-green-600 text-right border-t border-amber-200 pt-1">
              ${remainingAfterSavings - funBudget * 4}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => onConfirm(savings, funBudget)}
          className="btn-primary w-full text-lg"
        >
          ✅ Confirm & Start Month
        </button>
      </div>
    </div>
  );
}


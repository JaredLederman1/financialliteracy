import type { LogEntry } from '../game/types';

interface LogPanelProps {
  log: LogEntry[];
  currentWeek: number;
}

export function LogPanel({ log, currentWeek }: LogPanelProps) {
  const typeStyles: Record<string, string> = {
    info: 'text-gray-700',
    expense: 'text-red-600',
    income: 'text-green-600',
    warning: 'text-orange-600 font-semibold',
    success: 'text-green-700 font-semibold'
  };

  // Group by week
  const logByWeek: Record<number, LogEntry[]> = {};
  log.forEach(entry => {
    if (!logByWeek[entry.week]) {
      logByWeek[entry.week] = [];
    }
    logByWeek[entry.week].push(entry);
  });

  return (
    <div className="game-panel">
      <h2 className="font-display text-xl font-bold text-amber-800 mb-3">
        📜 Activity Log
      </h2>
      
      <div className="max-h-64 overflow-y-auto bg-amber-50/50 rounded-xl border border-amber-200">
        {Object.keys(logByWeek).sort((a, b) => Number(b) - Number(a)).map(weekNum => (
          <div key={weekNum} className="border-b border-amber-200 last:border-b-0">
            <div className={`px-3 py-1.5 font-display font-semibold text-sm ${
              Number(weekNum) === currentWeek ? 'bg-amber-200 text-amber-800' : 'bg-amber-100 text-amber-700'
            }`}>
              Week {weekNum}
            </div>
            {logByWeek[Number(weekNum)].map((entry, idx) => (
              <div key={idx} className={`log-entry ${typeStyles[entry.type]}`}>
                {entry.text}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}


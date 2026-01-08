import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatPillProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: 'green' | 'blue' | 'amber' | 'rose' | 'slate';
  showBar?: boolean;
  barValue?: number; // 0-100
}

const colorClasses = {
  green: {
    bg: 'bg-positive-50',
    text: 'text-positive-600',
    bar: 'bg-positive-400',
  },
  blue: {
    bg: 'bg-primary-50',
    text: 'text-primary-600',
    bar: 'bg-primary-400',
  },
  amber: {
    bg: 'bg-warning-100',
    text: 'text-amber-600',
    bar: 'bg-warning-400',
  },
  rose: {
    bg: 'bg-danger-50',
    text: 'text-danger-500',
    bar: 'bg-danger-400',
  },
  slate: {
    bg: 'bg-surface-100',
    text: 'text-slate-600',
    bar: 'bg-slate-400',
  },
};

export function StatPill({ 
  icon, 
  label, 
  value, 
  color = 'slate',
  showBar = false,
  barValue = 0,
}: StatPillProps) {
  const colors = colorClasses[color];
  
  return (
    <div className={`${colors.bg} rounded-xl px-3 py-2 min-w-[80px]`}>
      <div className="flex items-center gap-1.5">
        <span className="text-lg">{icon}</span>
        <div className="flex flex-col">
          <span className={`text-xs ${colors.text} opacity-70`}>{label}</span>
          <span className={`font-bold ${colors.text}`}>{value}</span>
        </div>
      </div>
      {showBar && (
        <div className="mt-1.5 h-1.5 bg-white/50 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${colors.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, barValue))}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      )}
    </div>
  );
}


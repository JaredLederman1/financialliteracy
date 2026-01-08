import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0-100
  color?: 'primary' | 'positive' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  showLabel?: boolean;
  label?: string;
}

const colorClasses = {
  primary: 'bg-gradient-to-r from-primary-400 to-primary-500',
  positive: 'bg-gradient-to-r from-positive-400 to-positive-500',
  warning: 'bg-gradient-to-r from-warning-400 to-warning-500',
  danger: 'bg-gradient-to-r from-danger-400 to-danger-500',
};

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
};

export function ProgressBar({ 
  value, 
  color = 'primary', 
  size = 'md',
  showLabel = false,
  label,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>{label}</span>
          <span>{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className={`w-full bg-surface-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}


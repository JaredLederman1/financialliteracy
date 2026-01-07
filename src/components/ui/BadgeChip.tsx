import { motion } from 'framer-motion';

interface BadgeChipProps {
  emoji: string;
  label: string;
  variant?: 'default' | 'earned' | 'locked';
}

const variantClasses = {
  default: 'bg-surface-100 text-slate-600',
  earned: 'bg-primary-100 text-primary-700 border border-primary-200',
  locked: 'bg-surface-100 text-slate-400',
};

export function BadgeChip({ emoji, label, variant = 'default' }: BadgeChipProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold
        ${variantClasses[variant]}
      `}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </motion.div>
  );
}


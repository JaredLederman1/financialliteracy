import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

const variantClasses = {
  default: 'bg-white rounded-2xl shadow-soft',
  elevated: 'bg-white rounded-2xl shadow-soft border border-surface-200/50',
  glass: 'bg-white/80 backdrop-blur-md rounded-2xl shadow-soft',
};

export function Card({ 
  children, 
  variant = 'default', 
  padding = 'md',
  className = '',
  ...props 
}: CardProps) {
  return (
    <motion.div
      className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}


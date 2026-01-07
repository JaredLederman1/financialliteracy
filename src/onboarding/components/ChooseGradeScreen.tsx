import { motion } from 'framer-motion';
import { ArrowLeft, GraduationCap, RotateCcw } from 'lucide-react';
import type { OnboardingState, OnboardingAction } from '../types';
import { clearAllData } from '../storage';

interface ChooseGradeScreenProps {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
  onReset?: () => void;
}

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8];

// Color scheme for different grade ranges
const getGradeColor = (grade: number): string => {
  if (grade <= 2) return 'from-emerald-400 to-emerald-500';
  if (grade <= 4) return 'from-blue-400 to-blue-500';
  if (grade <= 6) return 'from-purple-400 to-purple-500';
  return 'from-primary-400 to-primary-500';
};

const getGradeLabel = (grade: number): string => {
  if (grade === 1) return '1st';
  if (grade === 2) return '2nd';
  if (grade === 3) return '3rd';
  return `${grade}th`;
};

export function ChooseGradeScreen({ state, dispatch, onReset }: ChooseGradeScreenProps) {
  const handleSelectGrade = (grade: number) => {
    dispatch({ type: 'SELECT_GRADE', grade });
  };

  const handleBack = () => {
    dispatch({ type: 'GO_BACK' });
  };

  const handleReset = () => {
    if (confirm('Start completely over? This will delete all your data.')) {
      clearAllData();
      if (onReset) {
        onReset();
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-sky-100 to-slate-100 flex items-center justify-center p-4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-lg">
        {/* Back Button */}
        <motion.button
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">What Grade Are You In?</h1>
          <p className="text-slate-500">This helps us adjust the lessons just for you!</p>
        </motion.div>

        {/* Grade Grid */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-4 gap-3">
            {GRADES.map((grade, index) => (
              <motion.button
                key={grade}
                onClick={() => handleSelectGrade(grade)}
                className={`
                  relative aspect-square rounded-2xl font-bold text-xl
                  transition-all overflow-hidden
                  ${state.profile.grade === grade
                    ? 'ring-4 ring-primary-400 ring-offset-2'
                    : 'hover:scale-105'
                  }
                `}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.05, type: 'spring' }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getGradeColor(grade)}`} />
                
                {/* Content */}
                <div className="relative flex flex-col items-center justify-center h-full text-white">
                  <span className="text-2xl font-extrabold">{grade}</span>
                  <span className="text-xs opacity-80">{getGradeLabel(grade)} Grade</span>
                </div>

                {/* Selected Checkmark */}
                {state.profile.grade === grade && (
                  <motion.div
                    className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <span className="text-primary-500 text-sm">✓</span>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Recommendation Note */}
          <motion.p
            className="text-center text-slate-400 text-sm mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            💡 Money World is designed for grades 6-8, but everyone can learn!
          </motion.p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {['account', 'grade', 'avatar'].map((step, index) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-colors ${
                index <= 1 ? 'bg-primary-500' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Reset Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-slate-400 hover:text-red-500 text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Start Over
          </button>
        </div>
      </div>
    </motion.div>
  );
}


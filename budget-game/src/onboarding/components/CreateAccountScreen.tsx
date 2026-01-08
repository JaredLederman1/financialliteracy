import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, RotateCcw } from 'lucide-react';
import type { OnboardingState, OnboardingAction, Account } from '../types';
import { clearAllData } from '../storage';

interface CreateAccountScreenProps {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
  onReset?: () => void;
}

export function CreateAccountScreen({ state, dispatch, onReset }: CreateAccountScreenProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_ACCOUNT' });
  };

  const handleChange = (field: keyof Account, value: string) => {
    dispatch({ type: 'SET_ACCOUNT_FIELD', field, value });
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
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Create Your Account</h1>
          <p className="text-slate-500">Let's get you started on your adventure!</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                First Name *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={state.account.firstName || ''}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  className={`
                    w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-colors
                    focus:outline-none focus:border-primary-400
                    ${state.errors.firstName ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}
                  `}
                />
              </div>
              {state.errors.firstName && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {state.errors.firstName}
                </motion.p>
              )}
            </div>

            {/* Last Name (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Last Name <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={state.account.lastName || ''}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 focus:outline-none focus:border-primary-400 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={state.account.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className={`
                    w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-colors
                    focus:outline-none focus:border-primary-400
                    ${state.errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}
                  `}
                />
              </div>
              {state.errors.email && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {state.errors.email}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={state.account.password || ''}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="At least 8 characters"
                  className={`
                    w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-colors
                    focus:outline-none focus:border-primary-400
                    ${state.errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}
                  `}
                />
              </div>
              {state.errors.password && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {state.errors.password}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {['account', 'grade', 'avatar'].map((step, index) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === 0 ? 'bg-primary-500' : 'bg-slate-300'
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


import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, RotateCcw } from 'lucide-react';
import type { OnboardingState, OnboardingAction, Avatar } from '../types';
import { HAIRSTYLES, HAIR_COLORS, EYE_COLORS, SKIN_COLORS } from '../types';
import { AvatarPreview } from './AvatarPreview';
import { clearAllData } from '../storage';

interface AvatarDesignerScreenProps {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
  onReset?: () => void;
}

export function AvatarDesignerScreen({ state, dispatch, onReset }: AvatarDesignerScreenProps) {
  const avatar = state.profile.avatar!;

  const handleAvatarChange = (changes: Partial<Avatar>) => {
    dispatch({ type: 'UPDATE_AVATAR', avatar: changes });
  };

  const handleFinish = () => {
    dispatch({ type: 'FINISH_ONBOARDING' });
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

  // Navigate hairstyles
  const currentHairstyleIndex = HAIRSTYLES.findIndex(h => h.id === avatar.hairstyleId);
  
  const prevHairstyle = () => {
    const newIndex = currentHairstyleIndex > 0 ? currentHairstyleIndex - 1 : HAIRSTYLES.length - 1;
    handleAvatarChange({ hairstyleId: HAIRSTYLES[newIndex].id });
  };

  const nextHairstyle = () => {
    const newIndex = currentHairstyleIndex < HAIRSTYLES.length - 1 ? currentHairstyleIndex + 1 : 0;
    handleAvatarChange({ hairstyleId: HAIRSTYLES[newIndex].id });
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-sky-100 to-slate-100 p-4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Design Your Character</h1>
          <p className="text-slate-500">Make it look just like you!</p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Avatar Preview */}
          <motion.div
            className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AvatarPreview avatar={avatar} size="lg" />
            <p className="text-slate-400 text-sm mt-4">Your Character</p>
          </motion.div>

          {/* Right: Customization Controls */}
          <motion.div
            className="bg-white rounded-3xl shadow-xl p-6 space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Hairstyle Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Hairstyle
              </label>
              <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                <motion.button
                  onClick={prevHairstyle}
                  className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-slate-100 transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </motion.button>
                <span className="font-medium text-slate-700">
                  {HAIRSTYLES[currentHairstyleIndex]?.name}
                </span>
                <motion.button
                  onClick={nextHairstyle}
                  className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-slate-100 transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </motion.button>
              </div>
            </div>

            {/* Hair Color */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Hair Color
              </label>
              <div className="flex flex-wrap gap-2">
                {HAIR_COLORS.map((color) => (
                  <motion.button
                    key={color}
                    onClick={() => handleAvatarChange({ hairColor: color })}
                    className={`
                      w-10 h-10 rounded-full transition-all
                      ${avatar.hairColor === color
                        ? 'ring-4 ring-primary-400 ring-offset-2 scale-110'
                        : 'hover:scale-105'
                      }
                    `}
                    style={{ backgroundColor: color }}
                    whileTap={{ scale: 0.9 }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Eye Color */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Eye Color
              </label>
              <div className="flex flex-wrap gap-2">
                {EYE_COLORS.map((color) => (
                  <motion.button
                    key={color}
                    onClick={() => handleAvatarChange({ eyeColor: color })}
                    className={`
                      w-10 h-10 rounded-full transition-all
                      ${avatar.eyeColor === color
                        ? 'ring-4 ring-primary-400 ring-offset-2 scale-110'
                        : 'hover:scale-105'
                      }
                    `}
                    style={{ backgroundColor: color }}
                    whileTap={{ scale: 0.9 }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Skin Color */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Skin Tone
              </label>
              <div className="flex flex-wrap gap-2">
                {SKIN_COLORS.map((color) => (
                  <motion.button
                    key={color}
                    onClick={() => handleAvatarChange({ skinColor: color })}
                    className={`
                      w-10 h-10 rounded-full transition-all
                      ${avatar.skinColor === color
                        ? 'ring-4 ring-primary-400 ring-offset-2 scale-110'
                        : 'hover:scale-105'
                      }
                    `}
                    style={{ backgroundColor: color }}
                    whileTap={{ scale: 0.9 }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Finish Button */}
            <motion.button
              onClick={handleFinish}
              className="w-full bg-positive-500 hover:bg-positive-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-positive-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-5 h-5" />
              Finish & Start Adventure!
            </motion.button>
          </motion.div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {['account', 'grade', 'avatar'].map((step) => (
            <div
              key={step}
              className="w-3 h-3 rounded-full transition-colors bg-primary-500"
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


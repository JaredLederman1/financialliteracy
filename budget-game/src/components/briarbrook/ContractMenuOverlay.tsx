/**
 * ContractMenuOverlay - Cozy Illustrated Style
 * 
 * Shows available contracts at a building with soft colors,
 * rounded corners, and friendly animations.
 */

import { motion } from 'framer-motion';
import { X, Lock, Star, Coins, Sparkles, CheckCircle2 } from 'lucide-react';
import { getBuildingById } from '../../game/briarbrook/buildings';
import { getAvailableContracts } from '../../game/briarbrook/contracts';
import type { BriarbrookPlayer, Contract, ContractCategory } from '../../game/briarbrook/types';
import { CATEGORY_COLORS, DIFFICULTY_LABELS } from '../../game/briarbrook/types';
import { Button } from '../ui/Button';

interface ContractMenuOverlayProps {
  buildingId: string;
  player: BriarbrookPlayer;
  onSelectContract: (contractId: string) => void;
  onClose: () => void;
}

export function ContractMenuOverlay({
  buildingId,
  player,
  onSelectContract,
  onClose,
}: ContractMenuOverlayProps) {
  const building = getBuildingById(buildingId);
  if (!building) return null;

  const contracts = getAvailableContracts(
    building.category,
    player.completedContractIds,
    player.mastery[building.category],
    player.mastery.saving
  );

  const categoryColor = CATEGORY_COLORS[building.category];
  const masteryPercent = player.mastery[building.category];

  return (
    <>
      {/* Backdrop - soft blur */}
      <motion.div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="fixed inset-x-4 top-8 bottom-8 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100">
          {/* Header */}
          <div className={`bg-gradient-to-r ${getCategoryGradient(building.category)} p-5 relative`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center gap-4">
              {/* NPC Portrait */}
              <div className="w-16 h-16 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center text-3xl border border-white/30 shadow-lg">
                {building.npcEmoji}
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-white">{building.name}</h2>
                <p className="text-white/80 text-sm font-medium">{building.npcName}</p>
              </div>
            </div>

            {/* Mastery bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-white/80 mb-1.5 font-medium">
                <span>Mastery Progress</span>
                <span>{masteryPercent}%</span>
              </div>
              <div className="h-2.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div 
                  className="h-full bg-white/90 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${masteryPercent}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
            </div>
          </div>

          {/* Contract List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            <p className="text-slate-500 text-sm px-1 mb-2">{building.description}</p>

            {contracts.map(({ contract, locked, lockReason }, index) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ContractCard
                  contract={contract}
                  locked={locked}
                  lockReason={lockReason}
                  completed={player.completedContractIds.includes(contract.id)}
                  categoryColor={categoryColor}
                  onSelect={() => !locked && !player.completedContractIds.includes(contract.id) && onSelectContract(contract.id)}
                />
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <Button variant="secondary" fullWidth onClick={onClose}>
              Return to Town
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// Contract card component - cozy style
function ContractCard({
  contract,
  locked,
  lockReason,
  completed,
  categoryColor,
  onSelect,
}: {
  contract: Contract;
  locked: boolean;
  lockReason?: string;
  completed: boolean;
  categoryColor: string;
  onSelect: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      disabled={locked || completed}
      className={`
        w-full text-left p-4 rounded-2xl border-2 transition-all
        ${completed 
          ? 'bg-emerald-50 border-emerald-200' 
          : locked 
            ? 'bg-slate-100/80 border-slate-200 opacity-70 cursor-not-allowed' 
            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer'
        }
      `}
      whileHover={!locked && !completed ? { scale: 1.01, y: -2 } : {}}
      whileTap={!locked && !completed ? { scale: 0.99 } : {}}
    >
      <div className="flex items-start gap-3">
        {/* Status icon */}
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm
          ${completed 
            ? 'bg-emerald-100' 
            : locked 
              ? 'bg-slate-200' 
              : `bg-${categoryColor}-50 border border-${categoryColor}-100`
          }
        `}>
          {completed ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          ) : locked ? (
            <Lock className="w-5 h-5 text-slate-400" />
          ) : (
            <span className="text-2xl">{contract.npcEmoji}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold ${completed ? 'text-emerald-700' : 'text-slate-800'}`}>
              {contract.title}
            </h3>
            <DifficultyBadge difficulty={contract.difficulty} />
          </div>
          
          <p className="text-slate-500 text-sm line-clamp-2 mb-2">
            {completed ? '✓ Completed' : locked ? lockReason : contract.description}
          </p>

          {/* Rewards */}
          {!completed && !locked && (
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                <Coins className="w-3 h-3" />
                {contract.rewards.goldDelta > 0 ? `+${contract.rewards.goldDelta}` : contract.rewards.goldDelta}
              </span>
              <span className="flex items-center gap-1 text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                <Sparkles className="w-3 h-3" />
                +{contract.rewards.xpDelta} XP
              </span>
              <span className="flex items-center gap-1 text-violet-600 bg-violet-50 px-2 py-1 rounded-full">
                <Star className="w-3 h-3" />
                +{contract.rewards.masteryDelta}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// Difficulty badge - cozy pill style
function DifficultyBadge({ difficulty }: { difficulty: 1 | 2 | 3 }) {
  const styles = {
    1: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    2: 'bg-amber-100 text-amber-700 border-amber-200',
    3: 'bg-violet-100 text-violet-700 border-violet-200',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${styles[difficulty]}`}>
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}

// Helper for category gradients - softer, more illustrated feel
function getCategoryGradient(category: ContractCategory): string {
  const gradients: Record<ContractCategory, string> = {
    earning: 'from-emerald-500 to-emerald-600',
    budgeting: 'from-amber-500 to-amber-600',
    saving: 'from-sky-500 to-sky-600',
    credit: 'from-pink-500 to-pink-600',
    planning: 'from-violet-500 to-violet-600',
  };
  return gradients[category];
}

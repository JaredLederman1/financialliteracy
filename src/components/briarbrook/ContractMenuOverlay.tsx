import { motion, AnimatePresence } from 'framer-motion';
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
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="fixed inset-x-4 top-8 bottom-8 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="h-full bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-700">
          {/* Header */}
          <div className={`bg-gradient-to-r ${getCategoryGradient(building.category)} p-4 relative`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center gap-4">
              {/* NPC Portrait */}
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl border-2 border-white/30">
                {building.npcEmoji}
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-white">{building.name}</h2>
                <p className="text-white/80 text-sm">{building.npcName}</p>
              </div>
            </div>

            {/* Mastery bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Mastery</span>
                <span>{masteryPercent}%</span>
              </div>
              <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white/80"
                  initial={{ width: 0 }}
                  animate={{ width: `${masteryPercent}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
            </div>
          </div>

          {/* Contract List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <p className="text-slate-400 text-sm mb-3">{building.description}</p>

            {contracts.map(({ contract, locked, lockReason }) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                locked={locked}
                lockReason={lockReason}
                completed={player.completedContractIds.includes(contract.id)}
                categoryColor={categoryColor}
                onSelect={() => !locked && !player.completedContractIds.includes(contract.id) && onSelectContract(contract.id)}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700 bg-slate-800/50">
            <Button variant="secondary" fullWidth onClick={onClose}>
              Return to Town
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// Contract card component
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
        w-full text-left p-4 rounded-xl border-2 transition-all
        ${completed 
          ? 'bg-emerald-900/30 border-emerald-500/50' 
          : locked 
            ? 'bg-slate-700/50 border-slate-600 opacity-60 cursor-not-allowed' 
            : 'bg-slate-700/50 border-slate-600 hover:border-slate-500 hover:bg-slate-700 cursor-pointer'
        }
      `}
      whileHover={!locked && !completed ? { scale: 1.02 } : {}}
      whileTap={!locked && !completed ? { scale: 0.98 } : {}}
    >
      <div className="flex items-start gap-3">
        {/* Status icon */}
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
          ${completed 
            ? 'bg-emerald-500/30' 
            : locked 
              ? 'bg-slate-600' 
              : `bg-${categoryColor}-500/30`
          }
        `}>
          {completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : locked ? (
            <Lock className="w-5 h-5 text-slate-400" />
          ) : (
            <span className="text-lg">{contract.npcEmoji}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold ${completed ? 'text-emerald-300' : 'text-white'}`}>
              {contract.title}
            </h3>
            <DifficultyBadge difficulty={contract.difficulty} />
          </div>
          
          <p className="text-slate-400 text-sm line-clamp-2 mb-2">
            {completed ? '✓ Completed' : locked ? lockReason : contract.description}
          </p>

          {/* Rewards */}
          {!completed && !locked && (
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-yellow-400">
                <Coins className="w-3 h-3" />
                {contract.rewards.goldDelta > 0 ? `+${contract.rewards.goldDelta}` : contract.rewards.goldDelta}
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Sparkles className="w-3 h-3" />
                +{contract.rewards.xpDelta} XP
              </span>
              <span className="flex items-center gap-1 text-purple-400">
                <Star className="w-3 h-3" />
                +{contract.rewards.masteryDelta} Mastery
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// Difficulty badge
function DifficultyBadge({ difficulty }: { difficulty: 1 | 2 | 3 }) {
  const colors = {
    1: 'bg-emerald-500/30 text-emerald-400',
    2: 'bg-amber-500/30 text-amber-400',
    3: 'bg-purple-500/30 text-purple-400',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${colors[difficulty]}`}>
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}

// Helper for category gradients
function getCategoryGradient(category: ContractCategory): string {
  const gradients: Record<ContractCategory, string> = {
    earning: 'from-emerald-600 to-emerald-800',
    budgeting: 'from-amber-600 to-amber-800',
    saving: 'from-sky-600 to-sky-800',
    credit: 'from-rose-600 to-rose-800',
    planning: 'from-violet-600 to-violet-800',
  };
  return gradients[category];
}


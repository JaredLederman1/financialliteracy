import { EARNING_CONTRACTS } from './earning';
import { BUDGETING_CONTRACTS } from './budgeting';
import { SAVING_CONTRACTS } from './saving';
import { CREDIT_CONTRACTS } from './credit';
import { PLANNING_CONTRACTS } from './planning';
import type { Contract, ContractCategory } from '../types';

// All contracts combined
export const ALL_CONTRACTS: Contract[] = [
  ...EARNING_CONTRACTS,
  ...BUDGETING_CONTRACTS,
  ...SAVING_CONTRACTS,
  ...CREDIT_CONTRACTS,
  ...PLANNING_CONTRACTS,
];

// Get contracts by category
export function getContractsByCategory(category: ContractCategory): Contract[] {
  return ALL_CONTRACTS.filter(c => c.category === category);
}

// Get contract by ID
export function getContractById(id: string): Contract | undefined {
  return ALL_CONTRACTS.find(c => c.id === id);
}

// Get available contracts for a building based on player mastery
export function getAvailableContracts(
  category: ContractCategory,
  completedContractIds: string[],
  _categoryMastery: number,
  savingMastery: number = 0
): { contract: Contract; locked: boolean; lockReason?: string }[] {
  const contracts = getContractsByCategory(category);
  
  return contracts.map(contract => {
    // Already completed
    const isCompleted = completedContractIds.includes(contract.id);
    
    // Count completed contracts in this category
    const completedInCategory = contracts.filter(c => 
      completedContractIds.includes(c.id)
    ).length;
    
    // Difficulty unlock rules
    let locked = false;
    let lockReason: string | undefined;
    
    if (!isCompleted) {
      if (contract.difficulty === 2) {
        // Difficulty 2 unlocks after completing 3 contracts in category
        if (completedInCategory < 2) {
          locked = true;
          lockReason = `Complete ${2 - completedInCategory} more beginner contract(s)`;
        }
      }
      
      if (contract.difficulty === 3) {
        // Difficulty 3 (capstone) unlocks after completing all other 4
        if (completedInCategory < 4) {
          locked = true;
          lockReason = `Complete ${4 - completedInCategory} more contract(s)`;
        }
      }
      
      // Special rule: Credit contracts difficulty 2+ need saving mastery >= 30
      if (category === 'credit' && contract.difficulty >= 2 && savingMastery < 30) {
        locked = true;
        lockReason = 'Requires Saving mastery ≥ 30';
      }
    }
    
    return {
      contract,
      locked: isCompleted ? false : locked,
      lockReason: isCompleted ? 'Completed' : lockReason,
    };
  });
}

// Check if a category is complete
export function isCategoryComplete(
  category: ContractCategory,
  completedContractIds: string[]
): boolean {
  const contracts = getContractsByCategory(category);
  return contracts.every(c => completedContractIds.includes(c.id));
}

// Get category progress
export function getCategoryProgress(
  category: ContractCategory,
  completedContractIds: string[]
): { completed: number; total: number; percent: number } {
  const contracts = getContractsByCategory(category);
  const completed = contracts.filter(c => completedContractIds.includes(c.id)).length;
  return {
    completed,
    total: contracts.length,
    percent: Math.round((completed / contracts.length) * 100),
  };
}

// Re-export individual category arrays
export { EARNING_CONTRACTS, BUDGETING_CONTRACTS, SAVING_CONTRACTS, CREDIT_CONTRACTS, PLANNING_CONTRACTS };


import type { BriarbrookBuilding } from './types';

// Briarbrook Town Buildings
export const BRIARBROOK_BUILDINGS: BriarbrookBuilding[] = [
  {
    id: 'job-board',
    name: 'Job Board',
    npcName: 'Mira the Messenger',
    npcEmoji: '📬',
    category: 'earning',
    description: 'Find work and learn about earning income!',
    x: 180,
    y: 160,
    width: 100,
    height: 90,
    color: 0x10B981, // Emerald
    icon: '📋',
  },
  {
    id: 'market-row',
    name: 'Market Row',
    npcName: 'Tobin the Shopkeeper',
    npcEmoji: '🏪',
    category: 'budgeting',
    description: 'Learn to budget and spend wisely!',
    x: 500,
    y: 130,
    width: 110,
    height: 85,
    color: 0xF59E0B, // Amber
    icon: '🛒',
  },
  {
    id: 'town-vault',
    name: 'Town Vault',
    npcName: 'Vaultkeeper Orin',
    npcEmoji: '🏦',
    category: 'saving',
    description: 'Discover the power of saving!',
    x: 620,
    y: 320,
    width: 100,
    height: 100,
    color: 0x0EA5E9, // Sky
    icon: '🏦',
  },
  {
    id: 'merchant-deals',
    name: 'Merchant of Deals',
    npcName: 'Selene the Deal Maker',
    npcEmoji: '🌙',
    category: 'credit',
    description: 'Understand borrowing and credit!',
    x: 150,
    y: 380,
    width: 105,
    height: 95,
    color: 0xF43F5E, // Rose
    icon: '🌙',
  },
  {
    id: 'guild-hall',
    name: 'Guild Hall',
    npcName: 'Captain Rowan',
    npcEmoji: '🦅',
    category: 'planning',
    description: 'Plan your financial future!',
    x: 380,
    y: 430,
    width: 120,
    height: 100,
    color: 0x8B5CF6, // Violet
    icon: '🏛️',
  },
];

// Get building by ID
export function getBuildingById(id: string): BriarbrookBuilding | undefined {
  return BRIARBROOK_BUILDINGS.find(b => b.id === id);
}

// Get building by category
export function getBuildingByCategory(category: string): BriarbrookBuilding | undefined {
  return BRIARBROOK_BUILDINGS.find(b => b.category === category);
}

// Map dimensions for Briarbrook
export const BRIARBROOK_MAP_WIDTH = 800;
export const BRIARBROOK_MAP_HEIGHT = 600;

// Player settings
export const PLAYER_SPEED = 180;
export const PLAYER_SIZE = 28;
export const INTERACTION_RANGE = 80;


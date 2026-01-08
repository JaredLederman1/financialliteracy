import type { BriarbrookBuilding } from './types';

// Extended world dimensions for house + town layout
export const BRIARBROOK_MAP_WIDTH = 3200;
export const BRIARBROOK_MAP_HEIGHT = 1080;

// Player settings
export const PLAYER_SPEED = 350;
export const PLAYER_SIZE = 52;
export const INTERACTION_RANGE = 160;

// Ground level
export const GROUND_LEVEL = 680;

// Area definitions
export const AREAS = {
  HOME: { startX: 0, endX: 800 },
  PATH: { startX: 800, endX: 1400 },
  TOWN_SQUARE: { startX: 1400, endX: 3200 },
};

// Town square center point
export const TOWN_CENTER = { x: 2200, y: GROUND_LEVEL - 50 };

// Player's Home
export const PLAYER_HOME = {
  x: 350,
  y: GROUND_LEVEL - 80,
  width: 240,
  height: 280,
};

// Briarbrook Town Buildings - arranged around town square
export const BRIARBROOK_BUILDINGS: BriarbrookBuilding[] = [
  {
    id: 'job-board',
    name: 'Job Board',
    npcName: 'Mira the Messenger',
    npcEmoji: '📬',
    category: 'earning',
    description: 'Find work and learn about earning income!',
    x: TOWN_CENTER.x - 400,  // Left side of square
    y: GROUND_LEVEL - 60,
    width: 180,
    height: 220,
    color: 0x10B981,
    icon: '📋',
  },
  {
    id: 'market-row',
    name: 'Market Stall',
    npcName: 'Tobin the Shopkeeper',
    npcEmoji: '🏪',
    category: 'budgeting',
    description: 'Learn to budget and spend wisely!',
    x: TOWN_CENTER.x,  // Center back
    y: GROUND_LEVEL - 180,
    width: 260,
    height: 200,
    color: 0xF59E0B,
    icon: '🛒',
  },
  {
    id: 'town-vault',
    name: 'Town Vault',
    npcName: 'Vaultkeeper Orin',
    npcEmoji: '🏦',
    category: 'saving',
    description: 'Discover the power of saving!',
    x: TOWN_CENTER.x + 420,  // Right side of square
    y: GROUND_LEVEL - 80,
    width: 200,
    height: 260,
    color: 0x0EA5E9,
    icon: '🏦',
  },
  {
    id: 'guild-hall',
    name: 'Guild Hall',
    npcName: 'Captain Rowan',
    npcEmoji: '🦅',
    category: 'planning',
    description: 'Plan your financial future!',
    x: TOWN_CENTER.x + 750,  // Far right, grand building
    y: GROUND_LEVEL - 100,
    width: 280,
    height: 320,
    color: 0x8B5CF6,
    icon: '🏛️',
  },
];

export function getBuildingById(id: string): BriarbrookBuilding | undefined {
  return BRIARBROOK_BUILDINGS.find(b => b.id === id);
}

export function getBuildingByCategory(category: string): BriarbrookBuilding | undefined {
  return BRIARBROOK_BUILDINGS.find(b => b.category === category);
}

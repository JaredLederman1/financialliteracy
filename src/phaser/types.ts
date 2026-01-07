import type { Avatar } from '../onboarding/types';
import type { PlayerProfile } from '../game/types';
import type { BriarbrookPlayer } from '../game/briarbrook/types';

// ============================================
// PHASER GAME TYPES
// ============================================

export interface TownBuilding {
  id: string;
  questId: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: number; // Hex color for the building
  icon: string;
  unlocked: boolean;
}

export interface PlayerState {
  x: number;
  y: number;
  avatar: Avatar;
  name: string;
}

// Events from Phaser to React
export type PhaserToReactEvent =
  | { type: 'BUILDING_CLICKED'; buildingId: string; questId: string }
  | { type: 'BUILDING_INTERACT'; buildingId: string; questId: string }
  | { type: 'PLAYER_MOVED'; x: number; y: number }
  | { type: 'SCENE_READY' };

// Events from React to Phaser
export type ReactToPhaserEvent =
  | { type: 'UPDATE_UNLOCKED_QUESTS'; completedQuestIds: string[] }
  | { type: 'UPDATE_PLAYER_AVATAR'; avatar: Avatar }
  | { type: 'TELEPORT_PLAYER'; x: number; y: number }
  | { type: 'SCENE_READY' }
  | { type: 'PAUSE_MOVEMENT' }
  | { type: 'RESUME_MOVEMENT' };

// Game state shared between React and Phaser
export interface SharedGameState {
  player: PlayerProfile | BriarbrookPlayer | null;
  completedQuestIds: string[];
  avatar: Avatar | null;
}

// ============================================
// BUILDING DEFINITIONS (Legacy - kept for backward compatibility)
// ============================================

export const TOWN_BUILDINGS: Omit<TownBuilding, 'unlocked'>[] = [
  {
    id: 'home',
    questId: 'first-allowance',
    name: 'Home',
    x: 200,
    y: 150,
    width: 120,
    height: 100,
    color: 0x60A5FA, // Blue
    icon: '🏠',
  },
  {
    id: 'park',
    questId: 'hangout-invite',
    name: 'Park',
    x: 500,
    y: 120,
    width: 140,
    height: 90,
    color: 0x4ADE80, // Green
    icon: '🌳',
  },
  {
    id: 'repair-shop',
    questId: 'something-breaks',
    name: 'Repair Shop',
    x: 150,
    y: 350,
    width: 110,
    height: 100,
    color: 0xFB923C, // Orange
    icon: '🔧',
  },
  {
    id: 'neighbor',
    questId: 'side-gig',
    name: "Mr. Chen's",
    x: 550,
    y: 320,
    width: 100,
    height: 100,
    color: 0xA78BFA, // Purple
    icon: '👨',
  },
  {
    id: 'store',
    questId: 'saving-goal',
    name: 'Main Street',
    x: 350,
    y: 450,
    width: 130,
    height: 90,
    color: 0xF472B6, // Pink
    icon: '🏪',
  },
  {
    id: 'town-hall',
    questId: 'chapter-1-finale',
    name: 'Town Hall',
    x: 650,
    y: 480,
    width: 120,
    height: 110,
    color: 0x818CF8, // Indigo
    icon: '🏛️',
  },
];

// Map dimensions
export const MAP_WIDTH = 800;
export const MAP_HEIGHT = 600;

// Player settings
export const PLAYER_SPEED = 200;
export const PLAYER_SIZE = 32;

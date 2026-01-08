/**
 * Design Tokens for Briarbrook
 * 
 * Centralized styling for both Phaser and React components
 */

// Color palette
export const PALETTE = {
  // Sky colors
  sky: {
    light: '#E8F4F8',
    mid: '#C8E6EC',
    dark: '#88BBDD',
    horizon: '#FFF0E5',
  },
  
  // Primary teal
  teal: {
    light: '#6EE7B7',
    primary: '#06B6D4',
    dark: '#0E7490',
  },
  
  // Warm gold accent
  gold: {
    light: '#FEF3C7',
    primary: '#FCD34D',
    dark: '#D97706',
  },
  
  // Nature greens
  green: {
    light: '#8FBF7F',
    grass: '#7CB668',
    dark: '#4CAF50',
    forest: '#228B22',
  },
  
  // Slate text
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
  },
  
  // Accent colors
  violet: {
    light: '#C4B5FD',
    primary: '#8B5CF6',
    dark: '#7C3AED',
  },
  
  rose: {
    light: '#FECDD3',
    primary: '#F43F5E',
    dark: '#E11D48',
  },
  
  // Building colors
  wood: {
    light: '#DEB887',
    primary: '#8B6914',
    dark: '#6B4423',
  },
  
  stone: {
    light: '#D1D5DB',
    primary: '#9CA3AF',
    dark: '#6B7280',
  },
  
  // Skin tones
  skin: {
    light: '#FFDBAC',
    primary: '#FFDBBA',
    blush: '#FFB4B4',
  },
  
  // Common
  white: '#FFFFFF',
  black: '#000000',
} as const;

// Phaser-compatible hex colors
export const HEX = {
  skyLight: 0xE8F4F8,
  skyMid: 0xC8E6EC,
  skyDark: 0x88BBDD,
  
  grassMain: 0x7CB668,
  grassLight: 0x8CC678,
  grassDark: 0x6CA658,
  
  pathLight: 0xD4C4A8,
  pathDark: 0xC9B896,
  
  woodLight: 0xDEB887,
  woodPrimary: 0x8B6914,
  woodDark: 0x6B4423,
  
  stoneLight: 0xD1D5DB,
  stonePrimary: 0x9CA3AF,
  stoneDark: 0x6B7280,
  
  roofRed: 0xB45B3E,
  roofRedHighlight: 0xC96B4E,
  
  textDark: 0x1E293B,
  textMuted: 0x64748B,
  
  shadowDark: 0x000000,
} as const;

// Z-depth layers for Phaser
export const LAYERS = {
  background: -200,
  farMountains: -150,
  midHills: -100,
  clouds: -80,
  ground: -50,
  paths: -30,
  decorations: -10,
  buildings: 100,
  characters: 200,
  prompts: 300,
  ui: 500,
} as const;

// Border radii
export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// Shadows (for Phaser)
export const SHADOW = {
  subtle: { alpha: 0.08, blur: 10, offsetY: 4 },
  soft: { alpha: 0.12, blur: 15, offsetY: 6 },
  medium: { alpha: 0.18, blur: 20, offsetY: 8 },
} as const;

// Animation durations (ms)
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
} as const;

// Helper functions
export function lightenColor(hex: number, percent: number): number {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  
  const newR = Math.min(255, r + (255 - r) * percent);
  const newG = Math.min(255, g + (255 - g) * percent);
  const newB = Math.min(255, b + (255 - b) * percent);
  
  return (Math.floor(newR) << 16) | (Math.floor(newG) << 8) | Math.floor(newB);
}

export function darkenColor(hex: number, percent: number): number {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  
  const newR = Math.max(0, r * (1 - percent));
  const newG = Math.max(0, g * (1 - percent));
  const newB = Math.max(0, b * (1 - percent));
  
  return (Math.floor(newR) << 16) | (Math.floor(newG) << 8) | Math.floor(newB);
}

export function hexToRgbString(hex: number): string {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

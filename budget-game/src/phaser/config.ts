/**
 * Centralized Phaser Configuration
 * 
 * Fullscreen 4K-quality rendering with extended world
 */

import Phaser from 'phaser';

// Viewport dimensions (will scale to fit screen)
export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;

// Extended world for house + town layout
export const WORLD_WIDTH = 3200;
export const WORLD_HEIGHT = 1080;

/**
 * Create Phaser game configuration
 * Fullscreen with maximum quality
 */
export function createGameConfig(
  parent: HTMLElement,
  scenes: typeof Phaser.Scene[]
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.WEBGL,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#E8F4F8',
    
    // Maximum quality rendering
    pixelArt: false,
    antialias: true,
    roundPixels: true,
    
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    
    scene: scenes,
    
    // Fullscreen scaling - FIT to fill screen while maintaining aspect ratio
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    
    render: {
      antialias: true,
      antialiasGL: true,
      roundPixels: true,
      powerPreference: 'high-performance',
      batchSize: 4096,
    },
    
    input: {
      keyboard: true,
      mouse: true,
      touch: true,
    },
    
    audio: {
      disableWebAudio: true,
    },
  };
}

export default { createGameConfig, GAME_WIDTH, GAME_HEIGHT, WORLD_WIDTH, WORLD_HEIGHT };

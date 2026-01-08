import type { PhaserToReactEvent, ReactToPhaserEvent } from './types';

type PhaserEventCallback = (event: PhaserToReactEvent) => void;
type ReactEventCallback = (event: ReactToPhaserEvent) => void;

/**
 * Simple event bus for communication between React and Phaser
 * - Phaser emits events that React listens to
 * - React emits events that Phaser listens to
 */
class GameEventBus {
  private phaserListeners: PhaserEventCallback[] = [];
  private reactListeners: ReactEventCallback[] = [];

  // React subscribes to Phaser events
  onPhaserEvent(callback: PhaserEventCallback): () => void {
    this.phaserListeners.push(callback);
    return () => {
      this.phaserListeners = this.phaserListeners.filter(cb => cb !== callback);
    };
  }

  // Phaser subscribes to React events
  onReactEvent(callback: ReactEventCallback): () => void {
    this.reactListeners.push(callback);
    return () => {
      this.reactListeners = this.reactListeners.filter(cb => cb !== callback);
    };
  }

  // Phaser emits to React
  emitToReact(event: PhaserToReactEvent): void {
    this.phaserListeners.forEach(callback => callback(event));
  }

  // React emits to Phaser
  emitToPhaser(event: ReactToPhaserEvent): void {
    this.reactListeners.forEach(callback => callback(event));
  }

  // Clear all listeners (for cleanup)
  clear(): void {
    this.phaserListeners = [];
    this.reactListeners = [];
  }
}

// Singleton instance
export const gameEventBus = new GameEventBus();


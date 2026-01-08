// Seeded random number generator using mulberry32 algorithm
// This ensures deterministic randomness for debugging and replay

export function createRNG(seed: number): { next: () => number; state: number } {
  let state = seed;
  
  const next = (): number => {
    state |= 0;
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  
  return {
    next,
    get state() { return state; }
  };
}

// Get a random integer in range [min, max] inclusive
export function randomInt(rng: { next: () => number }, min: number, max: number): number {
  return Math.floor(rng.next() * (max - min + 1)) + min;
}

// Get a random element from an array
export function randomChoice<T>(rng: { next: () => number }, array: T[]): T {
  return array[Math.floor(rng.next() * array.length)];
}

// Weighted random selection
export function weightedChoice<T>(
  rng: { next: () => number },
  items: T[],
  weights: number[]
): T {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = rng.next() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  
  return items[items.length - 1];
}

// Generate a random seed from current time
export function generateSeed(): number {
  return Math.floor(Math.random() * 2147483647);
}


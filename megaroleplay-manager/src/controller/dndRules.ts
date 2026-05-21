// src/utils/dndRules.ts

export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

export const MIN_STAT = 8;
export const MAX_STAT = 15;
export const TOTAL_POINTS = 27;

export type StatName = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

export interface RawStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

// Calculate total cost of current stats
export function calculatePointsUsed(stats: RawStats): number {
  return Object.values(stats).reduce((total, score) => {
    return total + (POINT_BUY_COSTS[score] || 0);
  }, 0);
}

// Check if the current allocation is valid
export function isValidAllocation(stats: RawStats): boolean {
  const used = calculatePointsUsed(stats);
  // Must use exactly 27 points (or less if you want to allow saving points, but D&D usually requires using all)
  // Usually, you can't go over. Let's enforce <= 27 for flexibility, or == 27 for strictness.
  // Strict D&D: You must spend exactly 27.
  return used <= TOTAL_POINTS; 
}

// Helper to get cost of a specific stat
export function getStatCost(score: number): number {
  return POINT_BUY_COSTS[score] || 0;
}
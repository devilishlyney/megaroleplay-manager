export const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100] as const;

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollMultiple(sides: number, count: number): number[] {
  return Array.from({ length: count }, () => rollDie(sides));
}

export function rollTotal(sides: number, count: number): { rolls: number[]; total: number } {
  const rolls = rollMultiple(sides, count);
  return { rolls, total: rolls.reduce((sum, r) => sum + r, 0) };
}
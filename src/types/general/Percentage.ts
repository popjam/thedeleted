import { getRandomInt } from "isaacscript-common";

/** Number between 0 and 100. */
export type Percentage = number;

/** Type guard to check if a number is a Percentage. */
export function isPercentage(number: number): number is Percentage {
  return number <= 100 && number >= 0;
}

/** Errors if number is not a valid Percentage. */
export function createPercentage(number: number): Percentage {
  if (number > 100 || number < 0) {
    throw new Error("Percentage: Percentage outside of bounds (0-100).");
  }
  return number;
}

/**
 * Rolls a percentage chance that can either be true or false. 100% is always true and 0% is always
 * false. Precision up to 2 decimal point (e.g 0.01%).
 */
export function rollPercentage(
  percentageChance: Percentage,
  seed?: Seed,
): boolean {
  return getRandomInt(0, 9999, seed) * 0.01 < percentageChance;
}

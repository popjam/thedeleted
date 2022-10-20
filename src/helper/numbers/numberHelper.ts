import { getRandomInt } from "isaacscript-common";

/**
 * Rolls a percentage chance that can either be true or false. 100% is always true and 0% is always
 * false. Can be up to 2 decimal point (e.g 0.01%).
 */
export function rollPercentage(percentageChance: number): boolean {
  return getRandomInt(0, 9999) * 0.01 < percentageChance;
}

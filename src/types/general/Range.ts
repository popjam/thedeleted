import { getRandomInt } from "isaacscript-common";

/** Range between two numbers. Left number is minimum, right is maximum. */
export type Range = [number, number];

/** Get a random number in the range, inclusive on both ends. */
export function randomInRange(range: Range): number {
  return getRandomInt(range[0], range[1]);
}

/**
 * Modifies the range to make sure the right number is equal or higher to the left.
 *
 * @param minValue The minimum value (default 1).
 * @param notSame Ensures values are not same (default true) Increments right side if they are the
 *                same.
 */
export function validifyRange(
  range: Range,
  config: { minValue?: number; notSame?: boolean } = {},
): Range {
  config.minValue ??= 1;
  if (config.notSame === undefined) {
    config.notSame = true;
  }
  range[0] = range[0] >= config.minValue ? range[0] : config.minValue;
  range[1] = range[1] >= config.minValue ? range[1] : config.minValue;
  range = range[0] <= range[1] ? range : [range[1], range[0]];
  if (config.notSame) {
    if (range[0] === range[1]) {
      range[1]++;
    }
  }
  return range;
}

import { getRandomInt } from "isaacscript-common";

/** Range between two numbers. Left number is minimum, right is maximum. */
export type Range = [number, number];

/** Get a random number in the range, inclusive on both ends. */
export function randomInRange(range: Range): number {
  return getRandomInt(range[0], range[1]);
}

/**
 * Get a random number in the range, inclusive on both ends. If a number is inputted to the
 * function, it will be returned.
 */
export function randomInRangeOrNumber(rangeOrNumber: Range | number): number {
  if (typeof rangeOrNumber === "number") {
    return rangeOrNumber;
  }

  return randomInRange(rangeOrNumber);
}

/**
 * Modifies the range to make sure the right number is equal or higher to the left.
 *
 * @param range
 * @param config
 * @param minValue The minimum value (default 1).
 * @param notSame Ensures values are not same (default true) Increments right side if they are the
 *                same.
 * @param config.minValue
 * @param config.notSame
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

/** Returns the range as a string, ready to print. */
export function rangeToString(range: Range): string {
  return `${range[0]}-${range[1]}`;
}

/** If a Range is involved, returns a range, otherwise returns a number. */
export function multiplyRangesOrNumbers(
  numberOrRange1: number | Range,
  numberOrRange2: number | Range,
): number | Range {
  if (typeof numberOrRange1 === "number") {
    if (typeof numberOrRange2 === "number") {
      return numberOrRange1 * numberOrRange2;
    }
    return [
      numberOrRange2[0] * numberOrRange1,
      numberOrRange2[1] * numberOrRange1,
    ];
  }
  if (typeof numberOrRange2 === "number") {
    return [
      numberOrRange1[0] * numberOrRange2,
      numberOrRange1[1] * numberOrRange2,
    ];
  }
  return multiplyRanges(numberOrRange1, numberOrRange2);
}

/** Multiply two Ranges together, like a matrix. */
export function multiplyRanges(range1: Range, range2: Range): Range {
  return [range1[0] * range2[0], range1[1] * range2[1]];
}

/** Multiply a Range by a number, e.g [1,1] * 5 = [5,5]. */
export function multiplyRangeConstituents(
  range: Range,
  multiplier: number,
): Range {
  return [range[0] * multiplier, range[1] * multiplier];
}

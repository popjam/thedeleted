import { getRandomInt } from "isaacscript-common";

/** Range between two numbers. Left number is minimum, right is maximum. */
export type Range = [number, number];

/** Get a random number in the range, inclusive on both ends. */
export function randomInRange(range: Range): number {
  return getRandomInt(range[0], range[1]);
}

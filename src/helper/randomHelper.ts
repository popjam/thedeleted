import { getRandomInt } from "isaacscript-common";

export function randomDistribution(
  mean: number,
  standardDeviation: number,
  minValue: number,
  maxValue: number,
  ignorePercent: number,
): number {
  const ignoreProb = ignorePercent / 100;
  if (Math.random() < ignoreProb) {
    return Math.random() * (maxValue - minValue) + minValue;
  }
  let num: number;
  do {
    num =
      Math.random() * 2 - 1 + (Math.random() * 2 - 1) + (Math.random() * 2 - 1);
    num = num * standardDeviation + mean;
  } while (num < minValue || num > maxValue);
  return num;
}

export function randomLogDistribution(
  minValue: number,
  maxValue: number,
  skewness: number,
): number {
  const range = maxValue - minValue;
  const rand = Math.random();
  const logValue = skewness ** rand - 1;
  const value = (logValue / (skewness - 1)) * range + minValue;
  return Math.max(minValue, Math.min(maxValue, value));
}

/** Wrapper for getRandomInteger() to default seedOrRNG to undefined. */
export function getRandomInteger(
  min: int,
  max: int,
  seedOrRNG: Seed | RNG | undefined = undefined,
  exceptions?: int[] | readonly int[],
): int {
  return getRandomInt(min, max, seedOrRNG, exceptions);
}

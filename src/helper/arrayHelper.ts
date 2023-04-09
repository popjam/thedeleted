import { getRandomArrayIndex, getRandomSeed } from "isaacscript-common";

/**
 * Returns the element with the most frequent occurrence in the provided Array. If the array is
 * empty, returns undefined. If there are equal occurrences, returns the first found.
 *
 * @example [1, 2, 2, 3] => returns 2.
 */
export function getMostFrequentElementInArray<T>(arr: T[]): T | undefined {
  if (arr.length === 0) {
    return undefined;
  }
  const hashmap = arr.reduce<Record<string, number>>((acc, _val, index) => {
    const v = acc[index.toString()];
    if (v === undefined) {
      acc[index.toString()] = 0;
    } else {
      acc[index.toString()]++;
    }
    return acc;
  }, {});
  const mf = Object.keys(hashmap).reduce((a, b) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    hashmap[a]! > hashmap[b]! ? a : b,
  );
  return arr[+mf] as T;
}

/**
 * Checks if 'Value' of type 'T' is equal to or part of 'ArrayOfTOrT' depending on whether it is an
 * array or singular value.
 */
export function isInArrayOrEquals<T>(value: T, arrayOfTOrT: T | T[]): boolean {
  if (Array.isArray(arrayOfTOrT)) {
    return arrayOfTOrT.includes(value);
  }
  return value === arrayOfTOrT;
}

// eslint-disable-next-line isaacscript/complete-sentences-jsdoc
/**
 * Returns the index of the last element in the array where predicate is true, and -1 otherwise.
 *
 * @param array The source array to search in.
 * @param predicate find calls predicate once for each element of the array, in descending order,
 *                  until it finds one where predicate returns true. If such an element is found,
 *                  findLastIndex immediately returns that element index. Otherwise, findLastIndex
 *                  returns -1.
 */
export function findLastIndexOfArray<T>(
  array: T[],
  predicate: (value: T, index: number, obj: T[]) => boolean,
): number {
  let l = array.length;
  // eslint-disable-next-line isaacscript/no-unsafe-plusplus
  while (l-- !== 0) {
    const current = array[l];
    if (current === undefined) {
      return -1;
    }

    if (predicate(current, l, array)) {
      return l;
    }
  }
  return -1;
}

export function getRandomArrayElementFast<T>(
  array: T[] | readonly T[],
  seedOrRNG: Seed | RNG = getRandomSeed(),
): T {
  const randomIndex = getRandomArrayIndex(array, seedOrRNG);
  const randomElement = array[randomIndex];
  if (randomElement === undefined) {
    error(
      `Failed to get a random array element fast since the random index of ${randomIndex} was not valid.`,
    );
  }
  return randomElement;
}

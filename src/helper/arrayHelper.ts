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
  const hashmap = arr.reduce<Record<string, number>>((acc, val, index) => {
    const v = acc[index.toString()];
    if (v === undefined) {
      acc[index.toString()] = 0;
    } else {
      acc[index.toString()]++;
    }
    return acc;
  }, {});
  const mf = Object.keys(hashmap).reduce((a, b) =>
    hashmap[a]! > hashmap[b]! ? a : b,
  );
  return arr[+mf] as T;
}

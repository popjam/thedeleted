/**
 * Returns the value of the first element in the set where predicate is true, and undefined
 * otherwise.
 *
 * @param set The set to test.
 * @param predicate find calls predicate once for each element of the set, in insertion order, until
 *                  it finds one where predicate returns true. If such an element is found, find
 *                  immediately returns that element value. Otherwise, find returns undefined.
 * @returns The value of the first element in the set that satisfies the provided testing function.
 *          Otherwise, undefined is returned.
 */
export function findSet<T>(
  set: Set<T>,
  predicate: (value: T) => boolean,
): T | undefined {
  for (const value of set) {
    if (predicate(value)) {
      return value;
    }
  }
  return undefined;
}

/**
 * Returns a random element from the set that satisfies the provided testing function.
 *
 * @param set The set to get a random element from.
 * @param predicate The predicate to test the elements against.
 * @returns A random element from the set that satisfies the provided testing function.
 */
export function getRandomSetElementWithPredicate<T>(
  set: Set<T>,
  predicate: (value: T) => boolean,
): T {
  const filteredSet = new Set<T>();
  for (const value of set) {
    if (predicate(value)) {
      filteredSet.add(value);
    }
  }
  return getRandomSetElement(filteredSet);
}

/**
 * Returns a random element from the set.
 *
 * @param set The set to get a random element from.
 * @returns A random element from the set.
 */
export function getRandomSetElement<T>(set: Set<T>): T {
  const index = Math.floor(Math.random() * set.size);
  let i = 0;
  for (const value of set) {
    if (i === index) {
      return value;
    }
    i++;
  }
  error("Set is empty.");
}

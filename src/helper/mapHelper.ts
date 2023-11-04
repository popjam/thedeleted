/**
 * Returns true if at least one element in this map satisfies the provided testing function.
 *
 * @param map The map to test.
 * @param predicate find calls predicate once for each element of the map, in insertion order, until
 *                  it finds one where predicate returns true. If such an element is found, find
 *                  immediately returns true. Otherwise, find returns false.
 * @returns true if the callback function returns a truthy value for at least one element in the
 *          map. Otherwise, false.
 */
export function someMap(
  map: Map<unknown, unknown>,
  predicate: (
    value: unknown,
    key: unknown,
    map: Map<unknown, unknown>,
  ) => boolean,
): boolean {
  for (const [key, value] of map) {
    if (predicate(value, key, map)) {
      return true;
    }
  }
  return false;
}

/**
 * Returns the value of the first element in the map where predicate is true, and undefined
 * otherwise.
 *
 * @param map The map to test.
 * @param predicate find calls predicate once for each element of the map, in insertion order, until
 *                  it finds one where predicate returns true. If such an element is found, find
 *                  immediately returns that element value. Otherwise, find returns undefined.
 * @returns The value of the first element in the map that satisfies the provided testing function.
 *          Otherwise, undefined is returned.
 */
export function findMap<T>(
  map: Map<unknown, unknown>,
  predicate: (
    value: unknown,
    key: unknown,
    map: Map<unknown, unknown>,
  ) => boolean,
): T | undefined {
  for (const [key, value] of map) {
    if (predicate(value, key, map)) {
      return value as T;
    }
  }
  return undefined;
}

/** Returns a random map value. */
export function getRandomMapElement<T>(map: Map<unknown, unknown>): T {
  const index = Math.floor(Math.random() * map.size);
  return [...map.values()][index] as T;
}

/**
 * Returns a random element from the map that satisfies the provided testing function.
 *
 * @param map The map to get a random element from.
 * @param predicate The predicate to test the elements against.
 * @returns A random element from the map that satisfies the provided testing function.
 */
export function getRandomMapElementWithPredicate<T>(
  map: Map<unknown, unknown>,
  predicate: (
    value: unknown,
    key: unknown,
    map: Map<unknown, unknown>,
  ) => boolean,
): T {
  const filteredMap = new Map<unknown, unknown>();
  for (const [key, value] of map) {
    if (predicate(value, key, map)) {
      filteredMap.set(key, value);
    }
  }
  return getRandomMapElement(filteredMap);
}

/** Convert a map to string. */
export function mapToString(map: Map<unknown, unknown>): string {
  return [...map.entries()]
    .map(([key, value]) => `${key} => ${value}`)
    .join(", ");
}

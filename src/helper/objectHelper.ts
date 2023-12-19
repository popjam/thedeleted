import { getRandomArrayIndex } from "isaacscript-common";

/** Does the Object contain a certain value. */
export function objectContainsValue<T>(
  object: Record<string, T>,
  value: T,
): boolean {
  return Object.values(object).includes(value);
}

/** Returns an array of keys in an object, as type 'keyof <Object>'. */
export function getObjectKeys<T extends Record<string, unknown>>(
  obj: T,
): Array<keyof T> {
  return Object.keys(obj) as Array<keyof typeof obj>;
}

/** Returns an array of values in an Object. */
export function getObjectValues<T>(obj: Record<string, T>): T[] {
  const keys = getObjectKeys(obj);
  return keys.map((key) => obj[key]) as T[];
}

/**
 * Gets the object key as a string from its value. Only works if the values are unique, otherwise
 * returns the first match.
 */
export function getObjectKeyByValue<T>(
  obj: Record<string, T>,
  value: T,
): string | undefined {
  return Object.keys(obj).find((key) => obj[key] === value);
}

/**
 * Get a random string key from an Object.
 *
 * @param obj The object to get a random key from.
 * @param seedOrRNG The seed or RNG to use for the random number generator.
 * @returns A random string key from the object.
 *
 * If the object is empty, an error is thrown.
 */
export function getRandomObjectKey<T>(
  obj: Record<string, T>,
  seedOrRNG: Seed | RNG | undefined = undefined,
): string {
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    error(
      "Failed to get a random object key since the provided object is empty.",
    );
  }
  const randomIndex = getRandomArrayIndex(keys, seedOrRNG);
  const randomKey = keys[randomIndex];
  if (randomKey === undefined) {
    error(
      `Failed to get a random object key since the random index of ${randomIndex} was not valid.`,
    );
  }
  return randomKey;
}

/** Converts an object to a key:value printable string, taking into account objects in objects. */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function objectToString<T>(obj: any): string {
  if (typeof obj !== "object") {
    error(
      `ObjectHelper.objectToString() was passed a non-object, it was passed a ${typeof obj}`,
    );
  }
  const keys = Object.keys(obj as Record<string, T>);
  const values = Object.values(obj as Record<string, T>);
  let output = "";
  for (const [i, key] of keys.entries()) {
    const value = values[i];
    output +=
      typeof value === "object"
        ? `${key}: { ${objectToString(value)} }, `
        : `${key}: ${values[i]}, `;
  }
  return output;
}

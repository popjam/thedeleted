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

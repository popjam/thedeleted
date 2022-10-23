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

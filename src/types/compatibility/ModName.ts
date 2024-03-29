export type ModName = string & { __brand: "modname" };

/**
 * Creates a ModName object from the given name.
 *
 * @param name The name of the ModName.
 * @returns A ModName object.
 */
export function createModName(name: string): ModName {
  return name as ModName;
}

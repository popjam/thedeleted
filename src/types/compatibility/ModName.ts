export type ModID = string & { __brand: "modname" };

/**
 * Creates a ModID object from the given name.
 *
 * @param name The ID of the ModName. This will correspond to mod's ID in its metadata file.
 * @returns A ModID object.
 */
export function createModID(name: string): ModID {
  return name as ModID;
}

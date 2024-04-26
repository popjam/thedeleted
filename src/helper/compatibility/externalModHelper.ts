import { getModSet } from "../../features/data/gameSets/gameSets";
import type { ModName } from "../../types/compatibility/ModName";

/** Retrieve a list of all known active mods. */
export function getActiveMods(): readonly ModName[] {
  const modSet = getModSet();
  return [...modSet];
}

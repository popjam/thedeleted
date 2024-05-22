import { getModSet } from "../../features/data/gameSets/gameSets";
import type { ModID } from "../../types/compatibility/ModName";

/** Retrieve a list of all known active mods. */
export function getActiveMods(): readonly ModID[] {
  const modSet = getModSet();
  return [...modSet];
}

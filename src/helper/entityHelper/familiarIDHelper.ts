import type { EntityID } from "isaacscript-common";
import { EntityCategory } from "../../enums/general/EntityCategory";
import { getNonModdedEntityIDSetFromCategory } from "../../features/data/gameSets/gameEntitySets";
import type { FamiliarID } from "../../enums/data/ID/FamiliarID";
import { getNameSubTypeFromModdedEntityID } from "../../maps/data/moddedEntityIDToNameSubType";
import { getModdedEntityNameAndSubTypeFromNameSubType } from "./entityIDHelper";

/**
 * Determines if a EntityID that refers to a familiar is modded by checking it against the set of
 * all non-modded FamiliarIDs.
 */
export function isFamiliarIDModded(familiarID: FamiliarID): boolean {
  const nonModdedFamiliarSet = getNonModdedEntityIDSetFromCategory(
    EntityCategory.FAMILIAR,
  );
  return !nonModdedFamiliarSet.has(familiarID as EntityID);
}

/**
 * Get the name of a FamiliarID. If it is modded, and the mod is not tracked, this will return
 * undefined. For modded familiars, this is the same as its 'name' xml attribute.
 */
export function getFamiliarIDName(familiarID: FamiliarID): string | undefined {
  const modded = isFamiliarIDModded(familiarID);
  if (!modded) {
    return undefined;
  }

  const nameSubType = getNameSubTypeFromModdedEntityID(familiarID as EntityID);
  if (nameSubType === undefined) {
    return undefined;
  }

  return getModdedEntityNameAndSubTypeFromNameSubType(nameSubType).name;
}

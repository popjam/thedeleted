import type { EntityID } from "isaacscript-common";
import { getConstituentsFromEntityID, getSlotName } from "isaacscript-common";
import { EntityCategory } from "../../enums/general/EntityCategory";
import { getNonModdedEntityIDSetFromCategory } from "../../features/data/gameSets/gameEntitySets";
import { getNameSubTypeFromModdedEntityID } from "../../maps/data/moddedEntityIDToNameSubType";
import { getModdedEntityNameAndSubTypeFromNameSubType } from "./entityIDHelper";
import { tearVariantToString } from "../../maps/data/name/tearVariantNameMap";

/**
 * Determines if a EntityID that refers to a tear is modded by checking it against the set of all
 * non-modded tears.
 */
export function isTearIDModded(entityID: EntityID): boolean {
  const nonModdedSlotSet = getNonModdedEntityIDSetFromCategory(
    EntityCategory.TEAR,
  );
  return !nonModdedSlotSet.has(entityID);
}

/**
 * Get the name of a Tear from its EntityID. If it is modded, and the mod is not tracked, this will
 * return undefined. For modded tears, this is the same as its 'name' xml attribute.
 *
 * @example EntityID.TEAR_BLOOD -> "Blood"
 */
export function getTearIDName(entityID: EntityID): string | undefined {
  const modded = isTearIDModded(entityID);
  if (!modded) {
    const constituents = getConstituentsFromEntityID(entityID);
    const variant = constituents[1];
    return tearVariantToString(variant);
  }

  const nameSubType = getNameSubTypeFromModdedEntityID(entityID);
  if (nameSubType === undefined) {
    return undefined;
  }

  return getModdedEntityNameAndSubTypeFromNameSubType(nameSubType).name;
}

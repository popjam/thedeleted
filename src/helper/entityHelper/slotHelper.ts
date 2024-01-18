import { getConstituentsFromEntityID, getSlotName } from "isaacscript-common";
import type { EntityID } from "isaacscript-common";
import { EntityCategory } from "../../enums/general/EntityCategory";
import { getNonModdedEntityIDSetFromCategory } from "../../features/data/gameSets/gameEntitySets";
import { getNameSubTypeFromModdedEntityID } from "../../maps/data/moddedEntityIDToNameSubType";
import { getModdedEntityNameAndSubTypeFromNameSubType } from "./entityIDHelper";

/**
 * Determines if a EntityID that refers to a slot is modded by checking it against the set of all
 * non-modded slots.
 */
export function isSlotIDModded(entityID: EntityID): boolean {
  const nonModdedSlotSet = getNonModdedEntityIDSetFromCategory(
    EntityCategory.SLOT,
  );
  return !nonModdedSlotSet.has(entityID);
}

/**
 * Get the name of a Slot from its EntityID. If it is modded, and the mod is not tracked, this will
 * return undefined. For modded slots, this is the same as its 'name' xml attribute.
 */
export function getSlotIDName(entityID: EntityID): string | undefined {
  const modded = isSlotIDModded(entityID);
  if (!modded) {
    const constituents = getConstituentsFromEntityID(entityID);
    const variant = constituents[1];
    return getSlotName(variant);
  }

  const nameSubType = getNameSubTypeFromModdedEntityID(entityID);
  if (nameSubType === undefined) {
    return undefined;
  }

  return getModdedEntityNameAndSubTypeFromNameSubType(nameSubType).name;
}

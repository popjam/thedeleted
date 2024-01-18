import { getConstituentsFromEntityID } from "isaacscript-common";
import type { EntityID } from "isaacscript-common";
import { EntityCategory } from "../../enums/general/EntityCategory";
import { getNonModdedEntityIDSetFromCategory } from "../../features/data/gameSets/gameEntitySets";
import { getNameSubTypeFromModdedEntityID } from "../../maps/data/moddedEntityIDToNameSubType";
import { getModdedEntityNameAndSubTypeFromNameSubType } from "./entityIDHelper";
import { getNonModdedBombEntityName } from "../../maps/data/name/bombEntityNameMap";

/**
 * Determines if a EntityID that refers to a live bomb is modded by checking it against the set of
 * all non-modded bombs.
 */
export function isBombEntityModded(entityID: EntityID): boolean {
  const nonModdedSlotSet = getNonModdedEntityIDSetFromCategory(
    EntityCategory.BOMB,
  );
  return !nonModdedSlotSet.has(entityID);
}

/**
 * Get the name of a Bomb from its EntityID. If it is modded, and the mod is not tracked, this will
 * return undefined. For modded bombs, this is the same as its 'name' xml attribute.
 */
export function getBombEntityIDName(entityID: EntityID): string | undefined {
  const modded = isBombEntityModded(entityID);
  if (!modded) {
    const constituents = getConstituentsFromEntityID(entityID);
    const variant = constituents[1];
    return getNonModdedBombEntityName(variant);
  }

  const nameSubType = getNameSubTypeFromModdedEntityID(entityID);
  if (nameSubType === undefined) {
    return undefined;
  }

  return getModdedEntityNameAndSubTypeFromNameSubType(nameSubType).name;
}

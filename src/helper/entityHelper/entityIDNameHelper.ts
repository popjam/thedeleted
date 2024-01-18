import type { EntityID } from "isaacscript-common";
import { getModdedEntityIDSet } from "../../features/data/gameSets/gameEntitySets";
import { getNameSubTypeFromModdedEntityID } from "../../maps/data/moddedEntityIDToNameSubType";
import {
  getEntityCategoryFromEntityID,
  getModdedEntityNameAndSubTypeFromNameSubType,
} from "./entityIDHelper";
import { EntityCategory } from "../../enums/general/EntityCategory";
import { getBombEntityIDName } from "./bombEntityHelper";
import { getEffectIDName } from "./effectIDHelper";
import type { EffectID } from "../../enums/data/ID/EffectID";
import { getPickupIDName } from "./pickupIDHelper";
import type { PickupID } from "../../enums/data/ID/PickupID";
import { getNPCIDName } from "./npcIDHelper";
import type { NPCID } from "isaac-typescript-definitions";
import { getSlotIDName } from "./slotHelper";
import { getFamiliarIDName } from "./familiarIDHelper";
import type { FamiliarID } from "../../enums/data/ID/FamiliarID";

/**
 * Get a modded entities' name from their EntityID. This is equivalent to their 'name' XML attribute
 * in the entities2.xml file. If the mod is not tracked, this will return undefined.
 */
export function getModdedEntityNameFromEntityID(
  entityID: EntityID,
): string | undefined {
  const nameSubType = getNameSubTypeFromModdedEntityID(entityID);
  if (nameSubType === undefined) {
    return undefined;
  }
  return getModdedEntityNameAndSubTypeFromNameSubType(nameSubType).name;
}

/**
 * Find the EntityID from the modded entities' name (equal to the 'name' XML attribute in
 * entities2.xml). Warning: Slow!
 */
export function getModdedEntityIDFromName(name: string): EntityID | undefined {
  // Loop through all modded entities in the 'moddedEntityIDToNameSubTypeMap' map and find the
  // matching name.
  const moddedEntities = getModdedEntityIDSet();
  for (const entityID of moddedEntities) {
    const entityName = getModdedEntityNameFromEntityID(entityID);
    if (entityName === undefined) {
      continue;
    }
    if (entityName === name) {
      return entityID;
    }
  }

  return undefined;
}

export function getEntityIDName(entityID: EntityID): string | undefined {
  const entityCategory = getEntityCategoryFromEntityID(entityID);
  switch (entityCategory) {
    case EntityCategory.BOMB: {
      return getBombEntityIDName(entityID);
    }

    case EntityCategory.EFFECT: {
      return getEffectIDName(entityID as EffectID);
    }

    case EntityCategory.PICKUP: {
      return getPickupIDName(entityID as PickupID);
    }

    case EntityCategory.NPC: {
      return getNPCIDName(entityID as NPCID);
    }

    case EntityCategory.SLOT: {
      return getSlotIDName(entityID);
    }

    case EntityCategory.FAMILIAR: {
      return getFamiliarIDName(entityID as FamiliarID);
    }

    // eslint-disable-next-line isaacscript/require-break
    default: {
      error(`Unimplemented entity category: ${entityCategory}`);
    }
  }
}

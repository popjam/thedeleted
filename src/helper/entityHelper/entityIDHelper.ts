import {
  getEntityIDFromConstituents,
  getEnumKeys,
  getEnumValues,
} from "isaacscript-common";
import type { EntityID } from "isaacscript-common";
import { spawnEntityByName } from "../../classes/facets/SpawnEntityByNameFacet";
import { EntityFlag, NPCID } from "isaac-typescript-definitions";
import {
  getModdedNPCIDSet,
  getNPCIDSet,
  getNonModdedNPCIDSet,
} from "../../sets/data/npc/NPCIDSets";
import { getActiveMods } from "../compatibility/externalModHelper";
import { getNPCIDNameSubTypesForMod } from "../../maps/data/npc/modded/ModToNameSubTypeMap";
import { fprint } from "../printHelper";

/** Determine if a string is in the format of an EntityID (e.g '123.0.0'). */
export function isEntityID(entityID: string): entityID is EntityID {
  const [type, variant, subType] = entityID.split(".");
  return (
    type !== undefined &&
    variant !== undefined &&
    subType !== undefined &&
    !Number.isNaN(Number(type)) &&
    !Number.isNaN(Number(variant)) &&
    !Number.isNaN(Number(subType))
  );
}

/** Get an EntityID from an Entity. */
export function getEntityIDFromEntity(entity: Entity): EntityID {
  return getEntityIDFromConstituents(
    entity.Type,
    entity.Variant,
    entity.SubType,
  );
}

/** Get an EntityID from an Entity's name. This is done by temporarily spawning the NPC */
export function getEntityIDFromName(entityName: string): EntityID | undefined {
  const entity = spawnEntityByName(entityName);
  if (entity === undefined) {
    return undefined;
  }

  entity.ClearEntityFlags(EntityFlag.APPEAR);
  entity.Visible = false;

  const entityID = getEntityIDFromEntity(entity);
  entity.Remove();

  return entityID;
}

/** Some values in various modded ID enums will be 'names' instead of standard EntityIDs. */
export function assertEntityID(
  entityID: string | EntityID,
): entityID is EntityID {
  if (!isEntityID(entityID)) {
    const entityIDFromName = getEntityIDFromName(entityID);
    if (entityIDFromName !== undefined) {
      return true;
    }
    return false;
  }
  return true;
}

/**
 * Get the modded Entity's name and subType from its Name + SubType string (e.g "0.HoneyFox") would
 * return [0, "HoneyFox"].
 */
export function getModdedEntityNameAndSubTypeFromNameSubType(
  nameSubType: string,
): [number, string] {
  // We can't use 'split' as names may contain '.'.
  const subTypeIndex = nameSubType.indexOf(".");
  if (subTypeIndex === -1) {
    error(`Invalid nameSubType: ${nameSubType}`);
  }
  const subType = nameSubType.slice(0, subTypeIndex);
  const name = nameSubType.slice(subTypeIndex + 1);
  return [Number(subType), name];
}

/**
 * Get an EntityID from a NameSubType string. If the game cannot find the entity name and hence its
 * type or variant, this will return undefined.
 */
export function getEntityIDFromNameSubType(
  nameSubType: string,
): EntityID | undefined {
  const [subType, name] =
    getModdedEntityNameAndSubTypeFromNameSubType(nameSubType);
  const type = Isaac.GetEntityTypeByName(name);
  const variant = Isaac.GetEntityVariantByName(name);
  if ((type as number) === -1 || variant === -1) {
    fprint(`Invalid nameSubType: ${nameSubType}`);
    return undefined;
  }
  return getEntityIDFromConstituents(type, variant, subType);
}

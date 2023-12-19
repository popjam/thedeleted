import {
  getEntityIDFromConstituents,
  getEnumKeys,
  getEnumValues,
  isNPC,
} from "isaacscript-common";
import type { EntityID } from "isaacscript-common";
import { spawnEntityByName } from "../../classes/facets/SpawnEntityByNameFacet";
import type { EntityType } from "isaac-typescript-definitions";
import { EntityFlag, NPCID } from "isaac-typescript-definitions";
import { fprint } from "../printHelper";
import type { NameSubType } from "../../types/data/nameSubType";
import { EntityCategory } from "../../enums/general/EntityCategory";

/** Determine if a variable is an EntityID (e.g '123.0.0'). */
export function isEntityID(variable: unknown): variable is EntityID {
  if (typeof variable !== "string") {
    return false;
  }
  const [type, variant, subType] = variable.split(".");
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

/**
 * Get an EntityID from an Entity's name. This is done by temporarily spawning the NPC. Warning,
 * slow!
 */
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

/** Get a set of EntityID's from the base game that match the provided EntityCategory. */
export function getBaseEntityIDSetFromCategory(
  category: EntityCategory,
): Set<EntityID> {
  switch (category) {
    case EntityCategory.NPC: {
      return new Set(getEnumValues(NPCID)) as Set<EntityID>;
    }

    default: {
      fprint(`Invalid category: ${category}, not yet implemented.`);
      return new Set<EntityID>();
    }
  }
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
 * return { subType: 0, name: "HoneyFox" }.
 */
export function getModdedEntityNameAndSubTypeFromNameSubType(
  nameSubType: NameSubType,
): { name: string; subType: number } {
  // We can't use 'split' as names may contain '.'.
  const subTypeIndex = nameSubType.indexOf(".");
  if (subTypeIndex === -1) {
    error(`Invalid nameSubType: ${nameSubType}`);
  }
  const subType = nameSubType.slice(0, subTypeIndex);
  const name = nameSubType.slice(subTypeIndex + 1);
  return { name, subType: Number(subType) };
}

/**
 * Get an EntityID from a NameSubType string. If the game cannot find the entity name and hence its
 * type or variant, this will return undefined.
 */
export function getEntityIDFromNameSubType(
  nameSubType: NameSubType,
): EntityID | undefined {
  const nameAndSubType =
    getModdedEntityNameAndSubTypeFromNameSubType(nameSubType);
  const { name, subType } = nameAndSubType;
  const type = Isaac.GetEntityTypeByName(name);
  const variant = Isaac.GetEntityVariantByName(name);
  if ((type as number) === -1 || variant === -1) {
    fprint(`Invalid nameSubType: ${nameSubType}`);
    return undefined;
  }
  return getEntityIDFromConstituents(type, variant, subType);
}

/**
 * Determine an Entity's EntityCategory from its EntityID or EntityType.
 *
 * @param entityIDOrEntityType The EntityID or EntityType to determine the EntityCategory from.
 * @returns The EntityCategory of the EntityID or EntityType.
 */
export function getEntityCategoryFromEntityID(
  entityIDOrEntityType: EntityID | EntityType,
): EntityCategory {
  const typeNumber = isEntityID(entityIDOrEntityType)
    ? Number(entityIDOrEntityType.split(".")[0])
    : entityIDOrEntityType;
  if (typeNumber === 0) {
    error(
      `getEntityCategoryFromEntityID: Invalid entityID ${entityIDOrEntityType}`,
    );
  }
  if (typeNumber === 1) {
    return EntityCategory.PLAYER;
  }
  if (typeNumber === 2) {
    return EntityCategory.TEAR;
  }
  if (typeNumber === 3) {
    return EntityCategory.FAMILIAR;
  }
  if (typeNumber === 4) {
    return EntityCategory.BOMB;
  }
  if (typeNumber === 5) {
    return EntityCategory.PICKUP;
  }
  if (typeNumber === 6) {
    return EntityCategory.SLOT;
  }
  if (typeNumber === 7) {
    return EntityCategory.LASER;
  }
  if (typeNumber === 8) {
    return EntityCategory.KNIFE;
  }
  if (typeNumber === 9) {
    return EntityCategory.PROJECTILE;
  }
  if (typeNumber >= 1000) {
    return EntityCategory.EFFECT;
  }

  return EntityCategory.NPC;
}

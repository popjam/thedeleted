import {
  getConstituentsFromEntityID,
  getEntities,
  getEntityIDFromConstituents,
  getRandomSetElement,
} from "isaacscript-common";
import type { EntityID } from "isaacscript-common";
import type { EntityType } from "isaac-typescript-definitions";
import { EntityCategory } from "../../enums/general/EntityCategory";
import {
  getEntityIDSetFromCategory,
  getModdedEntityIDSetFromCategory,
  getNonModdedEntityIDSetFromCategory,
} from "../../features/data/gameSets/gameSets";
import type { ModName } from "../../types/compatibility/ModName";

/** Determine if a variable is an EntityID (e.g '123.0.0'). */
export function isEntityID(variable: unknown): variable is EntityID {
  if (typeof variable !== "string") {
    return false;
  }
  const constituents = variable.split(".");
  if (constituents.length !== 3) {
    return false;
  }
  const [type, variant, subType] = constituents;
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

/**
 * Helper function to get all of the entities in the room or all of the entities that match a
 * specific EntityID.
 *
 * Due to bugs with Isaac.FindInRadius, this function uses Isaac.GetRoomEntities, which is more
 * expensive but also more robust. (If a matching entity type is provided, then Isaac.FindByType
 * will be used instead.)
 *
 * @param entityID The EntityID to match. If a constituent is -1, will match all entities of that
 *                 type.
 * @param ignoreFriendly Whether to ignore friendly entities (default is false).
 */
export function getEntitiesFromEntityID(
  entityID: EntityID,
  ignoreFriendly = false,
): readonly Entity[] {
  const constituents = getConstituentsFromEntityID(entityID);
  return getEntities(
    constituents[0],
    constituents[1],
    constituents[2],
    ignoreFriendly,
  );
}

/**
 * Returns the EntityConfigEntity from the provided EntityID.
 *
 * If a non-existent variant/subtype is requested, the base version of that entity is returned
 * instead.
 *
 * Returns undefined if there is no entity from the provided EntityType.
 *
 * @param entityID The EntityID to get the EntityConfigEntity from.
 * @returns The EntityConfigEntity from the provided EntityID.
 */
export function getEntityConfigFromEntityID(
  entityID: EntityID,
): EntityConfigEntity | undefined {
  const constituents = getConstituentsFromEntityID(entityID);
  return EntityConfig.GetEntity(
    constituents[0],
    constituents[1],
    constituents[2],
  );
}

/**
 * Retrieves the entity name from the given entity ID.
 *
 * @param entityID The entity ID to retrieve the name from.
 * @returns The entity name if found, otherwise undefined.
 *
 * Note: This may need modification for Collectibles/Trinkets as they are not found in
 * entities2.xml.
 */
export function getEntityNameFromEntityID(
  entityID: EntityID,
): string | undefined {
  const config = getEntityConfigFromEntityID(entityID);
  if (config === undefined) {
    return undefined;
  }

  const name = config.GetName();

  // Remove the hashtag character from the string.
  const formattedName = name
    .replace("#", "")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return formattedName;
}

/**
 * Retrieves the size of an entity based on its entity ID.
 *
 * @param entityID The entity ID to retrieve the size for.
 * @returns The size of the entity, or undefined if the entity ID is invalid.
 */
export function getEntitySizeFromEntityID(entityID: EntityID): int | undefined {
  const config = getEntityConfigFromEntityID(entityID);
  if (config === undefined) {
    return undefined;
  }

  return config.GetCollisionRadius();
}

/**
 * Retrieves the base HP (Hit Points) of an entity based on its entity ID.
 *
 * @param entityID The ID of the entity.
 * @returns The base HP of the entity, or undefined if the entity ID is invalid.
 */
export function getEntityBaseHPFromEntityID(
  entityID: EntityID,
): number | undefined {
  const config = getEntityConfigFromEntityID(entityID);
  if (config === undefined) {
    return undefined;
  }

  return config.GetBaseHP();
}

/**
 * Generates a random EntityID from the specified category.
 *
 * @param category The category of the entity.
 * @param modded Optional. Specifies whether to get modded or non-modded entities. Defaults to
 *               undefined (both modded and non-modded entities).
 * @param seedOrRNG Optional. The seed or RNG (Random Number Generator) to use for randomness.
 *                  Defaults to undefined.
 * @returns A random EntityID from the specified category, or undefined if no entities are
 *          available.
 */
export function getRandomEntityIDFromCategory(
  category: EntityCategory,
  modded?: boolean,
  seedOrRNG?: Seed | RNG,
): EntityID | undefined {
  let entities: ReadonlySet<EntityID> | undefined;
  if (modded === undefined) {
    entities = getEntityIDSetFromCategory(category);
  } else {
    entities = modded
      ? getModdedEntityIDSetFromCategory(category)
      : getNonModdedEntityIDSetFromCategory(category);
  }

  if (entities.size === 0) {
    return undefined;
  }

  return getRandomSetElement(entities, seedOrRNG);
}

/**
 * Retrieves the mod name from the given entity ID.
 *
 * @param entityID The entity ID to retrieve the mod name from.
 * @returns The mod name associated with the entity ID, or undefined if not found.
 */
export function getModNameFromEntityID(
  entityID: EntityID,
): ModName | undefined {
  const [entityType, variant, subType] = getConstituentsFromEntityID(entityID);
  const entityConfigEntry = EntityConfig.GetEntity(
    entityType,
    variant,
    subType,
  );
  return entityConfigEntry?.GetModName() as ModName | undefined;
}

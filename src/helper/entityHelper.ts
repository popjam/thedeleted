import type { PickupVariant, EntityType } from "isaac-typescript-definitions";
import { EntityFlag } from "isaac-typescript-definitions";
import {
  getBombs,
  getEffects,
  getEntities,
  getFamiliars,
  getKnives,
  getLasers,
  getNPCs,
  getPickups,
  getPlayers,
  getProjectiles,
  getRandom,
  getRandomVector,
  getSlots,
  getTears,
  isSlot,
  spawn,
  spawnPickup,
} from "isaacscript-common";
import { mod } from "../mod";
import { EntityCategory } from "../enums/general/EntityCategory";
import { isLeavingGame } from "../features/general/isLeavingGame";

/** Retrieves the distance between two known entities. */
export function getDistanceBetweenEntities(
  entity1: Entity,
  entity2: Entity,
): number {
  return entity1.Position.Distance(entity2.Position);
}

/**
 * Get a random position within a circle.
 *
 * @param centerPos The center of the circle.
 * @param radius The radius of the circle.
 * @param excludeRadius Will add an area to the radius where the chosen position can not be. This
 *                      area originates from the origin point and increases the radius of the
 *                      circle.
 */
export function getRandomPositionInRadius(
  centerPos: Vector,
  radius: number,
  excludeRadius = 0,
): Vector {
  const displacement = getRandomVector(undefined)
    .Normalized()
    .mul(getRandom(undefined) * radius + excludeRadius);
  return centerPos.add(displacement);
}

/**
 * Spawn a pickup by spawning it in a radius around a position and 'throwing' it at the position.
 */
export function spawnPickupThrowToPos(
  variant: PickupVariant,
  subType: number,
  pos: Vector,
  radius = 100,
  speed = 4,
): EntityPickup {
  const spawnPos = getRandomVector(undefined).Normalized().mul(radius).add(pos);
  const displacement = pos.sub(spawnPos);
  const distance = spawnPos.Distance(pos);
  const time = distance / speed;
  const velocity = displacement.div(time);
  return spawnPickup(variant, subType, spawnPos, velocity);
}

/**
 * Spawn a pickup by spawning it in a radius around an entity and 'throwing' it at the entity,
 * taking into account the entities own velocity.
 */
export function spawnPickupThrowToEntity(
  variant: PickupVariant,
  subType: number,
  entity: Entity,
  radius = 100,
  speed = 4,
): EntityPickup {
  const pos = entity.Position;
  const spawnPos = getRandomVector(undefined).Normalized().mul(radius).add(pos);
  const displacement = pos.sub(spawnPos);
  const distance = spawnPos.Distance(pos);
  const time = distance / speed;
  const velocity = displacement.div(time).add(entity.Velocity);
  return spawnPickup(variant, subType, spawnPos, velocity);
}

/**
 * Spawn a pickup by 'throwing' it from a position. Note: Some pickups such as chests behave
 * differently to being thrown.
 */
export function spawnPickupThrowFromPos(
  variant: PickupVariant,
  subType: number,
  centerPos: Vector,
  maxSpeed = 15,
  minSpeed = 2,
): EntityPickup {
  const throwVector = getRandomVector(undefined)
    .Normalized()
    .mul(getRandom(undefined) * (maxSpeed - minSpeed) + minSpeed);
  const pickup = spawnPickup(variant, subType, centerPos, throwVector);
  return pickup;
}

/**
 * Spawn a pickup by 'throwing' it from a position. Note: Some pickups such as chests behave
 * differently to being thrown.
 */
export function spawnPickupThrowFromEntity(
  variant: PickupVariant,
  subType: number,
  entity: Entity,
  maxSpeed = 15,
  minSpeed = 2,
): EntityPickup {
  const centerPos = entity.Position;
  const throwVector = getRandomVector(undefined)
    .Normalized()
    .mul(getRandom(undefined) * (maxSpeed - minSpeed) + minSpeed);
  const pickup = spawnPickup(
    variant,
    subType,
    centerPos,
    throwVector.add(entity.Velocity),
  );
  return pickup;
}

/**
 * Spawns an Entity which is invisible. Note: This will not mute sounds, make it friendly or make it
 * be invisible upon exiting / entering game / room.
 */
export function spawnInvisibleEntity(
  entityType: EntityType,
  variant: number,
  subType: number,
  position: Vector,
  velocity?: Vector | undefined,
  spawner?: Entity | undefined,
): Entity {
  const entity = spawn(
    entityType,
    variant,
    subType,
    position,
    velocity,
    spawner,
  );
  entity.ClearEntityFlags(EntityFlag.APPEAR);
  entity.Visible = false;
  mod.runInNGameFrames(() => {
    entity.Visible = false;
  }, 5);
  return entity;
}

/**
 * Makes an entity invisible. Note that this will not mute sounds or make them friendly / invisible
 * upon exiting / entering game / room.
 */
export function makeEntityInvisible(entity: Entity): Entity {
  entity.ClearEntityFlags(EntityFlag.APPEAR);
  entity.Visible = false;
  return entity;
}

/** Return an Entity to visible after makeEntityInvisible(). */
export function makeEntityVisible(entity: Entity): Entity {
  entity.Visible = true;
  return entity;
}

/**
 * Retrieves the closest pickup to a reference position. If there are no pickups in the room,
 * returns undefined.
 */
export function getClosestPickupTo(
  referencePosition: Vector,
): EntityPickup | undefined {
  let closestPickup: undefined | EntityPickup;
  let closestDistance = 10_000;
  const pickupsInRoom = getPickups();
  // eslint-disable-next-line unicorn/no-array-for-each
  pickupsInRoom.forEach((pickup: EntityPickup) => {
    const pickupDistance = pickup.Position.Distance(referencePosition);
    if (pickupDistance < closestDistance) {
      closestPickup = pickup;
      closestDistance = pickupDistance;
    }
  });
  return closestPickup;
}

/**
 * Determine which EntityCategory a non-Grid Entity belongs to using the Entity class. Note: you
 * probably want to use 'getEntityCategoryFromEntityID' instead, as it should be faster.
 *
 * @returns EntityCategory or undefined (as the entity can somehow be undefined).
 */
export function getEntityCategory(entity: Entity): EntityCategory | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (entity === undefined) {
    return undefined;
  }

  if (isSlot(entity)) {
    return EntityCategory.SLOT;
  }

  if (entity.ToBomb() !== undefined) {
    return EntityCategory.BOMB;
  }

  if (entity.ToKnife() !== undefined) {
    return EntityCategory.KNIFE;
  }

  if (entity.ToLaser() !== undefined) {
    return EntityCategory.LASER;
  }

  if (entity.ToNPC() !== undefined) {
    return EntityCategory.NPC;
  }

  if (entity.ToProjectile() !== undefined) {
    return EntityCategory.PROJECTILE;
  }

  if (entity.ToPlayer() !== undefined) {
    return EntityCategory.PLAYER;
  }

  if (entity.ToEffect() !== undefined) {
    return EntityCategory.EFFECT;
  }

  if (entity.ToTear() !== undefined) {
    return EntityCategory.TEAR;
  }

  if (entity.ToPickup() !== undefined) {
    return EntityCategory.PICKUP;
  }

  if (entity.ToFamiliar() !== undefined) {
    return EntityCategory.FAMILIAR;
  }

  return undefined;
}

/**
 * Returns an array of all entities in the room that match the specified EntityCategory. If there
 * are no entities in the room, returns an empty array.
 *
 * @param category The EntityCategory to search for.
 * @param ignoreFriendly If true, will ignore friendly NPCs if the EntityCategory is
 *                       EntityCategory.NPC. Defaults to false.
 */
export function getAllEntitiesWithCategory(
  category: EntityCategory,
  ignoreFriendly?: boolean,
): readonly Entity[] {
  switch (category) {
    case EntityCategory.BOMB: {
      return getBombs();
    }

    case EntityCategory.EFFECT: {
      return getEffects();
    }

    case EntityCategory.FAMILIAR: {
      return getFamiliars();
    }

    case EntityCategory.KNIFE: {
      return getKnives();
    }

    case EntityCategory.LASER: {
      return getLasers();
    }

    case EntityCategory.NPC: {
      return getNPCs(undefined, undefined, undefined, ignoreFriendly);
    }

    case EntityCategory.PLAYER: {
      return getPlayers();
    }

    case EntityCategory.PICKUP: {
      return getPickups();
    }

    case EntityCategory.PROJECTILE: {
      return getProjectiles();
    }

    case EntityCategory.SLOT: {
      return getSlots();
    }

    case EntityCategory.TEAR: {
      return getTears();
    }
  }
}

/** Find the first entity in the room that matches the initSeed. Warning: Slow. */
export function getEntityFromInitSeed(initSeed: Seed): Entity | undefined {
  return getEntities().find((entity) => entity.InitSeed === initSeed);
}

/**
 * Returns true if the entity is persistent and is being (or about to be) unloaded due to
 * PRE_GAME_EXIT. This is useful as persistent NPCs will return upon continue, so for features which
 * use 'NPCIndex', these NPCs shouldn't be unsubscribed from the feature.
 */
export function isPersistentEntityBeingUnloadedDueToGameExit(
  entity: Entity,
): boolean {
  return entity.HasEntityFlags(EntityFlag.PERSISTENT) && isLeavingGame();
}

/**
 * Checks if an entity has been modified.
 *
 * @param entity The entity to check.
 * @returns Returns true if the entity has been modified, false otherwise.
 */
export function isEntityModded(entity: Entity): boolean {
  const [entityType, variant, subType] = [
    entity.Type,
    entity.Variant,
    entity.SubType,
  ];
  const entityConfigEntry = EntityConfig.GetEntity(
    entityType,
    variant,
    subType,
  );
  if (entityConfigEntry === undefined) {
    return true;
  }
  return entityConfigEntry.GetModName() !== undefined;
}

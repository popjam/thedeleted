import type { PickupVariant } from "isaac-typescript-definitions";
import { EntityFlag, EntityType } from "isaac-typescript-definitions";
import type { EntityID } from "isaacscript-common";
import {
  DISTANCE_OF_GRID_TILE,
  game,
  getEntityIDFromConstituents,
  getPickups,
  getPlayers,
  getRandom,
  getRandomVector,
  spawn,
  spawnNPC,
  spawnPickup,
} from "isaacscript-common";
import { mod } from "../mod";

const RANDOM_POSITION_AVOID_PLAYER_DISTANCE = DISTANCE_OF_GRID_TILE * 2;

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
 * @param centerPos
 * @param radius
 * @param excludeRadius Will add an area to the radius where the chosen position can not be. This
 *                      area originates from the origin point and increases the radius of the
 *                      circle.
 */
export function getRandomPositionInRadius(
  centerPos: Vector,
  radius: number,
  excludeRadius = 0,
): Vector {
  const displacement = getRandomVector()
    .Normalized()
    .mul(getRandom() * radius + excludeRadius);
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
  const spawnPos = getRandomVector().Normalized().mul(radius).add(pos);
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
  const spawnPos = getRandomVector().Normalized().mul(radius).add(pos);
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
  const throwVector = getRandomVector()
    .Normalized()
    .mul(getRandom() * (maxSpeed - minSpeed) + minSpeed);
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
  const throwVector = getRandomVector()
    .Normalized()
    .mul(getRandom() * (maxSpeed - minSpeed) + minSpeed);
  const pickup = spawnPickup(
    variant,
    subType,
    centerPos,
    throwVector.add(entity.Velocity),
  );
  return pickup;
}

/**
 * Find a random position in the room that has direct access to 'accessorPos'. Poop is ignored and
 * acts as if nothing is there. Does not overlap with any players.
 *
 * @maxIterations The amount of iterations until it gives up (default 100).
 */
export function getRandomAccessiblePosition(
  accessorPos: Vector,
  maxIterations = 100,
): Vector | undefined {
  let freePosition = Vector(0, 0);
  let i = 0;
  const playerPositions = getPlayers().map((player) => player.Position);
  while (i < maxIterations) {
    freePosition = game.GetRoom().GetRandomPosition(DISTANCE_OF_GRID_TILE);
    const doesOverlapPlayer = playerPositions.some(
      (playerPosition) =>
        playerPosition.Distance(freePosition) <
        RANDOM_POSITION_AVOID_PLAYER_DISTANCE,
    );
    if (!doesOverlapPlayer && isPositionAccessible(freePosition, accessorPos)) {
      break;
    }
    i++;
  }
  return freePosition;
}

/**
 * Checks if a position is accessible to another position.
 *
 * @testPos The position you're checking for.
 * @accessorPos The position you want to check it connects to.
 * @ignorePoop Whether to ignore poops (default true).
 */
export function isPositionAccessible(
  testPos: Vector,
  accessorPos: Vector,
  ignorePoop = true,
): boolean {
  const npc = spawnNPC(EntityType.FLY, 0, 0, testPos);
  npc.Visible = false;
  const pathfinder = npc.Pathfinder;
  const hasPath = pathfinder.HasPathToPos(accessorPos, ignorePoop);
  npc.Remove();
  return hasPath;
}

/**
 * Get a random position in the room that has direct access to the first player. Poop is ignored and
 * acts as if nothing is there. Does not overlap with any players. If there are no possible
 * positions, returns Vector(0, 0).
 */
export function getQuickAccessiblePosition(): Vector {
  return (
    getRandomAccessiblePosition(Isaac.GetPlayer().Position) ?? Vector(0, 0)
  );
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
 * Retrieves the closest pickup to a reference position. If there are no pickups in the room,
 * returns undefined.
 */
export function getClosestPickupTo(
  referencePosition: Vector,
): EntityPickup | undefined {
  let closestPickup: undefined | EntityPickup;
  let closestDistance = 10_000;
  const pickupsInRoom = getPickups();
  pickupsInRoom.forEach((pickup: EntityPickup) => {
    const pickupDistance = pickup.Position.Distance(referencePosition);
    if (pickupDistance < closestDistance) {
      closestPickup = pickup;
      closestDistance = pickupDistance;
    }
  });
  return closestPickup;
}

/** Get an EntityID from an Entity. */
export function getEntityIDFromEntity(entity: Entity): EntityID {
  return getEntityIDFromConstituents(
    entity.Type,
    entity.Variant,
    entity.SubType,
  );
}

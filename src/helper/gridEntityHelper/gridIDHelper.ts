import type { GridEntityID } from "isaacscript-common";
import {
  getConstituentsFromGridEntityID,
  getGridEntities,
  getMatchingGridEntities,
  getRandomEnumValue,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import { GridID } from "../../enums/data/ID/GridID";
import { PoopGridEntityVariant } from "isaac-typescript-definitions";

/**
 * Spawns a Grid Entity using its GridID.
 *
 * @param gridID The GridID of the Grid Entity to spawn.
 * @param gridIndexOrPosition The Grid Index or Position to spawn the Grid Entity at.
 * @param removeExistingGridEntity Optional. Whether to remove the existing grid entity on the same
 *                                 tile, if it exists. Defaults to true. If false, this function
 *                                 will do nothing, since spawning a grid entity on top of another
 *                                 grid entity will not replace it.
 * @returns The spawned Grid Entity.
 */
export function spawnGridID(
  gridID: GridID,
  gridIndexOrPosition: int | Vector,
  removeExistingGridEntity?: boolean | undefined,
): GridEntity | undefined {
  const [type, variant] = gridID.split(".");
  return spawnGridEntityWithVariant(
    Number(type),
    Number(variant),
    gridIndexOrPosition,
    removeExistingGridEntity,
  );
}

/** Returns a random GridID from the GridID Enum. */
export function getRandomGridID(
  seedOrRNG: Seed | RNG | undefined = undefined,
): GridID {
  return getRandomEnumValue(GridID, seedOrRNG);
}

/**
 * Helper function to get all of the grid entities in the room that specifically match the GridID
 * (or GridEntityID) provided. If the variant is '-1', will return all grid entities of that
 * GridEntityType. If the GridEntityType is '-1', will return all grid entities.
 *
 * @example getGridEntitiesFromGridID(GridID.ROCK) --> All rocks in the room.
 * @example getGridEntitiesFromGridID("-1.-1") --> All grid entities in the room.
 */
export function getGridEntitiesFromGridID(
  gridID: GridID,
): readonly GridEntity[] {
  const [gridEntityType, variant] = getConstituentsFromGridEntityID(
    gridID as GridEntityID,
  );
  if ((gridEntityType as number) === -1) {
    return getGridEntities();
  }

  if (variant === -1) {
    return getGridEntities(gridEntityType);
  }

  return getMatchingGridEntities(gridEntityType, variant);
}

/** Determine if a variable is an GridEntityID (e.g '11.0'). */
export function isGridEntityID(variable: unknown): variable is GridEntityID {
  if (typeof variable !== "string") {
    return false;
  }
  const constituents = variable.split(".");
  if (constituents.length !== 2) {
    return false;
  }
  const [type, variant] = constituents;
  return (
    type !== undefined &&
    variant !== undefined &&
    !Number.isNaN(Number(type)) &&
    !Number.isNaN(Number(variant))
  );
}

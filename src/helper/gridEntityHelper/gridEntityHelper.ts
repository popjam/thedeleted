import { game, getAllGridIndexes, getGridEntityID } from "isaacscript-common";
import { GridID } from "../../enums/data/ID/GridID";
import { GridEntityType } from "isaac-typescript-definitions";

/**
 * Returns a random GridIndex in the room that:
 *
 * a) would not block the player from accessing all doors in the room b) would not spawn on top of a
 * player
 *
 * If no such GridIndex exists, returns undefined.
 */
export function getSafeRandomGridIndex(
  seedOrRandom: Seed | RNG | undefined = undefined,
): int | undefined {
  const gridIndices = getAllGridIndexes();
  if (gridIndices.length === 0) {
    error(
      "getSafeRandomGridIndex: Failed to get a random GridIndex since the room has no GridIndices.",
    );
  }

  return undefined;
}

/**
 * Returns an array of Grid Indices from the current room that do not have a grid entity on them.
 */
export function getAllEmptyGridIndexes(): readonly int[] {
  const gridIndices = getAllGridIndexes();
  if (gridIndices.length === 0) {
    return [];
  }

  // Filter out grid indices that have a grid entity.
  const filteredGridIndices = gridIndices.filter((gridIndex) => {
    const gridEntity = game.GetRoom().GetGridEntity(gridIndex);
    return gridEntity === undefined;
  });

  return filteredGridIndices;
}

/**
 * Returns an array of Grid Indices from the current room that do not have any of the provided grid
 * entity types on them. If GridEntityType.NULL is provided, will filter out grid indices that have
 * no grid entity.
 */
export function getAllGridIndexesWithExceptions(
  ...exceptions: readonly GridEntityType[]
): readonly int[] {
  const gridIndices = getAllGridIndexes();
  if (gridIndices.length === 0) {
    return [];
  }

  // Filter out grid indices that match the exceptions.
  const filteredGridIndices = gridIndices.filter((gridIndex) => {
    const gridEntity = game.GetRoom().GetGridEntity(gridIndex);
    if (gridEntity === undefined) {
      return !exceptions.includes(GridEntityType.NULL);
    }

    const gridEntityType = gridEntity.GetType();
    return !exceptions.includes(gridEntityType);
  });

  return filteredGridIndices;
}

/**
 * Returns the grid index located at Position. Clamps to the nearest grid index if Position is out
 * of bounds.
 */
export function positionToClampedGridIndex(position: Vector): int {
  return game.GetRoom().GetClampedGridIndex(position);
}

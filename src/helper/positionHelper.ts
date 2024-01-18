import { EntityType } from "isaac-typescript-definitions";
import {
  game,
  DISTANCE_OF_GRID_TILE,
  getPlayers,
  spawnNPC,
} from "isaacscript-common";

const RANDOM_POSITION_AVOID_PLAYER_DISTANCE = DISTANCE_OF_GRID_TILE * 2;

/** Gets a random position in the room. */
export function getRandomPosition(): Vector {
  return game.GetRoom().GetRandomPosition(DISTANCE_OF_GRID_TILE);
}

/**
 * Find a random position in the room that has direct access to 'accessorPos'. Poop is ignored and
 * acts as if nothing is there. Does not overlap with any players.
 *
 * @accessorPos The position you want to check it connects to.
 * @maxIterations The amount of iterations until it gives up (default 100).
 * @checkOverlapWithPlayers Whether to check if the position overlaps with any players (default
 *                          true).
 */
export function getRandomAccessiblePosition(
  accessorPos: Vector,
  maxIterations = 100,
  checkOverlapWithPlayers = true,
): Vector | undefined {
  let freePosition = Vector(0, 0);
  let i = 0;
  const playerPositions = getPlayers().map((player) => player.Position);
  while (i < maxIterations) {
    freePosition = game.GetRoom().GetRandomPosition(DISTANCE_OF_GRID_TILE);
    const doesOverlapPlayer = checkOverlapWithPlayers
      ? playerPositions.some(
          (playerPosition) =>
            playerPosition.Distance(freePosition) <
            RANDOM_POSITION_AVOID_PLAYER_DISTANCE,
        )
      : false;
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

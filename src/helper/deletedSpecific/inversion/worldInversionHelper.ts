/** Helper functions related to the corrupted-world. */

import { getInvertedPlayers } from "../../../features/corruption/inversion/playerInversion";
import { getModeDataFromPlayer } from "../../../maps/modes/modeMap";
import { getDeletedPlayers } from "../deletedHelper";

/**
 * Checks if the 'inverted world' should be portrayed with the corrupted error room backdrop. As
 * some Deleted modes are stuck in the inverted world, it would be an eye sore to have the backdrop
 * constantly be the corrupted backdrop.
 */
export function shouldInvertedWorldHaveCorruptBackdrop(): boolean {
  return !getDeletedPlayers().some(
    (player) => getModeDataFromPlayer(player).startInverted,
  );
}

/**
 * Checks if the player should modify the floor color while inverted. No floor color is modified if
 * any player is in a mode that is stuck in the inverted world.
 */
export function shouldInvertedWorldHaveCorruptFloorColor(): boolean {
  return !shouldInvertedWorldHaveCorruptBackdrop();
}

/** Checks if the world is in its inverted state. */
export function isWorldInverted(): boolean {
  return getInvertedPlayers().length > 0;
}

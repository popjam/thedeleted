/** Functions related to the players' 'Modes'. */

import {
  NormalModeCarousel,
  TaintedModeCarousel,
} from "../../constants/pcConstants";
import { getCurrentPlayerMode, setPlayerMode } from "../../features/modes/mode";
import { fprint } from "../printHelper";
import { isModeTainted } from "./deletedHelper";

/**
 * Switches to the next mode on the carousel for the specified player. If the player's current mode
 * is undefined or the player is not a Deleted player, nothing happens. If the player's current mode
 * is tainted, the tainted mode carousel is used. If the next mode is undefined, the first mode on
 * the carousel is selected.
 *
 * @param player The player entity.
 * @param forward Optional. Determines the direction of the carousel. Defaults to true (forward).
 */
export function switchToNextModeOnCarousel(
  player: EntityPlayer,
  forward = true,
): void {
  const mode = getCurrentPlayerMode(player);
  if (mode === undefined) {
    fprint("Cannot switch modes on a non-Deleted player.");
    return;
  }

  let carousel = NormalModeCarousel;
  if (isModeTainted(mode)) {
    carousel = TaintedModeCarousel;
  }

  let nextModeIndex =
    (carousel.indexOf(mode) + (forward ? 1 : -1)) % carousel.length;
  // If the index is negative, wrap around to the end of the carousel.
  if (nextModeIndex < 0) {
    nextModeIndex += carousel.length;
  }

  const nextMode = carousel[nextModeIndex];

  /** If the next mode is undefined, wrap around to the first mode. */
  if (nextMode === undefined) {
    const firstMode = carousel[0];
    if (firstMode === undefined) {
      error("The carousel is empty.");
    }
    setPlayerMode(player, firstMode);
    return;
  }

  setPlayerMode(player, nextMode);
}

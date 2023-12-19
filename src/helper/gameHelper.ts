import { game, GAME_FRAMES_PER_SECOND } from "isaacscript-common";
import { mod } from "../mod";

/**
 * Returns true if the pause menu is open, ISC 'pause' feature is enabled, ModConfigMenu or
 * DeadSeaScrollsMenu is open.
 */
export function isGamePaused(): boolean {
  return (
    game.IsPaused() ||
    mod.isPaused() ||
    (ModConfigMenu !== undefined && ModConfigMenu.IsVisible)
  );
}

/**
 * Fires a function every game frame, or every X game frames (specified by 'frameDelay'), until the
 * provided function returns true.
 */
export function fireFunctionConstantly(
  func: () => boolean,
  frameDelay = 1,
): void {
  mod.runInNGameFrames(() => {
    const shouldStop = func();
    if (!shouldStop) {
      fireFunctionConstantly(func, frameDelay);
    }
  }, frameDelay);
}

/** Converts seconds to game frames. */
export function secondsToGameFrames(seconds: number): int {
  return seconds * GAME_FRAMES_PER_SECOND;
}

import { game } from "isaacscript-common";
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

/** Fires a function every game frame, or every X game frames (specified by 'frameDelay'). */
export function fireFunctionConstantly(func: () => void, frameDelay = 1): void {
  mod.runInNGameFrames(() => {
    func();
    fireFunctionConstantly(func, frameDelay);
  }, frameDelay);
}

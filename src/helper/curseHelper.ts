import type { LevelCurse } from "isaac-typescript-definitions";
import { game } from "isaacscript-common";

/** Get all active curses. */
export function getCurses(): BitFlags<LevelCurse> {
  return game.GetLevel().GetCurses();
}

/** Determine if the floor has any curses active. */
export function hasAnyCurse(): boolean {
  return getCurses() !== 0;
}

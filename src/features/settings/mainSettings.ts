/** Settings are a group of gears unique to each player. */

import { PlayerSettings } from "../../interfaces/PlayerSettings";
import { setStartingBombsSetting } from "./consumableSettings";

export function addSettingsToPlayer(
  player: EntityPlayer,
  settings: PlayerSettings,
): void {
  if (settings.startingBombs !== undefined) {
    setStartingBombsSetting(player, settings.startingBombs);
  }
}

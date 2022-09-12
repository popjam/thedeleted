/** A group of settings unique to each player. */

import { PlayerSettings } from "../../interfaces/PlayerSettings";
import { setCorruptionDNASetting } from "./corruptionSettings";

/**
 * Modify any amount of settings for the player by passing in PlayerSettings option with desired
 * values.
 */
export function addSettingsToPlayer(
  player: EntityPlayer,
  settings: PlayerSettings,
): void {
  // Corruption DNA.
  if (settings.corruptionDNA !== undefined) {
    setCorruptionDNASetting(player, settings.corruptionDNA);
  }
}

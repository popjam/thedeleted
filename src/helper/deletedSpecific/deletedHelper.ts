import { getPlayers } from "isaacscript-common";
import { CharacterType } from "../../enums/general/CharacterType";
import { Mode } from "../../enums/modes/Mode";
import { getModeData, PLAYERTYPE_MODE_MAP } from "../../maps/modes/modeMap";

/** Determines if the player is of type Deleted or Tainted Deleted. */
export function isPlayerDeleted(player: EntityPlayer): boolean {
  return PLAYERTYPE_MODE_MAP.get(player.GetPlayerType()) !== undefined;
}

/** Determines if the player is of type non-Tainted Deleted. */
export function isPlayerNormalDeleted(player: EntityPlayer): boolean {
  const mode = PLAYERTYPE_MODE_MAP.get(player.GetPlayerType());
  if (mode !== undefined) {
    return CharacterType.NORMAL === getModeData(mode).characterType;
  }
  return false;
}

/** Determines if the player is of type Tainted Deleted. */
export function isPlayerTaintedDeleted(player: EntityPlayer): boolean {
  return !isPlayerNormalDeleted(player);
}

/** Determines if the mode is for Tainted Deleted or not. */
export function isModeTainted(mode: Mode): boolean {
  return getModeData(mode).characterType === CharacterType.TAINTED;
}

/** Get all the players currently in game that are of type normal or tainted Deleted. */
export function getDeletedPlayers(): EntityPlayer[] {
  return getPlayers().filter((player) => isPlayerDeleted(player));
}

/**
 * Get the color associated with the Deleted mode. If the player is not a Deleted or the mode does
 * not have a main color, returns undefined.
 */
export function getPlayerMainColor(player: EntityPlayer): Color | undefined {
  const mode = PLAYERTYPE_MODE_MAP.get(player.GetPlayerType());
  if (mode !== undefined) {
    return getModeData(mode).mainColor;
  }
  return undefined;
}

export function getDeletedInvertedSprite(player: EntityPlayer): string {
  const mode = PLAYERTYPE_MODE_MAP.get(player.GetPlayerType());
  if (mode === undefined) {
    error("Failed to get the deleted inverted sprite for the player.");
  }
  return "";
}

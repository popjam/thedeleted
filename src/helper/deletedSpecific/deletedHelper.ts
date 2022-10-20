import {
  PLAYER_TYPES_DELETED,
  PLAYER_TYPES_NORMAL_DELETED,
  PLAYER_TYPES_TAINTED_DELETED,
} from "../../constants/modeConstants";

/** Determines if the player is of type Deleted or Tainted Deleted. */
export function isPlayerDeleted(player: EntityPlayer): boolean {
  return PLAYER_TYPES_DELETED.includes(player.GetPlayerType());
}

/** Determines if the player is of type non-Tainted Deleted. */
export function isPlayerNormalDeleted(player: EntityPlayer): boolean {
  return PLAYER_TYPES_NORMAL_DELETED.includes(player.GetPlayerType());
}

/** Determines if the player is of type Tainted Deleted. */
export function isPlayerTaintedDeleted(player: EntityPlayer): boolean {
  return PLAYER_TYPES_TAINTED_DELETED.includes(player.GetPlayerType());
}

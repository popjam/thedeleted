import { PlayerTypeCustom } from "../../enums/PlayerTypeCustom";

/** Determines if the player is of type Deleted or Tainted Deleted. */
export function isPlayerDeleted(player: EntityPlayer): boolean {
  return (
    player.GetPlayerType() === PlayerTypeCustom.DELETED ||
    player.GetPlayerType() === PlayerTypeCustom.DELETED_B
  );
}

/** Determines if the player is of type non-Tainted Deleted. */
export function isPlayerNormalDeleted(player: EntityPlayer): boolean {
  return player.GetPlayerType() === PlayerTypeCustom.DELETED;
}

/** Determines if the player is of type Tainted Deleted. */
export function isPlayerTaintedDeleted(player: EntityPlayer): boolean {
  return player.GetPlayerType() === PlayerTypeCustom.DELETED_B;
}

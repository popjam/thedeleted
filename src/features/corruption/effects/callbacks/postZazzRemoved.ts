import {
  removePlayerMostRecentInvertedActiveItem,
  removePlayerMostRecentInvertedPassiveItem,
} from "../../../../helper/deletedSpecific/inversion/invertedInventory";

// PLAYER_COLLECTIBLE_REMOVED
export function invertedItemEffectsPostZazzPassiveCollectibleRemoved(
  player: EntityPlayer,
): void {
  removePlayerMostRecentInvertedPassiveItem(player);
}

// PLAYER_COLLECTIBLE_REMOVED
export function invertedItemEffectsPostZazzActiveCollectibleRemoved(
  player: EntityPlayer,
): void {
  removePlayerMostRecentInvertedActiveItem(player);
}

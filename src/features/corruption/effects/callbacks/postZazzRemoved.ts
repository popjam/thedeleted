import { CollectibleType } from "isaac-typescript-definitions";
import { removePlayerMostRecentInvertedPassiveItem } from "../../../../helper/deletedSpecific/inversion/invertedInventory";
import { addRemovedInvertedItemToTracker } from "../../inventory/removedInvertedItems";

// PLAYER_COLLECTIBLE_REMOVED
export function invertedItemEffectsPostZazzPassiveCollectibleRemoved(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): void {
  /** Remove the Zazz item. */
  const collectibleTypeRemoved = removePlayerMostRecentInvertedPassiveItem(
    player,
    false,
    true,
  );
  if (collectibleTypeRemoved === undefined) {
    return;
  }

  /** Track the item that was removed. */
  addRemovedInvertedItemToTracker(
    player,
    collectibleType,
    collectibleTypeRemoved,
  );
}

// PLAYER_COLLECTIBLE_REMOVED
export function invertedItemEffectsPostZazzActiveCollectibleRemoved(
  player: EntityPlayer,
): void {
  // removePlayerMostRecentInvertedActiveItem(player, false);
}

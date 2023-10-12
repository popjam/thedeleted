import type { CollectibleType } from "isaac-typescript-definitions";
import { addRemovedInvertedItemToTracker } from "../../inventory/removedInvertedItems";
import { removePlayerMostRecentInvertedPassive } from "../../../../helper/deletedSpecific/inversion/invertedInventoryHelper";

// PLAYER_COLLECTIBLE_REMOVED
export function invertedItemEffectsPostZazzPassiveCollectibleRemoved(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): void {
  /** Remove the Zazz item. */
  const collectibleTypeRemoved = removePlayerMostRecentInvertedPassive(
    player,
    collectibleType,
    false,
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

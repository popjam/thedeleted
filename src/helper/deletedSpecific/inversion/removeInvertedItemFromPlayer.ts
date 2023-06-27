import { CollectibleType } from "isaac-typescript-definitions";
import { getAndSetInvertedItemActionSet } from "../../../features/corruption/effects/itemEffects";
import { doesPlayerHaveInvertedItem } from "../../../features/corruption/inventory/itemInventory";
import { fprint } from "../../printHelper";

/**
 * Removes the inverted item from the player (if they have one tracked in their corrupted
 * inventory).
 *
 * For passive items, this will remove any associated actions from playerEffects. Each Action added
 * to the player from addInvertedItemToPlayer() will have a reference to its CollectibleType. From
 * this, we can ascertain a set of actions which may need to be removed after calling this function.
 * However, there's a problem, in that if you have two or more copies of one inverted item, you
 * don't know which actions to remove (it shouldn't remove them all).
 *
 * This function tries its best.
 */
export function removeInvertedItemFromPlayer(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  removeLogo = true,
  removeFromInventory = true,
): void {
  if (!doesPlayerHaveInvertedItem(player, collectibleType)) {
    return;
  }

  fprint(`Removing inverted item from player: ${collectibleType}`);

  // This may have changed since the player picked up the item. However, this shouldn't be a big
  // deal.
  const invertedItemActionSet = getAndSetInvertedItemActionSet(collectibleType);
  invertedItemActionSet.removeFromPlayer(
    player,
    collectibleType,
    removeLogo,
    removeFromInventory,
  );
}

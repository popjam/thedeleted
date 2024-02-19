import type { CollectibleType } from "isaac-typescript-definitions";
import type { PlayerIndex } from "isaacscript-common";
import { getPlayerIndex } from "isaacscript-common";
import { mod } from "../../../mod";
import type { InvertedActiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";

/**
 * This feature tracks corrupted items that have been removed from the player in the room, in the
 * hopes that when a rogue dummy-zazzinator item is spawned, we can identify which player it came
 * from and properly transform it into its corrupted item.
 *
 * Each removed item will have...
 *
 * @property dummyItem - The physical item that was removed from the player. Passive zazzinator
 *           dummy items are unique to each quality, giving another clue to what the reference item
 *           is. Active items are unique to the slot they are in.
 * @property referenceCollectible - The inverted collectible that the dummy item represents. This
 *           should be set when adding collectibles to the removedItemTracker.
 * @property InvertedActiveActionSet - If the removed item is an active item, this will be the
 *           ActionSet for that item. The activeItemTracker can then register the pedestal as having
 *           a pre-existing inverted active item.
 */
interface RemovedZazzItem {
  playerIndex: PlayerIndex;
  dummyItem: CollectibleType;
  referenceCollectible: CollectibleType;
  InvertedActiveActionSet?: InvertedActiveActionSet;
}

const v = {
  room: {
    removedItems: [] as RemovedZazzItem[],
  },
};

export function removedItemTrackerInit(): void {
  mod.saveDataManager("RemovedItemTracker", v);
}

/**
 * Add a removed item to the removed inverted item tracker. This will be used when rogue zazzinator
 * items spawn on the ground (e.g when swapping an active item out of your inventory).
 */
export function addRemovedInvertedItemToTracker(
  player: EntityPlayer,
  dummyItem: CollectibleType,
  referenceCollectible: CollectibleType,
  actionSet?: InvertedActiveActionSet,
): void {
  const playerIndex = getPlayerIndex(player);
  v.room.removedItems.push({
    playerIndex,
    dummyItem,
    referenceCollectible,
    InvertedActiveActionSet: actionSet,
  });
}

// Get list of removed inverted items in chronological order (oldest first). Mutable as we want to
// be able to remove items from the list.
// eslint-disable-next-line isaacscript/no-mutable-return
export function _getRemovedInvertedItems(): RemovedZazzItem[] {
  return v.room.removedItems;
}

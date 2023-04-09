import { CollectibleType } from "isaac-typescript-definitions";
import {
  getCollectibleName,
  getPlayerIndex,
  PlayerIndex,
} from "isaacscript-common";
import { fprint } from "../../../helper/printHelper";
import { mod } from "../../../mod";

// eslint-disable-next-line isaacscript/complete-sentences-jsdoc
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
 */
interface RemovedZazzItem {
  playerIndex: PlayerIndex;
  dummyItem: CollectibleType;
  referenceCollectible: CollectibleType;
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
): void {
  const playerIndex = getPlayerIndex(player);
  fprint(
    `Tracking removed item with reference collectible: ${getCollectibleName(
      referenceCollectible,
    )}`,
  );
  v.room.removedItems.push({
    playerIndex,
    dummyItem,
    referenceCollectible,
  });
}

// eslint-disable-next-line no-underscore-dangle
export function _getRemovedInvertedItems(): RemovedZazzItem[] {
  return v.room.removedItems;
}
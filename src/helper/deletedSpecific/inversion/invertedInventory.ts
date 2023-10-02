/**
 * This file contains helper functions to do with the players' inverted inventory, as well as
 * functions related to adding and removing Inverted items.
 */

import type { CollectibleType } from "isaac-typescript-definitions";
import { ActiveSlot } from "isaac-typescript-definitions";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { ActionSetType } from "../../../enums/corruption/actionSets/ActionSetType";
import { getAndSetInvertedItemActionSet } from "../../../features/corruption/effects/itemEffects";
import {
  doesPlayerHaveInvertedItem,
  getPlayerInvertedItemInventory,
} from "../../../features/corruption/inventory/itemInventory";
import { fprint } from "../../printHelper";
import {
  addInvertedItemActionSetToPlayer,
  removeInvertedItemActionSetFromPlayer,
} from "./playerItemEffects";

/**
 * Remove the most recent Inverted Item from the player that follows the predicate. Returns the
 * CollectibleType of the corrupted item that was removed, or undefined if no item was removed.
 */
export function removeInvertedItemFromPlayerWithPredicate(
  player: EntityPlayer,
  predicate: (actionSet: InvertedItemActionSet) => boolean,
  removeLogo?: boolean,
  removeFromInventory?: boolean,
): CollectibleType | undefined {
  const playerInventory = getPlayerInvertedItemInventory(player);
  for (let i = playerInventory.length - 1; i >= 0; i--) {
    const currentCollectible = playerInventory[i];
    if (currentCollectible === undefined) {
      return undefined;
    }
    const actionSet = getAndSetInvertedItemActionSet(currentCollectible);
    if (predicate(actionSet)) {
      removeInvertedItemFromPlayer(
        player,
        currentCollectible,
        removeLogo,
        removeFromInventory,
      );
      return currentCollectible;
    }
  }
  return undefined;
}

/** Removes recent inverted passive, returns True if one was removed. */
export function removePlayerMostRecentInvertedPassiveItem(
  player: EntityPlayer,
  removeLogo?: boolean | undefined,
  removeFromInventory?: boolean | undefined,
): CollectibleType | undefined {
  return removeInvertedItemFromPlayerWithPredicate(
    player,
    (actionSet) =>
      actionSet.actionSetType === ActionSetType.INVERTED_PASSIVE_ITEM,
    removeLogo,
    removeFromInventory,
  );
}

/** Removes recent inverted active, returns True if one was removed. */
export function removePlayerMostRecentInvertedActiveItem(
  player: EntityPlayer,
  removeLogo?: boolean | undefined,
  removeFromInventory?: boolean | undefined,
): CollectibleType | undefined {
  return removeInvertedItemFromPlayerWithPredicate(
    player,
    (actionSet) =>
      actionSet.actionSetType === ActionSetType.INVERTED_ACTIVE_ITEM,
    removeLogo,
    removeFromInventory,
  );
}

/**
 * Removes the inverted item from the player (if they have one tracked in their inverted inventory).
 *
 * This will remove any associated actions from playerEffects. Each Action added to the player from
 * addInvertedItemToPlayer() will have a reference to its CollectibleType. From this, we can
 * ascertain a set of actions which may need to be removed after calling this function.
 */
export function removeInvertedItemFromPlayer(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  removeLogo = true,
  removeFromInventory = true,
  slot: ActiveSlot = ActiveSlot.PRIMARY,
): void {
  if (!doesPlayerHaveInvertedItem(player, collectibleType)) {
    return;
  }

  fprint(`Removing inverted item from player: ${collectibleType}`);

  // This may have changed since the player picked up the item. However, this shouldn't be a big
  // deal.
  const invertedItemActionSet = getAndSetInvertedItemActionSet(collectibleType);
  removeInvertedItemActionSetFromPlayer(
    player,
    invertedItemActionSet,
    collectibleType,
    removeLogo,
    removeFromInventory,
    slot,
  );
}

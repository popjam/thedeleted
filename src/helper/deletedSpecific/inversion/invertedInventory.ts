/** This file contains helper functions to do with the players' inverted inventory. */

import { CollectibleType } from "isaac-typescript-definitions";
import { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { ActionSetType } from "../../../enums/corruption/actionSets/ActionSetType";
import { getAndSetInvertedItemActionSet } from "../../../features/corruption/effects/itemEffects";
import {
  doesPlayerHaveInvertedItem,
  getPlayerInvertedItemInventory,
} from "../../../features/corruption/inventory/itemInventory";
import { fprint } from "../../printHelper";

/**
 * Remove the most recent Inverted Item from the player that follows the predicate. Returns true if
 * an item was removed, false otherwise.
 */
export function removeInvertedItemFromPlayerWithPredicate(
  player: EntityPlayer,
  predicate: (actionSet: InvertedItemActionSet) => boolean,
): boolean {
  const playerInventory = getPlayerInvertedItemInventory(player);
  for (let i = playerInventory.length - 1; i >= 0; i--) {
    const currentCollectible = playerInventory[i];
    if (currentCollectible === undefined) {
      return false;
    }
    const actionSet = getAndSetInvertedItemActionSet(currentCollectible);
    if (predicate(actionSet)) {
      removeInvertedItemFromPlayer(player, currentCollectible);
      return true;
    }
  }
  return false;
}

/** Removes recent inverted passive, returns True if one was removed. */
export function removePlayerMostRecentInvertedPassiveItem(
  player: EntityPlayer,
): boolean {
  return removeInvertedItemFromPlayerWithPredicate(
    player,
    (actionSet) =>
      actionSet.actionSetType === ActionSetType.INVERTED_PASSIVE_ITEM,
  );
}

/** Removes recent inverted active, returns True if one was removed. */
export function removePlayerMostRecentInvertedActiveItem(
  player: EntityPlayer,
): boolean {
  return removeInvertedItemFromPlayerWithPredicate(
    player,
    (actionSet) =>
      actionSet.actionSetType === ActionSetType.INVERTED_ACTIVE_ITEM,
  );
}

/** Remove all items from the player that follow the predicate. */
export function removeAllInvertedItemsFromPlayerWithPredicate(
  player: EntityPlayer,
  predicate: (actionSet: InvertedItemActionSet) => boolean,
): void {
  while (removeInvertedItemFromPlayerWithPredicate(player, predicate)) {
    // Do nothing
  }
}

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

/**
 * Adds the ActionSet contents attached to the inverted CollectibleType to the player. Also adds a
 * logo to the inventory and updates the inventory.
 *
 * For corrupted passives, actions will be added to the player, and effects will trigger
 * immediately.
 */
export function addInvertedItemToPlayer(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  addLogo = true,
  addToInventory = true,
  pocket = false,
): void {
  const invertedItemActionSet = getAndSetInvertedItemActionSet(collectibleType);
  invertedItemActionSet.addToPlayer(
    player,
    collectibleType,
    addLogo,
    addToInventory,
    pocket,
  );
}

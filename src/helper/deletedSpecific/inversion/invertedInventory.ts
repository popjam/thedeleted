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

/**
 * Adds the ActionSet contents attached to the inverted CollectibleType to the player. Also adds a
 * logo to the inventory and updates the inventory.
 *
 * For corrupted passives, actions will be added to the player, and effects will trigger
 * immediately.
 *
 * @param player
 * @param collectibleType The inverted collectible you want to add. If no InvertedItemActionSet is
 *                        assigned, will generate a new one.
 * @param addLogo Whether to add a logo to the inventory. For passives, this will be the warning
 *                sign logo on the item tracker. For actives, this will be the physical Zazzinator
 *                active item. Default true.
 * @param addToInventory Whether to add the item to the inverted item inventory. Default true.
 * @param slot The slot the inverted active item should go into (if it is an
 *             InvertedActiveActionSet).
 */
export function addInvertedItemToPlayer(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  addLogo = true,
  addToInventory = true,
  slot: ActiveSlot = ActiveSlot.PRIMARY,
): void {
  const invertedItemActionSet = getAndSetInvertedItemActionSet(collectibleType);
  addInvertedItemActionSetToPlayer(
    player,
    invertedItemActionSet,
    addLogo,
    addToInventory,
    collectibleType,
    slot,
  );
}

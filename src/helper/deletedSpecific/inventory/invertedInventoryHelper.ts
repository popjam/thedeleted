/** Core functions related to inverted actions and passives the player owns. */

import type { CollectibleType } from "isaac-typescript-definitions";
import { ActiveSlot } from "isaac-typescript-definitions";
import {
  getAndSetInvertedItemActionSet,
  isInvertedItemPassive,
} from "../../../features/corruption/effects/itemEffects";
import {
  _addInvertedPassiveItemToCorruptInventory,
  _doesPlayerHaveInvertedPassiveItem,
  _removeInvertedPassiveItemFromCorruptInventory,
  getPlayerMostRecentInvertedPassiveItemCollectibleType,
} from "../../../features/corruption/inventory/passiveItemInventory";
import {
  doesPlayerHaveCustomActive,
  getCustomActiveInSlot,
} from "../../../features/corruption/inversion/customActives";
import type { InvertedActiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { deepCopy } from "isaacscript-common";
import {
  _addZazzActiveToPlayer,
  _removeZazzActiveFromPlayer,
} from "./custom actives/customActiveHelper";
import { isInvertedActiveActionSet } from "../actionSetHelper";
import type { InvertedPassiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedPassiveActionSet";
import { isAction } from "../../../classes/corruption/actions/Action";
import {
  addActionsToTracker,
  removeActionFromTracker,
} from "../../../features/corruption/effects/playerEffects";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { CollectibleTypeCustom } from "../../../enums/general/CollectibleTypeCustom";
import { _addInvertedActiveToPlayer } from "../../../classes/facets/CustomActiveFacet";
import { addRemovedInvertedItemToTracker } from "../../../features/corruption/inventory/removedInvertedItems";
import { fprint } from "../../printHelper";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";

/**
 * Returns true if the player has at least one inverted item of the provided CollectibleType. Can be
 * either an inverted passive or an inverted active.
 */
export function doesPlayerHaveInvertedItem(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): boolean {
  const isInverted = isInvertedItemPassive(collectibleType);
  if (isInverted) {
    return _doesPlayerHaveInvertedPassiveItem(player, collectibleType);
  }
  return doesPlayerHaveCustomActive(player, collectibleType);
}

/**
 * Adds the ActionSet contents attached to the inverted CollectibleType to the player. Also adds a
 * logo to the inventory and updates the inventory.
 *
 * For corrupted passives, actions will be added to the player, and effects will trigger
 * immediately.
 *
 * @param player The player to add the inverted item to.
 * @param collectibleType The inverted collectible you want to add. If no InvertedItemActionSet is
 *                        assigned, will generate a new one.
 * @param addLogo Whether to add the physical item. For passives, this will be the warning sign logo
 *                on the item tracker. For actives, this will be the physical Zazzinator active
 *                item. Default true.
 * @param slot The slot the inverted active item should go into (if it is an
 *             InvertedActiveActionSet). Default primary.
 * @param pickupIndex The pickup index of the pedestal the inverted item was picked up from (if
 *                    any). This is necessary to ascertain if the item on the pedestal is being
 *                    tracked through the activeItemTracker, and if so, the tracked ActionSet should
 *                    be given to the player.
 * @param actionSet The ActionSet to add to the player. This will override the ActionSet attached to
 *                  the collectibleType. If undefined, will use the ActionSet attached to the
 *                  collectibleType (or generate a new one if none exists).
 */
export function addInvertedItemToPlayer(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  addLogo = true,
  slot: ActiveSlot = ActiveSlot.PRIMARY,
  actionSet?: InvertedItemActionSet,
): void {
  fprint(`addInvertedItemToPlayer: ${collectibleType}`);
  const invertedItemActionSet =
    actionSet ?? deepCopy(getAndSetInvertedItemActionSet(collectibleType));
  if (isInvertedActiveActionSet(invertedItemActionSet)) {
    addInvertedActiveToPlayer(
      player,
      invertedItemActionSet,
      collectibleType,
      addLogo,
      slot,
    );
  } else {
    addInvertedPassiveToPlayer(
      player,
      invertedItemActionSet,
      collectibleType,
      addLogo,
    );
  }
}

/**
 * Adds the InvertedActiveActionSet to the player, by using the CustomActiveFacet.
 *
 * @param player The player to add the InvertedActionSet to.
 * @param invertedActionSet The InvertedActionSet to add.
 * @param addLogo Whether to add the physical item (should be true).
 * @param collectible The collectible the InvertedActionSet refers to.
 * @param slot The slot the inverted active item should go into (default primary).
 * @param pickupIndex
 * @param actionSet
 */
function addInvertedActiveToPlayer(
  player: EntityPlayer,
  invertedActionSet: InvertedActiveActionSet,
  collectible: CollectibleType,
  addLogo = true,
  slot: ActiveSlot = ActiveSlot.PRIMARY,
) {
  invertedActionSet.oi = collectible;

  // Add actions to tracker.
  for (const actionOrResponse of invertedActionSet.getActions()) {
    if (actionOrResponse.actionType === ActionType.ON_OBTAIN) {
      actionOrResponse.trigger({ player });
    } else {
      addActionsToTracker(player, actionOrResponse);
    }
  }

  // Add logo.
  if (addLogo) {
    _addZazzActiveToPlayer(player, invertedActionSet, slot);
  }

  _addInvertedActiveToPlayer(player, invertedActionSet, slot);
}

/**
 * Add the inverted passive ActionSet to the player by adding the Actions and triggering the
 * Responses.
 *
 * @param player The player to add the Active to.
 * @param invertedPassiveActionSet The InvertedActiveActionSet to add.
 * @param collectible The CollectibleType that the passive item refers to.
 * @param addLogo Whether to add the physical item to the inventory (default true).
 */
function addInvertedPassiveToPlayer(
  player: EntityPlayer,
  invertedPassiveActionSet: InvertedPassiveActionSet,
  collectible: CollectibleType,
  addLogo = true,
) {
  // Add to the corrupt inventory.
  _addInvertedPassiveItemToCorruptInventory(
    player,
    collectible,
    invertedPassiveActionSet,
  );

  // Add actions to tracker for optimization. Trigger effects and 'on obtain' Actions.
  for (const actionOrResponse of invertedPassiveActionSet.getEffects()) {
    if (isAction(actionOrResponse)) {
      if (actionOrResponse.actionType === ActionType.ON_OBTAIN) {
        actionOrResponse.trigger({ player });
      } else {
        addActionsToTracker(player, actionOrResponse);
      }
    } else {
      actionOrResponse.trigger({ player });
    }
  }

  if (addLogo) {
    /** Will be refined eventually. */
    player.AddCollectible(CollectibleTypeCustom.ZAZZ);
  }
}

/**
 * Removes the most recent passive item of the specified collectibleType (if the player has it). It
 * will achieve this by removing the Actions from the tracker, and removing the physical item from
 * the inventory (if removeLogo is true), then finally removing the item from the corrupt inventory.
 *
 * @param player The player to remove the item from.
 * @param collectibleType The CollectibleType of the item to remove. If undefined, will remove the
 *                        most recent item.
 * @param removeLogo Whether to remove the physical item from the inventory (default true).
 * @returns True if an item was removed.
 */
export function removePlayerMostRecentInvertedPassive(
  player: EntityPlayer,
  collectibleType?: CollectibleType,
  removeLogo = true,
): CollectibleType | undefined {
  // If collectibleType is undefined, get the most recent item.
  if (collectibleType === undefined) {
    collectibleType =
      getPlayerMostRecentInvertedPassiveItemCollectibleType(player);
    if (collectibleType === undefined) {
      return undefined;
    }
  } else if (!_doesPlayerHaveInvertedPassiveItem(player, collectibleType)) {
    return undefined;
  }

  // Remove the Actions from the tracker.
  const actionSet = getAndSetInvertedItemActionSet(collectibleType);
  for (const action of actionSet.getActions()) {
    removeActionFromTracker(player, action);
  }

  // Remove physical item.
  if (removeLogo) {
    // Disabled currently due to triggering 'postZazzRemoved' callback.
    // player.RemoveCollectible(CollectibleTypeCustom.ZAZZ);
  }

  // Track the item that was removed.
  addRemovedInvertedItemToTracker(
    player,
    CollectibleTypeCustom.ZAZZ,
    collectibleType,
  );

  _removeInvertedPassiveItemFromCorruptInventory(player, collectibleType);
  return collectibleType;
}

/**
 * Removes an inverted active from the specified slot, if it exists (default primary).
 *
 * @returns True if an item was removed.
 */
export function removePlayerInvertedActive(
  player: EntityPlayer,
  slot = ActiveSlot.PRIMARY,
): boolean {
  const invertedActive = getCustomActiveInSlot(player, slot);
  if (invertedActive === undefined) {
    return false;
  }

  /**
   * Remove physical item. The CustomActiveFacet will detect this and perform the necessary actions.
   */
  _removeZazzActiveFromPlayer(player, invertedActive, slot);

  return true;
}

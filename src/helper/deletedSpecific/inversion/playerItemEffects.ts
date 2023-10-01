/**
 * Functions to do with ActionSets and their effects. Contains functions that add or remove
 * InvertedActionSets from the player.
 */

import { ActiveSlot, CollectibleType } from "isaac-typescript-definitions";
import { deepCopy } from "isaacscript-common";
import type { InvertedActiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import type { Action } from "../../../classes/corruption/actions/Action";
import { isAction } from "../../../classes/corruption/actions/Action";
import type { Response } from "../../../classes/corruption/responses/Response";
import { ActionOrigin } from "../../../enums/corruption/actions/ActionOrigin";
import { CollectibleTypeCustom } from "../../../enums/general/CollectibleTypeCustom";
import {
  addActionOrResponseToPlayer,
  addActionsToPlayer,
  removeActionWithPredicate,
} from "../../../features/corruption/effects/playerEffects";
import {
  _addInvertedItemToCorruptInventory,
  _removeInvertedItemFromCorruptInventory,
} from "../../../features/corruption/inventory/itemInventory";
import { isInvertedActiveActionSet } from "../actionSetHelper";
import { _addZazzActiveToPlayer } from "./customActiveHelper";
import { isZazzinatorActiveCopy } from "../../../sets/zazzSets";
import {
  _addInvertedActiveToPlayer,
  _removeInvertedActiveFromPlayer,
} from "../../../classes/facets/CustomActiveFacet";
import type { InvertedPassiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedPassiveActionSet";
import type { ActionType } from "../../../enums/corruption/actions/ActionType";

/**
 * Adds an InvertedActionSet to the player. If it is a passive InvertedActionSet, will simply add an
 * inverted passive item. If it is an active InvertedActionSet, will add an inverted active through
 * the CustomActiveFacet. Instead of using this, you should probably use
 * 'addInvertedItemToPlayer()'.
 *
 * @param player The player to add the InvertedActionSet to.
 * @param invertedActionSet The InvertedActionSet to add.
 * @param addLogo Whether to add a logo to the inventory. For passives, this will be the warning
 *                sign logo on the item tracker. For actives, this will be the physical Zazzinator
 *                active item. Default true.
 * @param addToInventory Whether to add the item to the inverted item inventory. Default true.
 * @param collectible The collectible the InvertedActionSet refers to (NULL if undefined).
 * @param slot The slot the inverted active item should go into (if it is an
 *             InvertedActiveActionSet, default primary).
 */
export function addInvertedItemActionSetToPlayer(
  player: EntityPlayer,
  invertedActionSet: InvertedItemActionSet,
  addLogo: boolean,
  addToInventory: boolean,
  collectible: CollectibleType | undefined,
  slot: ActiveSlot = ActiveSlot.PRIMARY,
): void {
  if (isInvertedActiveActionSet(invertedActionSet)) {
    addInvertedActiveActionSetToPlayer(
      player,
      invertedActionSet,
      collectible,
      addLogo,
      addToInventory,
      slot,
    );
  } else {
    addInvertedPassiveActionSetToPlayer(
      player,
      invertedActionSet,
      collectible,
      addLogo,
      addToInventory,
    );
  }
}

/**
 * Removes an InvertedItemActionSet from the player. This can be a passive or active ActionSet.
 *
 * @param player The player to remove the InvertedActionSet from.
 * @param invertedActionSet The InvertedActionSet to remove. If a slot is provided, this will be
 *                          ignored.
 * @param collectibleType The CollectibleType that the InvertedActionSet refers to.
 * @param removeLogo Whether to remove the physical Zazz item (default true).
 * @param removeFromInventory Whether to remove the item from the inverted item inventory (default
 *                            true).
 * @param slot The slot the inverted active item should be removed from (default primary). If a Slot
 *             is not provided, will instead attempt
 */
export function removeInvertedItemActionSetFromPlayer(
  player: EntityPlayer,
  invertedActionSet: InvertedItemActionSet,
  collectibleType: CollectibleType | undefined,
  removeLogo = true,
  removeFromInventory = true,
  slot: ActiveSlot | undefined = ActiveSlot.PRIMARY,
): void {
  if (isInvertedActiveActionSet(invertedActionSet)) {
    removeInvertedActiveActionSetFromPlayer(
      player,
      invertedActionSet,
      collectibleType,
      removeLogo,
      removeFromInventory,
      slot,
    );
  } else {
    removeInvertedPassiveActionSetFromPlayer(
      player,
      invertedActionSet,
      collectibleType,
      removeLogo,
      removeFromInventory,
    );
  }
}

/**
 * Adds the InvertedActiveActionSet to the player, by using the CustomActiveFacet.
 *
 * @param player The player to add the InvertedActionSet to.
 * @param invertedActionSet The InvertedActionSet to add.
 * @param addLogo Whether to add the physical item (should be true).
 * @param addToInventory Whether to add the item to the inverted item inventory.
 * @param collectible The collectible the InvertedActionSet refers to.
 * @param slot The slot the inverted active item should go into (default primary).
 */
function addInvertedActiveActionSetToPlayer(
  player: EntityPlayer,
  invertedActionSet: InvertedActiveActionSet,
  collectible: CollectibleType | undefined,
  addLogo = true,
  addToInventory = true,
  slot: ActiveSlot = ActiveSlot.PRIMARY,
) {
  // Create a Deep Copy and add reference Collectible.
  const actionSet = deepCopy<InvertedActiveActionSet>(invertedActionSet);
  actionSet.oi = collectible;

  // Add physical item.
  if (addLogo) {
    _addZazzActiveToPlayer(player, actionSet, slot);
  } else {
    actionSet.copy = isZazzinatorActiveCopy(player.GetActiveItem(slot));
  }

  // Inventory.
  if (addToInventory && collectible !== undefined) {
    _addInvertedItemToCorruptInventory(player, collectible);
  }

  /**
   * Add the Actions to the player. These Actions will be active while the player holds the inverted
   * active, and be removed once the active is removed.
   */
  for (const action of actionSet.getActions()) {
    if (actionSet.oi !== undefined) {
      action.o = [ActionOrigin.INVERTED_COLLECTIBLE, actionSet.oi];
    }
    addActionOrResponseToPlayer(player, deepCopy(action));
  }

  _addInvertedActiveToPlayer(player, actionSet, slot);
}

/**
 * Add the inverted passive ActionSet to the player by adding the Actions and triggering the
 * Responses.
 *
 * @param player The player to add the Active to.
 * @param invertedActionSet The InvertedActiveActionSet to add.
 * @param collectible The CollectibleType that the passive item refers to.
 * @param addLogo Whether to add the physical item to the inventory (default true).
 * @param addToInventory Whether to add the passive to the player's inventory (default true).
 */
function addInvertedPassiveActionSetToPlayer(
  player: EntityPlayer,
  invertedActionSet: InvertedPassiveActionSet,
  collectible: CollectibleType | undefined,
  addLogo = true,
  addToInventory = true,
) {
  // Add the Actions + Responses.
  const actionsAndResponses = deepCopy<Array<Action | Response>>(
    invertedActionSet.getEffects(),
  );
  for (const actionOrResponse of actionsAndResponses) {
    if (isAction(actionOrResponse)) {
      if (collectible !== undefined) {
        actionOrResponse.o = [ActionOrigin.INVERTED_COLLECTIBLE, collectible];
      }
      addActionsToPlayer(player, actionOrResponse);
    } else {
      actionOrResponse.trigger({ player });
    }
  }

  if (addLogo) {
    /** Will be refined eventually. */
    player.AddCollectible(CollectibleTypeCustom.ZAZZ);
  }

  if (addToInventory && collectible !== undefined) {
    _addInvertedItemToCorruptInventory(player, collectible);
  }
}

/**
 * Remove an inverted active ActionSet (or does nothing if it can't find that ActionSet).
 *
 * @param player The player to remove the InvertedActionSet from.
 * @param invertedActionSet The InvertedActionSet to remove.
 * @param collectibleType The CollectibleType that the InvertedActionSet refers to. If
 *                        invertedActionSet.oi is set, this will be ignored.
 * @param removeLogo Whether to remove the physical Zazz item (default true).
 * @param removeFromInventory Whether to remove the item from the inverted item inventory (default
 *                            true).
 */
function removeInvertedPassiveActionSetFromPlayer(
  player: EntityPlayer,
  invertedActionSet: InvertedPassiveActionSet,
  collectibleType: CollectibleType | undefined,
  removeLogo = true,
  removeFromInventory = true,
) {
  // Remove the Actions using advanced GPT-5 AI technology.
  const actionTypes = invertedActionSet
    .getActions()
    .map((action) => action.actionType);
  // eslint-disable-next-line unicorn/no-array-for-each
  actionTypes.forEach((actionType: ActionType) => {
    removeActionWithPredicate(
      (action) =>
        action.o?.[0] === ActionOrigin.INVERTED_COLLECTIBLE &&
        action.o[1] === ((invertedActionSet.oi ?? collectibleType) as number),
      player,
      actionType,
    );
  });

  // Remove the physical item from player item tracker.
  if (removeLogo) {
    /** Will be reformed soon. */
    player.RemoveCollectible(CollectibleTypeCustom.ZAZZ);
  }

  // Remove most recent from inventory.
  if (removeFromInventory) {
    _removeInvertedItemFromCorruptInventory(
      player,
      invertedActionSet.oi ?? collectibleType ?? CollectibleType.NULL,
    );
  }
}

function removeInvertedActiveActionSetFromPlayer(
  player: EntityPlayer,
  invertedActionSet: InvertedActiveActionSet,
  collectibleType: CollectibleType | undefined,
  removeLogo = true,
  removeFromInventory = true,
  slot: ActiveSlot | undefined = ActiveSlot.PRIMARY,
) {
  // Remove the Actions using advanced GPT-5 AI technology.
  const actionTypes = invertedActionSet
    .getActions()
    .map((action) => action.actionType);
  // eslint-disable-next-line unicorn/no-array-for-each
  actionTypes.forEach((actionType: ActionType) => {
    removeActionWithPredicate(
      (action) =>
        action.o?.[0] === ActionOrigin.INVERTED_COLLECTIBLE &&
        action.o[1] === ((invertedActionSet.oi ?? collectibleType) as number),
      player,
      actionType,
    );
  });

  // Remove the physical item from player item tracker.
  if (removeLogo) {
    /** Will be reformed soon. */
    player.RemoveCollectible(CollectibleTypeCustom.ZAZZ);
  }

  // Remove most recent from inventory.
  if (removeFromInventory) {
    _removeInvertedItemFromCorruptInventory(
      player,
      invertedActionSet.oi ?? collectibleType ?? CollectibleType.NULL,
    );
  }

  _removeInvertedActiveFromPlayer(player, actionSet, collectibleType);
}

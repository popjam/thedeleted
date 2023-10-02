/** Functions related to inverted actions and passives the player owns. */

import type { CollectibleType } from "isaac-typescript-definitions";
import { ActiveSlot } from "isaac-typescript-definitions";
import {
  getAndSetInvertedItemActionSet,
  isInvertedItemPassive,
} from "../../../features/corruption/effects/itemEffects";
import {
  _addInvertedPassiveItemToCorruptInventory,
  doesPlayerHaveInvertedPassiveItem,
} from "../../../features/corruption/inventory/itemInventory2";
import { doesPlayerHaveCustomActive } from "../../../features/corruption/inversion/customActives";
import type { InvertedActiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { deepCopy } from "isaacscript-common";
import { _addZazzActiveToPlayer } from "./customActiveHelper";
import { isInvertedActiveActionSet } from "../actionSetHelper";
import type { InvertedPassiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedPassiveActionSet";
import { isAction } from "../../../classes/corruption/actions/Action";
import { addActionsToTracker } from "../../../features/corruption/effects/playerEffects";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { CollectibleTypeCustom } from "../../../enums/general/CollectibleTypeCustom";
import { _addInvertedItemToCorruptInventory } from "../../../features/corruption/inventory/itemInventory";
import { _addInvertedActiveToPlayer } from "../../../classes/facets/CustomActiveFacet";

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
    return doesPlayerHaveInvertedPassiveItem(player, collectibleType);
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
  slot: ActiveSlot = ActiveSlot.PRIMARY,
): void {
  const invertedItemActionSet = getAndSetInvertedItemActionSet(collectibleType);
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
 * @param addToInventory Whether to add the item to the inverted item inventory.
 * @param collectible The collectible the InvertedActionSet refers to.
 * @param slot The slot the inverted active item should go into (default primary).
 */
function addInvertedActiveToPlayer(
  player: EntityPlayer,
  invertedActionSet: InvertedActiveActionSet,
  collectible: CollectibleType,
  addLogo = true,
  slot: ActiveSlot = ActiveSlot.PRIMARY,
) {
  // Create a Deep Copy and add reference Collectible.
  const actionSet = deepCopy<InvertedActiveActionSet>(invertedActionSet);
  actionSet.oi = collectible;

  // Add actions to tracker.
  for (const actionOrResponse of actionSet.getActions()) {
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

  _addInvertedActiveToPlayer(player, actionSet, slot);
}

/**
 * Add the inverted passive ActionSet to the player by adding the Actions and triggering the
 * Responses.
 *
 * @param player The player to add the Active to.
 * @param invertedPassiveActionSet The InvertedActiveActionSet to add.
 * @param collectible The CollectibleType that the passive item refers to.
 * @param addLogo Whether to add the physical item to the inventory (default true).
 * @param addToInventory Whether to add the passive to the player's inventory (default true).
 */
function addInvertedPassiveToPlayer(
  player: EntityPlayer,
  invertedPassiveActionSet: InvertedPassiveActionSet,
  collectible: CollectibleType,
  addLogo = true,
) {
  // Add to the corrupt inventory.
  const copiedActionSet = deepCopy(invertedPassiveActionSet);
  _addInvertedPassiveItemToCorruptInventory(
    player,
    collectible,
    copiedActionSet,
  );

  // Add actions to tracker for optimization. Trigger effects and 'on obtain' Actions.
  for (const actionOrResponse of copiedActionSet.getEffects()) {
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

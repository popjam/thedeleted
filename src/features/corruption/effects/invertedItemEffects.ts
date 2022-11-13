/**
 * Tracks ActionSets (and hence Actions) associated with Inverted CollectibleType. Inverted
 * collectibles of the same CollectibleType share the same ActionSet and will always have an
 * ActionSet.
 */

import { CollectibleType } from "isaac-typescript-definitions";
import { deepCopy, DefaultMap } from "isaacscript-common";
import {
  Action,
  ActionOrigin,
  isAction,
} from "../../../classes/corruption/actions/Action";
import { InvertedItemActionSet } from "../../../classes/corruption/actionSets/InvertedItemActionSet";
import { Response } from "../../../classes/corruption/responses/Response";
import { ActionSetType } from "../../../enums/corruption/actionSets/ActionSetType";
import { CollectibleTypeCustom } from "../../../enums/general/CollectibleTypeCustom";
import { mod } from "../../../mod";
import { addInvertedItemToCorruptInventory } from "../CorruptInventory";
import { getGameInvertedItemActionSet } from "../inversion/playerInversion";
import { addActionsToPlayer } from "./playerEffects";

/** Generates ActionSet */
const factoryFunction = (): InvertedItemActionSet =>
  getGameInvertedItemActionSet();

const v = {
  run: {
    /**
     * ActionSets attached to collectibles which are on an inverted pedestal. Inverted collectibles
     * spawned with no ActionSets are automatically assigned an ActionSet by looking at the inverted
     * players. Inverted collectibles with empty ActionSets are not modified.
     *
     * Two inverted pedestals of the same CollectibleType will share the same ActionSet.
     */
    invertedItems: new DefaultMap<CollectibleType, InvertedItemActionSet>(
      factoryFunction,
    ),
  },
};

export function itemEffectsInit(): void {
  mod.saveDataManager("itemEffects", v);
}

/** Get the ActionSet attached to the inverted item. */
export function getAndSetInvertedItemActionSet(
  collectibleType: CollectibleType,
): InvertedItemActionSet {
  return v.run.invertedItems.getAndSetDefault(collectibleType);
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
): void {
  // This may have changed since the player picked up the item. However, this shouldn't be a big
  // deal.
  const invertedItemActionSet = getAndSetInvertedItemActionSet(collectibleType);
  if (
    invertedItemActionSet.actionSetType === ActionSetType.INVERTED_PASSIVE_ITEM
  ) {
    const actionTypes = invertedItemActionSet
      .getActions()
      .map((action) => action.actionType);
  }
}

/**
 * Adds the ActionSet contents attached to the inverted CollectibleType to the player. Also adds a
 * logo to the inventory and updates the inventory.
 *
 * Actions will be added to the player, and effects will trigger immediately.
 */
export function addInvertedItemToPlayer(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  addLogo = true,
  addToInventory = true,
): void {
  const invertedItemActionSet = getAndSetInvertedItemActionSet(collectibleType);
  // TODO: Update for Actives.
  const actionsAndResponses = deepCopy<Array<Action | Response>>(
    invertedItemActionSet.effects,
  );
  actionsAndResponses.forEach((actionOrResponse) => {
    if (isAction(actionOrResponse)) {
      actionOrResponse.o = [ActionOrigin.INVERTED_COLLECTIBLE, collectibleType];
      addActionsToPlayer(player, actionOrResponse);
    } else {
      actionOrResponse.trigger({ player });
    }
  });

  if (addLogo) {
    player.AddCollectible(CollectibleTypeCustom.ZAZZ);
  }
  if (addToInventory) {
    addInvertedItemToCorruptInventory(player, collectibleType);
  }
}

/**
 * If the inverted item does not already have an ActionSet attached to it, this function will attach
 * one.
 */
export function setInvertedItemActionSetIfNone(
  collectible: CollectibleType,
  actionSet: InvertedItemActionSet,
): void {
  if (!v.run.invertedItems.has(collectible)) {
    setInvertedItemActionSet(collectible, actionSet);
  }
}

/**
 * Sets the ActionSet for the inverted item. If the item already has an ActionSet, this will
 * override it.
 */
export function setInvertedItemActionSet(
  collectible: CollectibleType,
  actionSet: InvertedItemActionSet,
): void {
  v.run.invertedItems.set(collectible, actionSet);
}

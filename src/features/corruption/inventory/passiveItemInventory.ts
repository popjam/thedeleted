/**
 * This file contains functions and data structures related to the passive item inventory in the
 * game. It provides functionality to track and manipulate the inverted passive items of players.
 * The inventory is implemented using a DefaultMap, which maps player indices to arrays of
 * [CollectibleType, ActionSet] tuples. The functions in this file allow retrieving and modifying
 * the inventory, as well as performing various operations on the items. Additionally, there is a
 * function to re-add the actions associated with the inverted passive items to the action tracker
 * after the game is continued.
 */

import type { CollectibleType } from "isaac-typescript-definitions";
import type { PlayerIndex } from "isaacscript-common";
import {
  DefaultMap,
  defaultMapGetPlayer,
  getPlayerIndex,
} from "isaacscript-common";
import type { ActionSet } from "../../../classes/corruption/actionSets/ActionSet";
import { findLastIndexOfArray } from "../../../helper/arrayHelper";
import { mod } from "../../../mod";
import type { Action } from "../../../classes/corruption/actions/Action";

/**
 * We use this inventory to track a players' inverted passive items (in order). Inverted active
 * items are tracked through the 'CustomActiveFacet'. Two inverted passives of the same type will
 * have different ActionSet objects.
 */
const v = {
  run: {
    /** Ordered list of inverted passive items added to the player. */
    items: new DefaultMap<PlayerIndex, Array<[CollectibleType, ActionSet]>>(
      () => [],
    ),
  },
};

export function invertedItemCorruptInit(): void {
  mod.saveDataManager("CorruptInventory", v);
}

/**
 * Returns an ordered array of [CollectibleType, ActionSet] for the passive inverted items a player
 * has.
 */
export function getPlayerInvertedPassiveItems(
  player: EntityPlayer,
): ReadonlyArray<[CollectibleType, ActionSet]> {
  return defaultMapGetPlayer(v.run.items, player);
}

/**
 * Returns the most recently added inverted passive item a player has along with its ActionSet, or
 * undefined if they have none.
 */
export function getPlayerMostRecentInvertedPassiveItem(
  player: EntityPlayer,
): [CollectibleType, ActionSet] | undefined {
  return defaultMapGetPlayer(v.run.items, player).at(-1);
}

/**
 * Returns the most recently added inverted passive item a player has, or undefined if they have
 * none.
 */
export function getPlayerMostRecentInvertedPassiveItemCollectibleType(
  player: EntityPlayer,
): CollectibleType | undefined {
  return defaultMapGetPlayer(v.run.items, player).at(-1)?.[0];
}

/** Returns an ordered array of CollectibleType for the passive inverted items a player has. */
export function getPlayerInvertedPassiveItemCollectibleTypes(
  player: EntityPlayer,
): readonly CollectibleType[] {
  return defaultMapGetPlayer(v.run.items, player).map(([item]) => item);
}

/** Returns an ordered array of ActionSets for the passive inverted items a player has. */
export function getPlayerInvertedPassiveItemActionSets(
  player: EntityPlayer,
): readonly ActionSet[] {
  return defaultMapGetPlayer(v.run.items, player).map(
    ([, actionSet]) => actionSet,
  );
}

/** Returns true if the player has at least one inverted item of the provided CollectibleType. */
export function _doesPlayerHaveInvertedPassiveItem(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): boolean {
  return defaultMapGetPlayer(v.run.items, player).some(
    ([item]) => item === collectibleType,
  );
}

/**
 * Get the amount of inverted passive items a player has. Can specify a certain CollectibleType to
 * filter results.
 */
export function _getPlayerAmountOfInvertedPassiveItems(
  player: EntityPlayer,
  collectibleType?: CollectibleType,
): number {
  if (collectibleType === undefined) {
    return defaultMapGetPlayer(v.run.items, player).length;
  }
  return defaultMapGetPlayer(v.run.items, player).filter(
    ([item]) => item === collectibleType,
  ).length;
}

/**
 * Add an inverted passive item to the inventory. This function shouldn't be called outside certain
 * circumstances.
 */
export function _addInvertedPassiveItemToCorruptInventory(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  actionSet: ActionSet,
): void {
  defaultMapGetPlayer(v.run.items, player).push([collectibleType, actionSet]);
}

/**
 * Remove the most recently added inverted passive item from the inventory. This function shouldn't
 * be called outside certain circumstances.
 */
export function _removeInvertedPassiveItemFromCorruptInventory(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): void {
  const playerInventory = defaultMapGetPlayer(v.run.items, player);
  const index = findLastIndexOfArray(
    playerInventory,
    ([item]) => item === collectibleType,
  );
  if (index !== -1) {
    playerInventory.splice(index, 1);
  }
}

/**
 * Removes a specific action from an ActionSet for a given player and collectible type. This should
 * only be used in certain circumstances.
 */
export function _removeActionFromCorruptInventory(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  actionToRemove: Action,
): boolean {
  const playerInventory = v.run.items.getAndSetDefault(getPlayerIndex(player));

  for (const [item, actionSet] of playerInventory) {
    if (item === collectibleType) {
      const actions = actionSet.getActions();
      const actionIndex = actions.indexOf(actionToRemove);
      if (actionIndex !== -1) {
        actions.splice(actionIndex, 1);
        // Return the action that was removed.
        return true;
      }
    }
  }

  return false;
}

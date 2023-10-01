/** Keeps track of corrupted items added to the player. */

import type { CollectibleType } from "isaac-typescript-definitions";
import type { PlayerIndex } from "isaacscript-common";
import {
  DefaultMap,
  defaultMapGetPlayer,
  isPassiveCollectible,
} from "isaacscript-common";
import { findLastIndexOfArray } from "../../../helper/arrayHelper";
import { fprint } from "../../../helper/printHelper";
import { mod } from "../../../mod";

const v = {
  run: {
    /** Ordered list of inverted items added to the player. Can be both actives and passives. */
    items: new DefaultMap<PlayerIndex, CollectibleType[]>(() => []),
  },
};

export function invertedItemCorruptInit(): void {
  mod.saveDataManager("CorruptInventory", v);
}

/** Returns true if the player has at least one inverted item of the provided CollectibleType. */
export function doesPlayerHaveInvertedItem(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): boolean {
  return defaultMapGetPlayer(v.run.items, player).includes(collectibleType);
}

/**
 * Get the amount of inverted passive items a player has. Can specify a certain CollectibleType to
 * filter results.
 */
export function getPlayerAmountOfInvertedItems(
  player: EntityPlayer,
  collectibleType?: CollectibleType,
): number {
  if (collectibleType === undefined) {
    return defaultMapGetPlayer(v.run.items, player).length;
  }
  return defaultMapGetPlayer(v.run.items, player).filter(
    (item) => item === collectibleType,
  ).length;
}

/**
 * Get an ordered list of inverted items the player has. The last index is the most recently
 * obtained inverted passive.
 */
export function getPlayerInvertedItemInventory(
  player: EntityPlayer,
): CollectibleType[] {
  return defaultMapGetPlayer(v.run.items, player);
}

/**
 * Get the most recent passive inverted item the player has obtained, or undefined if they have
 * none, that has been added to the inverted item inventory.
 */
export function getPlayerMostRecentInvertedItem(
  player: EntityPlayer,
): CollectibleType | undefined {
  // eslint-disable-next-line prefer-destructuring
  const length = defaultMapGetPlayer(v.run.items, player).length;
  if (length === 0) {
    return undefined;
  }
  return defaultMapGetPlayer(v.run.items, player)[length - 1];
}

/**
 * Add an inverted item into the players' inventory tracker. This does not actually give the item to
 * the player, and should probably not get called outside specific functions.
 */

export function _addInvertedItemToCorruptInventory(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): void {
  fprint(`Adding inverted item to inventory: ${collectibleType}`);
  defaultMapGetPlayer(v.run.items, player).push(collectibleType);
}

/**
 * Removes the most recently added item from the inventory of a specified CollectibleType, if it
 * doesn't exist does nothing. Does not actually remove the physical item from the player, or the
 * corrupted effects, use removeInvertedItemFromPlayer() for that.
 */

export function _removeInvertedItemFromCorruptInventory(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): void {
  const inventory = defaultMapGetPlayer(v.run.items, player);
  const index = findLastIndexOfArray(
    inventory,
    (item) => item === collectibleType,
  );
  if (index !== -1) {
    inventory.splice(index, 1);
  }
}

/** Get the amount of passive inverted items the player currently has. */
export function getAmountOfPassivesInInventory(player: EntityPlayer): number {
  const inventory = defaultMapGetPlayer(v.run.items, player);
  return inventory.filter((item) => isPassiveCollectible(item)).length;
}

/** Get the amount of active inverted items the player currently has. */
export function getAmountOfActivesInInventory(player: EntityPlayer): number {
  const inventory = defaultMapGetPlayer(v.run.items, player);
  return inventory.filter((item) => !isPassiveCollectible(item)).length;
}

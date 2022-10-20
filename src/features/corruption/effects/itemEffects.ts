/**
 * Tracks ActionSets (and hence Actions) associated with CollectibleType. Every item can only have
 * one ActionSet. These can either be tied to the inverted form or the normal form.
 */

import { CollectibleType } from "isaac-typescript-definitions";
import { DefaultMap } from "isaacscript-common";
import { ActionSet } from "../../../classes/corruption/actionSets/ActionSet";
import { CollectibleTypeCustom } from "../../../enums/general/CollectibleTypeCustom";
import { mod } from "../../../mod";
import { getGameActionSet } from "../inversion/playerInversion";

/** Generates ActionSet */
const factoryFunction = (): ActionSet => getGameActionSet();

const v = {
  run: {
    /**
     * ActionSets attached to collectibles which are on an inverted pedestal. Inverted collectibles
     * spawned with no ActionSets are automatically assigned an ActionSet by looking at the inverted
     * players. Inverted collectibles with empty ActionSets are not modified.
     */
    invertedItems: new DefaultMap<CollectibleType, ActionSet>(factoryFunction),

    /**
     * Normal items with corrupted effects attached. Normal items do not spawn with default
     * ActionSets, and need to have them added manually through other means. On picking up the item,
     * the player will get any Actions as well as get the normal item.
     */
    normalItems: new Map<CollectibleType, ActionSet>(),
  },
};

export function itemEffectsInit(): void {
  mod.saveDataManager("itemEffects", v);
}

/** Get the ActionSet attached to the inverted version of the item. */
export function getAndSetInvertedItemActionSet(
  collectibleType: CollectibleType,
): ActionSet {
  return v.run.invertedItems.getAndSetDefault(collectibleType);
}

/** Get the ActionSet attached to the normal item. If it has no ActionSet, returns undefined. */
export function getNormalItemActionSet(
  collectibleType: CollectibleType,
): ActionSet | undefined {
  return v.run.normalItems.get(collectibleType);
}

/**
 * Triggers the ActionSet attached to the inverted item, generating one if necessary. Optional
 * parameter to add a 'warning' logo (to the item tracker).
 */
export function addInvertedItemToPlayer(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  addLogo = false,
): void {
  getAndSetInvertedItemActionSet(collectibleType).interact(player);
  if (addLogo) {
    player.AddCollectible(CollectibleTypeCustom.ZAZZ);
  }
}

/**
 * If the inverted item does not already have an ActionSet attached to it, this function will attach
 * one.
 */
export function setInvertedItemActionSetIfNone(
  collectible: CollectibleType,
  actionSet: ActionSet,
): void {
  if (!v.run.invertedItems.has(collectible)) {
    setInvertedItemActionSet(collectible, actionSet);
  }
}

/**
 * If the non inverted item does not already have an ActionSet attached to it, this function will
 * attach one.
 */
export function setNormalItemActionSetIfNone(
  collectible: CollectibleType,
  actionSet: ActionSet,
): void {
  if (!v.run.normalItems.has(collectible)) {
    setNormalItemActionSet(collectible, actionSet);
  }
}

/**
 * Sets the ActionSet for the inverted item. If the item already has an ActionSet, this will
 * override it.
 */
export function setInvertedItemActionSet(
  collectible: CollectibleType,
  actionSet: ActionSet,
): void {
  v.run.invertedItems.set(collectible, actionSet);
}

/**
 * Sets the ActionSet for the non inverted item. If the item already has an ActionSet, this will
 * override it.
 */
export function setNormalItemActionSet(
  collectible: CollectibleType,
  actionSet: ActionSet,
): void {
  v.run.normalItems.set(collectible, actionSet);
}

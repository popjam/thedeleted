/**
 * Tracks ActionSets (and hence Actions) associated with Inverted CollectibleType. Inverted
 * collectibles of the same CollectibleType share the same ActionSet and will always have an
 * ActionSet.
 */

import { CollectibleType } from "isaac-typescript-definitions";
import { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { ActionSetType } from "../../../enums/corruption/actionSets/ActionSetType";
import { getGameInvertedItemActionSet } from "../../../helper/deletedSpecific/inversion/corruptionGeneration";
import { fprint } from "../../../helper/printHelper";
import { mod } from "../../../mod";

const v = {
  run: {
    /**
     * ActionSets attached to collectibles which are on an inverted pedestal. Inverted collectibles
     * spawned with no ActionSets are automatically assigned an ActionSet by looking at the inverted
     * players. Inverted collectibles with empty ActionSets are not modified.
     *
     * Two inverted pedestals of the same CollectibleType will share the same ActionSet.
     */
    invertedItems: new Map<CollectibleType, InvertedItemActionSet>(),
  },
};

export function itemEffectsInit(): void {
  mod.saveDataManager("itemEffects", v);
}

/** Get the ActionSet attached to the inverted collectibleType. */
export function getAndSetInvertedItemActionSet(
  collectibleType: CollectibleType,
): InvertedItemActionSet {
  const invertedActionSet = v.run.invertedItems.get(collectibleType);
  if (invertedActionSet !== undefined) {
    return invertedActionSet;
  }

  fprint("Inverted item action set not found, creating one...");
  const newInvertedActionSet = getGameInvertedItemActionSet({
    collectible: collectibleType,
  });
  v.run.invertedItems.set(collectibleType, newInvertedActionSet);
  return newInvertedActionSet;
}

/** Check if the collectibleType has an ActionSet attached to it. */
export function doesCollectibleHaveInvertedItemActionSet(
  collectibleType: CollectibleType,
): boolean {
  return v.run.invertedItems.has(collectibleType);
}

/**
 * Retrieves the ActionSet attached to the inverted state of the collectible. Note that the
 * collectible passed can be non-inverted.
 */
export function getAndSetInvertedPedestalActionSet(
  collectible: EntityPickupCollectible,
): InvertedItemActionSet {
  return getAndSetInvertedItemActionSet(collectible.SubType);
}

/** Returns true if the Inverted Item is a passive item. */
export function isInvertedItemPassive(
  collectibleType: CollectibleType,
): boolean {
  const invertedItemActionSet = getAndSetInvertedItemActionSet(collectibleType);
  return (
    invertedItemActionSet.actionSetType === ActionSetType.INVERTED_PASSIVE_ITEM
  );
}

/** Returns true if the Inverted CollectibleType is registered with an ActionSet. */
export function doesInvertedItemHaveActionSet(
  collectibleType: CollectibleType,
): boolean {
  return v.run.invertedItems.has(collectibleType);
}

/** Do not use. */
// eslint-disable-next-line no-underscore-dangle
export function _setInvertedItemActionSet(
  collectible: CollectibleType,
  actionSet: InvertedItemActionSet,
): void {
  v.run.invertedItems.set(collectible, actionSet);
}

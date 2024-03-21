/**
 * Tracks ActionSets (and hence Actions) associated with Inverted CollectibleType. Inverted
 * collectibles of the same CollectibleType share the same ActionSet and will always have an
 * ActionSet.
 */

import type { CollectibleType } from "isaac-typescript-definitions";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { ActionSetType } from "../../../enums/corruption/actionSets/ActionSetType";
import { getGameInvertedItemActionSet } from "../../../helper/deletedSpecific/generation/corruptionGeneration";
import { fprint } from "../../../helper/printHelper";
import type { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
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

/**
 * Get the ActionSet attached to the inverted collectibleType. If there is none, will generate a
 * fresh one with the provided inputs (if any). Does not deepCopy!
 */
export function getAndSetInvertedItemActionSet(
  collectibleType: CollectibleType,
  inputs?: ActionSetBuilderInput,
): InvertedItemActionSet {
  const invertedActionSet = v.run.invertedItems.get(collectibleType);
  if (invertedActionSet !== undefined) {
    return invertedActionSet;
  }

  fprint(
    `Inverted item action set not found, creating one for collectibleType: ${collectibleType}`,
  );
  inputs ??= {};
  inputs.collectible = collectibleType;
  const newInvertedActionSet = getGameInvertedItemActionSet(inputs);
  v.run.invertedItems.set(collectibleType, newInvertedActionSet);
  return newInvertedActionSet;
}

/**
 * Get the ActionSet attached to the inverted collectibleType (will return undefined if one doesn't
 * exist). If you need to always return an ActionSet, use getAndSetInvertedItemActionSet().
 */
export function getInvertedItemActionSet(
  collectibleType: CollectibleType,
): InvertedItemActionSet | undefined {
  return v.run.invertedItems.get(collectibleType);
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

/** Returns true if the Inverted Item is an active item. */
export function isInvertedItemActive(
  collectibleType: CollectibleType,
): boolean {
  const invertedItemActionSet = getAndSetInvertedItemActionSet(collectibleType);
  return (
    invertedItemActionSet.actionSetType === ActionSetType.INVERTED_ACTIVE_ITEM
  );
}

/** Returns true if the Inverted CollectibleType is registered with an ActionSet. */
export function doesInvertedItemHaveActionSet(
  collectibleType: CollectibleType,
): boolean {
  return v.run.invertedItems.has(collectibleType);
}

/** Do not use. */

export function _setInvertedItemActionSet(
  collectible: CollectibleType,
  actionSet: InvertedItemActionSet,
): void {
  v.run.invertedItems.set(collectible, actionSet);
}

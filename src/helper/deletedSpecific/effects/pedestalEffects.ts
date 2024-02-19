import { CollectibleType } from "isaac-typescript-definitions";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { getTrackedPedestalInvertedActive } from "../../../features/corruption/effects/activeItemTracker";
import { getAndSetInvertedItemActionSet } from "../../../features/corruption/effects/itemEffects";
import type { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";

/**
 * Get the ActionSet attached to the inverted pedestal. If there is none, will generate a fresh one
 * with the provided builder or inputs (if any). If the inverted pedestal has a tracked active item,
 * will return the tracked active item's ActionSet. This will still work on non-Inverted pedestals.
 *
 * This will still work if the pedestal is not inverted.
 *
 * Does not deepCopy!
 *
 * @returns The inverted pedestal's ActionSet.
 */
export function getAndSetInvertedPedestalActionSet(
  collectible: EntityPickupCollectible,
  inputs?: ActionSetBuilderInput,
): InvertedItemActionSet {
  if (collectible.SubType === CollectibleType.NULL) {
    error("getAndSetInvertedPedestalActionSet: Pedestal is null.");
  }

  const trackedActiveItemActionSet =
    getTrackedPedestalInvertedActive(collectible);
  if (trackedActiveItemActionSet !== undefined) {
    return trackedActiveItemActionSet;
  }

  return getAndSetInvertedItemActionSet(collectible.SubType, inputs);
}

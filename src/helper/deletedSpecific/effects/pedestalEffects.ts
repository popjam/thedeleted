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
 * Does not deepCopy!
 *
 * @returns The inverted pedestal's ActionSet, or undefined if the pedestal is null.
 */
export function getAndSetInvertedPedestalActionSet(
  collectible: EntityPickupCollectible,
  inputs?: ActionSetBuilderInput,
): InvertedItemActionSet | undefined {
  if (collectible.SubType === CollectibleType.NULL) {
    return undefined;
  }

  const trackedActiveItemActionSet =
    getTrackedPedestalInvertedActive(collectible);
  if (trackedActiveItemActionSet !== undefined) {
    return trackedActiveItemActionSet;
  }

  return getAndSetInvertedItemActionSet(collectible.SubType, inputs);
}

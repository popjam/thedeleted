/**
 * Functions to do with setting a pedestal's inversion status. These functions will make sure to
 * update the pedestals as well.
 */

import { CollectibleType } from "isaac-typescript-definitions";
import { getCollectibles } from "isaacscript-common";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { Morality } from "../../../enums/corruption/Morality";
import { getAndSetInvertedItemActionSet } from "../../../features/corruption/effects/itemEffects";
import {
  _setAllPedestalInversion,
  _setPedestalInversion,
  isPickupInverted,
} from "../../../features/corruption/inversion/pickupInversion";
import { hasInvertedPickupBeenSeen } from "../../../features/corruption/inversion/seenInvertedPickups";
import type { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import type { InvertedItemActionSetBuilder } from "../../../types/general/Builder";
import { setInvertedItemActionSetIfNone } from "./itemEffects";
import { addEffectsToNonInvertedPickup } from "./pickupEffects";
import { updatePedestal } from "./updateInverted";

/**
 * Set one pedestal to a specific inversion status. This will also update the pedestal.
 *
 * @param toInverted If true, will set the pedestal to inverted.
 * @param collectible The pedestal to modify.
 * @param invertedItemActionSet Optional, will set the inverted items ActionSet if the item does not
 *                              have an ActionSet (does not DeepCopy).
 * @param inputs Optional inputs that will be used if a new InvertedItemActionSet is created.
 */
export function setPedestalInversion(
  toInverted: boolean,
  collectible: EntityPickupCollectible,
  invertedItemActionSet?: InvertedItemActionSet,
  inputs?: ActionSetBuilderInput,
): void {
  if (collectible.SubType === CollectibleType.NULL) {
    return;
  }

  if (isPickupInverted(collectible) === toInverted) {
    return;
  }

  /** Force the inverted ActionSet if one is not set. */
  if (invertedItemActionSet !== undefined && toInverted) {
    setInvertedItemActionSetIfNone(collectible.SubType, invertedItemActionSet);
  }

  /** Carry over the negative effects if the inverted ActionSet has carryOver attribute. */
  if (!toInverted && hasInvertedPickupBeenSeen(collectible)) {
    const invertedActionSet = getAndSetInvertedItemActionSet(
      collectible.SubType,
    );
    if (invertedActionSet.getNegativesCarryOver()) {
      addEffectsToNonInvertedPickup(
        collectible,
        ...invertedActionSet
          .getEffects()
          .filter((effect) => effect.getMorality() === Morality.NEGATIVE),
      );
    }
  }

  _setPedestalInversion(toInverted, collectible);
  updatePedestal(collectible, inputs);
}

/**
 * Sets all pedestals on the floor to a specific inversion status. This will also update all
 * pedestals in the room.
 *
 * @param inverted If true, will set all pedestals to inverted.
 * @param generationIfEmpty Optional, sets items in room ActionSet using specified builder if item
 *                          does not already have an ActionSet.
 * @param inputs Optional, sets items in room ActionSet using specified builder if item does not
 *               already have an ActionSet.
 */
export function setAllPedestalsOnLevelInversion(
  inverted: boolean,
  generationIfEmpty?: InvertedItemActionSetBuilder,
  inputs?: ActionSetBuilderInput,
): void {
  for (const collectible of getCollectibles()) {
    if (inputs !== undefined) {
      inputs.collectible = collectible.SubType;
    }
    setPedestalInversion(inverted, collectible, generationIfEmpty?.(inputs));
  }
  _setAllPedestalInversion(inverted);
}

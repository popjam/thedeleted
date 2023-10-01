/**
 * Functions to do with setting a pedestal's inversion status. These functions will make sure to
 * update the pedestals as well.
 */

import { CollectibleType } from "isaac-typescript-definitions";
import { getCollectibles } from "isaacscript-common";
import { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { Morality } from "../../../enums/corruption/Morality";
import { getAndSetInvertedItemActionSet } from "../../../features/corruption/effects/itemEffects";
import {
  _setAllPedestalInversion,
  _setPedestalInversion,
  isPickupInverted,
} from "../../../features/corruption/inversion/pickupInversion";
import { hasInvertedPickupBeenSeen } from "../../../features/corruption/inversion/seenInvertedPickups";
import { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import { InvertedItemActionSetBuilder } from "../../../types/general/Builder";
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
  if (invertedItemActionSet !== undefined) {
    if (toInverted) {
      setInvertedItemActionSetIfNone(
        collectible.SubType,
        invertedItemActionSet,
      );
    }
  }

  /** Carry over the negative effects if the inverted ActionSet has carryOver attribute. */
  if (!toInverted) {
    if (hasInvertedPickupBeenSeen(collectible)) {
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
  }

  _setPedestalInversion(toInverted, collectible);
  updatePedestal(collectible, inputs);
}

/**
 * Sets all pedestals on the floor to a specific inversion status. This will also update all
 * pedestals in the room.
 *
 * @param inverted
 * @param generationIfEmpty
 * @param inputs Optional, sets items in room ActionSet using specified builder if item does not
 *               already have an ActionSet.
 */
export function setAllPedestalsOnLevelInversion(
  inverted: boolean,
  generationIfEmpty?: InvertedItemActionSetBuilder,
  inputs?: ActionSetBuilderInput,
): void {
  getCollectibles().forEach((collectible) => {
    if (inputs !== undefined) {
      inputs.collectible = collectible.SubType;
    }
    setPedestalInversion(inverted, collectible, generationIfEmpty?.(inputs));
  });
  _setAllPedestalInversion(inverted);
}

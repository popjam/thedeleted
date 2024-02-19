/**
 * This file contains functions related to setting the inversion status of pedestals in the game. It
 * provides the ability to set the inversion status of individual pedestals as well as all pedestals
 * on a level. The functions handle updating the pedestals and applying effects based on the
 * inversion status.
 */

import { CollectibleType } from "isaac-typescript-definitions";
import { getCollectibles } from "isaacscript-common";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { Morality } from "../../../enums/corruption/Morality";
import { doesInvertedItemHaveActionSet } from "../../../features/corruption/effects/itemEffects";
import {
  _setAllPedestalInversion,
  _setPedestalInversion,
  isPickupInverted,
} from "../../../features/corruption/inversion/pickupInversion";
import { hasInvertedPickupBeenSeen } from "../../../features/corruption/inversion/seenInvertedPickups";
import type { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import type { InvertedItemActionSetBuilder } from "../../../types/general/Builder";
import { setInvertedItemActionSetIfNone } from "../effects/itemEffects";
import { addEffectsToNonInvertedPickup } from "../effects/pickupEffects";
import { updatePedestal } from "./updateInverted";
import { fprint } from "../../printHelper";
import { getAndSetInvertedPedestalActionSet } from "../effects/pedestalEffects";

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
  fprint(`Setting pedestal ${collectible.SubType} to inverted: ${toInverted}`);

  if (collectible.SubType === CollectibleType.NULL) {
    fprint("Cannot set pedestal inversion of NULL collectible.");
    return;
  }

  if (isPickupInverted(collectible) === toInverted) {
    fprint("Pedestal inversion is already set to the specified value.");
    return;
  }

  /** Force the inverted ActionSet if one is not set. */
  if (invertedItemActionSet !== undefined && toInverted) {
    fprint("Forcing inverted ActionSet..");
    setInvertedItemActionSetIfNone(collectible.SubType, invertedItemActionSet);
  }

  /**
   * Carry over the negative effects if the inverted ActionSet has carryOver attribute. Check if the
   * inverted item has an ActionSet, so we don't have to generate one if it doesn't.
   */
  if (
    !toInverted &&
    hasInvertedPickupBeenSeen(collectible) &&
    doesInvertedItemHaveActionSet(collectible.SubType)
  ) {
    fprint(`Carrying over negative effects for ${collectible.SubType}..`);
    const invertedActionSet = getAndSetInvertedPedestalActionSet(
      collectible,
      inputs,
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

/**
 * This file contains functions useful for updating pickups so their appearance and EID description
 * matches their inversion status and ActionSets.
 */

import { CollectibleType } from "isaac-typescript-definitions";
import {
  ColorDefault,
  getCollectibleGfxFilename,
  getCollectibles,
  isCollectible,
  isGlitchedCollectible,
  setCollectibleSprite,
} from "isaacscript-common";
import { returnCorruptedCollectibleSpriteToNormal } from "../../../classes/facets/CorruptedCollectibleSpriteFacet";
import {
  getAndSetNonInvertedPickupActionSet,
  getNonInvertedPickupActionSet,
} from "../../../features/corruption/effects/pickupEffects";
import { isPickupInverted } from "../../../features/corruption/inversion/pickupInversion";
import type { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import { isZazzinatorAny } from "../../../sets/zazzSets";
import {
  getGenericEntityEIDDescriptionObject,
  setSpecificEntityEIDDescriptionObject,
} from "../../compatibility/EID/EIDHelper";
import { fprint } from "../../printHelper";
import { getAndSetInvertedPedestalActionSet } from "../effects/pedestalEffects";
import { Morality } from "../../../enums/corruption/Morality";
import { doesInvertedItemHaveActionSet } from "../../../features/corruption/effects/itemEffects";
import { hasInvertedPickupBeenSeen } from "../../../features/corruption/inversion/seenInvertedPickups";

/**
 * Update pedestal is unique from the 'update pickup' function in that it needs to take into account
 * the inversion status of the pickup.
 *
 * If the pedestal is non-inverted, it needs to be set to default appearance in case it was
 * originally inverted.
 *
 * If a pedestal is inverted, it needs to be changed.
 */
export function updatePedestal(
  pedestal: EntityPickupCollectible,
  inputs?: ActionSetBuilderInput,
): void {
  fprint(
    `updatePedestal: ${pedestal.SubType}, is inverted: ${isPickupInverted(
      pedestal,
    )}`,
  );

  /** If pedestal has a custom sprite, return it to normal. */
  returnCorruptedCollectibleSpriteToNormal(pedestal);

  /** Update the appearance. */
  if (
    pedestal.SubType === CollectibleType.NULL ||
    isZazzinatorAny(pedestal.SubType)
  ) {
    return;
  }
  if (isPickupInverted(pedestal)) {
    fprint(`updatePedestal: ${pedestal.SubType} is inverted`);
    const invertedActionSet = getAndSetInvertedPedestalActionSet(
      pedestal,
      inputs,
    );
    invertedActionSet.updateAppearance(pedestal);
  } else {
    // Carry over negatives.
    carryOverNegatives(pedestal, inputs);

    const nonInvertedActionSet = getNonInvertedPickupActionSet(pedestal);
    if (nonInvertedActionSet === undefined) {
      returnPedestalAppearanceToNormal(pedestal);
    } else {
      nonInvertedActionSet.updateAppearance(pedestal);
    }
  }
}

/** Scans all pedestals in the room. */
export function updatePedestalsInRoom(): void {
  for (const pedestal of getCollectibles()) {
    updatePedestal(pedestal);
  }
}

/**
 * Returns a Pedestals EID and appearance to normal, for example after bitflipping back from the
 * corrupted realm.
 */
function returnPedestalAppearanceToNormal(pedestal: EntityPickupCollectible) {
  if (pedestal.SubType === CollectibleType.NULL) {
    return;
  }
  fprint(`returnPedestalAppearanceToNormal: ${pedestal.SubType}`);
  pedestal.FlipX = false;
  pedestal.SetColor(ColorDefault, 0, 1);
  returnCorruptedCollectibleSpriteToNormal(pedestal);

  if (!isGlitchedCollectible(pedestal)) {
    setCollectibleSprite(pedestal, getCollectibleGfxFilename(pedestal.SubType));
  }
  const genericEIDDesc = getGenericEntityEIDDescriptionObject(pedestal);
  if (genericEIDDesc === undefined) {
    return;
  }
  setSpecificEntityEIDDescriptionObject(pedestal, genericEIDDesc);
}

/**
 * This function is called whenever a pickup inits, or whenever a pickups inversion or subType or
 * ActionSet changes. For example upon bitflipping, all the pedestals in the room are updated to
 * account for the new EID description and change in pedestal appearance.
 */
export function updatePickup(pickup: EntityPickup): void {
  if (isCollectible(pickup)) {
    updatePedestal(pickup);
    return;
  }
  fprint(
    `Updating pickup: ${pickup.Type}, ${pickup.Variant}, ${pickup.SubType}.`,
  );
  const nonInvertedActionSet = getNonInvertedPickupActionSet(pickup);
  if (nonInvertedActionSet === undefined) {
    return;
  }
  nonInvertedActionSet.updateAppearance(pickup);
}

/** Gets called in the 'updatePedestal' function, when a non-Inverted pedestal is updated. */
function carryOverNegatives(
  collectible: EntityPickupCollectible,
  inputs?: ActionSetBuilderInput,
) {
  // Check if the inverted item has an ActionSet, so we don't have to generate one if it doesn't.
  if (
    hasInvertedPickupBeenSeen(collectible) &&
    doesInvertedItemHaveActionSet(collectible.SubType)
  ) {
    const invertedActionSet = getAndSetInvertedPedestalActionSet(
      collectible,
      inputs,
    );
    if (invertedActionSet.getNegativesCarryOver()) {
      const negativeEffects = invertedActionSet
        .getEffects()
        .filter((effect) => effect.getMorality() === Morality.NEGATIVE);

      if (negativeEffects.length > 0) {
        const nonInvertedActionSet =
          getAndSetNonInvertedPickupActionSet(collectible);

        // Check if negatives have already carried over.
        if (nonInvertedActionSet.ngo !== true) {
          fprint(`Carrying over ${negativeEffects.length} negative effects.`);
          nonInvertedActionSet.addEffects(...negativeEffects);
          nonInvertedActionSet.ngo = true;
        }
      }
    }
  }
}

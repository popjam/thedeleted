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
import { getAndSetInvertedItemActionSet } from "../../../features/corruption/effects/itemEffects";
import { getNonInvertedPickupActionSet } from "../../../features/corruption/effects/pickupEffects";
import { isPickupInverted } from "../../../features/corruption/inversion/pickupInversion";
import { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import { isZazzinatorAny } from "../../../sets/zazzSets";
import {
  getGenericEntityEIDDescriptionObject,
  setSpecificEntityEIDDescriptionObject,
} from "../../compatibility/EIDHelper";
import { fprint } from "../../printHelper";

/**
 * Update pedestal is unique from the 'update pickup' function in that it needs to take into account
 * the inversion status of the pickup.
 *
 * If the pedestal is non-inverted, it needs to be set to default appearance in case it was
 * originally inverted.
 *
 * If a pedestal is a 'ZAZZ' item, it needs to be changed. This is done by tracking the most
 * recently removed inverted items from the player.
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
    const invertedActionSet = getAndSetInvertedItemActionSet(
      pedestal.SubType,
      inputs,
    );
    invertedActionSet.updateAppearance(pedestal);
  } else {
    const nonInvertedActionSet = getNonInvertedPickupActionSet(pedestal);
    // TODO: ...
    if (nonInvertedActionSet === undefined) {
      returnPedestalAppearanceToNormal(pedestal);
    } else {
      nonInvertedActionSet.updateAppearance(pedestal);
    }
  }
}

/** Scans all pedestals in the room. */
export function updatePedestalsInRoom(): void {
  getCollectibles().forEach((pedestal) => {
    updatePedestal(pedestal);
  });
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

/**
 * This file contains functions useful for updating pickups so their appearance and EID description
 * matches their inversion status and ActionSets.
 */

import { CollectibleType, PickupVariant } from "isaac-typescript-definitions";
import {
  ColorDefault,
  getCollectibleGfxFilename,
  getCollectibles,
  isGlitchedCollectible,
  setCollectibleSprite,
} from "isaacscript-common";
import { returnCorruptedCollectibleSpriteToNormal } from "../../../classes/facets/CorruptedCollectibleSpriteFacet";
import { getAndSetInvertedItemActionSet } from "../../../features/corruption/effects/itemEffects";
import { getNonInvertedPickupActionSet } from "../../../features/corruption/effects/pickupEffects";
import { isPedestalInverted } from "../../../features/corruption/inversion/pickupInversion";
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
export function updatePedestal(pedestal: EntityPickupCollectible): void {
  fprint(
    `updatePedestal: ${pedestal.SubType}, is inverted: ${isPedestalInverted(
      pedestal,
    )}`,
  );
  if (isPedestalInverted(pedestal)) {
    const invertedActionSet = getAndSetInvertedItemActionSet(pedestal.SubType);
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
  getCollectibles().forEach((pedestal) => updatePedestal(pedestal));
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
 * This function is called whenever a pickup inits, or whenever a pickups inversion or ActionSet
 * changes. For example upon bitflipping, all the pedestals in the room are updated to account for
 * the new EID description and change in pedestal appearance.
 */
export function updatePickup(pickup: EntityPickup): void {
  if (pickup.Variant === PickupVariant.COLLECTIBLE) {
    updatePedestal(pickup as EntityPickupCollectible);
    return;
  }
  const actionSet = getNonInvertedPickupActionSet(pickup);
  actionSet?.updateAppearance(pickup);
}

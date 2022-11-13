import { CollectibleType, PickupVariant } from "isaac-typescript-definitions";
import { ActionSet } from "../../../classes/corruption/actionSets/ActionSet";
import { isPedestalInverted } from "../inversion/pickupInversion";
import { getAndSetInvertedItemActionSet } from "./invertedItemEffects";
import { getNonInvertedPickupActionSet } from "./pickupEffects";

/** General function to get an ActionSet from an inverted or non-inverted pickup. */
export function getEntityActionSet(
  pickup: EntityPickup,
): ActionSet | undefined {
  if (pickup.Variant === PickupVariant.COLLECTIBLE) {
    // Inverted Items.
    if (isPedestalInverted(pickup as EntityPickupCollectible)) {
      return getAndSetInvertedItemActionSet(pickup.SubType as CollectibleType);
    }
  }
  return getNonInvertedPickupActionSet(pickup);
}

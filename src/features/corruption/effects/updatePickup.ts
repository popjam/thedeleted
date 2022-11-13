/**
 * Tracks ActionSets (and hence Actions) attached to non-inverted pickups. Pickups do not
 * automatically come with ActionSets, and must be added manually.
 *
 * The ActionSets attached to these pickups are triggered differently depending on the type of
 * pickup.
 *
 * For example, a key with an ActionSet will be triggered upon picking up the key, while a card with
 * an ActionSet will be triggered upon using the card.
 *
 * ActionSets are tied to individual pickups (PickupIndex), not shared among types.
 */

import { PickupVariant } from "isaac-typescript-definitions";
import { updatePedestal } from "../inversion/pickupInversion";
import { getNonInvertedPickupActionSet } from "./pickupEffects";

/**
 * This function is called whenever a pickup inits, or whenever a pickups inversion or ActionSet
 * changes. For example upon bitflipping, all the pedestals in the room are updated to account for
 * the new EID description and change in pedestal appearance.
 */
export function updatePickup(pickup: EntityPickup): void {
  if (pickup.Variant === PickupVariant.COLLECTIBLE) {
    updatePedestal(pickup as EntityPickupCollectible);
  }
  const actionSet = getNonInvertedPickupActionSet(pickup);
  actionSet?.updateAppearance(pickup);
}

// POST_PICKUP_INIT_LATE
export function pickupEffectsPostPickupInitLate(pickup: EntityPickup): void {
  updatePickup(pickup);
}

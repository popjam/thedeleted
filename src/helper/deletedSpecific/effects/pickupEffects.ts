/** Functions related to non-inverted pickup corrupted effects. */

import { PickupVariant } from "isaac-typescript-definitions";
import type { ActionSet } from "../../../classes/corruption/actionSets/ActionSet";
import { NonInvertedPickupActionSet } from "../../../classes/corruption/actionSets/NonInverted/NonInvertedPickupActionSet";
import type { Action } from "../../../classes/corruption/actions/Action";
import type { Response } from "../../../classes/corruption/responses/Response";
import {
  _setPickupIndexActionSet,
  getNonInvertedPickupActionSet,
} from "../../../features/corruption/effects/pickupEffects";
import { isPickupInverted } from "../../../features/corruption/inversion/pickupInversion";
import { mod } from "../../../mod";
import { getAndSetInvertedPedestalActionSet } from "./pedestalEffects";
import { updatePickup } from "../inversion/updateInverted";

/**
 * Sets the ActionSet of the non-inverted pickup (which is unique per PickupIndex). Updates the
 * pickup.
 */
export function setNonInvertedPickupActionSet(
  pickup: EntityPickup,
  actionSet: NonInvertedPickupActionSet,
): void {
  _setPickupIndexActionSet(mod.getPickupIndex(pickup), actionSet);
  updatePickup(pickup);
  // if (isPickupInverted(pickup)) { }
}

/**
 * Retrieves the PickupActionSet of a non-inverted pickup. If one does not exist, an empty one will
 * be created.
 */
export function getAndSetNonInvertedPickupActionSet(
  pickup: EntityPickup,
): NonInvertedPickupActionSet {
  const actionSet = getNonInvertedPickupActionSet(pickup);
  if (actionSet !== undefined) {
    return actionSet;
  }
  const newActionSet = new NonInvertedPickupActionSet();
  setNonInvertedPickupActionSet(pickup, newActionSet);
  return newActionSet;
}

/**
 * Add Actions or Responses to the non-Inverted pickup. If a pickup is inverted, this will still add
 * them to the pickups non-inverted state. If a NonInvertedActionSet does not exist, it will be
 * created. Does not deepCopy!
 *
 * @returns The NonInvertedPickupActionSet of the pickup.
 */
export function addEffectsToNonInvertedPickup(
  pickup: EntityPickup,
  ...effects: ReadonlyArray<Response | Action>
): NonInvertedPickupActionSet {
  const nonInvertedActionSet = getNonInvertedPickupActionSet(pickup);
  if (nonInvertedActionSet === undefined) {
    const newNonInvertedActionSet = new NonInvertedPickupActionSet().addEffects(
      ...effects,
    );
    setNonInvertedPickupActionSet(pickup, newNonInvertedActionSet);
    return newNonInvertedActionSet;
  }
  nonInvertedActionSet.addEffects(...effects);
  updatePickup(pickup);
  return nonInvertedActionSet;
}

/**
 * General function to get an ActionSet from an inverted or non-inverted pickup. Will take into
 * account if the pickup is inverted.
 *
 * @param pickup The pickup to get the ActionSet from.
 *
 * @returns The ActionSet of the pickup, or undefined if the pickup does not have an ActionSet.
 */
export function getPickupActionSet(
  pickup: EntityPickup,
): ActionSet | undefined {
  if (
    pickup.Variant === PickupVariant.COLLECTIBLE && // Inverted Items.
    isPickupInverted(pickup as EntityPickupCollectible)
  ) {
    // TODO: Change to getAndSetTrackedInvertedItemActionSet().
    return getAndSetInvertedPedestalActionSet(
      pickup as EntityPickupCollectible,
    );
  }
  return getNonInvertedPickupActionSet(pickup);
}

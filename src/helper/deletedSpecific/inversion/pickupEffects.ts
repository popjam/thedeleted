import { CollectibleType, PickupVariant } from "isaac-typescript-definitions";
import { ActionSet } from "../../../classes/corruption/actionSets/ActionSet";
import { NonInvertedPickupActionSet } from "../../../classes/corruption/actionSets/NonInverted/NonInvertedPickupActionSet";
import { Action } from "../../../classes/corruption/actions/Action";
import { Response } from "../../../classes/corruption/responses/Response";
import { getAndSetInvertedItemActionSet } from "../../../features/corruption/effects/itemEffects";
import {
  _setPickupIndexActionSet,
  getNonInvertedPickupActionSet,
} from "../../../features/corruption/effects/pickupEffects";
import { isPickupInverted } from "../../../features/corruption/inversion/pickupInversion";
import { mod } from "../../../mod";
import { updatePickup } from "./updateInverted";

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
 */
export function addEffectsToNonInvertedPickup(
  pickup: EntityPickup,
  ...effects: Array<Response | Action>
): void {
  const nonInvertedActionSet = getNonInvertedPickupActionSet(pickup);
  if (nonInvertedActionSet !== undefined) {
    nonInvertedActionSet.addEffects(...effects);
    updatePickup(pickup);
  } else {
    setNonInvertedPickupActionSet(
      pickup,
      new NonInvertedPickupActionSet().addEffects(...effects),
    );
  }
}

/**
 * General function to get an ActionSet from an inverted or non-inverted pickup. Will take into
 * account if the pickup is inverted.
 */
export function getPickupActionSet(
  pickup: EntityPickup,
): ActionSet | undefined {
  if (pickup.Variant === PickupVariant.COLLECTIBLE) {
    // Inverted Items.
    if (isPickupInverted(pickup as EntityPickupCollectible)) {
      return getAndSetInvertedItemActionSet(pickup.SubType as CollectibleType);
    }
  }
  return getNonInvertedPickupActionSet(pickup);
}

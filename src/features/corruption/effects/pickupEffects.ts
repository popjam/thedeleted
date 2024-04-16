import type { PickupIndex } from "isaacscript-common";
import { NonInvertedPickupActionSet } from "../../../classes/corruption/actionSets/NonInverted/NonInvertedPickupActionSet";
import { mod } from "../../../mod";

const v = {
  run: {
    /**
     * Non-inverted pickups with corrupted effects attached. Pickups do not spawn with default
     * ActionSets, and need to have them added manually through other means.
     *
     * These effects do not affect inverted pickups.
     */
    pickup: new Map<PickupIndex, NonInvertedPickupActionSet>(),
  },
};

export function pickupEffectsInit(): void {
  mod.saveDataManager("pickupEffects", v);
}

/**
 * Retrieves the non-inverted pickup ActionSet (which is unique per PickupIndex). This will still
 * work as intended if called on an inverted pickup.
 */
export function getNonInvertedPickupActionSet(
  pickup: EntityPickup,
): NonInvertedPickupActionSet | undefined {
  return v.run.pickup.get(mod.getPickupIndex(pickup));
}

/**
 * Retrieves and sets the non-inverted pickup action set for a given pickup. If the action set is
 * already defined, it is returned. Otherwise, a new action set is created and set for the pickup.
 *
 * @param pickup The EntityPickup for which to get and set the action set.
 * @param nonInvertedActionSet Optional. A NonInvertedPickupActionSet to use if the pickup does not
 *                             already have an action set.
 * @returns The NonInvertedPickupActionSet for the pickup.
 */
export function getAndSetNonInvertedPickupActionSet(
  pickup: EntityPickup,
  nonInvertedActionSet?: NonInvertedPickupActionSet,
): NonInvertedPickupActionSet {
  const pickupIndex = mod.getPickupIndex(pickup);
  const actionSet = getNonInvertedPickupIndexActionSet(pickupIndex);
  if (actionSet !== undefined) {
    return actionSet;
  }
  const newActionSet = nonInvertedActionSet ?? new NonInvertedPickupActionSet();
  _setPickupIndexActionSet(pickupIndex, newActionSet);
  return newActionSet;
}

/**
 * Retrieves the non-inverted pickup ActionSet (which is unique per PickupIndex). This will still
 * work as intended if called on an inverted pickup.
 */
export function getNonInvertedPickupIndexActionSet(
  pickupIndex: PickupIndex,
): NonInvertedPickupActionSet | undefined {
  return v.run.pickup.get(pickupIndex);
}

/** Don't use this function. */

export function _setPickupIndexActionSet(
  pickupIndex: PickupIndex,
  actionSet: NonInvertedPickupActionSet,
): void {
  v.run.pickup.set(pickupIndex, actionSet);
}

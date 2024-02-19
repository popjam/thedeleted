import type { PickupIndex } from "isaacscript-common";
import type { NonInvertedPickupActionSet } from "../../../classes/corruption/actionSets/NonInverted/NonInvertedPickupActionSet";
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

/** Don't use this function. */

export function _setPickupIndexActionSet(
  pickupIndex: PickupIndex,
  actionSet: NonInvertedPickupActionSet,
): void {
  v.run.pickup.set(pickupIndex, actionSet);
}

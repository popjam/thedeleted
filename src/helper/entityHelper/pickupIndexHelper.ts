import type { PickupIndex } from "isaacscript-common";
import { getPickups } from "isaacscript-common";
import { mod } from "../../mod";

/**
 * Finds a pickup in the room which has the specified PickupIndex. If it can't find one, returns
 * undefined.
 */
export function getPickupWithPickupIndex(
  pickupIndex: PickupIndex,
): EntityPickup | undefined {
  for (const pickup of getPickups()) {
    if (mod.getPickupIndex(pickup) === pickupIndex) {
      return pickup;
    }
  }

  return undefined;
}

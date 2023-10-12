import type { PickupIndex } from "isaacscript-common";
import { mod } from "../../../mod";

const v = {
  level: {
    /** Default pedestal inversion status is the current game inversion status. */
    seenInverted: new Map<PickupIndex, boolean>(),
  },
};

export function seenInvertedPickupInit(): void {
  mod.saveDataManager("seenInvertedPickup", v);
}

/**
 * If the passed pickup has an inverted version, and the inverted version has been seen once
 * (meaning the player has been in the same room as it), this will return true.
 */
export function hasInvertedPickupBeenSeen(pickup: EntityPickup): boolean {
  return v.level.seenInverted.has(mod.getPickupIndex(pickup));
}

// eslint-disable-next-line no-underscore-dangle
export function _invertedPickupHasBeenSeen(pickup: EntityPickup): void {
  v.level.seenInverted.set(mod.getPickupIndex(pickup), true);
}

/**
 * Keeps track of and manages the inversion status of pickups, more specifically pedestals. If a
 * pedestal spawns of unknown inversion status (e.g when first loading in), it is defaulted to the
 * current game inversion status.
 */

import { CollectibleType } from "isaac-typescript-definitions";
import { DefaultMap, PickupIndex } from "isaacscript-common";
import { mod } from "../../../mod";
import { isGameInverted } from "./playerInversion";

/**
 * Keeps track of and manages 'inverted items'. When an item spawns, the game checks if it should be
 * inverted or not by looking at the game inversion status. If the item should be inverted, inverts
 * it.
 */
// TODO: Update to track all pickup inversions.

const v = {
  level: {
    /** Default pedestal inversion status is the current game inversion status. */
    isInverted: new DefaultMap<PickupIndex, boolean>(() => isGameInverted()),
  },
};

export function pickupInversionInit(): void {
  mod.saveDataManager("pickupInversion", v);
}

/** Check if the collectible entity is inverted. */
export function isPedestalInverted(
  collectible: EntityPickupCollectible,
): boolean {
  if (collectible.SubType === CollectibleType.NULL) {
    return false;
  }

  return v.level.isInverted.getAndSetDefault(mod.getPickupIndex(collectible));
}

/** Do not use. */
// eslint-disable-next-line no-underscore-dangle
export function _setPedestalInversion(
  inverted: boolean,
  collectible: EntityPickupCollectible,
): void {
  if (collectible.SubType === CollectibleType.NULL) {
    return;
  }

  v.level.isInverted.set(mod.getPickupIndex(collectible), inverted);
}

/** Do not use. */
// eslint-disable-next-line no-underscore-dangle
export function _setAllPedestalInversion(inverted: boolean): void {
  v.level.isInverted.forEach((_value, key) =>
    v.level.isInverted.set(key, inverted),
  );
}

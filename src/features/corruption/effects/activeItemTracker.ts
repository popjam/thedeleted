/**
 * This feature keeps track active items on the floor and their charge status. Once an Inverted
 * Active item has been placed on the ground, it will be tracked by this feature.
 */

import type { PickupIndex } from "isaacscript-common";
import type { InvertedActiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { mod } from "../../../mod";

const v = {
  level: {
    activeItems: new Map<PickupIndex, number>(),
    invertedActiveItems: new Map<PickupIndex, InvertedActiveActionSet>(),
  },
};

export function activeItemTrackerInit(): void {
  mod.saveDataManager("activeItemTracker", v);
}

/** Get the charge of the tracked non-Inverted active item. */
export function getTrackedPedestalChargeFromPickupIndex(
  pickupIndex: PickupIndex,
): number | undefined {
  return v.level.activeItems.get(pickupIndex) ?? undefined;
}

/** Set the charge of the tracked non-Inverted active item. */
export function setTrackedPedestalChargeFromPickupIndex(
  pickupIndex: PickupIndex,
  charge: number,
): void {
  v.level.activeItems.set(pickupIndex, charge);
}

export function removeTrackedPedestalChargeFromPickupIndex(
  pickupIndex: PickupIndex,
): void {
  v.level.activeItems.delete(pickupIndex);
}

/** Get the charge of the tracked non-Inverted active item. */
export function getTrackedPedestalCharge(
  pedestal: EntityPickupCollectible,
): number | undefined {
  return v.level.activeItems.get(mod.getPickupIndex(pedestal)) ?? undefined;
}

/** Set the charge of the tracked non-Inverted active item. */
export function setTrackedPedestalCharge(
  pedestal: EntityPickupCollectible,
  charge: number,
): void {
  v.level.activeItems.set(mod.getPickupIndex(pedestal), charge);
}

export function removeTrackedPedestalInvertedActive(
  pedestal: EntityPickupCollectible,
): void {
  v.level.invertedActiveItems.delete(mod.getPickupIndex(pedestal));
}

/**
 * Track a Custom Active / Inverted Active that has been dropped onto a pedestal.
 *
 * @param pedestal The pedestal the item was dropped onto.
 * @param actionSet The InvertedActiveActionSet associated with the pedestal. If undefined, the
 *                  pedestal will be removed from the tracker.
 */
export function setTrackedPedestalInvertedActive(
  pedestal: EntityPickupCollectible,
  actionSet: InvertedActiveActionSet,
): void {
  v.level.invertedActiveItems.set(mod.getPickupIndex(pedestal), actionSet);
}

/**
 * Get the InvertedActiveActionSet associated with a pedestal, if it exists. This will still return
 * the action set if the pedestal is not inverted. Does not deepCopy.
 */
export function getTrackedPedestalInvertedActive(
  pedestal: EntityPickupCollectible,
): InvertedActiveActionSet | undefined {
  return v.level.invertedActiveItems.get(mod.getPickupIndex(pedestal));
}

/**
 * Get the InvertedActiveActionSet associated with a pickup index, if it exists. This will still
 * return the action set if the pedestal is not inverted. Does not deepCopy.
 */
export function getTrackedPedestalInvertedActiveFromPickupIndex(
  pickupIndex: PickupIndex,
): InvertedActiveActionSet | undefined {
  return v.level.invertedActiveItems.get(pickupIndex);
}

/**
 * Get the tracked InvertedActiveActionSet associated with a pedestal, removing it if it exists.
 * This will still return the action set if the pedestal is not inverted. Does not deepCopy.
 */
export function getAndRemoveTrackedPedestalInvertedActive(
  pedestal: EntityPickupCollectible,
): InvertedActiveActionSet | undefined {
  const actionSet = getTrackedPedestalInvertedActive(pedestal);
  if (actionSet === undefined) {
    return undefined;
  }

  removeTrackedPedestalInvertedActive(pedestal);
  return actionSet;
}

/**
 * Get the tracked InvertedActiveActionSet associated with a pickup Index, removing it if it exists.
 * This will still return the action set if the pedestal is not inverted. Does not deepCopy.
 */
export function getAndRemoveTrackedPedestalInvertedActiveFromPickupIndex(
  pickupIndex: PickupIndex,
): InvertedActiveActionSet | undefined {
  const actionSet = v.level.invertedActiveItems.get(pickupIndex);
  if (actionSet === undefined) {
    return undefined;
  }

  v.level.invertedActiveItems.delete(pickupIndex);
  return actionSet;
}

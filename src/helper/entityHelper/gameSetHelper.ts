// Functions related to game sets.

import type { EntityID } from "isaacscript-common";
import { getRandomSetElement } from "isaacscript-common";
import type { PickupID } from "../../enums/data/ID/PickupID";
import { EntityCategory } from "../../enums/general/EntityCategory";
import {
  getEntityIDSetFromCategory,
  getModdedEntityIDSetFromCategory,
  getNonModdedEntityIDSetFromCategory,
} from "../../features/data/gameSets/gameSets";

/**
 * Retrieves a random PickupID.
 *
 * @param seedOrRNG Optional seed or RNG object used for randomization.
 * @param modded Optional flag indicating whether to use or not use modded EntityIDs. Default is
 *               either.
 * @returns A random PickupID, or undefined if the set is empty.
 */
export function getRandomPickupID(
  seedOrRNG?: Seed | RNG,
  modded?: boolean,
): PickupID | undefined {
  let pickupIDSet: ReadonlySet<EntityID> | undefined;
  if (modded === undefined) {
    pickupIDSet = getEntityIDSetFromCategory(EntityCategory.PICKUP);
  } else {
    pickupIDSet = modded
      ? getModdedEntityIDSetFromCategory(EntityCategory.PICKUP)
      : getNonModdedEntityIDSetFromCategory(EntityCategory.PICKUP);
  }

  if (pickupIDSet.size === 0) {
    return undefined;
  }

  return getRandomSetElement(pickupIDSet, seedOrRNG) as PickupID;
}

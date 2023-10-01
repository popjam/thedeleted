/** This file tracks the last picked up inverted collectible that each player has picked up. */

import type { CollectibleType } from "isaac-typescript-definitions";
import type { PickupIndex, PlayerIndex } from "isaacscript-common";
import { getPlayerIndex } from "isaacscript-common";
import type { NonInvertedPickupActionSet } from "../../../classes/corruption/actionSets/NonInverted/NonInvertedPickupActionSet";
import { getPickupWithPickupIndex } from "../../../helper/entityHelper/pickupIndexHelper";
import { fprint } from "../../../helper/printHelper";
import { mod } from "../../../mod";

export enum PickupStage {
  PRE_GET_PEDESTAL,
  PRE_GET_PEDESTAL_ZAZZ,
  PRE_ITEM_PICKUP,
  POST_ITEM_PICKUP,
}

const v = {
  run: {
    lastPickedUpCollectible: new Map<
      PlayerIndex,
      | {
          collectibleType: CollectibleType;
          pickupStage: PickupStage;
          pickupIndex: PickupIndex;
          inverted: boolean;
        }
      | undefined
    >(),

    /**
     * Non-Inverted Pickup ActionSets Attached to collectibles need to be tracked, as they are
     * unique to the specific PickupIndex.
     */
    lastPickedUpNonInvertedCollectibleActionSet: new Map<
      PlayerIndex,
      NonInvertedPickupActionSet
    >(),
  },
};

export function lastPickedUpInvertedCollectibleInit(): void {
  mod.saveDataManager("lastPickedUpInvertedCollectible", v);
}

/**
 * Get the last collectible that the player picked up, plus additional data.
 *
 * CollectibleType - The Collectible the player is in the process of picking up.
 *
 * PickupStage - What stage of the inverted pickup process the player is in.
 *
 * PickupIndex - The index of the pedestal the player is picking up from.
 *
 * Inverted - Whether or not the pickup is inverted.
 */
export function getLastPickedUpCollectible(player: EntityPlayer):
  | {
      collectibleType: CollectibleType;
      pickupStage: PickupStage;
      pickupIndex: PickupIndex;
      inverted: boolean;
    }
  | undefined {
  return v.run.lastPickedUpCollectible.get(getPlayerIndex(player));
}

/**
 * Set the last collectible that the player picked up, plus additional data.
 *
 * CollectibleType - The Collectible the player is in the process of picking up.
 *
 * PickupStage - What stage of the pickup process the player is in.
 *
 * PickupIndex - The index of the pedestal the player is picking up from.
 *
 * Inverted - Whether or not the pickup is inverted.
 */

export function setLastPickedUpCollectible(
  player: EntityPlayer,
  collectible:
    | {
        collectibleType: CollectibleType;
        pickupStage: PickupStage;
        pickupIndex: PickupIndex;
        inverted: boolean;
      }
    | undefined,
): void {
  v.run.lastPickedUpCollectible.set(getPlayerIndex(player), collectible);
}

/**
 * Checks if the specified pedestal is in the 'PRE_GET_PEDESTAL' stage. For non-Inverted pedestals,
 * this will only consist of the 'PRE_GET_PEDESTAL' stage. For Inverted pedestals, this will consist
 * of the 'PRE_GET_PEDESTAL' and 'PRE_GET_PEDESTAL_ZAZZ' stages, as the pedestal needs to be first
 * transformed into a dummy zazz item before pickup.
 */
export function isPedestalInPreGetPedestalStage(
  pedestal: EntityPickupCollectible,
): boolean {
  const pickupData = getPedestalPickingUpData(pedestal);
  if (pickupData === undefined) {
    return false;
  }

  return (
    pickupData.pickupStage === PickupStage.PRE_GET_PEDESTAL ||
    pickupData.pickupStage === PickupStage.PRE_GET_PEDESTAL_ZAZZ
  );
}

/**
 * When the item on the pedestal has been picked up and is being held up by the player (but not in
 * the players inventory yet). Note that a new item may be on the pedestal in this stage, if the
 * player is swapping an active item for an active item.
 */
export function isPedestalInPreItemPickupStage(
  pedestal: EntityPickupCollectible,
): boolean {
  const pickupData = getPedestalPickingUpData(pedestal);
  if (pickupData === undefined) {
    return false;
  }

  return pickupData.pickupStage === PickupStage.PRE_ITEM_PICKUP;
}

/**
 * When the item on the pedestal has been picked up, gone in to item queue, and exited itemQueue to
 * appear in the players inventory. Note that a new item may be on the pedestal in this stage, if
 * the player is swapping an active item for an active item.
 */
export function isPedestalInPostItemPickupStage(
  pedestal: EntityPickupCollectible,
): boolean {
  const pickupData = getPedestalPickingUpData(pedestal);
  if (pickupData === undefined) {
    return false;
  }

  return pickupData.pickupStage === PickupStage.POST_ITEM_PICKUP;
}

/**
 * If a pedestal is in the process of being used for an Inverted Collectible pickup, the PickupData
 * will be returned. Otherwise, this returns undefined.
 */
export function getPedestalPickingUpData(pedestal: EntityPickupCollectible):
  | {
      collectibleType: CollectibleType;
      pickupStage: PickupStage;
      pickupIndex: PickupIndex;
      inverted: boolean;
    }
  | undefined {
  const pickupDatas = [...v.run.lastPickedUpCollectible.values()];
  // eslint-disable-next-line isaacscript/no-let-any
  let match;
  for (const pickupData of pickupDatas) {
    if (
      pickupData !== undefined &&
      pickupData.pickupIndex === mod.getPickupIndex(pedestal)
    ) {
      match = pickupData;
    }
  }

  return match;
}

/** If the player is in the process of picking up an item, update the stage its in. */
export function updateLastPickedUpCollectible(
  player: EntityPlayer,
  pickupStage: PickupStage,
): void {
  const playerIndex = getPlayerIndex(player);
  if (v.run.lastPickedUpCollectible.has(playerIndex)) {
    const pickupData = v.run.lastPickedUpCollectible.get(playerIndex) as {
      collectibleType: CollectibleType;
      pickupStage: PickupStage;
      pickupIndex: PickupIndex;
    };
    pickupData.pickupStage = pickupStage;
  }
}

/**
 * Gets the last pedestal the player has picked up an item from, or undefined if it cannot find one.
 * The player may be in the process of picking up an item from it.
 */
export function getLastPickedUpPedestal(
  player: EntityPlayer,
): EntityPickupCollectible | undefined {
  const pickupData = getLastPickedUpCollectible(player);
  if (pickupData === undefined) {
    fprint("Failed to get the last picked up pedestal for the player.");
    return undefined;
  }

  return getPickupWithPickupIndex(
    pickupData.pickupIndex,
  ) as EntityPickupCollectible;
}

/**
 * Get the NonInvertedPickupActionSet attached to the last non-inverted collectible the player
 * picked up, if any.
 */
export function getLastPickedUpNonInvertedCollectibleActionSet(
  player: EntityPlayer,
): NonInvertedPickupActionSet | undefined {
  return v.run.lastPickedUpNonInvertedCollectibleActionSet.get(
    getPlayerIndex(player),
  );
}

/**
 * Set the NonInvertedPickupActionSet attached to the last non-inverted collectible the player
 * picked up, if any.
 */
export function setLastPickedUpNonInvertedCollectibleActionSet(
  player: EntityPlayer,
  actionSet: NonInvertedPickupActionSet,
): void {
  v.run.lastPickedUpNonInvertedCollectibleActionSet.set(
    getPlayerIndex(player),
    actionSet,
  );
}

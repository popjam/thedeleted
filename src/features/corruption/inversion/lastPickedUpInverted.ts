/** This file tracks the last picked up inverted collectible that each player has picked up. */

import type { PlayerIndex } from "isaacscript-common";
import { getPlayerIndex } from "isaacscript-common";
import type { NonInvertedPickupActionSet } from "../../../classes/corruption/actionSets/NonInverted/NonInvertedPickupActionSet";
import { fprint } from "../../../helper/printHelper";
import { mod } from "../../../mod";
import { PickupStage } from "../../../enums/general/PickupStage";
import type { LastPickedUpCollectibleData } from "../../../interfaces/corruption/inversion/LastPickedUpCollectibleData";

const v = {
  run: {
    lastPickedUpCollectible: new Map<
      PlayerIndex,
      LastPickedUpCollectibleData
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
  mod.saveDataManager("lastPickedUpInvertedCollectible", v, false);
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
export function getLastPickedUpCollectibleData(
  player: EntityPlayer,
): LastPickedUpCollectibleData | undefined {
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

export function setLastPickedUpCollectibleData(
  player: EntityPlayer,
  collectible: LastPickedUpCollectibleData | undefined,
): void {
  if (collectible === undefined) {
    v.run.lastPickedUpCollectible.delete(getPlayerIndex(player));
    return;
  }
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
 * If a pedestal is in the process of being used for an Inverted Collectible pickup, the PickupData
 * will be returned. Otherwise, this returns undefined.
 */
export function getPedestalPickingUpData(
  pedestal: EntityPickupCollectible,
): LastPickedUpCollectibleData | undefined {
  const pickupDatas = [...v.run.lastPickedUpCollectible.values()];
  // eslint-disable-next-line isaacscript/no-let-any
  let match;
  for (const pickupData of pickupDatas) {
    if (
      pickupData !== undefined &&
      pickupData.pickupIndex === mod["getPickupIndex"](pedestal)
    ) {
      match = pickupData;
    }
  }

  return match;
}

/**
 * If the player is in the process of picking up an item, update the stage its in. Alternatively,
 * set it to undefined if the player is not picking up an item.
 */
export function updateLastPickedUpCollectible(
  player: EntityPlayer,
  pickupStage: PickupStage,
): void {
  const playerIndex = getPlayerIndex(player);
  if (v.run.lastPickedUpCollectible.has(playerIndex)) {
    const pickupData = v.run.lastPickedUpCollectible.get(playerIndex);

    if (pickupData === undefined) {
      fprint("Failed to get the last picked up collectible for the player.");
      return;
    }
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
  const pickupData = getLastPickedUpCollectibleData(player);
  if (pickupData === undefined) {
    fprint("Failed to get the last picked up pedestal for the player.");
    return undefined;
  }

  return pickupData.pedestal;
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

/** Checks if the player is picking up a collectible using the 'lastPickedUpItem' functionality. */
export function isPlayerPickingUpItem(player: EntityPlayer): boolean {
  return v.run.lastPickedUpCollectible.has(getPlayerIndex(player));
}

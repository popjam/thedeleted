/** Functions that aid the CustomActiveHelper. */

import type { CollectibleType } from "isaac-typescript-definitions";
import { ActiveSlot } from "isaac-typescript-definitions";
import type { InvertedActiveActionSet } from "../../../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { isZazzinatorActive } from "../../../../sets/zazzSets";
import {
  getCollectibleChargeType,
  getCollectibleMaxCharges,
} from "isaacscript-common";

/**
 * Checks if the InvertedActiveActionSet matches the Zazzinator dummy item by comparing the charge
 * type, charges, and whether or not it is a copy.
 */
export function doesInvertedActiveActionSetMatchZazzActive(
  actionSet: InvertedActiveActionSet,
  zazzActive: CollectibleType,
): boolean {
  const chargeType = actionSet.getChargeType();
  const charges = actionSet.getTotalCharges();

  if (!isZazzinatorActive(zazzActive)) {
    return false;
  }

  if (charges !== getCollectibleMaxCharges(zazzActive)) {
    return false;
  }

  if (chargeType !== getCollectibleChargeType(zazzActive)) {
    return false;
  }

  return true;
}

/**
 * Add the Zazzinator Active that correlates with the InvertedActiveActionSet to the desired slot.
 * Note: This shouldn't be used as it only adds a dead item to the player, use
 * 'addInvertedActionSetToPlayer()' instead.
 *
 * @param player The player to add the Zazzinator Active to.
 * @param actionSet The InvertedActiveActionSet to add.
 * @param slot The slot to add the Zazzinator Active to.
 */
export function _addZazzActiveToPlayer(
  player: EntityPlayer,
  actionSet: InvertedActiveActionSet,
  slot: ActiveSlot,
): void {
  if (slot === ActiveSlot.PRIMARY || slot === ActiveSlot.SECONDARY) {
    player.AddCollectible(
      actionSet.getZazzActive(actionSet),
      actionSet.getTotalCharges(),
      undefined,
      slot,
    );
  } else if (slot === ActiveSlot.POCKET) {
    player.SetPocketActiveItem(actionSet.getZazzActive(actionSet), slot);
  }
}

/**
 * Removes the physical Zazz Active that correlates with the provided InvertedActiveActionSet from
 * the player. Note: This shouldn't be used as it only removes a dead item from the player.
 */
export function _removeZazzActiveFromPlayer(
  player: EntityPlayer,
  actionSet: InvertedActiveActionSet,
  slot: ActiveSlot,
): void {
  const zazzActive = actionSet.getZazzActive(actionSet);
  if (player.GetActiveItem(slot) === zazzActive) {
    player.RemoveCollectible(zazzActive);
  }
}

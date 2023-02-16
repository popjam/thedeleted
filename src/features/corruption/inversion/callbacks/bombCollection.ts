// POST_PICKUP_COLLECT.

import { BombSubType } from "isaac-typescript-definitions";
import { fprint } from "../../../../helper/printHelper";
import { getNonInvertedPickupActionSet } from "../../effects/pickupEffects";
import { queueCorruptedBomb } from "../../inventory/bombInventory";

/**
 * Non-Inverted Bomb with corrupted effects. Corrupted bombs get added to the end of the corrupted
 * bomb queue, that cycles when the player uses a bomb.
 *
 * @example Responses: Responses will be triggered upon the bomb exploding.
 * @example Actions: Actions will be triggered upon the bomb being next in the queue, and be
 *          deactivated upon the bomb being used. You can tell which bomb is currently equipped by
 *          looking at its color.
 */
export function nonInvertedBombPostPickupCollect(
  pickup: EntityPickup,
  player: EntityPlayer,
): void {
  const pickupActionSet = getNonInvertedPickupActionSet(pickup);
  if (pickupActionSet === undefined) {
    return;
  }
  // Trigger Responses immediately.
  if ((pickup.SubType as BombSubType) === BombSubType.NORMAL) {
    queueCorruptedBomb(player, pickupActionSet);
  } else if ((pickup.SubType as BombSubType) === BombSubType.DOUBLE_PACK) {
    queueCorruptedBomb(player, pickupActionSet);
    queueCorruptedBomb(player, pickupActionSet);
  } else if ((pickup.SubType as BombSubType) === BombSubType.GIGA) {
    queueCorruptedBomb(player, pickupActionSet);
  }
  // const actions = pickupActionSet.getActions();

  fprint("Bomb collected with corrupted effects!");
}

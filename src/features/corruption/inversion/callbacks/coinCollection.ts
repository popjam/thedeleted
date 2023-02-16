// POST_PICKUP_COLLECT.

import { fprint } from "../../../../helper/printHelper";
import { getNonInvertedPickupActionSet } from "../../effects/pickupEffects";

/**
 * Non-Inverted Coins with corrupted effects.
 *
 * @example Responses: Responses will be triggered upon the coin being collected.
 * @example Actions: Actions will be triggered upon the coin being collected, and be deactivated
 *          upon the coin/s being spent. This means a penny will have its actions deactivated after
 *          spending one cent, while a nickel will have its actions deactivated after spending five
 *          cents.
 */
export function nonInvertedCoinPostPickupCollect(
  pickup: EntityPickup,
  player: EntityPlayer,
): void {
  const pickupActionSet = getNonInvertedPickupActionSet(pickup);
  if (pickupActionSet === undefined) {
    return;
  }
  const responses = pickupActionSet.getResponses();
  // Trigger Responses immediately.
  responses.forEach((response) => {
    response.trigger({ player, nonInvertedPickup: pickup });
  });
  // const actions = pickupActionSet.getActions();

  fprint("Coin collected with corrupted effects!");
}

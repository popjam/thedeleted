import { PickupVariant } from "isaac-typescript-definitions";
import { updatePickup } from "../../../../helper/deletedSpecific/inversion/updateInverted";
import { fprint } from "../../../../helper/printHelper";
import { mod } from "../../../../mod";

/** This function runs when a pickup is rerolled, morphed or otherwise had its subType
 * or variant changed.
 */
export function invertedPostPickupChanged(
  pickup: EntityPickup,
  oldVariant: PickupVariant,
  oldSubType: int,
  newVariant: PickupVariant,
  newSubType: int,
): void {
  fprint(`pickupIndex: ${mod.getPickupIndex(pickup)} changed, updating it.`);
  updatePickup(pickup);
}

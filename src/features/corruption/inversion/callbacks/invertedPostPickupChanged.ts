import { PickupVariant } from "isaac-typescript-definitions";
import { updatePickup } from "../../../../helper/deletedSpecific/inversion/updateInverted";
import { fprint } from "../../../../helper/printHelper";

/**
 * This function runs when a pickup is rerolled, morphed or otherwise had its subType or variant
 * changed.
 */
export function invertedPostPickupChanged(
  pickup: EntityPickup,
  oldVariant: PickupVariant,
  oldSubType: int,
  newVariant: PickupVariant,
  newSubType: int,
): void {
  fprint(
    `pickup: 5.${oldVariant}.${oldSubType} changed to 5.${newVariant}.${newSubType}, updating it.`,
  );
  updatePickup(pickup);
}

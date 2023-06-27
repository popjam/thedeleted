import { PickupIndex } from "isaacscript-common";
import { mod } from "../../../mod";
import { isPickupInverted } from "./pickupInversion";

const v = {
  level: {
    invertedPedestals: new Map<PickupIndex, number>(),
    nonInvertedPedestals: new Map<PickupIndex, number>(),
  },
};

export function pedestalChargesInit(): void {
  mod.saveDataManager("pedestalCharges", v);
}

/**
 * Get the charges associated with a pedestal. This is different from pedestal.Charge as it accounts
 * for inverted pedestals (which have a different charge to their non-inverted).
 */
export function getPedestalCharges(
  pedestal: EntityPickupCollectible,
): number | undefined {
  const pickupInversion = isPickupInverted(pedestal);
  const pedestalMap = pickupInversion
    ? v.level.invertedPedestals
    : v.level.nonInvertedPedestals;
  const pickupIndex = mod.getPickupIndex(pedestal);
  return pedestalMap.get(pickupIndex);
}

/**
 * Set the charges associated with a pedestal. This is different from pedestal.Charge as it accounts
 * for inverted pedestals (which have a different charge to their non-inverted).
 */
export function setPedestalCharges(
  pedestal: EntityPickupCollectible,
  charges: number,
): void {
  const pickupInversion = isPickupInverted(pedestal);
  const pedestalMap = pickupInversion
    ? v.level.invertedPedestals
    : v.level.nonInvertedPedestals;
  const pickupIndex = mod.getPickupIndex(pedestal);
  pedestalMap.set(pickupIndex, charges);
}

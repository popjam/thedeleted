import {
  CollectibleType,
  ItemConfigChargeType,
  ItemType,
} from "isaac-typescript-definitions";
import {
  getCollectibleChargeType,
  getCollectibleMaxCharges,
} from "isaacscript-common";
import { InvertedActiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { UseActiveItemResponse } from "../../../classes/corruption/responses/UseActiveItemResponse";
import { getRandomCollectibleType } from "../../collectibleHelper";

/**
 * Generates a Hybrid Inverted Active ActionSet which contains multiple Active Items in one. Upon
 * triggering, all Active Items will be used at once.
 *
 * @param amountOfActives The amount of Active Items to include.
 * @param itemConfigChargeType
 */
export function generateHybridActiveActionSet(
  amountOfActives = 2,
): InvertedActiveActionSet {
  const actionSet = new InvertedActiveActionSet();
  let totalCharges = 0;
  let overallChargeType: ItemConfigChargeType | undefined;
  for (let i = 0; i < amountOfActives; i++) {
    // Get the random active item.
    const randomActive =
      getRandomCollectibleType({
        itemType: ItemType.ACTIVE,
      }) ?? CollectibleType.POOP;

    const chargeType = getCollectibleChargeType(randomActive);
    const charges = getCollectibleMaxCharges(randomActive);

    // Rally up the total charges.
    if (overallChargeType === undefined) {
      overallChargeType = chargeType;
      totalCharges = charges;
    } else if (overallChargeType === chargeType) {
      totalCharges += charges;
    } else if (overallChargeType === ItemConfigChargeType.TIMED) {
      if (chargeType === ItemConfigChargeType.NORMAL) {
        overallChargeType = ItemConfigChargeType.NORMAL;
        totalCharges = charges + i;
      }
    }

    // Add the active to the action set.
    actionSet.addEffects(new UseActiveItemResponse().construct(randomActive));
  }

  actionSet.setChargeType(overallChargeType ?? ItemConfigChargeType.NORMAL);
  actionSet.setTotalCharges(totalCharges);

  return actionSet;
}

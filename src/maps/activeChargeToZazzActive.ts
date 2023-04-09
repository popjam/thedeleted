import {
  CollectibleType,
  ItemConfigChargeType,
} from "isaac-typescript-definitions";
import { InvertedActiveActionSet } from "../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { CollectibleTypeCustom } from "../enums/general/CollectibleTypeCustom";

const ACTIVE_CHARGE_TO_ZAZZ_ACTIVE_MAP: ReadonlyMap<string, CollectibleType> =
  new Map([
    [
      `${ItemConfigChargeType.NORMAL}.${0}.false`,
      CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_0,
    ],
    [
      `${ItemConfigChargeType.NORMAL}.${0}.true`,
      CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_0_COPY,
    ],
    [
      `${ItemConfigChargeType.NORMAL}.${1}.false`,
      CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_1,
    ],
    [
      `${ItemConfigChargeType.NORMAL}.${2}.false`,
      CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_2,
    ],
    [
      `${ItemConfigChargeType.NORMAL}.${3}.false`,
      CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_3,
    ],
    [
      `${ItemConfigChargeType.NORMAL}.${4}.false`,
      CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_4,
    ],
    [
      `${ItemConfigChargeType.NORMAL}.${5}.false`,
      CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_5,
    ],
    [
      `${ItemConfigChargeType.NORMAL}.${6}.false`,
      CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_6,
    ],
    [
      `${ItemConfigChargeType.NORMAL}.${7}.false`,
      CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_7,
    ],
    [
      `${ItemConfigChargeType.NORMAL}.${8}.false`,
      CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_8,
    ],
    [
      `${ItemConfigChargeType.NORMAL}.${9}.false`,
      CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_9,
    ],
    [
      `${ItemConfigChargeType.NORMAL}.${10}.false`,
      CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_10,
    ],
    [
      `${ItemConfigChargeType.NORMAL}.${11}.false`,
      CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_11,
    ],
    [
      `${ItemConfigChargeType.NORMAL}.${12}.false`,
      CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_12,
    ],
  ]);

/**
 * Get the Zazzinator active item that corresponds to the given charge type and charge.
 *
 * @param chargeType The charge type of the active item.
 * @param charge The charge of the active item.
 * @param copied
 * @returns The Zazzinator active item that corresponds to the given charge type and charge.
 */
export function getZazzActiveFromCharge(
  chargeType: ItemConfigChargeType,
  charge: number,
  copied = false,
): CollectibleType {
  const chargeID = `${chargeType.toString()}.${charge.toString()}.${copied.toString()}`;
  const result = ACTIVE_CHARGE_TO_ZAZZ_ACTIVE_MAP.get(chargeID);
  if (result === undefined) {
    error(
      "Failed to get the Zazzinator active item from the given charge type and charge.",
    );
  }
  return result;
}

/** Get the ZAZZ active based on the Inverted Action Set. */
export function getZazzActiveFromInvertedActiveActionSet(
  actionSet: InvertedActiveActionSet,
): CollectibleType {
  return getZazzActiveFromCharge(
    actionSet.getChargeType(),
    actionSet.getCharges(),
    actionSet.copy,
  );
}

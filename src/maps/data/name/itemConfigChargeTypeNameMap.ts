import { ItemConfigChargeType } from "isaac-typescript-definitions";

const itemConfigChargeTypeTextMap = new Map<ItemConfigChargeType, string>([
  [ItemConfigChargeType.NORMAL, "Normal"],
  [ItemConfigChargeType.TIMED, "Timed"],
  [ItemConfigChargeType.SPECIAL, "Special"],
]);

/** Convert a ItemConfigChargeType value to a text value. */
export function itemConfigChargeTypeToText(
  chargeType: ItemConfigChargeType,
): string {
  const chargeTypeText = itemConfigChargeTypeTextMap.get(chargeType);
  return chargeTypeText ?? "Unknown Charge Type";
}

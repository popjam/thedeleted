import { ReadonlyMap } from "isaacscript-common";
import { PickupType } from "../../../enums/general/PickupType";

const PICKUP_TYPE_NAME_MAP = new ReadonlyMap<PickupType, string>([
  [PickupType.HEART, "Heart"],
  [PickupType.COIN, "Coin"],
  [PickupType.KEY, "Key"],
  [PickupType.BOMB, "Bomb"],
  [PickupType.BATTERY, "Battery"],
  [PickupType.PILL, "Pill"],
  [PickupType.CARD, "Card"],
  [PickupType.RUNE, "Rune"],
  [PickupType.SACK, "Sack"],
  [PickupType.CHEST, "Chest"],
  [PickupType.SHOP_ITEM, "Shop Item"],
  [PickupType.TRINKET, "Trinket"],
  [PickupType.COLLECTIBLE, "Collectible"],
  [PickupType.CHEST, "Chest"],
  [PickupType.MISCELLANEOUS, "Miscellaneous Pickup"],
  [PickupType.POOP, "Poop Pickup"],
  [PickupType.SOUL, "Soul Stone"],
]);

/**
 * Get the name of a pickup type.
 *
 * @param pickupType The pickup type to get the name of.
 * @returns The name of the pickup type.
 * @example pickupTypeToString(PickupType.HEART) -> "Heart"
 * @example pickupTypeToString(PickupType.COIN) -> "Coin"
 * @example pickupTypeToString(PickupType.KEY) -> "Key"
 * @example pickupTypeToString(PickupType.POOP) -> "Poop Pickup"
 */
export function pickupTypeToString(pickupType: PickupType): string {
  const pickupTypeName = PICKUP_TYPE_NAME_MAP.get(pickupType);
  if (pickupTypeName === undefined) {
    error(`No pickup type name found for pickup type ${pickupType}`);
  }

  return pickupTypeName;
}

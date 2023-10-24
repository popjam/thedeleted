import { ItemType } from "isaac-typescript-definitions";

const itemTypeTextMap: Record<ItemType, string> = {
  [ItemType.NULL]: "null",
  [ItemType.PASSIVE]: "passive",
  [ItemType.TRINKET]: "trinket",
  [ItemType.ACTIVE]: "active",
  [ItemType.FAMILIAR]: "familiar",
};

/**
 * Get a string text value describing the specified ItemType.
 *
 * @example getItemTypeText(ItemType.ACTIVE) // "active".
 */
export function getItemTypeText(itemType: ItemType): string {
  return itemTypeTextMap[itemType];
}

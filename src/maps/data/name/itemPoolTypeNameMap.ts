import { ItemPoolType } from "isaac-typescript-definitions";

const itemPoolTypeTextMap = new Map<ItemPoolType, string>([
  [ItemPoolType.TREASURE, "Treasure Room"],
  [ItemPoolType.SHOP, "Shop"],
  [ItemPoolType.BOSS, "Boss Room"],
  [ItemPoolType.DEVIL, "Devil Room"],
  [ItemPoolType.ANGEL, "Angel Room"],
  [ItemPoolType.SECRET, "Secret Room"],
  [ItemPoolType.LIBRARY, "Library"],
  [ItemPoolType.SHELL_GAME, "Shell Game"],
  [ItemPoolType.GOLDEN_CHEST, "Golden Chest"],
  [ItemPoolType.RED_CHEST, "Red Chest"],
  [ItemPoolType.BEGGAR, "Beggar"],
  [ItemPoolType.DEMON_BEGGAR, "Demon Beggar"],
  [ItemPoolType.CURSE, "Curse Room"],
  [ItemPoolType.KEY_MASTER, "Key Master"],
  [ItemPoolType.BATTERY_BUM, "Battery Bum"],
  [ItemPoolType.MOMS_CHEST, "Mom's Chest"],
  [ItemPoolType.GREED_TREASURE, "Greed Treasure Room"],
  [ItemPoolType.GREED_BOSS, "Greed Boss Room"],
  [ItemPoolType.GREED_SHOP, "Greed Shop"],
  [ItemPoolType.GREED_DEVIL, "Greed Devil Room"],
  [ItemPoolType.GREED_ANGEL, "Greed Angel Room"],
  [ItemPoolType.GREED_CURSE, "Greed Curse Room"],
  [ItemPoolType.GREED_SECRET, "Greed Secret Room"],
  [ItemPoolType.CRANE_GAME, "Crane Game"],
  [ItemPoolType.ULTRA_SECRET, "Ultra Secret Room"],
  [ItemPoolType.BOMB_BUM, "Bomb Bum"],
  [ItemPoolType.PLANETARIUM, "Planetarium"],
  [ItemPoolType.OLD_CHEST, "Old Chest"],
  [ItemPoolType.BABY_SHOP, "Baby Shop"],
  [ItemPoolType.WOODEN_CHEST, "Wooden Chest"],
  [ItemPoolType.ROTTEN_BEGGAR, "Rotten Beggar"],
]);

/**
 * Convert an ItemPoolType to a text string.
 *
 * @example itemPoolTypeToText(ItemPoolType.TREASURE) // "Treasure Room".
 */
export function itemPoolTypeToString(itemPoolType: ItemPoolType): string {
  const itemPoolTypeText = itemPoolTypeTextMap.get(itemPoolType);
  return itemPoolTypeText ?? "Unknown Item Pool Type";
}

import { ItemPoolType } from "isaac-typescript-definitions";

const itemPoolTypeTextMap = new Map<string, ItemPoolType>([
  ["treasure", ItemPoolType.TREASURE],
  ["shop", ItemPoolType.SHOP],
  ["boss", ItemPoolType.BOSS],
  ["devil", ItemPoolType.DEVIL],
  ["angel", ItemPoolType.ANGEL],
  ["secret", ItemPoolType.SECRET],
  ["library", ItemPoolType.LIBRARY],
  ["shellGame", ItemPoolType.SHELL_GAME],
  ["goldenChest", ItemPoolType.GOLDEN_CHEST],
  ["redChest", ItemPoolType.RED_CHEST],
  ["beggar", ItemPoolType.BEGGAR],
  ["demonBeggar", ItemPoolType.DEMON_BEGGAR],
  ["curse", ItemPoolType.CURSE],
  ["keyMaster", ItemPoolType.KEY_MASTER],
  ["batteryBum", ItemPoolType.BATTERY_BUM],
  ["momsChest", ItemPoolType.MOMS_CHEST],
  ["greedTreasure", ItemPoolType.GREED_TREASURE],
  ["greedBoss", ItemPoolType.GREED_BOSS],
  ["greedShop", ItemPoolType.GREED_SHOP],
  ["greedDevil", ItemPoolType.GREED_DEVIL],
  ["greedAngel", ItemPoolType.GREED_ANGEL],
  ["greedCurse", ItemPoolType.GREED_CURSE],
  ["greedSecret", ItemPoolType.GREED_SECRET],
  ["craneGame", ItemPoolType.CRANE_GAME],
  ["ultraSecret", ItemPoolType.ULTRA_SECRET],
  ["bombBum", ItemPoolType.BOMB_BUM],
  ["planetarium", ItemPoolType.PLANETARIUM],
  ["oldChest", ItemPoolType.OLD_CHEST],
  ["babyShop", ItemPoolType.BABY_SHOP],
  ["woodenChest", ItemPoolType.WOODEN_CHEST],
  ["rottenBeggar", ItemPoolType.ROTTEN_BEGGAR],
]);

/**
 * Converts an item pool XML name to its corresponding item pool type.
 *
 * @param itemPoolXMLName The XML name of the item pool.
 * @returns The item pool type.
 */
export function itemPoolXMLNameToItemPoolType(
  itemPoolXMLName: string,
): ItemPoolType {
  const itemPoolType = itemPoolTypeTextMap.get(itemPoolXMLName);
  if (itemPoolType === undefined) {
    error(`Unknown Item Pool XML Name: ${itemPoolXMLName}`);
  }
  return itemPoolType;
}

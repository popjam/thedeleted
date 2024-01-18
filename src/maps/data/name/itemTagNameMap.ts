import { ItemConfigTag, ItemType } from "isaac-typescript-definitions";

const itemTagNameMap: Record<ItemConfigTag, string> = {
  [ItemConfigTag.ANGEL]: "Is an angel item",
  [ItemConfigTag.BABY]: "Is a baby Item",
  [ItemConfigTag.BATTERY]: "Is a battery item",
  [ItemConfigTag.BOB]: "Is apart of the Bob transformation",
  [ItemConfigTag.BOOK]: "Is a book",
  [ItemConfigTag.DEAD]: "Is a dead item",
  [ItemConfigTag.DEVIL]: "Is apart of the Leviathan transformation",
  [ItemConfigTag.FLY]: "Is apart of the Beelzebub transformation",
  [ItemConfigTag.FOOD]: "Is a food item",
  [ItemConfigTag.GUPPY]: "Is apart of the Guppy transformation",
  [ItemConfigTag.LAZ_SHARED]: "Is shared between Lazarus forms",
  [ItemConfigTag.LAZ_SHARED_GLOBAL]: "Is shared between Lazarus forms globally",
  [ItemConfigTag.MOM]: "Is apart of the Yes Mother transformation",
  [ItemConfigTag.MONSTER_MANUAL]: "Is a monster manual creation",
  [ItemConfigTag.MUSHROOM]: "Is apart of the Fun Guy transformation",
  [ItemConfigTag.NO_CANTRIP]: "Can't be obtained in the cantrip challenge",
  [ItemConfigTag.NO_CHALLENGE]: "Can't appear in any challenges",
  [ItemConfigTag.NO_DAILY]: "Can't appear in daily runs",
  [ItemConfigTag.NO_EDEN]: "Eden can't start with",
  [ItemConfigTag.NO_GREED]: "Can't appear in greed mode",
  [ItemConfigTag.NO_KEEPER]: "Is banned from Keeper",
  [ItemConfigTag.OFFENSIVE]: "Is banned from Tainted Lost",
  [ItemConfigTag.POOP]: "Is apart of the Oh Shit transformation",
  [ItemConfigTag.QUEST]: "Is a quest item",
  [ItemConfigTag.SPIDER]: "Is apart of the Spider Baby transformation",
  [ItemConfigTag.STARS]: "Is a star-themed item",
  [ItemConfigTag.SUMMONABLE]: "Is summonable",
  [ItemConfigTag.SYRINGE]: "Is apart of the Spun transformation",
  [ItemConfigTag.TEARS_UP]: "Gives you a tears up",
  [ItemConfigTag.TECH]: "Is a technology item",
  [ItemConfigTag.UNIQUE_FAMILIAR]: "Is a unique familiar",
  [ItemConfigTag.WISP]: "Has a unique wisp",
};

/**
 * Get a string text value describing the specified ItemConfigTag.
 *
 * @example getItemTypeText(ItemType.ACTIVE) // "active".
 */
export function itemConfigTagToString(itemConfigTag: ItemConfigTag): string {
  return itemTagNameMap[itemConfigTag]!;
}

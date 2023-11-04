import { RoomType } from "isaac-typescript-definitions";

const ROOM_TYPE_TO_NAME_MAP: ReadonlyMap<RoomType, string> = new Map([
  [RoomType.DEFAULT, "Default Room"],
  [RoomType.SHOP, "Shop"],
  [RoomType.ERROR, "Error Room"],
  [RoomType.TREASURE, "Treasure Room"],
  [RoomType.BOSS, "Boss Room"],
  [RoomType.MINI_BOSS, "Miniboss Room"],
  [RoomType.SECRET, "Secret Room"],
  [RoomType.SUPER_SECRET, "Super Secret Room"],
  [RoomType.ARCADE, "Arcade"],
  [RoomType.CURSE, "Curse Room"],
  [RoomType.CHALLENGE, "Challenge Room"],
  [RoomType.LIBRARY, "Library"],
  [RoomType.SACRIFICE, "Sacrifice Room"],
  [RoomType.DEVIL, "Devil Room"],
  [RoomType.ANGEL, "Angel Room"],
  [RoomType.DUNGEON, "Crawl Space"],
  [RoomType.BOSS_RUSH, "Boss Rush"],
  [RoomType.CLEAN_BEDROOM, "Clean Bedroom"],
  [RoomType.DIRTY_BEDROOM, "Dirty Bedroom"],
  [RoomType.CHEST, "the Chest"],
  [RoomType.DICE, "Dice Room"],
  [RoomType.BLACK_MARKET, "Black Market"],
  [RoomType.GREED_EXIT, "Greed Exit Room"],
  [RoomType.PLANETARIUM, "Planetarium"],
  [RoomType.TELEPORTER, "Mausoleum Teleporter Entrance Room"],
  [RoomType.TELEPORTER_EXIT, "Mausoleum Teleporter Exit Room"],
  [RoomType.SECRET_EXIT, "Strange Room"],
  [RoomType.BLUE, "Blue Womb Room"],
  [RoomType.ULTRA_SECRET, "Ultra Secret Room"],
]);

/**
 * Retrieves a printable named version of the specified roomType enum value. Note, this will not
 * always contain the word 'room' afterwards, but should always be understandable.
 *
 * @example RoomType.BOSS_RUSH = "boss rush".
 * @example RoomType.CHALLENGE = "challenge room" (added 'room' to make it clearer).
 */
export function getRoomNameFromType(roomType: RoomType): string {
  const name = ROOM_TYPE_TO_NAME_MAP.get(roomType);
  if (name === undefined) {
    error(`RoomTypeNameMap: Cannot find Name of RoomType: ${roomType}`);
  }
  return name;
}

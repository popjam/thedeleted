import {
  ItemConfigChargeType,
  ItemConfigTag,
  ItemPoolType,
  RoomType,
} from "isaac-typescript-definitions";
import type { WeightedArray } from "isaacscript-common";

export const AVERAGE_NPCS_PER_ROOM = 10;
export const PLAYER_TOTAL_STATS = 11;

// General chance that an active item spawns over a passive item.
export const PERCENTAGE_CHANCE_FOR_ACTIVE = 15;

// When a passive item is chosen, this is the chance that it is a familiar.
export const PERCENTAGE_CHANCE_PASSIVE_IS_FAMILIAR = 5;

// Weights for each collectible quality for when a random quality is needed.
export const COLLECTIBLE_QUALITY_WEIGHTINGS: WeightedArray<Quality> = [
  [0, 1],
  [1, 1],
  [2, 0.8],
  [3, 0.5],
  [4, 0.2],
];

export const POOL_TYPE_WEIGHTINGS: WeightedArray<ItemPoolType> = [
  [ItemPoolType.TREASURE, 3],
  [ItemPoolType.SHOP, 1],
  [ItemPoolType.BOSS, 1],
  [ItemPoolType.DEVIL, 0.5],
  [ItemPoolType.ANGEL, 0.5],
  [ItemPoolType.SECRET, 0.5],
  [ItemPoolType.LIBRARY, 0.2],
  [ItemPoolType.SHELL_GAME, 0.5],
  [ItemPoolType.GOLDEN_CHEST, 0.2],
  [ItemPoolType.RED_CHEST, 0.5],
  [ItemPoolType.BEGGAR, 0.5],
  [ItemPoolType.DEMON_BEGGAR, 0.2],
  [ItemPoolType.CURSE, 0.5],
  [ItemPoolType.KEY_MASTER, 0.2],
  [ItemPoolType.BATTERY_BUM, 0.5],
  [ItemPoolType.MOMS_CHEST, 0.2],
  [ItemPoolType.GREED_TREASURE, 0.2],
  [ItemPoolType.GREED_BOSS, 0.2],
  [ItemPoolType.GREED_SHOP, 0.2],
  [ItemPoolType.GREED_DEVIL, 0.2],
  [ItemPoolType.GREED_ANGEL, 0.2],
  [ItemPoolType.GREED_CURSE, 0.2],
  [ItemPoolType.GREED_SECRET, 0.2],
  [ItemPoolType.CRANE_GAME, 0.2],
  [ItemPoolType.ULTRA_SECRET, 0.1],
  [ItemPoolType.BOMB_BUM, 0.2],
  [ItemPoolType.PLANETARIUM, 0.2],
  [ItemPoolType.OLD_CHEST, 0.2],
  [ItemPoolType.BABY_SHOP, 0.2],
  [ItemPoolType.WOODEN_CHEST, 0.5],
  [ItemPoolType.ROTTEN_BEGGAR, 0.2],
];

export const ITEM_CONFIG_CHARGE_TYPE_WEIGHTINGS: WeightedArray<ItemConfigChargeType> =
  [
    [ItemConfigChargeType.NORMAL, 5],
    [ItemConfigChargeType.TIMED, 0.5],
    [ItemConfigChargeType.SPECIAL, 0.1],
  ];

export const ITEM_CONFIG_TAG_WEIGHTINGS: WeightedArray<ItemConfigTag> = [
  [ItemConfigTag.ANGEL, 1],
  [ItemConfigTag.BATTERY, 1],
  [ItemConfigTag.BOB, 1],
  [ItemConfigTag.BOOK, 1],
  [ItemConfigTag.DEAD, 1],
  [ItemConfigTag.DEVIL, 1],
  [ItemConfigTag.FLY, 1],
  [ItemConfigTag.FOOD, 1],
  [ItemConfigTag.GUPPY, 1],
  [ItemConfigTag.MOM, 1],
  [ItemConfigTag.MONSTER_MANUAL, 1],
  [ItemConfigTag.MUSHROOM, 1],
  [ItemConfigTag.NO_GREED, 1],
  [ItemConfigTag.OFFENSIVE, 1],
  [ItemConfigTag.POOP, 1],
  [ItemConfigTag.QUEST, 1],
  [ItemConfigTag.SPIDER, 1],
  [ItemConfigTag.STARS, 1],
  [ItemConfigTag.SYRINGE, 1],
  [ItemConfigTag.TECH, 1],
  [ItemConfigTag.TEARS_UP, 1],
  [ItemConfigTag.UNIQUE_FAMILIAR, 1],
  [ItemConfigTag.WISP, 1],
];

export const INFREQUENT_ROOMS = [
  RoomType.MINI_BOSS,
  RoomType.ANGEL,
  RoomType.DEVIL,
  RoomType.DICE,
  RoomType.LIBRARY,
  RoomType.PLANETARIUM,
  RoomType.BLACK_MARKET,
  RoomType.BLUE,
  RoomType.CLEAN_BEDROOM,
  RoomType.DIRTY_BEDROOM,
  RoomType.ULTRA_SECRET,
  RoomType.ERROR,
  RoomType.BOSS_RUSH,
  RoomType.TELEPORTER,
  RoomType.TELEPORTER_EXIT,
];

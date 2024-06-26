import { AVERAGE_ROOMS_PER_FLOOR } from "./floorConstants";
import { AVERAGE_NPCS_PER_ROOM } from "./gameConstants";

/**
 * The amount the ideal severity can overflow the response's severity. For example, if the ideal
 * severity is 20, and the response's severity is 10, and the buffer is 10, then the response does
 * not need to be adjusted.
 *
 * If there is a positive mismatch for a positive response, it means the response is underpowered.
 * This is mainly a good thing to prevent overpowered responses.
 *
 * If there is a positive mismatch for a negative response, it means the negative response is
 * underpowered. This is also a good thing, as it means the negative response is not as bad as it
 * could be.
 */
export const DEFAULT_POSITIVE_MISMATCH_BUFFER = 10_000;

/**
 * The amount the ideal severity can underflow the response's severity. For example, if the ideal
 * severity is 20, and the response's severity is 30, and the buffer is 10, then the response does
 * not need to be adjusted.
 *
 * If there is a negative mismatch for a positive response, it means the response is overpowered.
 * This may cause issues by making the response too powerful.
 *
 * If there is a negative mismatch for a negative response, it means the negative response is too
 * powerful. This is less bad because overpowered negative responses can be avoided, while
 * overpowered positive responses would be more difficult to avoid.
 */
export const DEFAULT_NEGATIVE_MISMATCH_BUFFER = 0;

// If a Response were to happen each room, this is the standard severity it should have.
export const ON_ROOM_BASE_SEVERITY = 5;
export const ON_FLOOR_BASE_SEVERITY =
  ON_ROOM_BASE_SEVERITY * AVERAGE_ROOMS_PER_FLOOR;

export const HEALTH_UP_SEVERITY_ADDITIVE = ON_ROOM_BASE_SEVERITY * 5;
export const MAX_SEVERITY = 1000;
export const NEUTRAL_SEVERITY = 0;
export const BARELY_GOOD_SEVERITY = 1;
export const BARELY_BAD_SEVERITY = -1;
export const MIN_SEVERITY = -1000;

// Consumable Severities.
export const PENNY_SEVERITY = ON_ROOM_BASE_SEVERITY * 0.2;
export const KEY_SEVERITY = PENNY_SEVERITY * 5;
export const BOMB_SEVERITY = PENNY_SEVERITY * 5;
export const BATTERY_SEVERITY = PENNY_SEVERITY * 5;
export const CARD_SEVERITY = PENNY_SEVERITY * 15;
export const PILL_SEVERITY = PENNY_SEVERITY * 15;
export const SOUL_SEVERITY = PENNY_SEVERITY * 15;
export const HORSE_PILL_MULTIPLIER = 2;

export const RED_HEART_SEVERITY =
  PENNY_SEVERITY * 5 + HEALTH_UP_SEVERITY_ADDITIVE;
export const ETERNAL_HEART_SEVERITY = RED_HEART_SEVERITY * 2;
export const TRINKET_SEVERITY = PENNY_SEVERITY * 15;
export const CHEST_SEVERITY = PENNY_SEVERITY * ON_ROOM_BASE_SEVERITY * 5;

export const GOLDEN_CONSUMABLE_MULTIPLIER = ON_FLOOR_BASE_SEVERITY / 2;
export const MISCELLANEOUS_PICKUP_SEVERITY = MAX_SEVERITY;
export const RANDOM_PICKUP_SEVERITY = ON_ROOM_BASE_SEVERITY;

// Item Severities.
export const QUALITY_4_ITEM_SEVERITY = ON_FLOOR_BASE_SEVERITY * 5;
export const QUALITY_3_ITEM_SEVERITY = ON_FLOOR_BASE_SEVERITY * 4;
export const QUALITY_2_ITEM_SEVERITY = ON_FLOOR_BASE_SEVERITY * 3;
export const QUALITY_1_ITEM_SEVERITY = ON_FLOOR_BASE_SEVERITY * 2;
export const QUALITY_0_ITEM_SEVERITY = ON_FLOOR_BASE_SEVERITY;
export const OVERPOWERED_ITEM_SEVERITY = ON_ROOM_BASE_SEVERITY * 20;
export const SHOP_ITEM_QUALITY = QUALITY_2_ITEM_SEVERITY;

// NPC Severities.
export const NON_BOSS_NPC_SEVERITY = ON_ROOM_BASE_SEVERITY * -2;
export const BOSS_NPC_SEVERITY = NON_BOSS_NPC_SEVERITY * 10;
export const STORY_BOSS_NPC_SEVERITY = BOSS_NPC_SEVERITY * 2;

// Modded.
export const MODDED_MULTIPLIER = 2;
export const MODDED_RED_HEART_SEVERITY = RED_HEART_SEVERITY * MODDED_MULTIPLIER;
export const MODDED_COIN_SEVERITY = PENNY_SEVERITY * MODDED_MULTIPLIER;
export const MODDED_KEY_SEVERITY = KEY_SEVERITY * MODDED_MULTIPLIER;
export const MODDED_BOMB_SEVERITY = BOMB_SEVERITY * MODDED_MULTIPLIER;
export const MODDED_CHEST_SEVERITY = CHEST_SEVERITY * MODDED_MULTIPLIER;
export const MODDED_SACK_SEVERITY = PENNY_SEVERITY * MODDED_MULTIPLIER;
export const MODDED_PILL_SEVERITY = PILL_SEVERITY * MODDED_MULTIPLIER;
export const MODDED_CARD_SEVERITY = CARD_SEVERITY * MODDED_MULTIPLIER;
export const MODDED_HORSE_PILL_SEVERITY =
  PILL_SEVERITY * HORSE_PILL_MULTIPLIER * 2;
export const MODDED_SOUL_SEVERITY = SOUL_SEVERITY * MODDED_MULTIPLIER;
export const MODDED_RUNE_SEVERITY = CARD_SEVERITY * MODDED_MULTIPLIER;
export const MODDED_BATTERY_SEVERITY = BATTERY_SEVERITY * MODDED_MULTIPLIER;

// Stat severities.
export const DEFAULT_DAMAGE_UP_SEVERITY = ON_FLOOR_BASE_SEVERITY;
export const DEFAULT_NECRONOMICON_SEVERITY = ON_FLOOR_BASE_SEVERITY;
export const FULL_HEART_DAMAGE_SEVERITY = RED_HEART_SEVERITY * -1;
export const HEALTH_DOWN_SEVERITY = ETERNAL_HEART_SEVERITY * -1;
export const TEARS_UP_SEVERITY = ON_FLOOR_BASE_SEVERITY / 2;
export const TEARS_DOWN_SEVERITY = TEARS_UP_SEVERITY * -1;
export const SPEED_UP_SEVERITY = ON_ROOM_BASE_SEVERITY * 4;
export const SPEED_DOWN_SEVERITY = SPEED_UP_SEVERITY * -1;
export const LUCK_UP_SEVERITY = ON_ROOM_BASE_SEVERITY * 2;
export const LUCK_DOWN_SEVERITY = LUCK_UP_SEVERITY * -1;
export const TELEPORT_OUT_OF_ROOM_SEVERITY = ON_ROOM_BASE_SEVERITY * 4;
export const ENEMIES_SLOWDOWN_SEVERITY = ON_ROOM_BASE_SEVERITY * 8;
export const SHOT_SPEED_DOWN_SEVERITY = ON_ROOM_BASE_SEVERITY * -1;
export const SHOT_SPEED_UP_SEVERITY = SHOT_SPEED_DOWN_SEVERITY * -1;

// Actions. These describe the 'ideal' severity of the default action's responses.
export const ON_ROOM_ACTION_FREQUENCY = ON_ROOM_BASE_SEVERITY;
export const ON_FLOOR_ACTION_FREQUENCY =
  ON_ROOM_ACTION_FREQUENCY * AVERAGE_ROOMS_PER_FLOOR;
export const ON_OBTAIN_ACTION_FREQUENCY = 1000;
export const ON_DAMAGE_ACTION_FREQUENCY = ON_ROOM_ACTION_FREQUENCY * 2;
export const ON_KILL_ACTION_FREQUENCY =
  ON_ROOM_ACTION_FREQUENCY / AVERAGE_NPCS_PER_ROOM;
export const ON_REVIVE_ACTION_FREQUENCY = ON_FLOOR_ACTION_FREQUENCY * 2;
export const ON_TEAR_ACTION_FREQUENCY = ON_ROOM_ACTION_FREQUENCY / 1000;
export const ON_ACTIVE_USE_ACTION_FREQUENCY = ON_ROOM_ACTION_FREQUENCY;
export const ON_PILL_USE_ACTION_FREQUENCY = ON_ROOM_ACTION_FREQUENCY * 2;
export const ON_CARD_USE_ACTION_FREQUENCY = ON_ROOM_ACTION_FREQUENCY * 2;
export const ON_BOMB_EXPLODE_ACTION_FREQUENCY = ON_ROOM_ACTION_FREQUENCY;
export const ON_PICKUP_COLLECT_ACTION_FREQUENCY = ON_ROOM_ACTION_FREQUENCY / 10;
export const ON_GREED_WAVE_CLEAR_ACTION_FREQUENCY = ON_ROOM_ACTION_FREQUENCY;
export const ON_GRID_BREAK_ACTION_FREQUENCY = ON_ROOM_ACTION_FREQUENCY / 25;
export const ON_HOLY_MANTLE_BREAK_ACTION_FREQUENCY = ON_ROOM_ACTION_FREQUENCY;
export const ON_STAT_ACTION_FREQUENCY = ON_ROOM_ACTION_FREQUENCY / 5;
export const ON_PURCHASE_ACTION_FREQUENCY = ON_FLOOR_ACTION_FREQUENCY / 2;
export const ON_ROOM_CLEAR_ACTION_FREQUENCY = ON_ROOM_ACTION_FREQUENCY;
export const ON_SACRIFICE_ACTION_FREQUENCY = ON_FLOOR_ACTION_FREQUENCY / 10;
export const ON_SLOT_USE_ACTION_FREQUENCY = ON_FLOOR_ACTION_FREQUENCY / 30;
export const ON_SLOT_DESTROY_ACTION_FREQUENCY = ON_FLOOR_ACTION_FREQUENCY / 3;
export const ON_TRANSFORMATION_ACTION_FREQUENCY = ON_FLOOR_ACTION_FREQUENCY * 5;
export const ON_DEATH_ACTION_FREQUENCY = ON_FLOOR_ACTION_FREQUENCY * 10;

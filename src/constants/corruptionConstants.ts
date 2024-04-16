import type { WeightedArray } from "isaacscript-common";
import { InvertedItemActionSetBuilderReference } from "../enums/corruption/actionSets/ActionSetBuilders";
import type { Range } from "../types/general/Range";
import { UseFlag } from "isaac-typescript-definitions";
import { ActionType } from "../enums/corruption/actions/ActionType";
import { ResponseType } from "../enums/corruption/responses/ResponseType";

export const DEFAULT_INVERTED_ITEM_ACTION_SET_BUILDER_REFERENCE: InvertedItemActionSetBuilderReference =
  InvertedItemActionSetBuilderReference.INVERTED_ITEM_ACTION_SET_DEFAULT;

/** A weighted spread of how many segments an inverted collectible's sprite should have. */

export const INVERTED_COLLECTIBLE_CUSTOM_SPRITE_SEGMENT_AMOUNT_SPREAD: WeightedArray<number> =
  [
    [1, 5],
    [2, 50],
    [3, 50],
    [4, 50],
    [5, 30],
    [6, 10],
    [7, 5],
    [8, 1],
    [9, 0.1],
  ];

export const DEFAULT_CORRUPTED_SOUND_EFFECT_AMOUNT: Range = [1, 3];

export const DEFAULT_CORRUPTED_SOUND_EFFECT_LENGTH: Range = [0.4, 2];

export const CORRUPTED_BACKDROP_COLOR_TRANSPARENCY_VALUE = 0.1;

export const DEFAULT_INVERTED_ACTIVE_GENERATION_PERCENTAGE = 100;

/** Weighting for the amount of effects in a default inverted item. */
export const DEFAULT_INVERTED_ITEM_AMOUNT_OF_EFFECTS_WEIGHTS: WeightedArray<number> =
  [
    [1, 20],
    [2, 30],
    [3, 50],
    [4, 20],
    [5, 10],
  ];

/** Percentage chance of an effect being negative. */
export const DEFAULT_INVERTED_ITEM_CHANCE_FOR_POSITIVE_EFFECTS = 90;

export const DEFAULT_ACTION_WEIGHTS: WeightedArray<ActionType> = [
  [ActionType.ON_FLOOR, 1],
  [ActionType.ON_ROOM, 1],
  [ActionType.ON_OBTAIN, 1],
  [ActionType.ON_DAMAGE, 1],
  [ActionType.ON_KILL, 1],
  [ActionType.ON_DEATH, 1],
  [ActionType.ON_REVIVE, 1],
  [ActionType.ON_TEAR, 1],
  [ActionType.ON_ACTIVE_USE, 1],
  [ActionType.ON_PILL_USE, 1],
  [ActionType.ON_CARD_USE, 1],
  [ActionType.ON_BOMB_EXPLODE, 1],
  [ActionType.ON_PICKUP_COLLECT, 1],
  [ActionType.ON_GREED_WAVE_CLEAR, 1],
  [ActionType.ON_GRID_BREAK, 1],
  [ActionType.ON_HOLY_MANTLE_BREAK, 1],
  [ActionType.ON_STAT, 1],
  [ActionType.ON_PURCHASE, 1],
  [ActionType.ON_ROOM_CLEAR, 1],
  [ActionType.ON_SACRIFICE, 1],
  [ActionType.ON_SLOT_USE, 1],
  [ActionType.ON_SLOT_DESTROY, 1],
  [ActionType.ON_TRANSFORMATION, 1],
  [ActionType.ON_FRIENDLY_FIRE, 1],
];

export const DEFAULT_RESPONSE_WEIGHTS: WeightedArray<ResponseType> = [
  [ResponseType.TRIGGER_RANDOM, 1],
  [ResponseType.WAIT_THEN_TRIGGER, 1],
  [ResponseType.TRIGGER_OVER_TIME, 1],
  [ResponseType.TRIGGER_IN_SEQUENCE, 1],
  [ResponseType.IF_THEN_TRIGGER, 1],
  [ResponseType.IF_THEN_ELSE_TRIGGER, 1],
  [ResponseType.TRIGGER_IN_QUEUE, 1],
  [ResponseType.USE_ACTIVE_ITEM, 1],
  [ResponseType.USE_CARD, 1],
  [ResponseType.USE_PILL, 1],
  [ResponseType.GET_COLLECTIBLE, 1],
  [ResponseType.GET_TRINKET, 1],
  [ResponseType.GET_CONSUMABLE, 1],
  [ResponseType.SPAWN_PICKUP, 1],
  [ResponseType.SPAWN_NPC, 1],
  [ResponseType.SPAWN_SLOT, 1],
  [ResponseType.SPAWN_TEAR, 1],
  [ResponseType.SPAWN_PROJECTILE, 1],
  [ResponseType.SPAWN_EFFECT, 1],
  [ResponseType.SPAWN_GRID, 1],
  [ResponseType.SPAWN_ENTITY, 1],
  [ResponseType.SPAWN_LIVE_BOMB, 1],
  [ResponseType.PLAY_SOUND, 1],
  [ResponseType.PLAY_MUSIC, 1],
  [ResponseType.GIVE_COSTUME, 1],
  [ResponseType.GIVE_STAT, 1],
  [ResponseType.TRANSFORM, 1],
  [ResponseType.EXECUTE_COMMAND, 1],
  [ResponseType.SHOW_FORTUNE, 1],
  [ResponseType.GIVE_CURSE, 1],
  [ResponseType.REMOVE_ENTITY, 1],
  [ResponseType.REMOVE_GRID, 1],
  [ResponseType.REMOVE_CORRUPTED_ITEM, 1],
  [ResponseType.REMOVE_COLLECTIBLE, 1],
  [ResponseType.REMOVE_TRINKET, 1],
  [ResponseType.REMOVE_RULE, 1],
  [ResponseType.REROLL_COLLECTIBLE, 1],
  [ResponseType.REROLL_TRINKET, 1],
  [ResponseType.REROLL_STAT, 1],
  [ResponseType.CHANGE_CHARACTER, 1],
  [ResponseType.SPAWN_HYBRID_NPC, 1],
  [ResponseType.PLAY_CORRUPTED_SOUND, 1],
  [ResponseType.SPAWN_WORLD, 1],
  [ResponseType.HAVE_DREAM, 1],
  [ResponseType.HAVE_NIGHTMARE, 1],
  [ResponseType.GET_ACTION_SET, 1],
  [ResponseType.TEMPORARY_ACTION, 1],
  [ResponseType.TEMPORARY_ACTION_SET, 1],
  [ResponseType.TEMPORARY_COLLECTIBLE, 1],
  [ResponseType.TEMPORARY_TRINKET, 1],
  [ResponseType.TEMPORARY_RULE, 1],
  [ResponseType.PLAY_TUNE, 1],
  [ResponseType.ADD_RULE, 1],
  [ResponseType.REMOVE_ACTION, 1],
];

export const USE_ACTIVE_ITEM_RESPONSE_BITFLAG_ARRAY: readonly UseFlag[] = [
  UseFlag.NO_ANIMATION,
  UseFlag.NO_ANNOUNCER_VOICE,
];

export const HYBRID_NPC_MINIMUM_NPC_AMOUNT = 2;

export const HYBRID_NPC_DEFAULT_NPC_AMOUNT = 2;

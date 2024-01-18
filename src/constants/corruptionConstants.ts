import type { WeightedArray } from "isaacscript-common";
import { InvertedItemActionSetBuilderReference } from "../enums/corruption/actionSets/ActionSetBuilders";
import type { Range } from "../types/general/Range";
import { UseFlag } from "isaac-typescript-definitions";

export const DEFAULT_INVERTED_ITEM_ACTION_SET_BUILDER_REFERENCE: InvertedItemActionSetBuilderReference =
  InvertedItemActionSetBuilderReference.INVERTED_ITEM_ACTION_SET_DEFAULT;

/** A weighted spread of how many segments an inverted collectible's sprite should have. */
// eslint-disable-next-line isaacscript/require-capital-const-assertions, isaacscript/require-capital-read-only
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

// eslint-disable-next-line isaacscript/require-capital-const-assertions
export const DEFAULT_CORRUPTED_SOUND_EFFECT_AMOUNT: Range = [1, 3];
// eslint-disable-next-line isaacscript/require-capital-const-assertions
export const DEFAULT_CORRUPTED_SOUND_EFFECT_LENGTH: Range = [0.4, 2];

export const CORRUPTED_BACKDROP_COLOR_TRANSPARENCY_VALUE = 0.1;

export const DEFAULT_INVERTED_ACTIVE_GENERATION_PERCENTAGE = 100;

// eslint-disable-next-line isaacscript/require-capital-const-assertions
export const USE_ACTIVE_ITEM_RESPONSE_BITFLAG_ARRAY: readonly UseFlag[] = [
  UseFlag.NO_ANIMATION,
  UseFlag.NO_ANNOUNCER_VOICE,
];

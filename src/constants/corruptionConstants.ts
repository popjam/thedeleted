import { WeightedArray } from "isaacscript-common";
import { InvertedItemActionSetBuilderReference } from "../enums/corruption/actionSets/ActionSetBuilders";
import { Range } from "../types/general/Range";

export const DEFAULT_INVERTED_ITEM_ACTION_SET_BUILDER_REFERENCE: InvertedItemActionSetBuilderReference =
  InvertedItemActionSetBuilderReference.INVERTED_ITEM_ACTION_SET_DEFAULT;

/** A weighted spread of how many segments an inverted collectible's sprite should have. */
// eslint-disable-next-line isaacscript/require-capital-const-assertions
export const INVERTED_COLLECTIBLE_CUSTOM_SPRITE_SEGMENT_AMOUNT_SPREAD: WeightedArray<number> =
  [
    [1, 0.5],
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

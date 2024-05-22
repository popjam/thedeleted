import type { CollectibleType } from "isaac-typescript-definitions";
import type { ActionType } from "../../../enums/corruption/actions/ActionType";
import type { WeightedArray } from "isaacscript-common";
import type { ResponseType } from "../../../enums/corruption/responses/ResponseType";

/** Data sent to ActionSetBuilders. */
export interface ActionSetBuilderInput {
  /** Player who the ActionSet belongs to, may be no-one. */
  player?: EntityPlayer;

  /** Collectible the ActionSet is based on. */
  collectible?: CollectibleType;

  /**
   * Set to 100 to force an active, and 0 to force a passive. The chance the generated ActionSet
   * will be an ActiveActionSet.
   */
  chanceOfActive?: number;

  /** The number of effects the ActionSet should have. */
  numberOfEffects?: number;

  /**
   * The chance of a generated effect being positive. Set it to 0 to force all effects to be
   * negative, and 100 to force all effects to be positive.
   */
  chanceOfPositiveEffect?: number;

  /** The weights for the action types in a default inverted item. */
  actionWeightings?: WeightedArray<ActionType>;

  /** The weights for the response types, given a positive effect. */
  positiveResponseWeightings?: WeightedArray<ResponseType>;

  /** The weights for the response types, given a negative effect. */
  negativeResponseWeightings?: WeightedArray<ResponseType>;

  /**
   * The acceptable positive mismatch between the ideal severity of the action and severity of the
   * response. The higher this is, the weaker the effect can be.
   */
  positiveMismatchBuffer?: number;

  /**
   * The acceptable negative mismatch between the ideal severity of the action and severity of the
   * response. The higher this is, the stronger the effect can be.
   */
  negativeMismatchBuffer?: number;

  /** The chance for the effect to be only a response, instead of an action. */
  chanceForResponse?: number;

  /** Should the generator adjust response's severity for balance. Default true. */
  shouldAdjustSeverity?: boolean;
}

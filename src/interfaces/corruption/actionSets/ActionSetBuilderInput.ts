import type { CollectibleType } from "isaac-typescript-definitions";
import type { ActionType } from "../../../enums/corruption/actions/ActionType";
import type { WeightedArray } from "isaacscript-common";

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
}

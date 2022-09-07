import { Range } from "../../types/Range";

/**
 * Tags to apply certain properties to Actions. These may modify how often the action is triggered,
 * and hence how often the responses attached to it are triggered.
 */
export interface ActionTag {
  /**
   * Distance between activations.
   *
   * @example "Every 3 rooms", get brimstone.
   * @example "Every 1-5 rooms", get brimstone.
   * @example If not specified defaults to every time: "Every room", get brimstone.
   * @example Left number is "interval", right number is "triggers since activations", and should
   *          usually be set to 0.
   * @example E.g [Every 3 rooms, Has triggered twice with no activations].
   * @example Can specify a range for the interval (every triggering of the Action, will choose a
   *          random number in range (inclusive), if right number is higher, activates.)
   */
  interval?: [number, number] | [Range, number];
  /**
   * Only activates after X. Once fired, will never fire again.
   *
   * @example "After 3 rooms", get brimstone. --> activateAfter: 3
   */
  activateAfter?: number;

  /**
   * If set to true, actions triggered with multiple responses will trigger all of their responses
   * instead of only one randomly.
   *
   * @example Instead of: 'every 3 rooms, spawn a spider or a fly.
   * @example It will be: 'every 3 rooms, spawn a spider then a fly.
   */
  triggerAll?: true;

  /**
   * If a pickup contains two or more actions with a weight value, upon pickup only one of the
   * actions with a weight value will be awarded. The chance of getting each action is split between
   * 100, with each individual action's share being its weight to total weight ratio.
   *
   * @example 25% -> Action A (weight of 1).
   * @example 75% -> Action B (weight of 3).
   */
  weight?: number;

  /**
   * Indicates that the Action should be removed from whatever list or container it is being held
   * in. If this is set to true, the Action will not be removed immediately.An Action itself does
   * not know where it is being stored: so it has to 'signal' to tell its outer components it should
   * be removed.
   *
   * @example In triggerAllPlayerActionsByType(), it will do a 'garbage disposal' at the end,
   *          removing actions with this tag from the player.
   */
  flagForRemoval?: true;
}

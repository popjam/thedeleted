import { Range } from "../../types/Range";

/**
 * Tags to apply certain properties to Responses. These may modify how often the response is
 * triggered.
 */
export interface ResponseTag {
  /**
   * The percentage chance that the Response is activated upon trigger(). Can be to 2 decimal
   * places.
   *
   * @example "50% chance to spawn a spider" --> 50 chanceToActivate.
   */
  chanceToActivate?: number;
  /**
   * The amount of times it activates upon trigger().
   *
   * @example "Spawn 2x spiders" --> 2 amountOfActivations.
   * @example "Spawn 1-3 spiders" --> [1,3] rangeOfActivations.
   */
  amountOfActivations?: number | Range;
}

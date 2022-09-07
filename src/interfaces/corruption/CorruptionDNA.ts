import { ActionSet } from "./ActionSet";

/**
 * Used to influence the randomly generated corrupted effects. Every player, Deleted or not, is
 * given CorruptionDNA.
 *
 * @example CorruptionDNA can be passed to functions to generate ActionSets filled with
 *          Actions+Responses, or it can be simply used to generate Actions+Responses.
 * @example If a spread is used instead of a single instance, each Action+Response generation will
 *          call the spread() method on the Spread.
 */
export interface CorruptionDNA {
  /**
   * Aids ActionSet+Action+Response generation. For Action+Response generation, this will always be
   * ignored. Can be:
   *
   * @example A single ActionSet (which will be deep copied).
   * @example A single ActionSetBuilder, which will be called to obtain ActionSet/s.
   * @example A builder from ActionSetBuilders, which will be called to obtain ActionSet/s.
   * @example A spread of the types above.
   */
  actionSet?: ActionSet;
}

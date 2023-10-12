import type { Action } from "../../../classes/corruption/actions/Action";
import type { Response } from "../../../classes/corruption/responses/Response";
import { Morality } from "../../../enums/corruption/Morality";

/**
 * Given an array of Actions and Responses, sorts them by Morality, where positive effects are
 * first, then neutral, then negative.
 */
export function sortEffectsByMorality(
  effects: Array<Action | Response>,
): Array<Action | Response> {
  return effects.sort((a, b) => {
    const aMorality = a.getMorality();
    const bMorality = b.getMorality();
    if (aMorality === bMorality) {
      return 0;
    }
    if (aMorality === Morality.POSITIVE) {
      return -1;
    }
    if (bMorality === Morality.POSITIVE || bMorality === Morality.NEUTRAL) {
      return 1;
    }
    return -1;
  });
}

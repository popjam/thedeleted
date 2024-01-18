import { getCollectibleName } from "isaacscript-common";
import { Conditional } from "../../../enums/general/Conditional";

const CONDITION_TO_NAME_MAP: ReadonlyMap<
  Conditional,
  (xValue: number) => string
> = new Map([
  [Conditional.FLOOR_IS_CURSED, (_xValue) => "the floor is cursed"],
  [Conditional.PLAYER_HAS_ACTIVE_ITEM, (_xValue) => "you have an active item"],
  [
    Conditional.PLAYER_HAS_COLLECTIBLE_X,
    (xValue) => `you have ${getCollectibleName(xValue)}`,
  ],

  // TODO: Fix.
  [
    Conditional.PLAYER_HAS_ONLY_X_HEARTS,
    (xValue) => `you only have ${xValue} hearts`,
  ],
]);

/**
 * Get the conditional in string format.
 *
 * @param conditional The conditional to convert to string.
 * @param xValue The value of the conditional (e.g 3 for PLAYER_HAS_X_OR_MORE_HEALTH).
 * @param addIf Whether to add 'if' to the start of the string (e.g 'if the floor is cursed').
 *
 * @example 'conditionalToString(Conditional.FLOOR_IS_CURSED, 1)' returns 'the floor is cursed'
 * @example
 */
export function conditionalToString(
  conditional: Conditional,
  xValue: number,
  addIf = true,
): string {
  const name = CONDITION_TO_NAME_MAP.get(conditional);
  if (name === undefined) {
    error(`Unknown conditional ${conditional}`);
  }

  return `${addIf ? "if " : ""}${name(xValue)}`;
}

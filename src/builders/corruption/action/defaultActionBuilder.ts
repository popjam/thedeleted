import {
  getRandomFromWeightedArray,
  getRandomInt,
  WeightedArray,
} from "isaacscript-common";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { Morality } from "../../../enums/corruption/Morality";
import { Action } from "../../../interfaces/corruption/actions/Action";
import { Range, validifyRange } from "../../../types/general/Range";

export function buildDefaultAction(morality?: Morality): Action {
  const weightedActions: WeightedArray<Action> = [
    [
      {
        actionType: ActionType.ON_FLOOR,
        tags: {
          interval: getRandomFromWeightedArray<number | Range | undefined>([
            [getRandomInt(2, 5), 1],
            [validifyRange([getRandomInt(1, 3), getRandomInt(1, 5)]), 1],
          ]),
        },
      },
      1, // On floor with interval.
    ],
    [
      {
        actionType: ActionType.ON_FLOOR,
      },
      9, // Every floor.
    ],
  ];
  return getRandomFromWeightedArray(weightedActions)!;
}

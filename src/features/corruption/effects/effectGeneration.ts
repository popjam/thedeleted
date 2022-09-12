import { deepCopy } from "isaacscript-common";
import {
  DEFAULT_EMPTY_ACTION,
  DEFAULT_EMPTY_ACTION_SET,
} from "../../../constants/corruptionConstants";
import { Action } from "../../../interfaces/corruption/actions/Action";
import { ActionSet } from "../../../interfaces/corruption/actionSets/ActionSet";
import { CorruptionDNA } from "../../../interfaces/corruption/CorruptionDNA";

/** Functions responsible for generating ActionSets, Actions and Responses. */

/** Generates a complete ActionSet through CorruptionDNA. */
// TODO: Implement.
export function generateActionSet(corruptionDNA: CorruptionDNA): ActionSet {
  const actionSet = deepCopy(DEFAULT_EMPTY_ACTION_SET) as ActionSet;
  actionSet.actions.push(deepCopy(DEFAULT_EMPTY_ACTION) as Action);
  return actionSet;
}

/** Generates a complete Action through CorruptionDNA. */
export function generateAction(
  corruptionDNA: CorruptionDNA,
): Action | undefined {
  return undefined;
}

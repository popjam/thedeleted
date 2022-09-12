import {
  ActionSet,
  ActionSetType,
} from "../../../interfaces/corruption/actionSets/ActionSet";

export function buildDefaultActionSet(): ActionSet {
  return {
    actionSetType: ActionSetType.STANDARD,
    actions: [],
  };
}

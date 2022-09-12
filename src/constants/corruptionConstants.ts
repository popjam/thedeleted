import { ActionType } from "../enums/corruption/actions/ActionType";
import { Action } from "../interfaces/corruption/actions/Action";
import {
  ActionSet,
  ActionSetType,
} from "../interfaces/corruption/actionSets/ActionSet";
import { CorruptionDNA } from "../interfaces/corruption/CorruptionDNA";

// eslint-disable-next-line isaacscript/require-const-assertions
export const DEFAULT_EMPTY_ACTION_SET: ActionSet = {
  actionSetType: ActionSetType.STANDARD,
  actions: [],
  tags: {
    color: Color(1, 0, 0),
  },
};

// eslint-disable-next-line isaacscript/require-const-assertions
export const DEFAULT_EMPTY_ACTION: Action = {
  actionType: ActionType.ON_PICKUP,
};

/** The Default CorruptionDNA that will be used when one is not provided. */
export const DEFAULT_CORRUPTION_DNA: CorruptionDNA = {
  actionSet: DEFAULT_EMPTY_ACTION_SET,
} as const;

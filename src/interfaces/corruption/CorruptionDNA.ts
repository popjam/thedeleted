import { WeightedArray } from "isaacscript-common";
import { ActionBuilders } from "../../enums/corruption/actions/ActionBuilders";
import { ActionSetBuilders } from "../../enums/corruption/actionSets/ActionSetBuilders";
import { Builder } from "../../types/general/Builder";
import { Action } from "./actions/Action";
import { ActionSet } from "./actionSets/ActionSet";

/** Data which is responsible for creating ActionSets, Actions and Responses. */
export interface CorruptionDNA {
  /** Blueprint for structuring ActionSets. If left blank, will use 'default actionSet'. */
  actionSet?:
    | (ActionSet | Builder<ActionSet> | ActionSetBuilders)
    | WeightedArray<ActionSet | Builder<ActionSet> | ActionSetBuilders>;

  /** Blueprint for structuring Actions. If left blank, will use the 'default actionBuilder'. */
  actions?:
    | (Action | Builder<Action> | ActionBuilders)
    | WeightedArray<Action | Builder<Action> | ActionBuilders>;
}

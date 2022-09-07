import { Action } from "./Action";

/** Describes the types of different ActionSets. */
export enum ActionSetType {
  STANDARD,
  LIMITED,
}

/**
 * ActionSets are containers for Actions. Unlike Actions and Responses, ActionSets can not be
 * 'triggered', and are only used for storage. They are usually assigned to a CollectibleType.
 * ActionSets can contain ActionSets.
 */
export type ActionSet = StandardActionSet | LimitedActionSet;

/** The standard Action Set. */
export interface StandardActionSet {
  actions: Action[];
  readonly actionSetType: ActionSetType.STANDARD;
}

/** Action Set with a limit. */
export interface LimitedActionSet {
  actions: Action[];
  readonly actionSetType: ActionSetType.LIMITED;
}

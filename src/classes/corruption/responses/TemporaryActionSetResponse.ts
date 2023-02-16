import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { ActionSet } from "../actionSets/ActionSet";
import { InvertedPassiveActionSet } from "../actionSets/Inverted/InvertedPassiveActionSet";
import { Response } from "./Response";

const DEFAULT_ACTION_SET = new InvertedPassiveActionSet();

/**
 * Gives the player a temporary ActionSet until it is triggered for removal.
 *
 * @example Get the effect 'every room, get 1 blue spider' for the floor.
 */
export class TemporaryActionSetResponse extends Response {
  override responseType: ResponseType = ResponseType.TEMPORARY_ACTION_SET;

  // The actionSet to give to the player. It will be deep copied, as multiple may be given. Actions
  // will have their 'origin' be 'TEMPORARY_ACTION', and an ID which will keep track of them for
  // removal.
  a?: ActionSet;

  /** Need to deep copy before use! */
  getActionSet(): ActionSet {
    return this.a ?? DEFAULT_ACTION_SET;
  }

  setActionSet(actionSet: ActionSet): this {
    this.a = actionSet;
    return this;
  }

  getText(): string {
    return "";
  }

  fire(): void {}
}

import { getRandomSetElement } from "isaacscript-common";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { FUNNY_ACTION_TEXT_SET } from "../../../sets/funnyActionTexts";
import { Action } from "./Action";
import { MAX_SEVERITY } from "../../../constants/severityConstants";

/**
 * Upon the player obtaining the passive or active inverted item, immediately triggers its responses
 * instead of adding the Action to the player. Functionally the same as adding Responses to the
 * player. Will activate every time an Active is picked up, even after putting it down.
 */
export class OnObtainAction extends Action {
  override actionType = ActionType.ON_OBTAIN;
  override actFr = MAX_SEVERITY;

  /**
   * Constructs an instance of the OnObtainAction class.
   *
   * @returns The instance of the OnObtainAction class.
   */
  construct(): this {
    return this;
  }

  /**
   * Overrides any ActionText and provides a 'dummy' value, which is randomly chosen from a set.
   *
   * @example 'On uninstalling isaac, ' ...
   */
  setRandomFunnyActionText(): this {
    this.oat = getRandomSetElement(FUNNY_ACTION_TEXT_SET, undefined);
    return this;
  }

  /** Obtain Actions are identical to naked responses, hence they usually do not have any text. */
  override getActionText(): string {
    // If overridden.
    if (this.oat !== undefined) {
      return this.oat;
    }

    return "";
  }

  protected override getTriggerClause(): string {
    return "";
  }
}

import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { Action } from "./Action";

/**
 * Upon the player obtaining the Action, immediately triggers its responses instead of adding the
 * Action to the player. Functionally the same as adding Responses to the player.
 */
export class OnObtainAction extends Action {
  override actionType = ActionType.ON_OBTAIN;

  override getText(): string {
    return `${this.getResponseText()}`;
  }
}

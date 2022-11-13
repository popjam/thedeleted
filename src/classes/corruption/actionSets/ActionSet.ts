import { ActionSetType } from "../../../enums/corruption/actionSets/ActionSetType";
import { legibleString } from "../../../helper/stringHelper";
import { Action, isAction } from "../actions/Action";
import { isResponse, Response } from "../responses/Response";

const NO_EFFECTS_DEFAULT_TEXT = "does nothing";

/** ActionSet class. */
export abstract class ActionSet {
  readonly actionSetType!: ActionSetType;
  effects: Array<Action | Response> = [];

  /** Returns Actions + Responses, does not deepCopy! */
  getEffects(): Array<Action | Response> {
    return this.effects;
  }

  /** Gets only the Responses (does not deepCopy!). */
  getResponses(): Response[] {
    return this.effects.filter(
      (actionOrResponse): actionOrResponse is Response =>
        isResponse(actionOrResponse),
    );
  }

  /** Gets only the Actions (does not deepCopy!). */
  getActions(): Action[] {
    return this.effects.filter((actionOrResponse): actionOrResponse is Action =>
      isAction(actionOrResponse),
    );
  }

  /**
   * Adds one or more actions or responses to the ActionSet. Can provide one action or response,
   * multiple actions or responses or an array of actions or responses.
   */
  addEffects(...effects: Array<Action | Response>): this {
    this.effects = this.effects.concat(effects);
    return this;
  }

  getText(): string {
    let text = "";
    this.effects.forEach((actionOrResponse) => {
      text += "#";
      text += legibleString(actionOrResponse.getText());
    });
    if (text === "") {
      return NO_EFFECTS_DEFAULT_TEXT;
    }
    return text;
  }

  abstract updateAppearance(entity: Entity): void;
}

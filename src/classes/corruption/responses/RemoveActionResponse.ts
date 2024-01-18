import type { ActionOrigin } from "../../../enums/corruption/actions/ActionOrigin";
import type { ActionType } from "../../../enums/corruption/actions/ActionType";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import {
  removeActionWithPredicate,
  removeAllActionsWithPredicate,
} from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import type { Action } from "../actions/Action";
import { Response } from "./Response";

const DEFAULT_ALL_ACTIONS = false;
const VERB = "remove";
const VERB_PARTICIPLE = "removing";

/**
 * Response to Remove Actions that are attached to players. Will remove Actions which match the
 * given parameters. If 'removeAll' is true, then all Actions that match will be removed.
 */
export class RemoveActionResponse extends Response {
  override responseType: ResponseType = ResponseType.REMOVE_ACTION;

  /** The origin. */
  o?: ActionOrigin;

  /** ID for origin. */
  i?: number;

  /** ActionType of the Action to remove. */
  at?: ActionType;

  /** If all actions that match should be removed. */
  all?: boolean;

  /**
   * Response to Remove Actions that are attached to players. Will remove Actions which match the
   * given parameters. If 'removeAll' is true, then all Actions that match will be removed.
   */
  construct(
    actionOrigin?: ActionOrigin,
    id?: number,
    actionType?: ActionType,
    removeAll?: boolean,
  ): this {
    if (actionOrigin !== undefined) {
      this.setActionOrigin(actionOrigin);
    }

    if (id !== undefined) {
      this.setID(id);
    }

    if (actionType !== undefined) {
      this.setActionType(actionType);
    }

    if (removeAll !== undefined) {
      this.setRemoveAll(removeAll);
    }
    return this;
  }

  getActionOrigin(): ActionOrigin | undefined {
    return this.o;
  }

  setActionOrigin(actionOrigin: ActionOrigin): this {
    this.o = actionOrigin;
    return this;
  }

  getRemoveAll(): boolean {
    return this.all ?? DEFAULT_ALL_ACTIONS;
  }

  setRemoveAll(removeAll: boolean): this {
    this.all = removeAll;
    return this;
  }

  getID(): number | undefined {
    return this.i;
  }

  setID(id: number): this {
    this.i = id;
    return this;
  }

  getActionType(): ActionType | undefined {
    return this.at;
  }

  setActionType(actionType: ActionType): this {
    this.at = actionType;
    return this;
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  override getNoun(): string {
    return "";
  }

  override getText(): string {
    return "";
  }

  fire(triggerData: TriggerData): void {
    const { player } = triggerData;

    if (player === undefined) {
      return;
    }

    const aT = this.getActionType();
    const actionOrigin = this.getActionOrigin();
    const id = this.getID();
    const removeAll = this.getRemoveAll();
    const predicate = (action: Action) => {
      if (actionOrigin !== undefined && action.o?.[0] !== actionOrigin) {
        return false;
      }

      if (id !== undefined && action.o?.[1] !== id) {
        return false;
      }

      return true;
    };

    if (removeAll) {
      removeAllActionsWithPredicate(predicate, player, aT);
    } else {
      removeActionWithPredicate(predicate, player, aT);
    }
  }
}

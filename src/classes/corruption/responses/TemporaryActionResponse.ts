import { deepCopy } from "isaacscript-common";
import { ActionOrigin } from "../../../enums/corruption/actions/ActionOrigin";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { _addActionsToTracker } from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { mod } from "../../../mod";
import type { Action } from "../actions/Action";
import { OnRoomAction } from "../actions/OnRoomAction";
import { RemoveActionResponse } from "./RemoveActionResponse";
import { Response } from "./Response";

const DEFAULT_TEMP_ACTION = new OnRoomAction();
const DEFAULT_REMOVE_ON = new OnRoomAction();
const DEFAULT_REMOVAL_RESPONSE = new RemoveActionResponse();
const VERB = "give";
const VERB_PARTICIPLE = "giving";

const v = {
  run: {
    /**
     * TemporaryActionResponses added to the player need to have a unique ID attached to them so
     * that they can be identified and removed from the RemoveActionAction added.
     */
    tempActionResponseID: 1,
  },
};

export function temporaryActionResponseInit(): void {
  mod.saveDataManager("temporaryActionResponse", v);
}

/**
 * Gives the player a temporary Action until it is triggered for removal.
 *
 * @example Get the effect 'every room, get 1 blue spider' for the floor.
 */
export class TemporaryActionResponse extends Response {
  override responseType: ResponseType = ResponseType.TEMPORARY_ACTION;

  // The action to give to the player. It will be deep copied, as multiple may be given. Actions
  // will have their 'origin' be 'TEMPORARY_ACTION', and an ID which will keep track of them for
  // removal.
  a?: Action;

  /** Remove on. */
  ro?: Action;

  /** These will be deep copied. */
  construct(temporaryAction: Action, removeOn: Action): this {
    return this.setAction(temporaryAction).setRemoveOn(removeOn);
  }

  /** Get the Action that will be temporarily added. */
  getAction(): Action {
    return this.a ?? DEFAULT_TEMP_ACTION;
  }

  /** Set the Action that should be temporarily added. This will deep copy it. */
  setAction(action: Action): this {
    this.a = deepCopy<Action>(action);
    return this;
  }

  /** Deep copies the temporary Action, and generates a new ID for it. */
  generateAction(): Action {
    const action = deepCopy<Action>(this.getAction());
    // eslint-disable-next-line isaacscript/no-unsafe-plusplus
    action.o = [ActionOrigin.TEMPORARY_ACTION, v.run.tempActionResponseID++];
    return action;
  }

  /** When to remove the Action. When this action fires, the temporary Action will be removed. */
  getRemoveOn(): Action {
    return this.ro ?? DEFAULT_REMOVE_ON;
  }

  /**
   * Generates the removal Action. Will always set 'FireAfterThenRemove' to 1, as the Action should
   * always remove itself after firing.
   *
   * @param id The. ID of the temporary Action that should be removed.
   */
  generateRemoveOn(id: number): Action {
    const removeOn = deepCopy<Action>(this.getRemoveOn());
    removeOn.setResponse(
      deepCopy<RemoveActionResponse>(DEFAULT_REMOVAL_RESPONSE).setID(id),
    );
    return removeOn;
  }

  /**
   * When to remove the collectible. When this action fires, the temporary Action will be removed.
   * The provided Action will be deep-copied, make sure its set to remove after firing once, and
   * make it set to permanent.
   */
  setRemoveOn(action: Action): this {
    this.ro = deepCopy<Action>(action);
    this.ro.setFireAfterThenRemove(1).setPermanence(true);
    return this;
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  override getNoun(): string {
    return "";
  }

  getText(_eid: boolean, _participle: boolean): string {
    return "";
  }

  fire(triggerData: TriggerData): void {
    const player = triggerData.player ?? Isaac.GetPlayer();

    const temporaryAction = this.generateAction();
    const id = temporaryAction.o?.[1];

    if (id === undefined) {
      return;
    }

    const removeOn = this.generateRemoveOn(id);

    // Add temporary Action.
    _addActionsToTracker(player, temporaryAction);

    // Add removal Action.
    _addActionsToTracker(player, removeOn);
  }
}

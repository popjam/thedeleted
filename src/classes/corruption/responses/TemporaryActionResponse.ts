import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { Action } from "../actions/Action";
import { Response } from "./Response";

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

  getText(): string {
    return "";
  }

  fire(): void {}
}

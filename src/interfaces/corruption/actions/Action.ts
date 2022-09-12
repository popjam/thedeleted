import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { Response } from "../responses/Response";
import { ActionTag } from "./ActionTag";

/**
 * Actions are containers which hold Responses. After the Action has passed all its 'checks', it
 * will trigger the responses it holds. Usually Actions are tied to Callbacks. Actions may also have
 * tags which modify their behavior. If there are multiple responses in an action, only one of the
 * responses will fire every time, chosen randomly. Certain tags may modify this behavior.
 *
 * @example 'Every 3 rooms'.
 * @example 'Every 1-5 floors'.
 * @function TriggerAction(Action) Is used to activate the response. Note it will not always trigger
 *           its responses, as it may have tags which modify its behavior.
 */
export type Action = OnRoomAction | OnFloorAction | OnPickupAction;

/** Action which triggers each room. */
export interface OnRoomAction {
  actionType: ActionType.ON_ROOM;
  responses?: Response | Response[];

  tags?: ActionTag;
}

/** Action which triggers each floor. */
export interface OnFloorAction {
  actionType: ActionType.ON_FLOOR;
  responses?: Response | Response[];

  tags?: ActionTag;
}

/**
 * Action which triggers upon player obtaining the action. These are instantly removed upon firing.
 */
export interface OnPickupAction {
  actionType: ActionType.ON_PICKUP;
  responses?: Response | Response[];

  tags?: ActionTag;
}

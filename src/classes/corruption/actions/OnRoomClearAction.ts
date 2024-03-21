import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayersActionsByType } from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_ROOM_CLEAR;

/** Triggers every time the player clears a room. */
/** Represents an action that is triggered when a room is cleared. */
export class OnRoomClearAction extends Action {
  override actionType = ACTION_TYPE;

  protected override getTriggerClause(): string {
    return "you clear a room";
  }

  /** Triggers the action with the provided trigger data. */
  override trigger(triggerData: TriggerData): void {
    super.trigger({ ...triggerData });
  }
}

/**
 * Triggers all OnRoomClearActions for all players.
 *
 * POST_CLEAR_ROOM callback.
 */
export function triggerOnRoomClearActions(): void {
  triggerPlayersActionsByType(ACTION_TYPE, {});
}

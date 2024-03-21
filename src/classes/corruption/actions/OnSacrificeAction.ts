import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_SACRIFICE;

/** Triggers every time the player makes a sacrifice. */
/** Represents an action that is triggered when a sacrifice is made. */
export class OnSacrificeAction extends Action {
  override actionType = ACTION_TYPE;

  protected override getTriggerClause(): string {
    return "you make a sacrifice";
  }

  /** Triggers the action with the provided trigger data. */
  override trigger(triggerData: TriggerData): void {
    super.trigger({ ...triggerData });
  }
}

/**
 * Triggers all OnSacrificeActions for all players.
 *
 * POST_SACRIFICE callback.
 */
export function triggerOnSacrificeActions(
  player: EntityPlayer,
  numSacrifices: number,
): void {
  triggerPlayerActionsByType(player, ACTION_TYPE, {
    player,
    onSacrificeAction: {
      player,
      numSacrifices,
    },
  });
}

import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_DEATH;

/** Triggers every time the player dies. */
export class OnDeathAction extends Action {
  override actionType = ACTION_TYPE;

  protected override getTriggerClause(): string {
    return "you die";
  }

  override trigger(triggerData: TriggerData): void {
    super.trigger({ ...triggerData });
  }
}

/**
 * Triggers all OnDeathActions for all players.
 *
 * POST_PLAYER_FATAL_DAMAGE callback.
 */
export function triggerOnDeathActions(player: EntityPlayer): void {
  triggerPlayerActionsByType(player, ACTION_TYPE, {
    player,
    onDeathAction: {
      player,
    },
  });
}

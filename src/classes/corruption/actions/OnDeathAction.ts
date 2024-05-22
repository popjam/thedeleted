import { ON_DEATH_ACTION_FREQUENCY } from "../../../constants/severityConstants";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_DEATH;

/** Triggers every time the player dies. */
export class OnDeathAction extends Action {
  override actionType = ACTION_TYPE;

  override getIdealSeverity(): number {
    return super.getIdealSeverity(ON_DEATH_ACTION_FREQUENCY);
  }

  protected override getTriggerClause(plural: boolean, _eid: boolean): string {
    return plural ? "deaths" : "death";
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

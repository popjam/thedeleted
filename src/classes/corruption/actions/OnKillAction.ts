import { ON_KILL_ACTION_FREQUENCY } from "../../../constants/severityConstants";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayersActionsByType } from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_KILL;

/** Triggers every time an NPC is killed. */
// TODO: Update for boss only, etc..
export class OnKillAction extends Action {
  override actionType = ACTION_TYPE;

  override getIdealSeverity(): number {
    return super.getIdealSeverity(ON_KILL_ACTION_FREQUENCY);
  }

  // Override the trigger clause for OnKillAction.
  protected override getTriggerClause(plural: boolean, _eid: boolean): string {
    return plural ? "kills" : "kill";
  }

  override trigger(triggerData: TriggerData): void {
    super.trigger({ ...triggerData });
  }
}

/** Triggers all OnDamageActions for all players. */
export function triggerOnKillActions(entity: Entity): void {
  triggerPlayersActionsByType(ACTION_TYPE, {
    onKillAction: entity as EntityNPC,
    spawnPosition: entity.Position,
    spawnVelocity: entity.Velocity,
  });
}

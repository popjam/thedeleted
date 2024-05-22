import { ON_GREED_WAVE_CLEAR_ACTION_FREQUENCY } from "../../../constants/severityConstants";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayersActionsByType } from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_GREED_WAVE_CLEAR;

/** Triggers every time a greed wave is cleared. */
export class OnGreedWaveClearAction extends Action {
  override actionType = ACTION_TYPE;

  override getIdealSeverity(): number {
    return super.getIdealSeverity(ON_GREED_WAVE_CLEAR_ACTION_FREQUENCY);
  }

  protected override getTriggerClause(plural: boolean, _eid: boolean): string {
    return plural ? "greed waves" : "greed wave";
  }

  override trigger(triggerData: TriggerData): void {
    super.trigger({ ...triggerData });
  }
}

/**
 * Triggers all OnGreedWaveClearActions for all players.
 *
 * POST_GREED_WAVE_CLEAR callback.
 */
export function triggerOnGreedWaveClearActions(): void {
  triggerPlayersActionsByType(ACTION_TYPE, {});
}

import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import { Action } from "./Action";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { PlayerStat } from "isaacscript-common";
import { ON_STAT_ACTION_FREQUENCY } from "../../../constants/severityConstants";
import { PLAYER_TOTAL_STATS } from "../../../constants/gameConstants";
import { addTheS } from "../../../helper/stringHelper";

const ACTION_TYPE = ActionType.ON_STAT;

/**
 * Triggers every time a player's stat changes.
 *
 * TODO: Prevent firing lots of times in a single frame.
 */
export class OnStatAction extends Action {
  override actionType = ACTION_TYPE;
  stat?: PlayerStat;
  thr?: number;

  construct(stat?: PlayerStat): this {
    this.stat = stat;
    return this;
  }

  override getIdealSeverity(): number {
    const stat = this.getStat();
    if (stat === undefined) {
      return super.getIdealSeverity(ON_STAT_ACTION_FREQUENCY);
    }

    return super.getIdealSeverity(
      ON_STAT_ACTION_FREQUENCY * PLAYER_TOTAL_STATS,
    );
  }

  getStat(): PlayerStat | undefined {
    return this.stat;
  }

  setStat(stat: PlayerStat): this {
    this.stat = stat;
    return this;
  }

  // Set the threshold for stat difference.
  public setThreshold(threshold: number): this {
    this.thr = threshold;
    return this;
  }

  // Get the threshold for stat difference.
  public getThreshold(): number | undefined {
    return this.thr;
  }

  protected override getTriggerClause(plural: boolean): string {
    const stat = this.getStat();
    const threshold = this.getThreshold();
    const changeWord = addTheS("change", plural, false);

    if (stat === undefined) {
      return `stat ${changeWord}`; // Generic clause for undefined stat.
    }
    switch (stat) {
      case PlayerStat.TEAR_FLAG: {
        return `tear flag ${changeWord}`;
      }

      case PlayerStat.TEAR_COLOR: {
        return `tear color ${changeWord}`;
      }

      case PlayerStat.FLYING: {
        return `flight status ${changeWord}`;
      }

      case PlayerStat.SIZE: {
        return `size ${changeWord}`;
      }

      default: {
        // Handle numerical stats as before.
        if (threshold !== undefined) {
          return `your ${stat} stat ${
            threshold > 0 ? "increases by" : "decreases by"
          } ${Math.abs(threshold)} or more`;
        }
        return `your ${stat} stat changes`;
      }
    }
  }

  override trigger(triggerData: TriggerData): void {
    const onStatTriggerData = triggerData.onStatAction;
    if (onStatTriggerData === undefined) {
      return;
    }

    const { stat } = onStatTriggerData;

    // Check if the stat is numerical.
    if (
      stat === PlayerStat.TEAR_FLAG ||
      stat === PlayerStat.TEAR_COLOR ||
      stat === PlayerStat.FLYING ||
      stat === PlayerStat.SIZE
    ) {
      // Non-numerical stat, trigger the action regardless of difference.
      super.trigger(triggerData);
    }

    const threshold = this.getThreshold();
    if (
      threshold !== undefined &&
      Math.abs(onStatTriggerData.difference) <= threshold
    ) {
      return; // Difference is not above threshold, don't trigger.
    }

    super.trigger(triggerData);
  }
}

/**
 * Triggers all OnStatActions for the player which had their stat changed.
 *
 * POST_STAT_CHANGE callback.
 */
export function triggerOnStatActions(
  player: EntityPlayer,
  stat: PlayerStat,
  difference: int,
): void {
  triggerPlayerActionsByType(player, ACTION_TYPE, {
    player,
    onStatAction: {
      player,
      stat,
      difference,
    },
  });
}

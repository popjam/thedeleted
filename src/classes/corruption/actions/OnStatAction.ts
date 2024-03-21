import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import { Action } from "./Action";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { PlayerStat } from "isaacscript-common";

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

  protected override getTriggerClause(): string {
    const stat = this.getStat();
    const threshold = this.getThreshold();

    if (stat === undefined) {
      return "your stats change"; // Generic clause for undefined stat.
    }
    switch (stat) {
      case PlayerStat.TEAR_FLAG: {
        return "your tear flags change";
      }

      case PlayerStat.TEAR_COLOR: {
        return "your tear color changes";
      }

      case PlayerStat.FLYING: {
        return "you gain or lose flight";
      }

      case PlayerStat.SIZE: {
        return "you change size";
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

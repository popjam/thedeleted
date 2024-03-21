import type { LevelStage } from "isaac-typescript-definitions";
import { game } from "isaacscript-common";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayersActionsByType } from "../../../features/corruption/effects/playerEffects";
import { addTheS } from "../../../helper/stringHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { levelStageToString } from "../../../maps/data/name/levelStageNameMap";
import { rangeToString } from "../../../types/general/Range";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_FLOOR;

const DEFAULT_INTERVAL = 1;

/**
 * Triggers every floor.
 *
 * @member lS - Fires only on the specified LevelStage.
 */
export class OnFloorAction extends Action {
  override actionType = ACTION_TYPE;
  lS?: LevelStage;

  /**
   * Constructs an instance of the OnFloorAction class.
   *
   * @param levelStage The level stage for the action. Undefined for all.
   * @returns The constructed instance of the OnFloorAction class.
   */
  construct(levelStage?: LevelStage | undefined): this {
    this.lS = levelStage;
    return this;
  }

  /** If set, will only fire on the specified LevelStage. */
  getLevelStage(): LevelStage | undefined {
    return this.lS;
  }

  /** If set, will only fire on the specified LevelStage. */
  setLevelStage(levelStage: LevelStage): this {
    this.lS = levelStage;
    return this;
  }

  protected override getTriggerClause(): string {
    const amount = this.getInterval() ?? 1;
    let intervalNoRange = amount;
    if (typeof intervalNoRange !== "number") {
      intervalNoRange = intervalNoRange[1];
    }

    return (
      this.getLevelStageText(intervalNoRange) ??
      addTheS("you reach a floor", intervalNoRange)
    );
  }

  getLevelStageText(amount: number): string | undefined {
    const { lS: levelStage } = this;
    if (levelStage !== undefined) {
      const name = levelStageToString(levelStage);
      return `${addTheS("visit", amount)} to ${name}`;
    }
    return undefined;
  }

  override getIntervalText(): string {
    const interval = this.getInterval();
    if (interval === undefined) {
      return "";
    }
    if (typeof interval === "number") {
      if (interval === DEFAULT_INTERVAL) {
        return "";
      }
      return `${interval.toString()} `;
    }
    return `${rangeToString(interval)} `;
  }

  override getActionText(): string {
    // If overridden.
    if (this.oat !== undefined) {
      return this.oat;
    }

    let text = "";
    const fireAfterThenRemove = this.getFireAfterThenRemove();
    const interval = this.getInterval() ?? 1;
    let intervalNoRange = interval;
    if (typeof intervalNoRange !== "number") {
      intervalNoRange = intervalNoRange[1];
    }

    if (fireAfterThenRemove === 1 && interval === 1) {
      text += `next ${this.getLevelStageText(intervalNoRange) ?? "floor"}`;
    } else if (fireAfterThenRemove === 1) {
      text += `after ${this.getIntervalText()} ${
        this.getLevelStageText(intervalNoRange) ?? "floor"
      }`;
    } else if (fireAfterThenRemove === undefined) {
      text += `every ${this.getIntervalText()} ${
        this.getLevelStageText(intervalNoRange) ??
        addTheS("floor", intervalNoRange)
      }`;
    } else {
      text += `up to ${fireAfterThenRemove} times, every ${this.getIntervalText()} ${
        this.getLevelStageText(intervalNoRange) ??
        addTheS("floor", intervalNoRange)
      }`;
    }
    text += ", ";
    return text;
  }

  override trigger(triggerData: TriggerData): void {
    const levelStage = this.getLevelStage();
    if (
      levelStage !== undefined &&
      game.GetLevel().GetAbsoluteStage() !== levelStage
    ) {
      return;
    }

    super.trigger(triggerData);
  }
}

/** Triggers all OnFloorActions for all players. */
export function triggerOnFloorActions(): void {
  triggerPlayersActionsByType(ACTION_TYPE, {});
}

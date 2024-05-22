import { LevelStage } from "isaac-typescript-definitions";
import { game, getRandomEnumValue } from "isaacscript-common";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayersActionsByType } from "../../../features/corruption/effects/playerEffects";
import { addTheS } from "../../../helper/stringHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { levelStageToString } from "../../../maps/data/name/levelStageNameMap";
import { Action } from "./Action";
import { ON_FLOOR_ACTION_FREQUENCY } from "../../../constants/severityConstants";
import { rollPercentage } from "../../../types/general/Percentage";
import { ON_FLOOR_SHUFFLE_CHANCE_FOR_LEVEL_STAGE_PARAM } from "../../../constants/corruptionConstants";

const ACTION_TYPE = ActionType.ON_FLOOR;

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

  override getIdealSeverity(): number {
    const levelStage = this.getLevelStage();
    if (levelStage !== undefined) {
      return super.getIdealSeverity(ON_FLOOR_ACTION_FREQUENCY);
    }

    return super.getIdealSeverity(ON_FLOOR_ACTION_FREQUENCY);
  }

  override shuffle(): this {
    if (rollPercentage(ON_FLOOR_SHUFFLE_CHANCE_FOR_LEVEL_STAGE_PARAM)) {
      this.setLevelStage(getRandomEnumValue(LevelStage, undefined));
    }

    return super.shuffle();
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

  protected override getTriggerClause(plural: boolean, _eid: boolean): string {
    return this.getLevelStageText(plural) ?? addTheS("floor", plural);
  }

  getLevelStageText(plural: boolean): string | undefined {
    const { lS: levelStage } = this;
    if (levelStage !== undefined) {
      const name = levelStageToString(levelStage);
      return `${addTheS("visit", plural)} to ${name}`;
    }
    return undefined;
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

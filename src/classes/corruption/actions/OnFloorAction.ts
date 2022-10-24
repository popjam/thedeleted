import { LevelStage } from "isaac-typescript-definitions";
import { game } from "isaacscript-common";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayersActionsByType } from "../../../features/corruption/effects/playerEffects";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_FLOOR;

/** Triggers every floor. */
export class OnFloorAction extends Action {
  override actionType = ACTION_TYPE;
  override noun = "floor";
  override nounPlural = "floors";
  levelStage?: LevelStage;

  /** If set, will only fire on the specified LevelStage. */
  getLevelStage(): LevelStage | undefined {
    return this.levelStage;
  }

  setLevelStage(levelStage: LevelStage): this {
    this.levelStage = levelStage;
    return this;
  }

  override fire(triggerData: TriggerData): void {
    const levelStage = this.getLevelStage();
    if (levelStage !== undefined) {
      if (game.GetLevel().GetAbsoluteStage() !== levelStage) {
        return;
      }
    }

    this.fire(triggerData);
  }
}

/** Triggers all OnFloorActions for all players. */
export function triggerOnFloorActions(): void {
  triggerPlayersActionsByType(ACTION_TYPE);
}

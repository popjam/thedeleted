import { LevelStage } from "isaac-typescript-definitions";
import { game } from "isaacscript-common";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayersActionsByType } from "../../../features/corruption/effects/playerEffects";
import { addTheS } from "../../../helper/stringHelper";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { getStageNameFromLevelStage } from "../../../maps/data/levelStageNameMap";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_FLOOR;
const SINGULAR_NUMBER = 1;
const PLURAL_NUMBER = 2;

/** Triggers every floor. */
export class OnFloorAction extends Action {
  override actionType = ACTION_TYPE;
  levelStage?: LevelStage;

  /** If set, will only fire on the specified LevelStage. */
  getLevelStage(): LevelStage | undefined {
    return this.levelStage;
  }

  /** If set, will only fire on the specified LevelStage. */
  setLevelStage(levelStage: LevelStage): this {
    this.levelStage = levelStage;
    return this;
  }

  getLevelStageText(amount: number): string | undefined {
    const { levelStage } = this;
    if (levelStage !== undefined) {
      const name = getStageNameFromLevelStage(levelStage);
      return `${addTheS("visit", amount)} to ${name}`;
    }
    return undefined;
  }

  // Additional Text manipulation for 'RoomType' modifier.
  override getActionText(): string {
    // If overridden.
    if (this.oat !== undefined) {
      return this.oat;
    }

    let text = "";
    const fireAfterThenRemove = this.getFireAfterThenRemove();
    if (fireAfterThenRemove !== undefined) {
      if (fireAfterThenRemove === 1) {
        text += `next ${
          this.getLevelStageText(fireAfterThenRemove) ?? "floor"
        }`;
      } else {
        text += `after ${fireAfterThenRemove} ${
          this.getLevelStageText(fireAfterThenRemove) ?? "floors"
        }`;
      }
    } else {
      const intervalText = this.getIntervalText();
      if (intervalText === "") {
        text += `every ${this.getLevelStageText(SINGULAR_NUMBER) ?? "floor"}`;
      } else {
        text += `every ${intervalText} ${
          this.getLevelStageText(PLURAL_NUMBER) ?? "floors"
        }`;
      }
    }
    text += ", ";
    return text;
  }

  override trigger(triggerData: TriggerData): void {
    const levelStage = this.getLevelStage();
    if (levelStage !== undefined) {
      if (game.GetLevel().GetAbsoluteStage() !== levelStage) {
        return;
      }
    }

    super.trigger(triggerData);
  }
}

/** Triggers all OnFloorActions for all players. */
export function triggerOnFloorActions(): void {
  triggerPlayersActionsByType(ACTION_TYPE, {});
}

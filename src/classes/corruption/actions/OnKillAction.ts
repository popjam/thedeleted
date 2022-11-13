import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayersActionsByType } from "../../../features/corruption/effects/playerEffects";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_KILL;

/** Triggers every time an NPC is killed. */
// TODO: Update for boss only, etc..
export class OnKillAction extends Action {
  override actionType = ACTION_TYPE;

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
        text += "next kill";
      } else {
        text += `after killing ${fireAfterThenRemove} enemies
        }`;
      }
    } else {
      const intervalText = this.getIntervalText();
      if (intervalText === "") {
        text += "every kill";
      } else {
        text += `every time you kill ${intervalText} enemies`;
      }
    }
    text += ", ";
    return text;
  }

  override trigger(triggerData: TriggerData): void {
    super.trigger({ ...triggerData });
  }
}

/** Triggers all OnDamageActions for all players. */
export function triggerOnKillActions(entity: Entity): void {
  triggerPlayersActionsByType(ACTION_TYPE, {
    onKillAction: entity as EntityNPC,
  });
}

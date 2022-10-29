import { DamageFlag } from "isaac-typescript-definitions";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayersActionsByType } from "../../../features/corruption/effects/playerEffects";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_DAMAGE;

/** Triggers every time the player is damaged. */
export class OnDamageAction extends Action {
  override actionType = ACTION_TYPE;
  override noun = "time you take damage";
  override nounPlural = "rooms";

  // Additional Text manipulation for 'RoomType' modifier.
  override getActionText(): string {
    // If overridden.
    if (this.overriddenActionText !== undefined) {
      return this.overriddenActionText;
    }

    let text = "";
    const fireAfterThenRemove = this.getFireAfterThenRemove();
    if (fireAfterThenRemove !== undefined) {
      if (fireAfterThenRemove === 1) {
        text += `next ${this.noun}`;
      } else {
        text += `after taking damage ${fireAfterThenRemove} times
        }`;
      }
    } else {
      const intervalText = this.getIntervalText();
      if (intervalText === "") {
        text += `${this.verb} ${this.noun}`;
      } else {
        text += `after taking damage ${intervalText} times`;
      }
    }
    text += ", ";
    return text;
  }

  override trigger(triggerData: TriggerData): void {
    super.trigger(triggerData);
  }
}

/** Triggers all OnDamageActions for all players. */
export function triggerOnDamageActions(
  entity: Entity,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  triggerPlayersActionsByType(ACTION_TYPE);
  return undefined;
}

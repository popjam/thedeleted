import { CollectibleType } from "isaac-typescript-definitions";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_DEATH;

/** Triggers every time the player dies. */
export class OnDeathAction extends Action {
  override actionType = ACTION_TYPE;

  /**
   * Constructs an instance of the OnDeathAction class.
   *
   * @returns The instance of the OnDeathAction class.
   */
  construct(): this {
    return this;
  }

  override getActionText(): string {
    // If overridden.
    if (this.oat !== undefined) {
      return this.oat;
    }

    let text = "";
    const intervalText = this.getIntervalText();
    const fireAfterThenRemove = this.getFireAfterThenRemove();
    if (fireAfterThenRemove !== undefined) {
      text +=
        fireAfterThenRemove === 1
          ? `next time you die ${intervalText}`
          : `up to ${fireAfterThenRemove} times, after dying ${intervalText}`;
    } else if (intervalText === "") {
      text += "every time you die";
    } else {
      text += `every time you die ${intervalText}`;
    }
    text += ", ";
    return text;
  }

  override trigger(triggerData: TriggerData): void {
    const onDeathTriggerData = triggerData.onDeathAction;
    if (onDeathTriggerData === undefined) {
      return;
    }

    super.trigger({ ...triggerData });
  }
}

/**
 * Triggers all OnDeathActions for all players.
 *
 * PRE_CUSTOM_REVIVE callback, return a value to revive the player.
 */
export function triggerOnDeathActions(player: EntityPlayer): int | undefined {
  triggerPlayerActionsByType(player, ACTION_TYPE, {
    player,
    onDeathAction: {
      player,
    },
  });
  return CollectibleType.SAD_ONION;
}

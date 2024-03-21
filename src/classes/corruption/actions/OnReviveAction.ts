import { CollectibleType } from "isaac-typescript-definitions";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_REVIVE;

/** Triggers when the player dies, reviving them. */
export class OnReviveAction extends Action {
  override actionType = ACTION_TYPE;

  /**
   * Constructs an instance of the OnReviveAction class.
   *
   * @returns The instance of the OnReviveAction class.
   */
  construct(): this {
    return this;
  }

  protected override getTriggerClause(): string {
    return "you revive";
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
 * PRE_CUSTOM_REVIVE callback, return a value to revive the player.
 *
 * The way this works is that
 */
export function triggerOnReviveActions(player: EntityPlayer): int | undefined {
  triggerPlayerActionsByType(player, ACTION_TYPE, {
    player,
    onReviveAction: {
      player,
    },
  });
  return CollectibleType.SAD_ONION;
}

import { DamageFlag } from "isaac-typescript-definitions";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import { bitFlagsContainsValue } from "../../../helper/bitflagHelper";
import { isAcceptableDamage } from "../../../helper/damageHelper";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { getDamageFlagTextFromMap } from "../../../maps/data/damageFlagText";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_DAMAGE;

/** Triggers every time the player is damaged. */
export class OnDamageAction extends Action {
  override actionType = ACTION_TYPE;
  df?: DamageFlag;

  getDamageFlagText(): string {
    const damageFlag = this.df;
    if (damageFlag === undefined) {
      return "";
    }
    return `from ${getDamageFlagTextFromMap(damageFlag).toLowerCase()}`;
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
        text += `next time you take damage ${this.getDamageFlagText()}`;
      } else {
        text += `after taking damage ${this.getDamageFlagText()} ${fireAfterThenRemove} times
        }`;
      }
    } else {
      const intervalText = this.getIntervalText();
      if (intervalText === "") {
        text += `every time you take damage ${this.getDamageFlagText()}`;
      } else {
        text += `every time you take damage ${this.getDamageFlagText()} ${intervalText} times`;
      }
    }
    text += ", ";
    return text;
  }

  /** Only fires on this damage flag. */
  getDamageFlag(): DamageFlag | undefined {
    return this.df;
  }

  /** May add duplicates. Only fires on this damage flag. */
  setDamageFlag(damageFlag: DamageFlag): this {
    this.df = damageFlag;
    return this;
  }

  override trigger(triggerData: TriggerData): void {
    const onDamageTriggerData = triggerData.onDamageAction;
    if (onDamageTriggerData === undefined) {
      return;
    }

    // Damage flag checking...
    const damageFlag = this.getDamageFlag();
    if (damageFlag === undefined) {
      // No damageFlag specified.
      if (!isAcceptableDamage(onDamageTriggerData.damageFlags)) {
        return;
      }
    } else if (
      // A specific damage flag specified.
      !bitFlagsContainsValue(onDamageTriggerData.damageFlags, damageFlag)
    ) {
      return;
    }

    super.trigger({ ...triggerData });
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
  const player = entity.ToPlayer();
  if (player === undefined) {
    return;
  }
  triggerPlayerActionsByType(player, ACTION_TYPE, {
    player,
    onDamageAction: {
      amount,
      damageFlags,
      source,
      countdownFrames,
    },
  });
  return undefined;
}

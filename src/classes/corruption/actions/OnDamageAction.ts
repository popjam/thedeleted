import type { DamageFlag } from "isaac-typescript-definitions";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import { bitFlagsContainsValue } from "../../../helper/bitflagHelper";
import { isSensibleDamage } from "../../../helper/damageHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { damageFlagToString } from "../../../maps/data/name/damageFlagNameMap";
import { Action } from "./Action";
import { ON_DAMAGE_ACTION_FREQUENCY } from "../../../constants/severityConstants";

const ACTION_TYPE = ActionType.ON_DAMAGE;

/** Triggers every time the player is damaged. */
export class OnDamageAction extends Action {
  override actionType = ACTION_TYPE;
  df?: DamageFlag;
  override actFr = ON_DAMAGE_ACTION_FREQUENCY;

  /**
   * Constructs an instance of the OnDamageAction class.
   *
   * @param damageFlag The damage flag to set (optional).
   * @returns The instance of the OnDamageAction class.
   */
  construct(damageFlag?: DamageFlag): this {
    if (damageFlag !== undefined) {
      this.setDamageFlag(damageFlag);
    }
    return this;
  }

  override getIdealSeverity(): number {
    const damageFlag = this.getDamageFlag();
    if (damageFlag === undefined) {
      return super.getIdealSeverity();
    }

    return super.getIdealSeverity(ON_DAMAGE_ACTION_FREQUENCY * 2);
  }

  getDamageFlagText(): string {
    const damageFlag = this.df;
    if (damageFlag === undefined) {
      return "";
    }
    return ` from ${damageFlagToString(damageFlag).toLowerCase()}`;
  }

  // Override the trigger clause for OnDamageAction.
  protected override getTriggerClause(): string {
    return `you take damage${this.getDamageFlagText()}`;
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
      if (!isSensibleDamage(onDamageTriggerData.damageFlags)) {
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
    return undefined;
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

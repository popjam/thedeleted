import type {
  PillEffect,
  PillColor,
  UseFlag,
} from "isaac-typescript-definitions";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import { Action } from "./Action";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { getPillColorFromEffect } from "isaacscript-common";
import {
  ON_FLOOR_BASE_SEVERITY,
  ON_PILL_USE_ACTION_FREQUENCY,
} from "../../../constants/severityConstants";
import { addTheS } from "../../../helper/stringHelper";

const ACTION_TYPE = ActionType.ON_PILL_USE;

/** Triggers every time the player uses a pill. */
/** Represents an action that is triggered when a pill is used. */
export class OnPillUseAction extends Action {
  override actionType = ACTION_TYPE;
  pe?: PillEffect;
  pc?: PillColor;

  /**
   * Constructs an instance of the OnPillUseAction class.
   *
   * @param pillEffect The pill effect to set (optional).
   * @param pillColor The pill color to set (optional).
   * @returns The instance of the OnPillUseAction class.
   */
  construct(pillEffect?: PillEffect, pillColor?: PillColor): this {
    if (pillEffect !== undefined) {
      this.setPillEffect(pillEffect);
    }
    if (pillColor !== undefined) {
      this.setPillColor(pillColor);
    }
    return this;
  }

  override getIdealSeverity(): number {
    const pillEffect = this.getPillEffect();
    if (pillEffect !== undefined) {
      return super.getIdealSeverity(ON_FLOOR_BASE_SEVERITY);
    }

    const pillColor = this.getPillColor();
    if (pillColor !== undefined) {
      return super.getIdealSeverity(ON_FLOOR_BASE_SEVERITY);
    }

    return super.getIdealSeverity(ON_PILL_USE_ACTION_FREQUENCY);
  }

  protected override getTriggerClause(plural: boolean, _eid: boolean): string {
    const pillColor = this.getPillColor();
    const pillEffect = this.getPillEffect();

    if (pillColor !== undefined && pillEffect !== undefined) {
      return `${pillColor} ${addTheS(
        "pill",
        plural,
        false,
      )} with the ${pillEffect} effect`;
    }
    if (pillColor !== undefined) {
      return `${pillColor} ${addTheS("pill", plural, false)}`;
    }
    if (pillEffect !== undefined) {
      return `${pillEffect} ${addTheS("pill", plural, false)}`;
    }
    return addTheS("pill", plural, false);
  }

  /**
   * Sets the pill effect for this action.
   *
   * @param pillEffect The pill effect to set.
   * @returns The instance of the OnPillUseAction class.
   */
  setPillEffect(pillEffect: PillEffect): this {
    this.pe = pillEffect;
    return this;
  }

  getPillEffect(): PillEffect | undefined {
    return this.pe;
  }

  /**
   * Gets the pill color associated with this action.
   *
   * @returns The pill color, or undefined if not set.
   */
  getPillColor(): PillColor | undefined {
    return this.pc;
  }

  /**
   * Sets the pill color for this action.
   *
   * @param pillColor The pill color to set.
   * @returns The instance of the OnPillUseAction class.
   */
  setPillColor(pillColor: PillColor): this {
    this.pc = pillColor;
    return this;
  }

  // TODO: Add pill color text.
  getPillColorText(): string {
    const pillColor = this.getPillColor();
    if (pillColor === undefined) {
      return "";
    }
    return "";
  }

  // TODO: Add pill effect text.
  getPillEffectText(): string {
    const pillEffect = this.getPillEffect();
    if (pillEffect === undefined) {
      return "";
    }
    return "";
  }

  /**
   * Triggers the action with the provided trigger data.
   *
   * @param triggerData The trigger data.
   */
  override trigger(triggerData: TriggerData): void {
    const onPillUseTriggerData = triggerData.onPillUseAction;
    if (onPillUseTriggerData === undefined) {
      return;
    }

    const pillColor = this.getPillColor();
    const pillEffect = this.getPillEffect();

    if (
      (pillColor !== undefined &&
        pillColor !==
          getPillColorFromEffect(onPillUseTriggerData.pillEffect)) ||
      (pillEffect !== undefined &&
        pillEffect !== onPillUseTriggerData.pillEffect)
    ) {
      return;
    }

    super.trigger(triggerData);
  }
}

/** Triggers all OnPillUseActions for all players. */
export function triggerOnPillUseActions(
  pillEffect: PillEffect,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
): boolean | undefined {
  triggerPlayerActionsByType(player, ACTION_TYPE, {
    player,
    onPillUseAction: {
      pillEffect,
      useFlags,
    },
  });
  return undefined;
}

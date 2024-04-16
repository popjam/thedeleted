import type { EntityID } from "isaacscript-common";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";
import { getEntityNameFromEntityID } from "../../../helper/entityHelper/entityIDHelper";
import { ON_SLOT_USE_ACTION_FREQUENCY } from "../../../constants/severityConstants";

const ACTION_TYPE = ActionType.ON_SLOT_USE;

/** Triggers every time the player uses a slot. */
/** Represents an action that is triggered when a slot is used. */
export class OnSlotUseAction extends Action {
  override actionType = ACTION_TYPE;
  sID?: EntityID;
  override actFr = ON_SLOT_USE_ACTION_FREQUENCY;

  /**
   * Constructs an instance of the OnSlotUseAction class.
   *
   * @param slotId The slot id to be set. If not provided, it will fire for any slot.
   * @returns The current instance of the OnSlotUseAction class.
   */
  construct(slotId?: EntityID): this {
    this.sID = slotId;
    return this;
  }

  override getIdealSeverity(): number {
    const slotID = this.getSlotID();
    if (slotID === undefined) {
      return super.getIdealSeverity();
    }

    return super.getIdealSeverity(ON_SLOT_USE_ACTION_FREQUENCY * 5);
  }

  /**
   * Gets the slot id associated with this action.
   *
   * @returns The slot id or undefined if not set.
   */
  getSlotID(): EntityID | undefined {
    return this.sID;
  }

  /**
   * Sets the slot id for this action.
   *
   * @param slotId The slot id to set. If not provided, it will fire for any slot.
   */
  setSlotID(slotId?: EntityID): void {
    this.sID = slotId;
  }

  protected override getTriggerClause(): string {
    const slotID = this.getSlotID();
    return slotID === undefined
      ? "you use a slot"
      : `you use the ${getEntityNameFromEntityID(slotID) ?? "slot"}`;
  }

  /** Triggers the action with the provided trigger data. */
  override trigger(triggerData: TriggerData): void {
    super.trigger({ ...triggerData });
  }
}

/**
 * Triggers all OnSlotUseActions for all players.
 *
 * POST_USE_SLOT callback.
 */
export function triggerOnSlotUseActions(
  slot: Entity,
  _previousAnimation: string,
  _currentAnimation: string,
): void {
  const player = Isaac.GetPlayer(0);
  triggerPlayerActionsByType(player, ACTION_TYPE, {
    player,
    onSlotUseAction: {
      slot,
    },
  });
}

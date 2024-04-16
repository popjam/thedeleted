import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";
import type { EntityID } from "isaacscript-common";
import {
  getEntityIDFromEntity,
  getEntityNameFromEntityID,
} from "../../../helper/entityHelper/entityIDHelper";
import {
  ON_FLOOR_ACTION_FREQUENCY,
  ON_SLOT_DESTROY_ACTION_FREQUENCY,
} from "../../../constants/severityConstants";

const ACTION_TYPE = ActionType.ON_SLOT_DESTROY;

/** Triggers every time the player destroys a slot. */
export class OnSlotDestroyAction extends Action {
  override actionType = ACTION_TYPE;
  sID?: EntityID;
  override actFr = ON_SLOT_DESTROY_ACTION_FREQUENCY;

  /**
   * Constructs an instance of the OnSlotDestroyAction class.
   *
   * @param slotId The slot id to be set. If not provided, it will fire for any slot.
   * @returns The current instance of the OnSlotDestroyAction class.
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

    return super.getIdealSeverity(ON_FLOOR_ACTION_FREQUENCY);
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

  // Override the trigger clause for OnSlotDestroyAction.
  protected override getTriggerClause(): string {
    return `you destroy ${this.getSlotText() ?? "a slot"}`;
  }

  // Helper function to get the slot text.
  private getSlotText(): string | undefined {
    const slotID = this.getSlotID();
    if (slotID === undefined) {
      return undefined;
    }
    return getEntityNameFromEntityID(slotID);
  }

  /** Triggers the action with the provided trigger data. */
  override trigger(triggerData: TriggerData): void {
    const slot = triggerData.onSlotUseAction?.slot;
    if (slot === undefined) {
      return;
    }

    if (this.sID !== undefined && this.sID !== getEntityIDFromEntity(slot)) {
      return;
    }

    super.trigger({ ...triggerData });
  }
}

/**
 * Triggers all OnSlotDestroyActions for all players.
 *
 * POST_SLOT_DESTROY callback.
 */
export function triggerOnSlotDestroyActions(slot: Entity): void {
  const player = Isaac.GetPlayer(0);
  triggerPlayerActionsByType(player, ACTION_TYPE, {
    player,
    onSlotDestroyAction: {
      slot,
    },
  });
}

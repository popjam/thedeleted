import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";
import type { PickupID } from "../../../enums/data/ID/PickupID";
import type { PickupType } from "../../../enums/general/PickupType";
import { getPickupTypeFromPickupID } from "../../../helper/entityHelper/pickupIDHelper";
import {
  getEntityIDFromEntity,
  getEntityNameFromEntityID,
} from "../../../helper/entityHelper/entityIDHelper";
import { pickupTypeToString } from "../../../maps/data/name/pickupTypeNameMap";
import type { EntityID } from "isaacscript-common";

const ACTION_TYPE = ActionType.ON_PURCHASE;

/** Triggers every time the player purchases an item or pickup. */
/** Represents an action that is triggered when an item or pickup is purchased. */
export class OnPurchaseAction extends Action {
  override actionType = ACTION_TYPE;
  pk?: PickupID | PickupType;

  /**
   * Constructs an instance of the OnPurchaseAction class.
   *
   * @param pickup The pickup ID or pickup type. If not provided, it will fire for any pickup.
   * @returns The current instance of the OnPurchaseAction class.
   */
  construct(pickup?: PickupID | PickupType): this {
    this.pk = pickup;
    return this;
  }

  /**
   * Gets the pickup associated with this action.
   *
   * @returns The pickup or undefined if not set.
   */
  getPickup(): PickupID | PickupType | undefined {
    return this.pk;
  }

  /**
   * Sets the pickup for this action.
   *
   * @param pickup The pickup to set. If not provided, it will fire for any pickup.
   */
  setPickup(pickup?: PickupID | PickupType): void {
    this.pk = pickup;
  }

  doesPickupMatch(pickup: PickupID): boolean {
    const pk = this.getPickup();
    if (pk === undefined) {
      return true;
    }

    if (typeof pk === "string") {
      return pk === pickup;
    }

    // It's a PickupType.
    return getPickupTypeFromPickupID(pickup) === pk;
  }

  protected override getTriggerClause(): string {
    const pickup = this.getPickup();
    return pickup === undefined
      ? "you purchase an item"
      : `you purchase ${
          typeof pickup === "string"
            ? getEntityNameFromEntityID(pickup as EntityID) ?? "an item"
            : pickupTypeToString(pickup)
        }`;
  }

  /** Triggers the action with the provided trigger data. */
  override trigger(triggerData: TriggerData): void {
    const pickup = triggerData.onPurchaseAction?.pickup;
    if (pickup === undefined) {
      return;
    }

    if (!this.doesPickupMatch(getEntityIDFromEntity(pickup) as PickupID)) {
      return;
    }

    super.trigger({ ...triggerData });
  }
}

/**
 * Triggers all OnPurchaseActions for the specified player.
 *
 * POST_PURCHASE_ITEM callback.
 */
export function triggerOnPurchaseActions(
  player: EntityPlayer,
  pickup: EntityPickup,
): void {
  triggerPlayerActionsByType(player, ACTION_TYPE, {
    player,
    onPurchaseAction: {
      player,
      pickup,
    },
  });
}

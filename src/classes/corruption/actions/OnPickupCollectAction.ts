import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";
import { ON_PICKUP_COLLECT_ACTION_FREQUENCY } from "../../../constants/severityConstants";
import { getPickupTypeSeverity } from "../../../maps/data/pickups/pickupSeverityMap";
import type { PickupType } from "../../../enums/general/PickupType";

const ACTION_TYPE = ActionType.ON_PICKUP_COLLECT;

/** Triggers every time the player collects a pickup. */
/**
 * Represents an action that is triggered when a pickup is collected.
 *
 * @remarks The `OnPickupCollectAction` class extends the `Action` class and provides additional
 *          functionality for handling pickup collection events.
 */
export class OnPickupCollectAction extends Action {
  override actionType = ACTION_TYPE;
  pk?: PickupType;
  override actFr = ON_PICKUP_COLLECT_ACTION_FREQUENCY;

  /**
   * Constructs a new instance of the `OnPickupCollectAction` class.
   *
   * @param pickup The pickup type to associate with the action. If `undefined`, it means any pickup
   *               (provided it works with `ON_PICKUP_COLLECT`).
   * @returns The constructed `OnPickupCollectAction` instance.
   */
  construct(pickup?: PickupType): this {
    this.pk = pickup;
    return this;
  }

  override getIdealSeverity(): number {
    const pickup = this.getPickup();
    if (pickup === undefined) {
      return super.getIdealSeverity();
    }

    return super.getIdealSeverity(getPickupTypeSeverity(pickup));
  }

  /**
   * Gets the pickup type associated with the action.
   *
   * @returns The pickup type associated with the action, or `undefined` if no pickup is associated.
   */
  getPickup(): PickupType | undefined {
    return this.pk;
  }

  /**
   * Sets the pickup type to associate with the action.
   *
   * @param pickup The pickup type to associate with the action. If `undefined`, it means any pickup
   *               (provided it works with `ON_PICKUP_COLLECT`).
   */
  setPickup(pickup?: PickupType): void {
    this.pk = pickup;
  }

  /**
   * Gets the trigger clause for the action.
   *
   * @returns The trigger clause for the action.
   */
  protected override getTriggerClause(): string {
    return "you collect a pickup";
  }

  /**
   * Triggers the action with the specified trigger data.
   *
   * @param triggerData The trigger data to pass to the action.
   */
  override trigger(triggerData: TriggerData): void {
    super.trigger({ ...triggerData });
  }
}

/**
 * Triggers all OnPickupCollectActions for all players.
 *
 * POST_PICKUP_COLLECT callback.
 */
export function triggerOnPickupCollectActions(
  pickup: EntityPickup,
  player: EntityPlayer,
): void {
  triggerPlayerActionsByType(player, ACTION_TYPE, {
    player,
    onPickupCollectAction: {
      player,
      pickup,
    },
  });
}

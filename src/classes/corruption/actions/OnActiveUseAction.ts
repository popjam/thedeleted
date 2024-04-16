import { ItemConfigChargeType, ItemType } from "isaac-typescript-definitions";
import type { CollectibleType } from "isaac-typescript-definitions";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";
import { getCollectibleNameWithEIDSetting } from "../../../helper/compatibility/EID/EIDHelper";
import { rollPercentage } from "../../../types/general/Percentage";
import { getRandomCollectibleType } from "../../../helper/collectibleHelper";
import {
  getCollectibleChargeType,
  getCollectibleMaxCharges,
} from "isaacscript-common";
import { ON_ROOM_ACTION_FREQUENCY } from "../../../constants/severityConstants";

const ACTION_TYPE = ActionType.ON_ACTIVE_USE;
const SHUFFLE_CHANCE_FOR_COLLECTIBLE_PARAM = 10;

/** Triggers every time the player uses an active item. */
/** Represents an action that is triggered when an active item is used. */
export class OnActiveUseAction extends Action {
  override actionType = ACTION_TYPE;
  act?: CollectibleType;
  override actFr = ON_ROOM_ACTION_FREQUENCY;

  /**
   * Constructs an instance of the OnActiveUseAction class.
   *
   * @param activeItem The active item to be set. If not provided, it will fire for any active item.
   * @returns The current instance of the OnActiveUseAction class.
   */
  construct(activeItem?: CollectibleType): this {
    this.act = activeItem;
    return this;
  }

  override getIdealSeverity(): number {
    const activeItem = this.getActiveItem();
    if (activeItem === undefined) {
      return super.getIdealSeverity();
    }

    const chargeType = getCollectibleChargeType(activeItem);
    if (chargeType === ItemConfigChargeType.NORMAL) {
      const charges = getCollectibleMaxCharges(activeItem);
      return super.getIdealSeverity(ON_ROOM_ACTION_FREQUENCY * charges);
    }

    return super.getIdealSeverity();
  }

  override shuffle(): this {
    if (rollPercentage(SHUFFLE_CHANCE_FOR_COLLECTIBLE_PARAM)) {
      const randomActive = getRandomCollectibleType({
        itemType: ItemType.ACTIVE,
        chargeType: ItemConfigChargeType.NORMAL,
      });
      this.setActiveItem(randomActive);
    }

    return super.shuffle();
  }

  /**
   * Gets the active item associated with this action.
   *
   * @returns The active item or undefined if not set.
   */
  getActiveItem(): CollectibleType | undefined {
    return this.act;
  }

  /**
   * Sets the active item for this action.
   *
   * @param act The active item to set. If not provided, it will fire for any active item.
   */
  setActiveItem(act?: CollectibleType): void {
    this.act = act;
  }

  // Override the trigger clause for OnActiveUseAction.
  protected override getTriggerClause(): string {
    return `you use ${this.getActiveItemText() ?? "an active item"}`;
  }

  // Helper function to get the active item text.
  private getActiveItemText(): string | undefined {
    const activeItem = this.getActiveItem();
    if (activeItem === undefined) {
      return undefined;
    }
    return getCollectibleNameWithEIDSetting(activeItem);
  }

  /**
   * Triggers the action with the provided trigger data.
   *
   * TODO: Restrict unlimited use Active Items.
   */
  override trigger(triggerData: TriggerData): void {
    super.trigger({ ...triggerData });
  }
}

/**
 * Triggers all OnActiveUseActions for all players.
 *
 * POST_USE_ITEM callback.
 */
export function triggerOnActiveUseActions(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): void {
  triggerPlayerActionsByType(player, ACTION_TYPE, {
    player,
    onActiveUseAction: {
      player,
      active: collectibleType,
    },
  });
}

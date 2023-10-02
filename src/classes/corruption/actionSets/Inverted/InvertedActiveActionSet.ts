import {
  ActiveSlot,
  CollectibleType,
  ItemConfigChargeType,
} from "isaac-typescript-definitions";
import { deepCopy } from "isaacscript-common";
import { ActionSetType } from "../../../../enums/corruption/actionSets/ActionSetType";
import { ActionOrigin } from "../../../../enums/corruption/actions/ActionOrigin";
import type { ActionType } from "../../../../enums/corruption/actions/ActionType";
import {
  addActionOrResponseToTracker,
  removeActionWithPredicate,
} from "../../../../features/corruption/effects/playerEffects";
import {
  _addInvertedItemToCorruptInventory,
  _removeInvertedItemFromCorruptInventory,
} from "../../../../features/corruption/inventory/itemInventory";
import {
  PickupStage,
  setLastPickedUpCollectible,
} from "../../../../features/corruption/inversion/lastPickedUpInverted";
import { getPedestalCharges } from "../../../../features/corruption/inversion/pedestalCharges";
import { fprint } from "../../../../helper/printHelper";
import { getZazzActiveFromCharge } from "../../../../maps/activeChargeToZazzActive";
import { mod } from "../../../../mod";
import { _addInvertedActiveToPlayer } from "../../../facets/CustomActiveFacet";
import { playPickupAnimationWithCustomSprite } from "../../../facets/RenderOverHeadFacet";
import type { Action } from "../../actions/Action";
import type { Response } from "../../responses/Response";
import { InvertedItemActionSet } from "./InvertedItemActionSet";

const DEFAULT_NAME = "Corrupted Active Item";
const DEFAULT_CHARGES = 4;
const DEFAULT_CHARGE_TYPE = ItemConfigChargeType.NORMAL;

/** ActionSet class. */
export class InvertedActiveActionSet extends InvertedItemActionSet {
  override actionSetType: ActionSetType = ActionSetType.INVERTED_ACTIVE_ITEM;
  ch?: number;
  chT?: ItemConfigChargeType;

  /** Remove after X uses attribute. */
  rX?: number;

  /** Number of times the item has been used. */
  nu?: number;

  /**
   * Transform after use attribute. After the Inverted Active Item is used, it will immediately
   * transform itself into the specified inverted/non-inverted item (preserving the same slot if it
   * is an active).
   */
  tu?: {
    /** The item to transform into: */
    i: CollectibleType;

    /** Whether the new item should be inverted or non-inverted. */
    iI?: boolean;

    /** How many uses until transformation (undefined is equal to 1). */
    u?: number;
  };

  /**
   * Charge with - if this is enabled, item will not charge normally, instead charging when the
   * Action is triggered.
   */
  cw?: Action;

  /**
   * On use condition - E.g requires a key to use. If the condition is not satisfied, will not be
   * used.
   */
  uc?: Response;

  override getName(): string {
    return this.n ?? DEFAULT_NAME;
  }

  /**
   * Get number of charges the active item has. This will have different meanings depending on the
   * ChargeType.
   */
  getCharges(): number {
    return this.ch ?? DEFAULT_CHARGES;
  }

  /**
   * Set the amount of charges the item has. This will have different meanings depending on the
   * ChargeType.
   */
  setCharges(charges: number): this {
    this.ch = charges;
    return this;
  }

  /** Get the item's chargeType. */
  getChargeType(): ItemConfigChargeType {
    return this.chT ?? DEFAULT_CHARGE_TYPE;
  }

  /** Set the item's chargeType. */
  setChargeType(chargeType: ItemConfigChargeType): this {
    this.chT = chargeType;
    return this;
  }

  /**
   * Retrieves the correct 'Zazzinator Active' based on the configuration of this ActiveActionSet.
   */
  getZazzActive(actionSet: InvertedActiveActionSet): CollectibleType {
    return getZazzActiveFromCharge(
      actionSet.getChargeType(),
      actionSet.getCharges(),
    );
  }

  /** Use the Inverted Active item. */
  // POST_USE_ITEM
  use(
    player: EntityPlayer,
  ):
    | boolean
    | { Discharge: boolean; Remove: boolean; ShowAnim: boolean }
    | undefined {
    fprint(
      `Inverted Active with ${this.getCharges()} charges used, triggering ${
        this.getResponses().length
      } responses..`,
    );

    /** Trigger responses. Do it twice if they have car battery. */
    const hasCarBattery = player.HasCollectible(CollectibleType.CAR_BATTERY);
    const repeatAmount = hasCarBattery ? 2 : 1;
    for (let i = 0; i < repeatAmount; i++) {
      for (const response of this.getResponses()) {
        response.trigger({
          player,
        });
      }
    }

    /** Play sound. */
    this.playSoundEffect();

    /** Play 'use item' animation. */
    const icon = this.getIcon();
    playPickupAnimationWithCustomSprite(player, icon, 2);

    return { Discharge: true, Remove: false, ShowAnim: false };
  }

  preGetPedestal(
    player: EntityPlayer,
    pedestal: EntityPickupCollectible,
  ): boolean | undefined {
    setLastPickedUpCollectible(player, {
      collectibleType: pedestal.SubType,
      pickupStage: PickupStage.PRE_GET_PEDESTAL,
      pickupIndex: mod.getPickupIndex(pedestal),
      inverted: true,
    });
    pedestal.SubType = getZazzActiveFromCharge(
      this.getChargeType(),
      this.getCharges(),
    );
    pedestal.Charge = getPedestalCharges(pedestal) ?? this.getCharges();
    return false;
  }
}

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
  addActionOrResponseToPlayer,
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
import { shouldZazzActiveBeACopy } from "../../../../helper/deletedSpecific/inversion/customActiveHelper";
import { fprint } from "../../../../helper/printHelper";
import { getZazzActiveFromCharge } from "../../../../maps/activeChargeToZazzActive";
import { mod } from "../../../../mod";
import { isZazzinatorActiveCopy } from "../../../../sets/zazzSets";
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

  /** Is the physical zazzinator item a copy or not. */
  copy?: boolean;

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
      actionSet.copy,
    );
  }

  /**
   * Add the inverted Active to the player's inventory.
   *
   * @param player The player to add the Active to.
   * @param collectible The CollectibleType of the Active to add.
   * @param addLogo Whether to add the Zazz logo to the Active.
   * @param addToInventory Whether to add the Active to the player's inventory.
   * @param slot The slot to add the Active to.
   */
  addToPlayer(
    player: EntityPlayer,
    collectible: CollectibleType,
    addLogo: boolean,
    addToInventory: boolean,
    slot:
      | ActiveSlot.PRIMARY
      | ActiveSlot.POCKET
      | ActiveSlot.POCKET_SINGLE_USE = ActiveSlot.PRIMARY,
  ): void {
    const actionSet = deepCopy<InvertedActiveActionSet>(this);
    actionSet.oi = collectible;

    // Add logo.
    if (addLogo) {
      if (slot === ActiveSlot.PRIMARY) {
        const shouldBeCopy = shouldZazzActiveBeACopy(player);
        actionSet.copy = shouldBeCopy;
        player.AddCollectible(
          this.getZazzActive(actionSet),
          this.getCharges(),
          undefined,
          slot,
        );
      } else {
        player.SetPocketActiveItem(this.getZazzActive(actionSet), slot);
      }
    } else {
      actionSet.copy = isZazzinatorActiveCopy(player.GetActiveItem());
      fprint(`Is copy: ${actionSet.copy}`);
    }

    // Inventory.
    if (addToInventory) {
      _addInvertedItemToCorruptInventory(player, collectible);
    }

    /**
     * Add the Actions to the player. These Actions will be active while the player holds the
     * inverted active, and be removed once the active is removed.
     */
    for (const action of actionSet.getActions()) {
      action.o = [ActionOrigin.INVERTED_COLLECTIBLE, actionSet.oi ?? 0];
      // Should this deepCopy?
      addActionOrResponseToPlayer(player, action);
    }

    _addInvertedActiveToPlayer(player, actionSet, slot);
  }

  removeFromPlayer(
    player: EntityPlayer,
    collectible: CollectibleType,
    removeLogo: boolean,
    removeFromInventory: boolean,
  ): void {
    // Remove the Actions using advanced GPT-5 AI technology.
    const actionTypes = this.getActions().map((action) => action.actionType);
    actionTypes.forEach((actionType: ActionType) => {
      removeActionWithPredicate(
        (action) =>
          action.o?.[0] === ActionOrigin.INVERTED_COLLECTIBLE &&
          action.o[1] === (collectible as number),
        player,
        actionType,
      );
    });

    // Remove the logo from player item tracker.
    if (removeLogo) {
      // player.RemoveCollectible(CollectibleTypeCustom.ZAZZ);
    }

    // Remove most recent from inventory.
    if (removeFromInventory) {
      _removeInvertedItemFromCorruptInventory(player, collectible);
    }
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
    const shouldBeCopy = shouldZazzActiveBeACopy(player);
    pedestal.SubType = getZazzActiveFromCharge(
      this.getChargeType(),
      this.getCharges(),
      shouldBeCopy,
    );
    pedestal.Charge = getPedestalCharges(pedestal) ?? this.getCharges();
    fprint(`Pedestal charge: ${pedestal.Charge}
    Inverted Active charge: ${this.getCharges()}
    Inverted Active chargeType: ${this.getChargeType()}
    Should be copy: ${shouldBeCopy}
    X-----X END PRE_GET_PEDESTAL X-----X

    `);
    return false;
  }
}

import {
  ActiveSlot,
  CollectibleType,
  ItemConfigChargeType,
} from "isaac-typescript-definitions";
import { deepCopy, isColor } from "isaacscript-common";
import { ActionSetType } from "../../../../enums/corruption/actionSets/ActionSetType";
import { ActionOrigin } from "../../../../enums/corruption/actions/ActionOrigin";
import { addActionOrResponseToPlayer } from "../../../../features/corruption/effects/playerEffects";
import { addInvertedItemToCorruptInventory } from "../../../../features/corruption/inventory/itemInventory";
import {
  PickupStage,
  setLastPickedUpCollectible,
} from "../../../../features/corruption/inversion/lastPickedUpInverted";
import { fprint } from "../../../../helper/printHelper";
import {
  getZazzActiveFromCharge,
  getZazzActiveFromInvertedActiveActionSet,
} from "../../../../maps/activeChargeToZazzActive";
import { mod } from "../../../../mod";
import {
  _addInvertedActiveToPlayer,
  shouldZazzActiveBeACopy,
} from "../../../facets/CustomActiveFacet";
import { playPickupAnimationWithCustomSprite } from "../../../facets/RenderOverHeadFacet";
import { InvertedItemActionSet } from "./InvertedItemActionSet";

const DEFAULT_NAME = "Corrupted Active Item";
const DEFAULT_CHARGES = 4;
const DEFAULT_CHARGE_TYPE = ItemConfigChargeType.NORMAL;

/** ActionSet class. */
export class InvertedActiveActionSet extends InvertedItemActionSet {
  override actionSetType: ActionSetType = ActionSetType.INVERTED_ACTIVE_ITEM;
  ch?: number;
  chT?: ItemConfigChargeType;

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

  /** Add the inverted Active to the player. */
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
          getZazzActiveFromInvertedActiveActionSet(actionSet),
          this.getCharges(),
          undefined,
          slot,
        );
      } else {
        player.SetPocketActiveItem(
          getZazzActiveFromInvertedActiveActionSet(actionSet),
          slot,
        );
      }
    }

    // Inventory.
    if (addToInventory) {
      addInvertedItemToCorruptInventory(player, collectible);
    }

    /**
     * Add the Actions to the player. These Actions will be active while the player holds the
     * inverted active, and be removed once the active is removed.
     */
    actionSet.getActions().forEach((action) => {
      action.o = [ActionOrigin.INVERTED_COLLECTIBLE, actionSet.oi ?? 0];
      // Should this deepCopy?
      addActionOrResponseToPlayer(player, action);
    });

    _addInvertedActiveToPlayer(player, actionSet, slot);
  }

  removeFromPlayer(
    player: EntityPlayer,
    collectible: CollectibleType,
    removeLogo: boolean,
    removeFromInventory: boolean,
  ): void {}

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

    /** Trigger responses. */
    this.getResponses().forEach((response) => {
      response.trigger({
        player,
      });
    });

    /** Play sound. */
    this.playSoundEffect();

    /** Play 'use item' animation. */
    const icon = this.getIcon();
    if (!isColor(icon)) {
      playPickupAnimationWithCustomSprite(player, icon, 2);
    }

    return undefined;
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
    return false;
  }
}

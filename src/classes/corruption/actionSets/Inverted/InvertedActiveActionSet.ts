import {
  CollectibleType,
  ItemConfigChargeType,
  ItemType,
} from "isaac-typescript-definitions";
import { ActionSetType } from "../../../../enums/corruption/actionSets/ActionSetType";
import {
  PickupStage,
  getPedestalPickingUpData,
  setLastPickedUpCollectible,
} from "../../../../features/corruption/inversion/lastPickedUpInverted";
import { fprint } from "../../../../helper/printHelper";
import { getZazzActiveFromCharge } from "../../../../maps/activeChargeToZazzActive";
import { mod } from "../../../../mod";
import { _addInvertedActiveToPlayer } from "../../../facets/CustomActiveFacet";
import { playPickupAnimationWithCustomSprite } from "../../../facets/RenderOverHeadFacet";
import type { Action } from "../../actions/Action";
import type { Response } from "../../responses/Response";
import { InvertedItemActionSet } from "./InvertedItemActionSet";
import { getEIDMarkupFromShortcut } from "../../../../helper/compatibility/EIDHelper";
import { legibleString } from "../../../../helper/stringHelper";
import {
  INVERTED_ACTIVE_EID_ICON,
  NO_EFFECTS_DEFAULT_TEXT,
} from "../../../../constants/actionSetConstants";
import { sortEffectsByMorality } from "../../../../helper/deletedSpecific/inversion/moralityHelper";
import type { EIDDescObject } from "../../../../interfaces/compatibility/EIDDescObject";
import { MOD_NAME } from "../../../../constants/mod/modConstants";
import type { CustomActiveData } from "../../../../interfaces/corruption/actionSets/CustomActiveData";
import {
  getAndRemoveTrackedPedestalInvertedActive,
  getTrackedPedestalInvertedActive,
  removeTrackedPedestalInvertedActive,
  setTrackedPedestalCharge,
  setTrackedPedestalInvertedActive,
} from "../../../../features/corruption/effects/activeItemTracker";

const DEFAULT_NAME = "Corrupted Active Item";
const DEFAULT_CHARGES = 4;
const DEFAULT_CHARGE_TYPE = ItemConfigChargeType.NORMAL;
const RESPONSE_EID_TEXT = "#{{Blank}} {{Blank}} {{Blank}} {{Blank}} On Use:";
const ACTION_EID_TEXT = "#{{Blank}} {{Blank}} {{Blank}} {{Blank}} While held:";

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

  /** Data related to the custom active item this ActionSet is attached to. */
  cd?: CustomActiveData;

  /** The current charge count of the custom active item. */
  cc?: number;

  /**
   * The current charge count of the non-Inverted Active item that is on the flip side of this one.
   */
  fc?: number;

  override getName(): string {
    return this.n ?? DEFAULT_NAME;
  }

  override getDescObject(): EIDDescObject {
    return {
      Description: legibleString(this.getText()),
      Name: this.getName(),
      ModName: MOD_NAME,
      Quality: this.getQuality(),
      Icon: EID?.getIcon(INVERTED_ACTIVE_EID_ICON),
      ItemType: ItemType.ACTIVE,
      Charges: this.getCharges(),
      ChargeType: this.getChargeType(),
    };
  }

  /**
   * Get the text describing the ActionSet. Overridden to separate 'On Use' and 'On Pickup' effects
   * and to prevent mistaking it for a Passive.
   */
  override getText(eid = true): string {
    let text = "";
    const actions = sortEffectsByMorality(this.getActions());
    const responses = sortEffectsByMorality(this.getResponses());
    for (let i = 0; i < 2; i++) {
      if (i === 0 && responses.length === 0) {
        continue;
      }
      if (i === 1 && actions.length === 0) {
        continue;
      }
      text += i === 0 ? RESPONSE_EID_TEXT : ACTION_EID_TEXT;
      for (const actionOrResponse of i === 0 ? responses : actions) {
        text += "#";
        if (eid) {
          // Set color of action / response.
          text += getEIDMarkupFromShortcut(
            actionOrResponse.getTextColor() ??
              this.getActionOrResponseColor(actionOrResponse),
          );
        }
        text += legibleString(actionOrResponse.getText());
        if (eid) {
          text += "{{CR}}";
        }
      }
    }
    if (text === "") {
      return NO_EFFECTS_DEFAULT_TEXT;
    }
    return text;
  }

  /**
   * Update the tracking of the custom active's current charge. This does not actually change the
   * current charge of the custom active.
   */
  setCurrentCharge(charge: number): this {
    this.cc = charge;
    return this;
  }

  /**
   * Get the tracked current charge of the custom active. Will return 0 if there is no current
   * charge tracked. This does not actually get the current charge of the custom active, but rather
   * the charge that is tracked.
   */
  getCurrentCharge(): number {
    return this.cc ?? 0;
  }

  /**
   * Update the tracking of the non-Inverted active's current charge. This does not actually change
   * the current charge of the non-Inverted active.
   */
  setFlipCharge(charge: number): this {
    this.fc = charge;
    return this;
  }

  /**
   * Get the tracked current charge of the non-Inverted active. Will return 0 if there is no current
   * charge tracked (for example, if the flipped item is a passive). This does not actually get the
   * current charge of the non-Inverted active, but rather the charge that is tracked.
   */
  getFlipCharge(): number {
    return this.fc ?? 0;
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

    // Save the original charge of the item on the pedestal. This should always be the charge of the
    // non-Inverted active (if the non-Inverted item is a passive, we can ignore this).
    setTrackedPedestalCharge(pedestal, pedestal.Charge);

    // Quickly change the item on the pedestal to the correct Zazzinator item.
    pedestal.SubType = getZazzActiveFromCharge(
      this.getChargeType(),
      this.getCharges(),
    );

    // If the inverted active item associated with the pedestal already existed and is being
    // tracked, we use the tracked charge instead of the default charge. We don't remove it as we
    // still need to track it for postItemPickup.
    fprint(
      `tracked inverted active charge upon pickup: ${
        getTrackedPedestalInvertedActive(pedestal)?.getCurrentCharge() ?? -1
      }`,
    );
    pedestal.Charge =
      getTrackedPedestalInvertedActive(pedestal)?.getCurrentCharge() ??
      this.getCharges();

    return false;
  }
}

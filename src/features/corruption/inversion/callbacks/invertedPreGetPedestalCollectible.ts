/**
 * This file tracks provides the logic for what happens when an inverted pedestal is picked up by
 * the player.
 */

import {
  clearCollectibleSprite,
  ColorDefault,
  getCollectibleName,
  getPlayerIndex,
} from "isaacscript-common";
import { ActionSetType } from "../../../../enums/corruption/actionSets/ActionSetType";
import { fprint } from "../../../../helper/printHelper";
import { stopPickupSounds } from "../../../../helper/soundHelper";
import { isGlitchedCollectibleSubType } from "../../../../helper/tmtrainerHelper";
import { mod } from "../../../../mod";
import { isZazzinatorAny } from "../../../../sets/zazzSets";
import { getNonInvertedPickupActionSet } from "../../effects/pickupEffects";
import {
  getLastPickedUpCollectibleData,
  setLastPickedUpCollectibleData,
  setLastPickedUpNonInvertedCollectibleActionSet,
  updateLastPickedUpCollectible,
} from "../lastPickedUpInverted";
import { isPickupInverted } from "../pickupInversion";
import { PickupStage } from "../../../../enums/general/PickupStage";
import type { LastPickedUpCollectibleData } from "../../../../interfaces/corruption/inversion/LastPickedUpCollectibleData";
import { removeTrackedPedestalInvertedActive } from "../../effects/activeItemTracker";
import { getAndSetInvertedPedestalActionSet } from "../../../../helper/deletedSpecific/effects/pedestalEffects";

/**
 * Upon picking up an item, but before it is added to ItemQueue. If the item pedestal is inverted,
 * swap it for 'ZAZZ' right before its picked up.
 */
// ModCallbacksCustom.MC_PRE_GET_PEDESTAL_COLLECTIBLE
export function pickupInversionPreGetPedestalCollectible(
  player: EntityPlayer,
  pickup: EntityPickupCollectible,
): boolean | undefined {
  const isInverted = isPickupInverted(pickup);

  // PickupStage.PRE_GET_PEDESTAL_ZAZZ.
  if (isZazzinatorAny(pickup.SubType)) {
    return preGetPedestalZazz(player, pickup);
  }

  // PickupStage.PRE_GET_PEDESTAL.
  return preGetPedestalNormal(player, pickup, isInverted);
}

// PickupStage.PRE_GET_PEDESTAL.
function preGetPedestalNormal(
  player: EntityPlayer,
  pickup: EntityPickupCollectible,
  isInverted: boolean,
): boolean | undefined {
  // Update pickup tracking.
  const lastPickedUpCollectibleData: LastPickedUpCollectibleData = {
    collectibleType: pickup.SubType,
    pickupStage: PickupStage.PRE_GET_PEDESTAL,
    pickupIndex: mod.getPickupIndex(pickup),
    inverted: false,
    pedestal: pickup,
    nonInvertedCharge: pickup.Charge,
  };

  fprint(
    `PreGetPedestalNormal: ${pickup.SubType} name: ${getCollectibleName(
      pickup.SubType,
    )} player: ${getPlayerIndex(player)} inversion: ${isInverted}`,
  );

  if (isInverted) {
    // Get ActionSet so we can know what ZAZZ to modify to.
    const itemActionSet = getAndSetInvertedPedestalActionSet(pickup);

    // We can set the pedestal tracker to undefined for now. If the put down item should be tracked,
    // it will be set in the next callback.
    removeTrackedPedestalInvertedActive(pickup);

    // Save last picked up collectible data.
    lastPickedUpCollectibleData.inverted = true;
    lastPickedUpCollectibleData.actionSet = itemActionSet;
    setLastPickedUpCollectibleData(player, lastPickedUpCollectibleData);

    fprint(
      `   Inverted Active: ${
        itemActionSet.actionSetType === ActionSetType.INVERTED_ACTIVE_ITEM
      }
      ActionSet: ${itemActionSet.getText()}`,
    );
    return itemActionSet.preGetPedestal(player, pickup);
  }

  setLastPickedUpCollectibleData(player, lastPickedUpCollectibleData);

  const itemActionSet = getNonInvertedPickupActionSet(pickup);
  if (itemActionSet !== undefined) {
    setLastPickedUpNonInvertedCollectibleActionSet(player, itemActionSet);
    fprint(`NonInverted ActionSet: ${itemActionSet.getText()}`);
    return undefined;
  }
  return undefined;
}

// PickupStage.PRE_GET_PEDESTAL_ZAZZ.
function preGetPedestalZazz(
  player: EntityPlayer,
  pickup: EntityPickupCollectible,
): boolean | undefined {
  const lastPickedUpCollectible = getLastPickedUpCollectibleData(player);

  /**
   * We don't care about it if it's not inverted.
   * TODO: Deal with useless zazz item.
   */
  if (
    lastPickedUpCollectible === undefined ||
    !lastPickedUpCollectible.inverted
  ) {
    return undefined;
  }

  // Stop pickup sound. We will play our own sound effect later.
  mod.runNextGameFrame(() => {
    stopPickupSounds();
    pickup.GetSprite().Color = ColorDefault;
  });

  /**
   * If it was a TMTRAINER item, need to temporarily turn it invisible so the original TMTRAINER
   * sprite doesn't render behind it.
   */
  if (isGlitchedCollectibleSubType(lastPickedUpCollectible.collectibleType)) {
    pickup.GetSprite().Color = Color(0, 0, 0, 0);
  } else {
    clearCollectibleSprite(pickup);
  }

  /** Update pickup stage. */
  updateLastPickedUpCollectible(player, PickupStage.PRE_GET_PEDESTAL_ZAZZ);

  fprint(
    `PreGetPedestalZazz: ${pickup.SubType} name: ${getCollectibleName(
      pickup.SubType,
    )} player: ${getPlayerIndex(player)} inversion: ${
      lastPickedUpCollectible.inverted
    }`,
  );

  return undefined;
}

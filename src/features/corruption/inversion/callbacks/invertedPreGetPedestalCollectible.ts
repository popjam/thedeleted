/**
 * This file tracks provides the logic for what happens when an inverted pedestal is picked up by
 * the player.
 */

import {
  clearCollectibleSprite,
  ColorDefault,
  getPlayerIndex,
  isColor,
} from "isaacscript-common";
import { ActionSetType } from "../../../../enums/corruption/actionSets/ActionSetType";
import { fprint } from "../../../../helper/printHelper";
import { stopPickupSounds } from "../../../../helper/soundHelper";
import { isGlitchedCollectibleSubType } from "../../../../helper/tmtrainerHelper";
import { mod } from "../../../../mod";
import { isZazzinatorAny } from "../../../../sets/zazzSets";
import { getAndSetInvertedItemActionSet } from "../../effects/itemEffects";
import { getNonInvertedPickupActionSet } from "../../effects/pickupEffects";
import {
  getLastPickedUpCollectible,
  isPedestalInPreGetPedestalStage,
  PickupStage,
  setLastPickedUpCollectible,
  setLastPickedUpNonInvertedCollectibleActionSet,
} from "../lastPickedUpInverted";
import { isPickupInverted } from "../pickupInversion";

/**
 * Upon picking up an item, but before it is added to ItemQueue. If the item pedestal is inverted,
 * swap it for 'ZAZZ' right before its picked up.
 */
// ModCallbacksCustom.MC_PRE_GET_PEDESTAL_COLLECTIBLE
export function pickupInversionPreGetPedestalCollectible(
  player: EntityPlayer,
  pickup: EntityPickupCollectible,
): boolean | undefined {
  if (isPedestalInPreGetPedestalStage(pickup)) {
    return undefined;
  }

  const isInverted = isPickupInverted(pickup);
  if (isZazzinatorAny(pickup.SubType)) {
    const lastPickedUpInvertedCollectible = getLastPickedUpCollectible(player);
    if (lastPickedUpInvertedCollectible === undefined) {
      return undefined;
    }
    const iconIsColor = isColor(
      getAndSetInvertedItemActionSet(
        lastPickedUpInvertedCollectible.collectibleType,
      ).getIcon(),
    );

    // Stop pickup sound. We will play our own sound effect later.
    mod.runNextGameFrame(() => {
      stopPickupSounds();
      if (!iconIsColor) {
        pickup.GetSprite().Color = ColorDefault;
      }
    });

    /**
     * If it was a TMTRAINER item, need to temporarily turn it invisible so the original TMTRAINER
     * sprite doesn't render behind it.
     */
    if (
      isGlitchedCollectibleSubType(
        lastPickedUpInvertedCollectible.collectibleType,
      )
    ) {
      pickup.GetSprite().Color = Color(0, 0, 0, 0);
    } else if (!iconIsColor) {
      clearCollectibleSprite(pickup);
    }
    return undefined;
  }
  if (isInverted) {
    const itemActionSet = getAndSetInvertedItemActionSet(pickup.SubType);
    fprint(
      `pickupInversion: ${getPlayerIndex(player)} picked up an inverted ${
        itemActionSet.actionSetType === ActionSetType.INVERTED_ACTIVE_ITEM
          ? "active"
          : "passive"
      } of subType: ${pickup.SubType}`,
    );
    return itemActionSet.preGetPedestal(player, pickup);
  }
  const itemActionSet = getNonInvertedPickupActionSet(pickup);
  if (itemActionSet !== undefined) {
    setLastPickedUpNonInvertedCollectibleActionSet(player, itemActionSet);
    setLastPickedUpCollectible(player, {
      collectibleType: pickup.SubType,
      pickupStage: PickupStage.PRE_GET_PEDESTAL,
      pickupIndex: mod.getPickupIndex(pickup),
      inverted: false,
    });
    fprint(
      `pickupInversion: ${getPlayerIndex(
        player,
      )} picked up a regular item with action set`,
    );
    return undefined;
  }

  return undefined;
}

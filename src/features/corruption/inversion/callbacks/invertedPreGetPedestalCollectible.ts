/**
 * This file tracks provides the logic for what happens when an inverted pedestal is picked up by
 * the player.
 */

import { ColorDefault, getPlayerIndex } from "isaacscript-common";
import { fprint } from "../../../../helper/printHelper";
import { stopPickupSounds } from "../../../../helper/soundHelper";
import { isGlitchedCollectibleSubType } from "../../../../helper/tmtrainerHelper";
import { mod } from "../../../../mod";
import { isZazzinatorAny } from "../../../../sets/zazzSets";
import { getAndSetInvertedItemActionSet } from "../../effects/itemEffects";
import {
  getLastPickedUpInvertedCollectible,
  setLastPickedUpInvertedCollectible,
} from "../lastPickedUpInverted";
import { isPedestalInverted } from "../pickupInversion";

/**
 * Upon picking up an item, but before it is added to ItemQueue. If the item pedestal is inverted,
 * swap it for 'ZAZZ' right before its picked up.
 */
// ModCallbacksCustom.MC_PRE_GET_PEDESTAL_COLLECTIBLE
export function pickupInversionPreGetPedestalCollectible(
  player: EntityPlayer,
  pickup: EntityPickupCollectible,
): boolean | undefined {
  const isInverted = isPedestalInverted(pickup);
  if (isZazzinatorAny(pickup.SubType)) {
    // Stop pickup sound. We will play our own sound effect later.
    mod.runNextGameFrame(() => {
      stopPickupSounds();
      pickup.GetSprite().Color = ColorDefault;
    });

    /**
     * If it was a TMTRAINER item, need to temporarily turn it invisible so the original TMTRAINER
     * sprite doesn't render behind it.
     */
    if (
      isGlitchedCollectibleSubType(getLastPickedUpInvertedCollectible(player))
    ) {
      pickup.GetSprite().Color = Color(0, 0, 0, 0);
    }
    return undefined;
  }
  if (isInverted) {
    const itemActionSet = getAndSetInvertedItemActionSet(pickup.SubType);
    fprint(
      `pickupInversion: ${getPlayerIndex(
        player,
      )} picked up an inverted item of subType: ${pickup.SubType}`,
    );
    setLastPickedUpInvertedCollectible(player, pickup.SubType);
    return itemActionSet.preGetPedestal(player, pickup);
  }
  return undefined;
}

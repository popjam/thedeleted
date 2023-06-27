/**
 * This file tracks provides the logic for what happens when an inverted pedestal is picked up by
 * the player.
 */

import {
  clearCollectibleSprite,
  ColorDefault,
  getCollectibleName,
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
  PickupStage,
  setLastPickedUpCollectible,
  setLastPickedUpNonInvertedCollectibleActionSet,
  updateLastPickedUpCollectible,
} from "../lastPickedUpInverted";
import { getPedestalCharges } from "../pedestalCharges";
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
  setLastPickedUpCollectible(player, {
    collectibleType: pickup.SubType,
    pickupStage: PickupStage.PRE_GET_PEDESTAL,
    pickupIndex: mod.getPickupIndex(pickup),
    inverted: false,
  });

  fprint(
    `

    X-------X START PRE_GET_PEDESTAL X-------X
    Player: ${getPlayerIndex(player)}
    Pickup: ${pickup.SubType} name: ${getCollectibleName(pickup.SubType)})}
    Inversion: ${isInverted}`,
  );

  if (isInverted) {
    const itemActionSet = getAndSetInvertedItemActionSet(pickup.SubType);
    fprint(
      `   Inverted Active: ${
        itemActionSet.actionSetType === ActionSetType.INVERTED_ACTIVE_ITEM
      }
      ActionSet: ${itemActionSet.getText()}`,
    );
    return itemActionSet.preGetPedestal(player, pickup);
  }
  const itemActionSet = getNonInvertedPickupActionSet(pickup);
  pickup.Charge = getPedestalCharges(pickup) ?? pickup.Charge;
  if (itemActionSet !== undefined) {
    setLastPickedUpNonInvertedCollectibleActionSet(player, itemActionSet);
    fprint(
      `   Non-Inverted ActionSet: ${itemActionSet.getText()}
      X-------X END PRE_GET_PEDESTAL X-------X

      `,
    );
    return undefined;
  }

  fprint(`    X-------X END PRE_GET_PEDESTAL X-------X
  `);
  return undefined;
}

// PickupStage.PRE_GET_PEDESTAL_ZAZZ.
function preGetPedestalZazz(
  player: EntityPlayer,
  pickup: EntityPickupCollectible,
): boolean | undefined {
  const lastPickedUpCollectible = getLastPickedUpCollectible(player);

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

  const iconIsColor = isColor(
    getAndSetInvertedItemActionSet(
      lastPickedUpCollectible.collectibleType,
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
  if (isGlitchedCollectibleSubType(lastPickedUpCollectible.collectibleType)) {
    pickup.GetSprite().Color = Color(0, 0, 0, 0);
  } else if (!iconIsColor) {
    clearCollectibleSprite(pickup);
  }

  /** Update pickup stage. */
  updateLastPickedUpCollectible(player, PickupStage.PRE_GET_PEDESTAL_ZAZZ);

  fprint(`

  X-------X START PRE_GET_PEDESTAL_ZAZZ X-------X
  Player: ${getPlayerIndex(player)}
  Pickup: ${pickup.SubType} name: ${getCollectibleName(pickup.SubType)})}
  Inversion: ${lastPickedUpCollectible.inverted}
  X-------X END PRE_GET_PEDESTAL_ZAZZ X-------X

  `);

  return undefined;
}

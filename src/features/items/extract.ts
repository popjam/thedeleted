import {
  CollectibleType,
  PickupVariant,
  UseFlag,
} from "isaac-typescript-definitions";
import { NonInvertedPickupActionSet } from "../../classes/corruption/actionSets/NonInverted/NonInvertedPickupActionSet";
import { extractResponseBuilder } from "../../helper/builders/items/EXTRACTBuilders";
import { setInvertedItemActionSet } from "../../helper/deletedSpecific/inversion/itemEffects";
import {
  getPickupActionSet,
  setNonInvertedPickupActionSet,
} from "../../helper/deletedSpecific/inversion/pickupEffects";
import { getClosestPickupTo } from "../../helper/entityHelper";
import { getAndSetInvertedPedestalActionSet } from "../corruption/effects/itemEffects";
import { isPedestalInverted } from "../corruption/inversion/pickupInversion";

export function extractPostUseItem(
  collectibleType: CollectibleType,
  rng: RNG,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
  activeSlot: int,
  customVarData: int,
):
  | boolean
  | { Discharge: boolean; Remove: boolean; ShowAnim: boolean }
  | undefined {
  return extractUse(player);
}

/**
 * On Extract use, the closest pickup explodes, damaging players or NPCs around it. However, if it
 * is a Collectible, it will be rerolled while adding a negative effect to it.
 */
function extractUse(
  player: EntityPlayer,
):
  | boolean
  | { Discharge: boolean; Remove: boolean; ShowAnim: boolean }
  | undefined {
  const closestPickup = getClosestPickupTo(player.Position);
  if (closestPickup === undefined) {
    return;
  }
  if (closestPickup.Variant === PickupVariant.COLLECTIBLE) {
    extractItem(closestPickup as EntityPickupCollectible);
  } else {
    extractPickup(closestPickup);
  }
  return undefined;
}

/**
 * Rerolls the collectible, adding a negative effect to it. If the item is an inverted item, it will
 * reroll into another inverted item while still adding a negative effect.
 */
function extractItem(collectible: EntityPickupCollectible) {
  const isInverted = isPedestalInverted(collectible);
  if (isInverted) {
    const invertedActionSet = getAndSetInvertedPedestalActionSet(collectible);
    invertedActionSet.addEffects(extractResponseBuilder());
    setInvertedItemActionSet(collectible.SubType, invertedActionSet);
  } else {
    const nonInvertedActionSet =
      (getPickupActionSet(collectible) as
        | NonInvertedPickupActionSet
        | undefined) ?? new NonInvertedPickupActionSet();
    nonInvertedActionSet.addEffects(extractResponseBuilder());
    // Which one: updatePedestal or setNonInvertedPickupActionSet?
    setNonInvertedPickupActionSet(collectible, nonInvertedActionSet);
  }

  // rerollPedestal(collectible);
}

function extractPickup(pickup: EntityPickup) {}

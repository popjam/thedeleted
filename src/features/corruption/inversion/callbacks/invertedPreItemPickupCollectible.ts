import { CollectibleType } from "isaac-typescript-definitions";
import type { PickingUpItemCollectible } from "isaacscript-common";
import { setPedestalInversion } from "../../../../helper/deletedSpecific/inversion/pedestalInversion";
import { setZazzinatorToRemovedItem } from "../../../../helper/deletedSpecific/inventory/removedItems";
import { mod } from "../../../../mod";
import { isZazzinatorAny } from "../../../../sets/zazzSets";
import { getAndSetInvertedItemActionSet } from "../../effects/itemEffects";
import {
  getLastPickedUpCollectibleData,
  getLastPickedUpPedestal,
  updateLastPickedUpCollectible,
} from "../lastPickedUpInverted";
import { PickupStage } from "../../../../enums/general/PickupStage";
import { fprint } from "../../../../helper/printHelper";
import { getAndSetInvertedPedestalActionSet } from "../../../../helper/deletedSpecific/effects/pedestalEffects";

/**
 * When the item goes into ItemQueue. Despite its name, tracks both inverted and non-inverted items.
 *
 * This is used to render the inverted item's name onto the HUD, which only happens when picking up
 * an inverted item from a pedestal (not when an inverted item is manually added).
 */
// ModCallbackCustom.MC_POST_ITEM_PICKUP_COLLECTIBLE
export function invertedPreItemPickupCollectible(
  player: EntityPlayer,
  pickingUpItem: PickingUpItemCollectible,
): void {
  const pickingUpItemInverted = isZazzinatorAny(pickingUpItem.subType);

  /** Call inverted item ActionSet 'prePickupCollectible' function. */
  if (pickingUpItemInverted) {
    const pickedUpItemData = getLastPickedUpCollectibleData(player);

    /** TODO: Error handling. */
    if (
      pickedUpItemData === undefined ||
      pickedUpItemData.pickupStage !== PickupStage.PRE_GET_PEDESTAL_ZAZZ
    ) {
      return;
    }
    const invertedActionSet =
      pickedUpItemData.actionSet ??
      getAndSetInvertedPedestalActionSet(pickedUpItemData.pedestal);
    invertedActionSet.prePickupCollectible(player, pickingUpItem);
  }

  /** Update pickup tracking. */
  updateLastPickedUpCollectible(player, PickupStage.PRE_ITEM_PICKUP);

  /**
   * Regardless of the picked up item inversion, we need to check if the pedestal houses a new item.
   * When this is the case, an active item has been swapped out.
   *
   * Normal active -> Normal active ---> Do nothing.
   *
   * Normal active -> Inverted active ---> Turn pedestal to normal.
   *
   * Inverted active -> Normal active ---> Turn pedestal inverted & morph zazz item.
   *
   * Inverted active -> Inverted active ---> Morph zazz item.
   */
  const pedestal = getLastPickedUpPedestal(player);
  fprint(" sorting out pedestal during preItemPickup...");
  if (pedestal === undefined || pedestal.SubType === CollectibleType.NULL) {
    fprint(` pedestal with type ${pedestal?.SubType}, returning...`);
    return;
  }

  const putDownItemInverted = isZazzinatorAny(pedestal.SubType);

  setPedestalInversion(putDownItemInverted, pedestal);
  if (putDownItemInverted) {
    mod.runInNRenderFrames(() => {
      setZazzinatorToRemovedItem(pedestal);
    }, 1);
  }
}

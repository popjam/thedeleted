import { CollectibleType } from "isaac-typescript-definitions";
import {
  PickingUpItemCollectible,
  getCollectibleName,
} from "isaacscript-common";
import { setPedestalInversion } from "../../../../helper/deletedSpecific/inversion/pedestalInversion";
import { setZazzinatorToRemovedItem } from "../../../../helper/deletedSpecific/inversion/removedItems";
import { fprint } from "../../../../helper/printHelper";
import { mod } from "../../../../mod";
import { isZazzinatorAny } from "../../../../sets/zazzSets";
import { getAndSetInvertedItemActionSet } from "../../effects/itemEffects";
import {
  PickupStage,
  getLastPickedUpCollectible,
  getLastPickedUpPedestal,
  updateLastPickedUpCollectible,
} from "../lastPickedUpInverted";

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

  fprint(`

  W------W START PRE_ITEM_PICKUP_COLLECTIBLE W------W`);

  /** Call inverted item ActionSet 'prePickupCollectible' function. */
  if (pickingUpItemInverted) {
    const pickedUpItemData = getLastPickedUpCollectible(player);

    /** TODO: Error handling. */
    if (
      pickedUpItemData === undefined ||
      pickedUpItemData.pickupStage !== PickupStage.PRE_GET_PEDESTAL_ZAZZ
    ) {
      return;
    }
    const invertedActionSet = getAndSetInvertedItemActionSet(
      pickedUpItemData.collectibleType,
    );
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
  if (pedestal === undefined || pedestal.SubType === CollectibleType.NULL) {
    fprint(
      `   Put down pedestal: ${
        pedestal === undefined ? "pedestal is undefined" : "pedestal is null"
      }
      W------W END PRE_ITEM_PICKUP_COLLECTIBLE W------W

      `,
    );
    return;
  }

  const putDownItemInverted = isZazzinatorAny(pedestal.SubType);

  fprint(`   Put down pedestal: ${pedestal.SubType}
  Was put down inverted: ${putDownItemInverted}
  Put down subType: ${pedestal.SubType}
  Put down name: ${getCollectibleName(pedestal.SubType)}`);

  setPedestalInversion(putDownItemInverted, pedestal);
  if (putDownItemInverted) {
    mod.runInNRenderFrames(() => {
      setZazzinatorToRemovedItem(pedestal);
    }, 1);
  }

  fprint(`   Post-change put down pedestal~
  Post-change was put down inverted: ${putDownItemInverted}
  Post-change put down subType: ${pedestal.SubType}
  Post-change put down name: ${getCollectibleName(pedestal.SubType)}
  W------W END PRE_ITEM_PICKUP_COLLECTIBLE W------W

  `);
}

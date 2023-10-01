import type { PickingUpItemCollectible } from "isaacscript-common";
import { getPlayerIndex } from "isaacscript-common";
import { addInvertedItemToPlayer } from "../../../../helper/deletedSpecific/inversion/invertedInventory";
import { fprint } from "../../../../helper/printHelper";
import { isZazzinatorAny } from "../../../../sets/zazzSets";
import {
  getLastPickedUpCollectible,
  getLastPickedUpNonInvertedCollectibleActionSet,
  PickupStage,
  updateLastPickedUpCollectible,
} from "../lastPickedUpInverted";

/**
 * When the item leaves ItemQueue. If it is ZAZZ, it's an inverted item. Passive items get their
 * ActionSet triggered immediately, while Active item ActionSets go into the players' active slot
 * and can be triggered by the player.
 *
 * If it is not an inverted item, it still may have an ActionSet, which is triggered here.
 */
// ModCallbackCustom.MC_POST_ITEM_PICKUP_COLLECTIBLE
export function invertedPostItemPickupCollectible(
  player: EntityPlayer,
  pickingUpItem: PickingUpItemCollectible,
): void {
  if (isZazzinatorAny(pickingUpItem.subType)) {
    const pickedUpCollectibleType = getLastPickedUpCollectible(player);

    // TODO: Error Handling.
    if (
      pickedUpCollectibleType === undefined ||
      pickedUpCollectibleType.pickupStage !== PickupStage.PRE_ITEM_PICKUP
    ) {
      return;
    }
    fprint(
      `invertedPostItemPickupCollectible: ${getPlayerIndex(
        player,
      )} picked up inverted item of subType: ${
        pickedUpCollectibleType.collectibleType
      }`,
    );
    addInvertedItemToPlayer(
      player,
      pickedUpCollectibleType.collectibleType,
      false,
    );

    /** Item is finished being picked up. */
    updateLastPickedUpCollectible(player, PickupStage.POST_ITEM_PICKUP);
  } else {
    // This is a regular item.
    const lastPickedUpCollectibleActionSet =
      getLastPickedUpNonInvertedCollectibleActionSet(player);
    if (lastPickedUpCollectibleActionSet !== undefined) {
      lastPickedUpCollectibleActionSet.addToPlayer(player);
    }
    updateLastPickedUpCollectible(player, PickupStage.POST_ITEM_PICKUP);
  }
}

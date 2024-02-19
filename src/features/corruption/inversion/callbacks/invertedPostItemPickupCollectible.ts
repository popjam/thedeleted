import type { PickingUpItemCollectible } from "isaacscript-common";
import { getPlayerIndex } from "isaacscript-common";
import { fprint } from "../../../../helper/printHelper";
import { isZazzinatorAny } from "../../../../sets/zazzSets";
import {
  getLastPickedUpCollectibleData,
  getLastPickedUpNonInvertedCollectibleActionSet,
  setLastPickedUpCollectibleData,
} from "../lastPickedUpInverted";
import { addInvertedItemToPlayer } from "../../../../helper/deletedSpecific/inventory/invertedInventoryHelper";
import { ActiveSlot } from "isaac-typescript-definitions";
import { PickupStage } from "../../../../enums/general/PickupStage";

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
    const pickedUpCollectibleType = getLastPickedUpCollectibleData(player);

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
      ActiveSlot.PRIMARY,
      pickedUpCollectibleType.actionSet,
    );

    /** Item is finished being picked up. */
    setLastPickedUpCollectibleData(player, undefined);
  } else {
    // This is a regular item.
    const lastPickedUpCollectibleActionSet =
      getLastPickedUpNonInvertedCollectibleActionSet(player);
    if (lastPickedUpCollectibleActionSet !== undefined) {
      lastPickedUpCollectibleActionSet.addToPlayer(player);
    }

    /** Item is finished being picked up. */
    setLastPickedUpCollectibleData(player, undefined);
  }
}

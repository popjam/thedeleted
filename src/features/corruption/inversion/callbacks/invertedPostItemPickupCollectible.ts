import { getPlayerIndex, PickingUpItemCollectible } from "isaacscript-common";
import { addInvertedItemToPlayer } from "../../../../helper/deletedSpecific/inversion/invertedInventory";
import { fprint } from "../../../../helper/printHelper";
import { isZazzinatorAny } from "../../../../sets/zazzSets";
import { getLastPickedUpInvertedCollectible } from "../lastPickedUpInverted";

/**
 * When the item leaves ItemQueue. If it is ZAZZ, it's an inverted item. Passive items get their
 * ActionSet triggered immediately, while Active item ActionSets go into the players' active slot
 * and can be triggered by the player.
 */
// ModCallbackCustom.MC_POST_ITEM_PICKUP_COLLECTIBLE
export function invertedPostItemPickupCollectible(
  player: EntityPlayer,
  pickingUpItem: PickingUpItemCollectible,
): void {
  if (isZazzinatorAny(pickingUpItem.subType)) {
    const pickedUpCollectibleType = getLastPickedUpInvertedCollectible(player);
    fprint(
      `invertedPostItemPickupCollectible: ${getPlayerIndex(
        player,
      )} picked up inverted item of subType: ${pickedUpCollectibleType}`,
    );
    addInvertedItemToPlayer(player, pickedUpCollectibleType, false);
  }
}

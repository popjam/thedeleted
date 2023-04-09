import { PickingUpItemCollectible } from "isaacscript-common";
import { isZazzinatorAny } from "../../../../sets/zazzSets";
import { getAndSetInvertedItemActionSet } from "../../effects/itemEffects";
import {
  getLastPickedUpCollectible,
  PickupStage,
  updateLastPickedUpCollectible,
} from "../lastPickedUpInverted";

/**
 * When the inverted item goes into ItemQueue. This is used to render the inverted item's name onto
 * the HUD, which only happens when picking up an inverted item from a pedestal (not when an
 * inverted item is manually added).
 */
// ModCallbackCustom.MC_POST_ITEM_PICKUP_COLLECTIBLE
export function invertedPreItemPickupCollectible(
  player: EntityPlayer,
  pickingUpItem: PickingUpItemCollectible,
): void {
  if (isZazzinatorAny(pickingUpItem.subType)) {
    const pickedUpCollectibleType = getLastPickedUpCollectible(player);

    if (pickedUpCollectibleType === undefined) {
      return;
    }
    const invertedActionSet = getAndSetInvertedItemActionSet(
      pickedUpCollectibleType.collectibleType,
    );
    updateLastPickedUpCollectible(player, PickupStage.PRE_ITEM_PICKUP);
    invertedActionSet.prePickupCollectible(player, pickingUpItem);
  } else {
    updateLastPickedUpCollectible(player, PickupStage.PRE_ITEM_PICKUP);
  }
}

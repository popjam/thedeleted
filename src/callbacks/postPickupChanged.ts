import { CollectibleType, PickupVariant } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { invertedPostPickupChanged } from "../features/corruption/inversion/callbacks/invertedPostPickupChanged";
import { isZazzinatorAny } from "../sets/zazzSets";

export function postPickupChangedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PICKUP_CHANGED, main);
}

function main(
  pickup: EntityPickup,
  oldVariant: PickupVariant,
  oldSubType: int,
  newVariant: PickupVariant,
  newSubType: int,
) {
  // eslint-disable-next-line isaacscript/complete-sentences-jsdoc
  /**
   * Going from any pickup --> zazzinator collectible should NOT update the pickup, and instead
   * determine if the change was due to the pre_get_pedestal morph or some other reason which should
   * be dealt with.
   *
   * If the pedestal is not in the pre_get_pedestal stage, and the item is zazz, it means the zazz
   * item has either spawned accidentally, fallen off the player (e.g butter!) or an inverted active
   * item has been swapped out.
   */
  if (
    newVariant === PickupVariant.COLLECTIBLE &&
    isZazzinatorAny(newSubType as CollectibleType)
  ) {
    return;
  }

  // if (isZazzinatorAny(oldSubType as CollectibleType)) { return; }
  invertedPostPickupChanged(
    pickup,
    oldVariant,
    oldSubType,
    newVariant,
    newSubType,
  );
}

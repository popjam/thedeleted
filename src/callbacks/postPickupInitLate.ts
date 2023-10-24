import type { CollectibleType } from "isaac-typescript-definitions";
import { PickupVariant } from "isaac-typescript-definitions";
import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";
import { postCollectibleInitLateZazzinator } from "../features/corruption/inventory/callbacks/postPickupChangedToInverted";
import { updatePickup } from "../helper/deletedSpecific/inversion/updateInverted";
import { isZazzinatorAny } from "../sets/zazzSets";

export function postPickupInitLate(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PICKUP_INIT_LATE, all);
}

function all(pickup: EntityPickup) {
  if (
    pickup.Variant === PickupVariant.COLLECTIBLE &&
    isZazzinatorAny(pickup.SubType as CollectibleType)
  ) {
    postCollectibleInitLateZazzinator(pickup);
  }
  updatePickup(pickup);
}

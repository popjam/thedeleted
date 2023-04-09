import { PickupVariant } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { postCollectibleInitLateZazzinator } from "../features/corruption/inventory/callbacks/postPickupChangedToInverted";
import { updatePickup } from "../helper/deletedSpecific/inversion/updateInverted";

export function postPickupInitLate(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PICKUP_INIT_LATE, all);
}

function all(pickup: EntityPickup) {
  if (pickup.Variant === PickupVariant.COLLECTIBLE) {
    postCollectibleInitLateZazzinator(pickup);
  }
  updatePickup(pickup);
}

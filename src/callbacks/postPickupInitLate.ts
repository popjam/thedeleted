import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { pickupEffectsPostPickupInitLate } from "../features/corruption/effects/updatePickup";

export function postPickupInitLate(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PICKUP_INIT_LATE, all);
}

function all(pickup: EntityPickup) {
  pickupEffectsPostPickupInitLate(pickup);
}

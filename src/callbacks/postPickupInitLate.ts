import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { updatePickup } from "../helper/deletedSpecific/inversion/updateInverted";

export function postPickupInitLate(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PICKUP_INIT_LATE, all);
}

function all(pickup: EntityPickup) {
  updatePickup(pickup);
}

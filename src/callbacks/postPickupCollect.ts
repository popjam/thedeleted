import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { pickupEffectPostPickupCollect } from "../features/corruption/effects/pickupEffects";
import { fprint } from "../helper/printHelper";

export function postPickupCollectInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT, main);
}

function main(pickup: EntityPickup, player: EntityPlayer) {
  fprint(`Player has picked up pickup of Variant: ${pickup.Variant}`);
  pickupEffectPostPickupCollect(pickup, player);
}

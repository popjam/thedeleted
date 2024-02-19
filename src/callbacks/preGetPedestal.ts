import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";
import { pickupInversionPreGetPedestalCollectible } from "../features/corruption/inversion/callbacks/invertedPreGetPedestalCollectible";

export function preGetPedestalInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.PRE_GET_PEDESTAL, main); // 35
}

// ModCallback.PRE_PICKUP_COLLISION (35)
function main(
  player: EntityPlayer,
  pickup: EntityPickupCollectible,
): boolean | undefined {
  return pickupInversionPreGetPedestalCollectible(player, pickup);
}

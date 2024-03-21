import { ModCallbackCustom } from "isaacscript-common";
import type { ModUpgraded } from "isaacscript-common";
import { triggerOnPurchaseActions } from "../classes/corruption/actions/OnPurchaseAction";

export function postPurchaseInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PURCHASE, main);
}

function main(player: EntityPlayer, pickup: EntityPickup) {
  triggerOnPurchaseActions(player, pickup);
}

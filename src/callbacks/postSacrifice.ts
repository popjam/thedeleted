import { ModCallbackCustom } from "isaacscript-common";
import type { ModUpgraded } from "isaacscript-common";
import { triggerOnSacrificeActions } from "../classes/corruption/actions/OnSacrificeAction";

export function postSacrificeInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_SACRIFICE, main);
}

function main(player: EntityPlayer, numSacrifices: int) {
  triggerOnSacrificeActions(player, numSacrifices);
}

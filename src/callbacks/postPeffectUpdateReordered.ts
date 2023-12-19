import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";
import { printPersistentNPCs } from "../features/general/NPCIndex";
import { fprint } from "../helper/printHelper";

export function postPeffectUpdateReorderedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED, main);
}

function main(player: EntityPlayer) {}

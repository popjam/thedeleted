import { ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";
import { mainPCPostPeffectUpdate } from "../features/pc/mainPC";

export function postPeffectUpdateInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_PEFFECT_UPDATE, main);
}

function main(player: EntityPlayer) {
  mainPCPostPeffectUpdate(player);
}

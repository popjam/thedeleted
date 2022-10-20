import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { mainPCPostPeffectUpdate as mainPCPostPeffectUpdateReordered } from "../features/pc/mainPC";

export function postPeffectUpdateReorderedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED, main);
}

function main(player: EntityPlayer) {
  mainPCPostPeffectUpdateReordered(player);
}

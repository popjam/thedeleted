import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
export function postPeffectUpdateReorderedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED, main);
}

function main(player: EntityPlayer) {}

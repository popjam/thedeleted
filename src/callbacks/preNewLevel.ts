import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { temporaryItemsPreNewLevel } from "../features/general/temporaryItems";

export function preNewLevelReorderedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.PRE_NEW_LEVEL, main);
}

function main(player: EntityPlayer) {
  temporaryItemsPreNewLevel(player);
}

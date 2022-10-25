import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { triggerOnFloorActions } from "../classes/corruption/actions/OnFloorAction";

export function postNewLevelReorderedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED, main);
}

function main() {
  // temporaryItemsPostNewLevelReordered();
  triggerOnFloorActions();
}

import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { runIndexPostGameStartedReordered } from "../features/runIndex";

export function postGameStartedReorderedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, main);
}

function main() {
  runIndexPostGameStartedReordered();
}

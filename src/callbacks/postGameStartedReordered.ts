import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { facetPostGameStartedReordered } from "../classes/Facet";
import { runIndexPostGameStartedReordered } from "../features/runIndex";

export function postGameStartedReorderedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, main);
}

function main(isContinued: boolean) {
  facetPostGameStartedReordered(isContinued);
  runIndexPostGameStartedReordered(isContinued);
}

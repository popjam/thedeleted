import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { facetPostGameContinuedReordered } from "../classes/Facet";
import { runIndexPostGameContinuedFacet } from "../features/runIndex";

export function postGameStartedReorderedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    postGameContinuedReordered,
    true,
  );
}

function postGameContinuedReordered(_isContinued: boolean) {
  facetPostGameContinuedReordered();
  runIndexPostGameContinuedFacet();
}

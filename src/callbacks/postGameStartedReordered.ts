import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";
import { facetPostGameContinuedReordered } from "../classes/Facet";
import { runIndexPostGameContinuedFacet } from "../features/runIndex";
import { itemInventoryPostGameContinuedReordered } from "../features/corruption/inventory/passiveItemInventory";
import { postGameStartedReorderedGameEntitySetBuilder } from "../features/data/gameEntitySetBuilder";

export function postGameStartedReorderedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    postGameStartedReordered,
    undefined,
  );
}

function postGameStartedReordered(isContinued: boolean) {
  if (isContinued) {
    facetPostGameContinuedReordered();
    runIndexPostGameContinuedFacet();
    itemInventoryPostGameContinuedReordered();
  } else {
    postGameStartedReorderedGameEntitySetBuilder();
  }
}

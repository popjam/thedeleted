import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";
import { facetPostGameContinuedReordered } from "../classes/Facet";
import { runIndexPostGameContinuedFacet } from "../features/runIndex";
import { itemInventoryPostGameContinuedReordered } from "../features/corruption/inventory/passiveItemInventory";

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
  itemInventoryPostGameContinuedReordered();
}

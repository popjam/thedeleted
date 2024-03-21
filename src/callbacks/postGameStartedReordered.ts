import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";
import { facetPostGameContinuedReordered } from "../classes/Facet";
import { runIndexPostGameContinuedFacet } from "../features/runIndex";
import { postGameStartedReorderedGameEntitySetBuilder } from "../features/data/gameSets/callbacks/gameSetsPostGameStartedReordered";
import { _itemInventoryPostGameContinuedReordered } from "../features/corruption/inventory/callbacks/itemInventoryPostGameContinuedReordered";
import { _customActiveInventoryPostGameContinuedReordered } from "../features/corruption/inversion/customActivePostGameContinuedReordered";

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
    _itemInventoryPostGameContinuedReordered();
    _customActiveInventoryPostGameContinuedReordered();
  } else {
    postGameStartedReorderedGameEntitySetBuilder();
  }
}

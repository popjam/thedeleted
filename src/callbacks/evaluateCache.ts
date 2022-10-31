import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";
import { playerStatsEvaluateCache } from "../features/general/playerStats";
import { modeEvaluateCacheTearColor } from "../features/modes/mode";

export function evaluateCacheInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.EVALUATE_CACHE, main);
  mod.AddCallback(ModCallback.EVALUATE_CACHE, tearColor, CacheFlag.TEAR_COLOR);
}

function main(player: EntityPlayer, cacheFlag: CacheFlag) {
  playerStatsEvaluateCache(player, cacheFlag);
}

function tearColor(player: EntityPlayer) {
  modeEvaluateCacheTearColor(player);
}

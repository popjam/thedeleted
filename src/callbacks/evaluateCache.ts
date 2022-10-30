import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";
import { modeEvaluateCacheColor } from "../features/modes/mode";

export function evaluateCacheInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.EVALUATE_CACHE, modeColor, CacheFlag.TEAR_COLOR);
}

function modeColor(player: EntityPlayer, cacheFlag: CacheFlag) {
  modeEvaluateCacheColor(player, cacheFlag);
}

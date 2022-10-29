import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";
import { happy99EvaluateCache as happy99EvaluateCacheColor } from "../features/modes/HAPPY99/HAPPY99";

export function evaluateCacheInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.EVALUATE_CACHE, color, CacheFlag.COLOR);
}

function color(player: EntityPlayer, cacheFlag: CacheFlag) {
  happy99EvaluateCacheColor(player, cacheFlag);
}

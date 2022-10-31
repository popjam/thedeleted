import { CacheFlag } from "isaac-typescript-definitions";

/** Triggers a cache update for the specified cache flag and player. */
export function triggerCacheUpdate(
  player: EntityPlayer,
  cacheFlag: CacheFlag,
): void {
  player.AddCacheFlags(cacheFlag);
  player.EvaluateItems();
}

import type { CollectibleType } from "isaac-typescript-definitions";
import { ItemPoolType } from "isaac-typescript-definitions";
import { ReadonlyMap, getCollectibleName } from "isaacscript-common";

const moddedCollectibleTypeItemPoolMap = new ReadonlyMap<
  string,
  ItemPoolType[]
>([["Name", [ItemPoolType.ANGEL]]]);

/**
 * Get a modded collectible's ItemPools (if the mod is tracked). If the mod is not tracked, return
 * undefined.
 */
export function _getModdedCollectibleTypeItemPools(
  collectibleType: CollectibleType,
): ItemPoolType[] | undefined {
  const name = getCollectibleName(collectibleType);
  return moddedCollectibleTypeItemPoolMap.get(name);
}

import { CollectibleType } from "isaac-typescript-definitions";
import { newCollectibleSprite } from "isaacscript-common";

const spriteCache = new Map<CollectibleType, Sprite>();

/**
 * Returns a collectible sprite from the collectible sprite cache, and if one does not exist yet,
 * creates it using 'newCollectibleSprite()'. These sprites should be static and not used for
 * animations.
 */
export function getCollectibleSpriteFromCache(
  collectibleType: CollectibleType,
): Sprite {
  const sprite = spriteCache.get(collectibleType);

  if (sprite !== undefined) {
    return sprite;
  }

  const newSprite = newCollectibleSprite(collectibleType);
  spriteCache.set(collectibleType, newSprite);

  return newSprite;
}

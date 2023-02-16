import { CollectibleType } from "isaac-typescript-definitions";

/**
 * CorruptedCollectibleSprite is an interface used to represent Corrupted Collectible Sprites in a
 * format that can be easily serialized and deserialized. These sprites are limited to being either
 * a single Collectible, or an amalgamation similar to TMTRAINER items.
 */
export interface CorruptedCollectibleSprite {
  collectibles: CollectibleType[];
  horizontal?: boolean;
  color?: Color | true;
  seed: Seed;
}

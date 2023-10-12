import type { CollectibleType } from "isaac-typescript-definitions";
import type { AdvancedColor } from "../../general/AdvancedColor";

/**
 * CorruptedCollectibleSprite is an interface used to represent Corrupted Collectible Sprites in a
 * format that can be easily serialized and deserialized. These sprites are limited to being either
 * a single Collectible, or an amalgamation similar to TMTRAINER items.
 */
export interface CorruptedCollectibleSprite {
  /** An array of collectibles that will be in the sprite amalgamation. */
  collectibles: CollectibleType[];

  /**
   * Whether the collectibles will be sliced vertically or horizontally. Leave it undefined to
   * randomly choose.
   */
  horizontal?: boolean;

  /**
   * The color of the Corrupted sprite.
   *
   * - If false, the sprite segments will remain their default color.
   * - If a Color, the sprite segments will be colored in that color.
   * - If an array of Colors, the sprite segments will be colored in those colors in order, random
   *   if there are more segments than colors.
   * - If "random", the sprite segments will be colored in random colors.
   * - If an AdvancedColor, the sprite segments will be colored in that AdvancedColor.
   * - If an array of AdvancedColors, the sprite segments will be colored in those AdvancedColors in
   *   order, random if there are more segments than colors.
   */
  color?: Color | Color[] | "random" | AdvancedColor | AdvancedColor[];

  /** Seed for the sprite. */
  seed: Seed;

  /** Whether the individual segments are flipped along the X axis. */
  flipX?: boolean;

  /** To be fixed. */
  flipY?: boolean;

  /** To be fixed. */
  rotation?: number;
}

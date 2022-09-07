import { ItemPoolType, ItemType } from "isaac-typescript-definitions";

/**
 * Modifiers to describe a subset of all CollectibleTypes.
 *
 * @example Used to get a random CollectibleType through getRandomCollectibleType().
 */
export interface CollectibleAttribute {
  /** Type of item, e.g Active. Remember familiars are separate from passives. */
  itemType?: ItemType | ItemType[];
  /** The pool the item is in. */
  poolType?: ItemPoolType | ItemPoolType[];
}

/**
 * Similar to CollectibleAttributes, however there are extra attribute options presented as specific
 * strings that can change depending on what is happening in the game.
 *
 * @example PoolType can be "room", which is the room's pool type.
 */
export interface CollectibleAttributeExtra
  extends Omit<CollectibleAttribute, "poolType"> {
  /**
   * The pool the item is in. Specify "room" to make it always be the room pool the player is in.
   */
  poolType?: ItemPool | "room";
}

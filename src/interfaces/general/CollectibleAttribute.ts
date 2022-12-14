import {
  CollectibleType,
  ItemConfigChargeType,
  ItemConfigTag,
  ItemPoolType,
  ItemType,
} from "isaac-typescript-definitions";
import { PlayerIndex } from "isaacscript-common";

/**
 * Modifiers to describe a subset of all CollectibleTypes.
 *
 * @example Used to get a random CollectibleType through getRandomCollectibleType().
 */
export interface CollectibleAttribute {
  /** Type of item, e.g Active. Remember familiars are separate from passives. */
  itemType?: ItemType | ItemType[];
  /** The pool the item is in. */
  poolType?: ItemPoolType | ItemPoolType[] | "room";
  /** The item quality. */
  quality?: number | number[];
  /** The item charge type (passive collectibles return 'normal'). */
  chargeType?: ItemConfigChargeType | ItemConfigChargeType[];
  /** The charges the item has (passive collectibles return 0). */
  maxCharges?: number | number[];
  /**
   * If the item is already owned by a player. If multiple players are specified, only one needs to
   * have it. Does not include pocket items.
   */
  playerHas?: PlayerIndex | PlayerIndex[];
  /** Item name starts with (capitalization doesn't matter). */
  startsWith?: string;
  /** Item name ends with (capitalization doesn't matter). */
  endsWith?: string;
  /** The tag/s the item should have all of (can have more than these). */
  itemTagAll?: ItemConfigTag[];
  /** The tag/s the item should have at least one of. */
  itemTagOne?: ItemConfigTag[];
  /** Banned Collectibles. */
  banned?: CollectibleType[];
}

/** Modifiers to describe a subset of all Active Items. */
export interface ActiveCollectibleAttribute extends CollectibleAttribute {
  itemType: ItemType.ACTIVE;
}

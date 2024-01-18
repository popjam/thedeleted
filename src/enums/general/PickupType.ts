/**
 * An enum of categories a Pickup can fall into. This is used over 'PickupVariant' in some cases as
 * PickupVariant has multiple values for the same PickupType (e.g Chests).
 */
export enum PickupType {
  HEART,
  COIN,
  KEY,
  BOMB,
  POOP,
  CHEST,
  SACK,
  PILL,
  CARD,
  SOUL,
  RUNE,
  BATTERY,
  COLLECTIBLE,
  TRINKET,
  SHOP_ITEM,
  MISCELLANEOUS,
}

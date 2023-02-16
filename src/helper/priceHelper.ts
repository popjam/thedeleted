import { PickupPrice } from "isaac-typescript-definitions";

/** Returns true if a collectible has no price, otherwise false (i.e Devil Deals and Shop Items). */
export function isCollectibleFree(
  collectible: EntityPickupCollectible,
): boolean {
  return (
    collectible.Price === (PickupPrice.FREE as number) ||
    collectible.Price === (PickupPrice.NULL as number)
  );
}

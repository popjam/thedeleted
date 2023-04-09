import { ChestSubType, CollectibleType } from "isaac-typescript-definitions";
import { isChest, isCollectible } from "isaacscript-common";

/**
 * If the Pickup is in the process of being collected by playing its 'Collect' animation. Note, not
 * all pickups may play this when collected.
 */
export function isPickupBeingCollected(pickup: EntityPickup): boolean {
  return pickup.GetSprite().IsPlaying("Collect");
}

/** Checks if a Pickup is in a 'opened', 'collected' form, e.g empty pedestals and opened chests. */
export function isUselessPickup(pickup: EntityPickup): boolean {
  if (isChest(pickup)) {
    if (pickup.SubType === (ChestSubType.OPENED as number)) {
      return true;
    }
  }

  if (isCollectible(pickup)) {
    if (pickup.SubType === CollectibleType.NULL) {
      return true;
    }
  }

  return false;
}

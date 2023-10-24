/**
 * If Zazzinator item is not in PreGetPedestal stage, it means it has somehow spawned some other
 * way, and should be morphed into a non-Zazzinator item. There are a few ways it could spawn, for
 * example after swapping a Zazzinator active item out of your inventory, or through a modded item
 * which can spawn a Zazzinator item, or through an item in which items from your inventory are
 * removed onto the floor.
 */

import { setZazzinatorToRemovedItem } from "../../../../helper/deletedSpecific/inventory/removedItems";
import { fprint } from "../../../../helper/printHelper";
import { isPedestalInPreGetPedestalStage } from "../../inversion/lastPickedUpInverted";

// POST_PICKUP_CHANGED
export function postPickupChangedZazzinator(
  pickup: EntityPickupCollectible,
): void {
  if (isPedestalInPreGetPedestalStage(pickup)) {
    fprint("Zazzinator item is PreGetPedestalStage, doing nothing...");
  } else {
    fprint("Zazzinator item is not PreGetPedestalStage, dealing with it...");
    setZazzinatorToRemovedItem(pickup);
  }
}

// POST_PICKUP_INIT_LATE, PickupVariant.COLLECTIBLE
export function postCollectibleInitLateZazzinator(pickup: EntityPickup): void {
  fprint("Zazzinator item postCollectibleInitFirst....");
  if (!isPedestalInPreGetPedestalStage(pickup as EntityPickupCollectible)) {
    fprint("Zazzinator item is not PreGetPedestalStage, dealing with it...");
    setZazzinatorToRemovedItem(pickup as EntityPickupCollectible);
  }
}

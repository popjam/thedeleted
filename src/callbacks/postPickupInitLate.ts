import { PickupVariant } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { corruptItemsPostPickupInitLate } from "../features/corruption/pickupInversion";

export function postPickupInitLate(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_PICKUP_INIT_LATE,
    main,
    PickupVariant.COLLECTIBLE,
  );
}

function main(pickup: EntityPickup) {
  corruptItemsPostPickupInitLate(pickup as EntityPickupCollectible);
}

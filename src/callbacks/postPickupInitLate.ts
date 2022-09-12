import { PickupVariant } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { pickupInversionPostPickupInitLate } from "../features/corruption/inversion/pickupInversion";

export function postPickupInitLate(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_PICKUP_INIT_LATE,
    main,
    PickupVariant.COLLECTIBLE,
  );
}

function main(pickup: EntityPickup) {
  pickupInversionPostPickupInitLate(pickup as EntityPickupCollectible);
}

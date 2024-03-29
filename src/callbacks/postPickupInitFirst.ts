import { PickupVariant } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { sophosPostCollectibleInitFirst } from "../features/modes/SOPHOS/SOPHOS";

export function postPickupInitFirst(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_PICKUP_INIT_FIRST,
    main,
    PickupVariant.COLLECTIBLE,
  );
}

function main(pickup: EntityPickup) {
  sophosPostCollectibleInitFirst(pickup as EntityPickupCollectible);
}

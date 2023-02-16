import { PickupVariant } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { invertedPostPickupChanged } from "../features/corruption/inversion/callbacks/invertedPostPickupChanged";

export function postPickupChangedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PICKUP_CHANGED, main);
}

function main(
  pickup: EntityPickup,
  oldVariant: PickupVariant,
  oldSubType: int,
  newVariant: PickupVariant,
  newSubType: int,
) {
  invertedPostPickupChanged(
    pickup,
    oldVariant,
    oldSubType,
    newVariant,
    newSubType,
  );
}

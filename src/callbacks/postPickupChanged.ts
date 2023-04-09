import { CollectibleType, PickupVariant } from "isaac-typescript-definitions";
import {
  ModCallbackCustom,
  ModUpgraded,
  isCollectible,
} from "isaacscript-common";
import { postPickupChangedZazzinator } from "../features/corruption/inventory/callbacks/postPickupChangedToInverted";
import { invertedPostPickupChanged } from "../features/corruption/inversion/callbacks/invertedPostPickupChanged";
import { isPedestalInPreItemPickupStage } from "../features/corruption/inversion/lastPickedUpInverted";
import { _setPedestalInversion } from "../features/corruption/inversion/pickupInversion";
import { isZazzinatorAny } from "../sets/zazzSets";

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
  /** Do not apply logic for when Zazzinator CollectibleTypes are involved. */
  if (isCollectible(pickup)) {
    if (isZazzinatorAny(newSubType as CollectibleType)) {
      postPickupChangedZazzinator(pickup);
      return;
    }

    if (
      !isZazzinatorAny(oldSubType as CollectibleType) &&
      isPedestalInPreItemPickupStage(pickup)
    ) {
      _setPedestalInversion(false, pickup);
    }
  }
  // if (isZazzinatorAny(oldSubType as CollectibleType)) { return; }
  invertedPostPickupChanged(
    pickup,
    oldVariant,
    oldSubType,
    newVariant,
    newSubType,
  );
}

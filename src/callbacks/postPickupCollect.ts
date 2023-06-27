import { PickupVariant } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { nonInvertedBombPostPickupCollect } from "../features/corruption/inversion/callbacks/bombCollection";
import { nonInvertedCoinPostPickupCollect } from "../features/corruption/inversion/callbacks/coinCollection";

export function postPickupCollectInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_PICKUP_COLLECT,
    mainCoinCollection,
    PickupVariant.COIN,
  );
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_PICKUP_COLLECT,
    mainBombCollection,
    PickupVariant.BOMB,
  );
}

function mainCoinCollection(pickup: EntityPickup, player: EntityPlayer) {
  nonInvertedCoinPostPickupCollect(pickup, player);
}

function mainBombCollection(pickup: EntityPickup, player: EntityPlayer) {
  nonInvertedBombPostPickupCollect(pickup, player);
}

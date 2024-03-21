import { PickupVariant } from "isaac-typescript-definitions";
import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";
import { nonInvertedBombPostPickupCollect } from "../features/corruption/inversion/callbacks/bombCollection";
import { nonInvertedCoinPostPickupCollect } from "../features/corruption/inversion/callbacks/coinCollection";
import { triggerOnPickupCollectActions } from "../classes/corruption/actions/OnPickupCollectAction";

export function postPickupCollectInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT, main);
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

function main(pickup: EntityPickup, player: EntityPlayer) {
  triggerOnPickupCollectActions(pickup, player);
}

function mainCoinCollection(pickup: EntityPickup, player: EntityPlayer) {
  nonInvertedCoinPostPickupCollect(pickup, player);
}

function mainBombCollection(pickup: EntityPickup, player: EntityPlayer) {
  nonInvertedBombPostPickupCollect(pickup, player);
}

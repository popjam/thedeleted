import { ItemType } from "isaac-typescript-definitions";
import {
  ModCallbackCustom,
  ModUpgraded,
  PickingUpItem,
  PickingUpItemCollectible,
  PickingUpItemTrinket,
} from "isaacscript-common";
import { invertedPreItemPickupCollectible } from "../features/corruption/inversion/callbacks/invertedPreItemPickupCollectible";

export function preItemPickupInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP, main);
}

function main(player: EntityPlayer, pickingUpItem: PickingUpItem) {
  if (pickingUpItem.itemType === ItemType.TRINKET) {
    mainTrinketPickup(player, pickingUpItem);
  } else if (pickingUpItem.itemType !== ItemType.NULL) {
    mainCollectiblePickup(player, pickingUpItem);
  }
}

function mainCollectiblePickup(
  player: EntityPlayer,
  pickingUpItem: PickingUpItemCollectible,
) {
  invertedPreItemPickupCollectible(player, pickingUpItem);
}

function mainTrinketPickup(
  player: EntityPlayer,
  pickingUpItem: PickingUpItemTrinket,
) {}
